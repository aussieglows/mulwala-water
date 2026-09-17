import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { REVENUE_CATEGORIES } from "@/lib/categories";
import { getActiveExpenseCategoryNames } from "@/lib/expense-categories";

const MODEL = "claude-haiku-4-5";

export type ExpenseLine = { description: string; amountCents: number; category: string };
export type ExpenseExtract = {
  vendor: string | null;
  date: string | null; // YYYY-MM-DD
  items: ExpenseLine[];
};
export type RevenueExtract = {
  payer: string | null;
  date: string | null; // YYYY-MM-DD
  amountCents: number | null;
  category: string; // from REVENUE_CATEGORIES
  invoiceRef: string | null;
  description: string | null;
};

export const EMPTY_EXPENSE: ExpenseExtract = { vendor: null, date: null, items: [] };
export const EMPTY_REVENUE: RevenueExtract = { payer: null, date: null, amountCents: null, category: "Consulting fees", invoiceRef: null, description: null };

const isDate = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

/** Build the Claude content block for a stored asset: an image block for images, a document block for
 *  PDFs. Returns null for unsupported types (or if the asset is missing). */
async function assetBlock(id: string): Promise<Anthropic.ContentBlockParam | null> {
  const asset = await db.mediaAsset.findUnique({ where: { id }, select: { data: true, contentType: true } });
  if (!asset) return null;
  const ct = asset.contentType || "image/jpeg";
  const b64 = Buffer.from(asset.data).toString("base64");
  if (ct === "application/pdf") {
    return { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } };
  }
  if (ct.startsWith("image/")) {
    return { type: "image", source: { type: "base64", media_type: ct as "image/jpeg" | "image/png" | "image/webp" | "image/gif", data: b64 } };
  }
  return null;
}

function firstJson(text: string): Record<string, unknown> | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Read an uploaded INVOICE / receipt (image or PDF) and pull vendor, date, and each line item with a
 *  best-fit consulting expense category. Empty on failure / missing key — the upload still saves. */
export async function extractExpenseFromAssetId(id: string): Promise<ExpenseExtract> {
  if (!process.env.ANTHROPIC_API_KEY) return EMPTY_EXPENSE;
  const block = await assetBlock(id);
  if (!block) return EMPTY_EXPENSE;
  const EXPENSE_CATEGORIES = await getActiveExpenseCategoryNames();
  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            block,
            {
              type: "text",
              text:
                `This is an invoice or receipt for a CONSULTING business. Extract only what is ACTUALLY visible:\n` +
                `- vendor: the merchant / supplier name (null if unclear).\n` +
                `- date: the invoice/purchase date as YYYY-MM-DD (null if unclear).\n` +
                `- items: an array with ONE entry PER DISTINCT LINE ITEM. Split multi-item documents into separate items; include tax/fees as their own item if shown. Each item is:\n` +
                `    { "description": short name, "amountCents": integer cents, "category": the single best match from EXACTLY this list: ${EXPENSE_CATEGORIES.join(", ")} }.\n` +
                `Airfare → "Flights". Hotels/lodging/Airbnb → "Accommodation". Uber/taxi/rental car/train → "Ground transport".\n` +
                `If it's a single total, items has one entry. Do not guess — omit anything not clearly shown. Respond with ONLY a JSON object with keys: vendor, date, items.`,
            },
          ],
        },
      ],
    });
    const text = res.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("").trim();
    const p = firstJson(text);
    if (!p) return EMPTY_EXPENSE;
    const cats = EXPENSE_CATEGORIES as readonly string[];
    const items: ExpenseLine[] = Array.isArray(p.items)
      ? p.items
          .map((it): ExpenseLine | null => {
            const o = it as { description?: unknown; amountCents?: unknown; category?: unknown };
            const amountCents = typeof o.amountCents === "number" && o.amountCents > 0 ? Math.round(o.amountCents) : null;
            if (amountCents == null) return null;
            const category = typeof o.category === "string" && cats.includes(o.category) ? o.category : "Other";
            return { description: o.description ? String(o.description).slice(0, 200) : "Item", amountCents, category };
          })
          .filter((x): x is ExpenseLine => x !== null)
          .slice(0, 40)
      : [];
    return {
      vendor: p.vendor ? String(p.vendor).slice(0, 120) : null,
      date: isDate(p.date) ? p.date : null,
      items,
    };
  } catch (e) {
    console.error("Expense extract failed:", e);
    return EMPTY_EXPENSE;
  }
}

/** Read an uploaded REVENUE screenshot / remittance / paid-invoice and pull payer, date, amount, type,
 *  and invoice ref. Empty on failure / missing key. */
export async function extractRevenueFromAssetId(id: string): Promise<RevenueExtract> {
  if (!process.env.ANTHROPIC_API_KEY) return EMPTY_REVENUE;
  const block = await assetBlock(id);
  if (!block) return EMPTY_REVENUE;
  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: [
            block,
            {
              type: "text",
              text:
                `This shows INCOME RECEIVED by a consulting business (a payment screenshot, bank credit, remittance advice, or paid invoice). Extract only what is ACTUALLY visible:\n` +
                `- payer: who paid (the client / sender), null if unclear.\n` +
                `- date: the date the money was received as YYYY-MM-DD, null if unclear.\n` +
                `- amountCents: the total amount received, in integer cents (null if unclear).\n` +
                `- category: the single best match from EXACTLY this list: ${REVENUE_CATEGORIES.join(", ")} (dividends/interest/capital gains → "Investment income").\n` +
                `- invoiceRef: an invoice/reference number if shown, else null.\n` +
                `- description: a short note (e.g. "March retainer"), else null.\n` +
                `Do not guess. Respond with ONLY a JSON object with keys: payer, date, amountCents, category, invoiceRef, description.`,
            },
          ],
        },
      ],
    });
    const text = res.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("").trim();
    const p = firstJson(text);
    if (!p) return EMPTY_REVENUE;
    const cats = REVENUE_CATEGORIES as readonly string[];
    const amountCents = typeof p.amountCents === "number" && p.amountCents > 0 ? Math.round(p.amountCents) : null;
    return {
      payer: p.payer ? String(p.payer).slice(0, 120) : null,
      date: isDate(p.date) ? p.date : null,
      amountCents,
      category: typeof p.category === "string" && cats.includes(p.category) ? p.category : "Consulting fees",
      invoiceRef: p.invoiceRef ? String(p.invoiceRef).slice(0, 60) : null,
      description: p.description ? String(p.description).slice(0, 200) : null,
    };
  } catch (e) {
    console.error("Revenue extract failed:", e);
    return EMPTY_REVENUE;
  }
}

/** Match an AI-detected payer name to an existing RevenueSource id (case/space-insensitive contains). */
export async function matchSourceId(payer: string | null): Promise<string | null> {
  if (!payer) return null;
  const sources = await db.revenueSource.findMany({ where: { active: true }, select: { id: true, name: true } });
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const p = norm(payer);
  if (!p) return null;
  const hit = sources.find((s) => { const n = norm(s.name); return n && (p.includes(n) || n.includes(p)); });
  return hit?.id ?? null;
}
