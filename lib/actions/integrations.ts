"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { syncGmail, disconnectGoogle, type SyncResult } from "@/lib/google";
import { syncPlaid, disconnectBank, type PlaidSyncResult } from "@/lib/plaid";

function bump() {
  revalidatePath("/admin");
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/pl");
  revalidatePath("/admin/settings");
}

export async function syncGmailNow(): Promise<SyncResult> {
  await requireAuth();
  const r = await syncGmail();
  bump();
  return r;
}

export async function syncPlaidNow(): Promise<PlaidSyncResult> {
  await requireAuth();
  const r = await syncPlaid();
  bump();
  return r;
}

export async function saveGmailLabels(input: { expenseLabel: string; revenueLabel: string }) {
  await requireAuth();
  await db.googleAccount.update({
    where: { id: "singleton" },
    data: { expenseLabel: input.expenseLabel.trim() || "Expenses", revenueLabel: input.revenueLabel.trim() || "Revenue" },
  });
  revalidatePath("/admin/settings");
}

export async function disconnectGoogleNow() {
  await requireAuth();
  await disconnectGoogle();
  revalidatePath("/admin/settings");
}

export async function disconnectBankNow(id: string) {
  await requireAuth();
  await disconnectBank(id);
  revalidatePath("/admin/settings");
}
