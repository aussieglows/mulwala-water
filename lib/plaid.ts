import "server-only";
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";
import { db } from "@/lib/db";
import { matchSourceId } from "@/lib/extract";
import { findOrCreateUnassignedSource, findInvestmentSourceId } from "@/lib/revenue-util";

export function plaidConfigured(): boolean {
  return !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);
}

function client(): PlaidApi {
  const env = (process.env.PLAID_ENV || "sandbox") as keyof typeof PlaidEnvironments;
  const config = new Configuration({
    basePath: PlaidEnvironments[env] ?? PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
      },
    },
  });
  return new PlaidApi(config);
}

const CLIENT_USER_ID = "mulwala-water";

/** Create a Plaid Link token for the browser to open the connect flow. Requests both bank
 *  transactions and investments. */
export async function createLinkToken(): Promise<string> {
  const resp = await client().linkTokenCreate({
    user: { client_user_id: CLIENT_USER_ID },
    client_name: "Mulwala Water",
    products: [Products.Transactions, Products.Investments],
    country_codes: [CountryCode.Us],
    language: "en",
    ...(process.env.PLAID_REDIRECT_URI ? { redirect_uri: process.env.PLAID_REDIRECT_URI } : {}),
  });
  return resp.data.link_token;
}

/** Exchange the public token from Link for a persistent access token and store the connection. */
export async function exchangePublicToken(publicToken: string): Promise<void> {
  const c = client();
  const ex = await c.itemPublicTokenExchange({ public_token: publicToken });
  const accessToken = ex.data.access_token;
  const itemId = ex.data.item_id;

  let institutionName: string | null = null;
  try {
    const item = await c.itemGet({ access_token: accessToken });
    const instId = item.data.item.institution_id;
    if (instId) {
      const inst = await c.institutionsGetById({ institution_id: instId, country_codes: [CountryCode.Us] });
      institutionName = inst.data.institution.name;
    }
  } catch {
    /* institution name is best-effort */
  }

  await db.bankConnection.upsert({
    where: { itemId },
    create: { itemId, accessToken, institutionName, products: "transactions,investments" },
    update: { accessToken, institutionName },
  });
}

export async function getBankConnections() {
  return db.bankConnection.findMany({ orderBy: { createdAt: "asc" } });
}

export async function disconnectBank(id: string): Promise<void> {
  const conn = await db.bankConnection.findUnique({ where: { id } });
  if (!conn) return;
  try {
    await client().itemRemove({ access_token: conn.accessToken });
  } catch {
    /* remove at Plaid is best-effort; always drop our record */
  }
  await db.bankConnection.delete({ where: { id } });
}

export type PlaidSyncResult = { revenue: number; expense: number; investmentIncome: number; error?: string };

