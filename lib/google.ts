import "server-only";
import sharp from "sharp";
import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import { db } from "@/lib/db";
import { extractExpenseFromAssetId, extractRevenueFromAssetId, matchSourceId } from "@/lib/extract";
import { getActiveExpenseCategoryNames } from "@/lib/expense-categories";
import { findOrCreateUnassignedSource } from "@/lib/revenue-util";

// Read-only Gmail + the account email address.
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function googleConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function redirectUri(): string {
  return process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL || "http://localhost:3000"}/api/google/callback`;
}

function oauthClient(): OAuth2Client {
  return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri());
}

/** The consent URL to start connecting a Google account. */
export function authUrl(): string {
  return oauthClient().generateAuthUrl({ access_type: "offline", prompt: "consent", scope: SCOPES });
}

export async function getGoogleAccount() {
  return db.googleAccount.findUnique({ where: { id: "singleton" } });
}

/** Exchange the OAuth code for tokens, look up the address, and store the connection. */
export async function connectFromCode(code: string): Promise<void> {
  const client = oauthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  let email: string | null = null;
  try {
    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const me = await oauth2.userinfo.get();
    email = me.data.email ?? null;
  } catch {
    /* email is best-effort */
  }
  await db.googleAccount.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      email,
      accessToken: tokens.access_token ?? null,
      refreshToken: tokens.refresh_token ?? null,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    },
    update: {
      email,
      accessToken: tokens.access_token ?? null,
      // Keep the existing refresh token if Google didn't send a new one.
      ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    },
  });
}

export async function disconnectGoogle(): Promise<void> {
  await db.googleAccount.deleteMany({});
}

/** An OAuth client primed with the stored refresh token; persists refreshed access tokens. */
async function authedClient(): Promise<OAuth2Client | null> {
  const acct = await getGoogleAccount();
  if (!acct?.refreshToken) return null;
  const client = oauthClient();
  client.setCredentials({
    refresh_token: acct.refreshToken,
    access_token: acct.accessToken ?? undefined,
    expiry_date: acct.expiryDate ? acct.expiryDate.getTime() : undefined,
  });
  client.on("tokens", (t) => {
    void db.googleAccount
      .update({
        where: { id: "singleton" },
        data: {
          ...(t.access_token ? { accessToken: t.access_token } : {}),
          ...(t.refresh_token ? { refreshToken: t.refresh_token } : {}),
          ...(t.expiry_date ? { expiryDate: new Date(t.expiry_date) } : {}),
        },
      })
      .catch(() => {});
  });
  return client;
}

type GmailAttachment = { filename: string; mimeType: string; attachmentId: string };

// Walk a Gmail message payload tree collecting image/PDF attachment parts.
function collectAttachments(payload: unknown, out: GmailAttachment[] = []): GmailAttachment[] {
  const p = payload as { mimeType?: string; filename?: string; body?: { attachmentId?: string }; parts?: unknown[] } | undefined;
  if (!p) return out;
  const mime = p.mimeType || "";
  if (p.filename && p.body?.attachmentId && (mime.startsWith("image/") || mime === "application/pdf")) {
    out.push({ filename: p.filename, mimeType: mime, attachmentId: p.body.attachmentId });
  }
  if (Array.isArray(p.parts)) for (const part of p.parts) collectAttachments(part, out);
  return out;
}

function header(payload: unknown, name: string): string {
  const headers = (payload as { headers?: { name?: string; value?: string }[] })?.headers ?? [];
  return headers.find((h) => (h.name || "").toLowerCase() === name.toLowerCase())?.value ?? "";
}

async function storeAttachment(buf: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    const asset = await db.mediaAsset.create({ data: { contentType: "application/pdf", data: new Uint8Array(buf) } });
    return asset.id;
  }
  const jpeg = await sharp(buf).rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
  const asset = await db.mediaAsset.create({ data: { contentType: "image/jpeg", data: new Uint8Array(jpeg) } });
  return asset.id;
}

export type SyncResult = { revenue: number; expense: number; scanned: number; error?: string };

/** Scan the configured Gmail labels for new messages with attachments, AI-read each attachment, and
 *  create PENDING revenue/expense rows for review. Idempotent via ProcessedEmail. */
export async function syncGmail(): Promise<SyncResult> {
  const result: SyncResult = { revenue: 0, expense: 0, scanned: 0 };
  const acct = await getGoogleAccount();
  if (!acct) return { ...result, error: "No Google account connected." };
  const auth = await authedClient();
  if (!auth) return { ...result, error: "Google account has no refresh token — reconnect it." };

  const gmail = google.gmail({ version: "v1", auth });

  // Resolve label names → ids.
  const labelsResp = await gmail.users.labels.list({ userId: "me" });
  const labels = labelsResp.data.labels ?? [];
  const labelId = (name: string) => labels.find((l) => (l.name || "").toLowerCase() === name.toLowerCase())?.id ?? null;

  const jobs: { labelName: string; kind: "revenue" | "expense" }[] = [
    { labelName: acct.expenseLabel, kind: "expense" },
    { labelName: acct.revenueLabel, kind: "revenue" },
  ];

  for (const job of jobs) {
    const id = labelId(job.labelName);
    if (!id) continue; // label doesn't exist yet — skip quietly
    const list = await gmail.users.messages.list({ userId: "me", labelIds: [id], q: "has:attachment newer_than:120d", maxResults: 25 });
    const msgs = list.data.messages ?? [];
    for (const m of msgs) {
      if (!m.id) continue;
      const already = await db.processedEmail.findUnique({ where: { messageId: m.id } });
      if (already) continue;
      result.scanned += 1;
      try {
        const full = await gmail.users.messages.get({ userId: "me", id: m.id, format: "full" });
        const payload = full.data.payload;
        const subject = header(payload, "Subject").slice(0, 200);
        const from = header(payload, "From").slice(0, 200);
        const attachments = collectAttachments(payload);
        for (const att of attachments) {
          const attResp = await gmail.users.messages.attachments.get({ userId: "me", messageId: m.id, id: att.attachmentId });
          const data = attResp.data.data;
          if (!data) continue;
          const buf = Buffer.from(data, "base64url");
          const assetId = await storeAttachment(buf, att.mimeType);
          const receiptUrl = `/api/media/${assetId}`;
          const createdBy = `Email: ${from || "Gmail"}`;
          if (job.kind === "revenue") {
            const ex = await extractRevenueFromAssetId(assetId);
            const sourceId = (await matchSourceId(ex.payer)) ?? (await findOrCreateUnassignedSource());
            await db.revenueEntry.create({
              data: {
                receivedOn: ex.date ? new Date(`${ex.date}T12:00:00`) : new Date(),
                amountCents: ex.amountCents ?? 0,
                sourceId,
                category: ex.category,
                payer: ex.payer,
                description: ex.description ?? subject ?? null,
                invoiceRef: ex.invoiceRef,
                receiptUrl,
                pending: true,
                createdBy,
              },
            });
            result.revenue += 1;
          } else {
            const ex = await extractExpenseFromAssetId(assetId);
            const cats = await getActiveExpenseCategoryNames();
            const items = ex.items.length ? ex.items : [{ description: subject || "Invoice", amountCents: 0, category: "Other" }];
            for (const it of items) {
              await db.expense.create({
                data: {
                  incurredOn: ex.date ? new Date(`${ex.date}T12:00:00`) : new Date(),
                  amountCents: it.amountCents,
                  category: cats.includes(it.category) ? it.category : "Other",
                  vendor: ex.vendor ?? null,
                  description: it.description || subject || null,
                  receiptUrl,
                  pending: true,
                  createdBy,
                },
              });
            }
            result.expense += 1;
          }
        }
        await db.processedEmail.create({ data: { messageId: m.id, kind: job.kind } });
      } catch (e) {
        console.error("Gmail message import failed:", m.id, e);
      }
    }
  }

  await db.googleAccount.update({ where: { id: "singleton" }, data: { lastSyncAt: new Date() } });
  return result;
}
