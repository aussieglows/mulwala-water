"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

function toDate(ymd: string): Date {
  return new Date(`${ymd}T12:00:00`);
}

export type RevenueInput = {
  receivedOn: string; // YYYY-MM-DD
  amountCents: number;
  sourceId: string;
  category: string;
  payer?: string;
  description?: string;
  method?: string;
  invoiceRef?: string;
  receiptUrl?: string;
};

function clean(v?: string): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export async function addRevenue(input: RevenueInput) {
  await requireAuth();
  if (!input.sourceId || input.amountCents <= 0) throw new Error("A source and a positive amount are required.");
  await db.revenueEntry.create({
    data: {
      receivedOn: toDate(input.receivedOn),
      amountCents: input.amountCents,
      sourceId: input.sourceId,
      category: input.category,
      payer: clean(input.payer),
      description: clean(input.description),
      method: clean(input.method),
      invoiceRef: clean(input.invoiceRef),
      receiptUrl: clean(input.receiptUrl),
      pending: false,
      createdBy: input.receiptUrl ? "Upload" : "Manual",
    },
  });
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/pl");
  revalidatePath("/admin");
}

export async function updateRevenue(input: RevenueInput & { id: string }) {
  await requireAuth();
  if (input.amountCents <= 0) throw new Error("Amount must be positive.");
  await db.revenueEntry.update({
    where: { id: input.id },
    data: {
      receivedOn: toDate(input.receivedOn),
      amountCents: input.amountCents,
      sourceId: input.sourceId,
      category: input.category,
      payer: clean(input.payer),
      description: clean(input.description),
      method: clean(input.method),
      invoiceRef: clean(input.invoiceRef),
    },
  });
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/pl");
  revalidatePath("/admin");
}

/** Confirm an AI-drafted (pending) revenue row after review. */
export async function confirmPendingRevenue(input: RevenueInput & { id: string }) {
  await requireAuth();
  if (!input.sourceId || input.amountCents <= 0) throw new Error("A source and a positive amount are required.");
  await db.revenueEntry.update({
    where: { id: input.id },
    data: {
      receivedOn: toDate(input.receivedOn),
      amountCents: input.amountCents,
      sourceId: input.sourceId,
      category: input.category,
      payer: clean(input.payer),
      description: clean(input.description),
      method: clean(input.method),
      invoiceRef: clean(input.invoiceRef),
      pending: false,
    },
  });
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/pl");
  revalidatePath("/admin");
}

export async function deleteRevenue(id: string) {
  await requireAuth();
  await db.revenueEntry.delete({ where: { id } });
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/pl");
  revalidatePath("/admin");
}