const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** Pull new bank transactions + investment income for every linked item into PENDING rows. */
export async function syncPlaid(): Promise<PlaidSyncResult> {
  const result: PlaidSyncResult = { revenue: 0, expense: 0, investmentIncome: 0 };
  const conns = await getBankConnections();
  if (conns.length === 0) return { ...result, error: "No bank connected." };
  const c = client();

  for (const conn of conns) {
    // --- Bank transactions (checking / credit) ---
    try {
      let cursor = conn.cursor ?? undefined;
      let hasMore = true;
      while (hasMore) {
        const resp = await c.transactionsSync({ access_token: conn.accessToken, cursor });
        const d = resp.data;
        for (const t of d.added) {
          const cents = Math.round(Math.abs(t.amount) * 100);
          if (cents <= 0) continue;
          const name = t.merchant_name || t.name || "Bank transaction";
          const when = new Date(`${t.date}T12:00:00`);
          if (t.amount > 0) {
            // money out → expense
            const exists = await db.expense.findUnique({ where: { bankTxnId: t.transaction_id } });
            if (!exists) {
              await db.expense.create({
                data: { incurredOn: when, amountCents: cents, category: "Other", vendor: name, description: t.name ?? null, method: "Bank transfer", pending: true, createdBy: `Bank: ${conn.institutionName ?? "linked account"}`, bankTxnId: t.transaction_id },
              });
              result.expense += 1;
            }
          } else {
            // money in → revenue
            const exists = await db.revenueEntry.findUnique({ where: { bankTxnId: t.transaction_id } });
            if (!exists) {
              const sourceId = (await matchSourceId(name)) ?? (await findOrCreateUnassignedSource());
              await db.revenueEntry.create({
                data: { receivedOn: when, amountCents: cents, sourceId, category: "Other", payer: name, description: t.name ?? null, method: "Bank transfer", pending: true, createdBy: `Bank: ${conn.institutionName ?? "linked account"}`, bankTxnId: t.transaction_id },
              });
              result.revenue += 1;
            }
          }
        }
        // Modified transactions: keep amount/date in sync if still pending review.
        for (const t of d.modified) {
          const cents = Math.round(Math.abs(t.amount) * 100);
          const when = new Date(`${t.date}T12:00:00`);
          await db.expense.updateMany({ where: { bankTxnId: t.transaction_id, pending: true }, data: { amountCents: cents, incurredOn: when } });
          await db.revenueEntry.updateMany({ where: { bankTxnId: t.transaction_id, pending: true }, data: { amountCents: cents, receivedOn: when } });
        }
        // Removed transactions: drop our still-pending copies.
        for (const r of d.removed) {
          if (!r.transaction_id) continue;
          await db.expense.deleteMany({ where: { bankTxnId: r.transaction_id, pending: true } });
          await db.revenueEntry.deleteMany({ where: { bankTxnId: r.transaction_id, pending: true } });
        }
        cursor = d.next_cursor;
        hasMore = d.has_more;
        await db.bankConnection.update({ where: { id: conn.id }, data: { cursor } });
      }
    } catch (e) {
      console.error("Plaid transactions sync failed for", conn.institutionName, e);
    }

    // --- Investment income (dividends / interest) ---
    try {
      const end = new Date();
      const start = conn.investmentsFrom ? new Date(`${conn.investmentsFrom}T00:00:00`) : new Date(Date.now() - 365 * 24 * 3600 * 1000);
      const incomeSubtypes = new Set(["dividend", "qualified dividend", "non-qualified dividend", "interest", "interest receivable", "non-resident tax", "return of principal", "long-term capital gain", "short-term capital gain"]);
      let offset = 0;
      let total = Infinity;
      while (offset < total) {
        const resp = await c.investmentsTransactionsGet({ access_token: conn.accessToken, start_date: ymd(start), end_date: ymd(end), options: { count: 100, offset } });
        const d = resp.data;
        total = d.total_investment_transactions;
        for (const it of d.investment_transactions) {
          const subtype = (it.subtype || "").toLowerCase();
          const isIncome = incomeSubtypes.has(subtype) || (it.type === "cash" && it.amount < 0);
          if (!isIncome) continue;
          if (it.amount >= 0) continue; // income is cash IN (negative amount in Plaid)
          const cents = Math.round(Math.abs(it.amount) * 100);
          if (cents <= 0) continue;
          const exists = await db.revenueEntry.findUnique({ where: { bankTxnId: it.investment_transaction_id } });
          if (exists) continue;
          const sourceId = await findInvestmentSourceId();
          await db.revenueEntry.create({
            data: { receivedOn: new Date(`${it.date}T12:00:00`), amountCents: cents, sourceId, category: "Investment income", payer: it.name ?? "Investment account", description: it.name ?? null, method: "Bank transfer", pending: true, createdBy: `Investments: ${conn.institutionName ?? "linked account"}`, bankTxnId: it.investment_transaction_id },
          });
          result.investmentIncome += 1;
        }
        offset += d.investment_transactions.length || total;
        if ((d.investment_transactions.length || 0) === 0) break;
      }
      await db.bankConnection.update({ where: { id: conn.id }, data: { investmentsFrom: ymd(end), lastSyncAt: new Date() } });
    } catch (e) {
      // Investments product may not be enabled for the item — that's fine, skip.
      console.error("Plaid investments sync skipped/failed for", conn.institutionName, e);
      await db.bankConnection.update({ where: { id: conn.id }, data: { lastSyncAt: new Date() } });
    }
  }

  return result;
}
