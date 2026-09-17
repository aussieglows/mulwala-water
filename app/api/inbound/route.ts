import sharp from "sharp";
import { db } from "@/lib/db";
import { extractExpenseFromAssetId, extractRevenueFromAssetId, matchSourceId } from "@/lib/extract";
import { getActiveExpenseCategoryNames } from "@/lib/expense-categories";

// Inbound email webhook. An email-forwarding provider (Postmark / SendGrid / Mailgun / Cloudflare
// Email Worker, etc.) POSTs a forwarded invoice or payment here as multipart/form-data. We store the
// first image/PDF attachment, AI-read it, and create a PENDING row for review on Revenue / Expenses.
//
//   POST /api/inbound?type=expense[&key=SECRET]   (default type = expense)
//   POST /api/inbound?type=revenue[&key=SECRET]
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function findOrCreateUnassignedSource(): Promise<string> {
  const existing = await db.revenueSource.findFirst({ where: { name: "Unassigned" } });
  if (existing) return existing.id;
  const max = await db.revenueSource.aggregate({ _max: { sortOrder: true } });
  const created = await db.revenueSource.create({ data: { name: "Unassigned", kind: "OTHER", sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  return created.id;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.INBOUND_SECRET;
  if (secret) {
    if (url.searchParams.get("key") !== secret) return new Response("Forbidden", { status: 403 });
  }
  const type = url.searchParams.get("type") === "revenue" ? "revenue" : "expense";

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  const subject = String(form.get("subject") ?? "").slice(0, 200);
  const from = String(form.get("from") ?? "").slice(0, 200);

  // First usable attachment (image or PDF).
  let file: File | null = null;
  for (const [, v] of form.entries()) {
    if (v instanceof File && (v.type.startsWith("image/") || v.type === "application/pdf")) { file = v; break; }
  }
  if (!file) {
    console.warn("Inbound email with no image/PDF attachment from", from);
    return new Response("No attachment", { status: 200 }); // 200 so the provider doesn't retry forever
  }

  // Store it.
  let assetId: string;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    if (file.type === "application/pdf") {
      const asset = await db.mediaAsset.create({ data: { contentType: "application/pdf", data: new Uint8Array(input) } });
      assetId = asset.id;
    } else {
      const jpeg = await sharp(input).rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
      const asset = await db.mediaAsset.create({ data: { contentType: "image/jpeg", data: new Uint8Array(jpeg) } });
      assetId = asset.id;
    }
  } catch (e) {
    console.error("Inbound store failed:", e);
    return new Response("Store failed", { status: 200 });
  }

  const receiptUrl = `/api/media/${assetId}`;
  const createdBy = `Email: ${from || "forwarded"}`;

  if (type === "revenue") {
    const ex = await extractRevenueFromAssetId(assetId);
    const sourceId = (await matchSourceId(ex.payer)) ?? (await findOrCreateUnassignedSource());
    const incurredOn = ex.date ? new Date(`${ex.date}T12:00:00`) : new Date();
    await db.revenueEntry.create({
      data: {
        receivedOn: incurredOn,
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
    return new Response("OK", { status: 200 });
  }

  // expense
  const ex = await extractExpenseFromAssetId(assetId);
  const categories = await getActiveExpenseCategoryNames();
  const incurredOn = ex.date ? new Date(`${ex.date}T12:00:00`) : new Date();
  const items = ex.items.length ? ex.items : [{ description: subject || "Invoice", amountCents: 0, category: "Other" }];
  for (const it of items) {
    const category = categories.includes(it.category) ? it.category : "Other";
    await db.expense.create({
      data: { incurredOn, amountCents: it.amountCents, category, vendor: ex.vendor ?? null, description: it.description || subject || null, receiptUrl, pending: true, createdBy },
    });
  }
  return new Response("OK", { status: 200 });
}
