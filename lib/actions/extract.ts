"use server";

import { requireAuth } from "@/lib/auth";
import {
  extractExpenseFromAssetId,
  extractRevenueFromAssetId,
  matchSourceId,
  EMPTY_EXPENSE,
  EMPTY_REVENUE,
  type ExpenseExtract,
  type RevenueExtract,
} from "@/lib/extract";

function idFromUrl(url: string): string | null {
  return url.split("/").pop()?.trim() || null;
}

/** Read an uploaded invoice/receipt to pre-fill the expense form. Returns editable draft data. */
export async function extractExpense(mediaUrl: string): Promise<ExpenseExtract> {
  await requireAuth();
  const id = idFromUrl(mediaUrl);
  if (!id) return EMPTY_EXPENSE;
  return extractExpenseFromAssetId(id);
}

/** Read an uploaded revenue screenshot/remittance to pre-fill the revenue form, and try to match it to
 *  an existing source. Returns editable draft data + a best-guess sourceId. */
export async function extractRevenue(mediaUrl: string): Promise<RevenueExtract & { sourceId: string | null }> {
  await requireAuth();
  const id = idFromUrl(mediaUrl);
  if (!id) return { ...EMPTY_REVENUE, sourceId: null };
  const extract = await extractRevenueFromAssetId(id);
  const sourceId = await matchSourceId(extract.payer);
  return { ...extract, sourceId };
}
