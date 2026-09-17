"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

function toDate(ymd: string): Date {
  return new Date(`${ymd}T12:00:00`);
}
function clean(v?: string): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export type ExpenseInput = {
  incurredOn: string; // YYYY-MM-DD
  amountCents: number;
  category: string;
  vendor?: string;
  description?: string;
  method?: string;
  billable?: boolean;
  clientId?: string | null;
  receiptUrl?: string;
};

export async function addExpense(input: ExpenseInput) {
  await requireAuth();
  if (input.amountCents <= 0) throw new Error("Amount must be positive.");
  await db.expense.create({
    data: {
      incurredOn: toDate(input.incurredOn),
      amountCents: input.amountCents,
      category: input.category,
      vendor: clean(input.vendor),
      description: clean(input.description),
      method: clean(input.method),
      billable: !!input.billable,
      clientId: input.clientId ?? null,
      receiptUrl: clean(input.receiptUrl),
      pending: false,
      createdBy: input.receiptUrl ? "Upload" : "Manual",
    },
  });
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/pl");
  revalidatePath("/admin");
}

export async function updateExpense(input: ExpenseInput & { id: string }) {
  await requireAuth();
  if (input.amountCents <= 0) throw new Error("Amount must be positive.");
  await db.expense.update({
    where: { id: input.id },
    data: {
      incurredOn: toDate(input.incurredOn),
      amountCents: input.amountCents,
      category: input.category,
      vendor: clean(input.vendor),
      description: clean(input.description),
      method: clean(input.method),
      billable: !!input.billable,
      clientId: input.clientId ?? null,
    },
  });
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/pl");
  revalidatePath("/admin");
}

export async function confirmPendingExpense(input: ExpenseInput & { id: string }) {
  await requireAuth();
  if (input.amountCents <= 0) throw new Error("Amount must be positive.");
  await db.expense.update({
    where: { id: input.id },
    data: {
      incurredOn: toDate(input.incurredOn),
      amountCents: input.amountCents,
      category: input.category,
      vendor: clean(input.vendor),
      description: clean(input.description),
      method: clean(input.method),
      pending: false,
    },
  });
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/pl");
  revalidatePath("/admin");
}

export async function deleteExpense(id: string) {
  await requireAuth();
  await db.expense.delete({ where: { id } });
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/pl");
  revalidatePath("/admin");
}
