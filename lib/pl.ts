import "server-only";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { getActiveExpenseCategoryNames } from "@/lib/expense-categories";
import { BUSINESS_TIMEZONE } from "@/lib/config";

export const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthIdx = (d: Date) =>
  Number(new Intl.DateTimeFormat("en-US", { timeZone: BUSINESS_TIMEZONE, month: "numeric" }).format(d)) - 1;

const zero12 = () => Array.from({ length: 12 }, () => 0);

export type PLResult = {
  year: number;
  monthLabels: string[];
  // Revenue rows: one per source, each with 12 monthly figures + a total.
  revenueRows: { id: string; name: string; kind: string; months: number[]; total: number }[];
  revenueTotals: { months: number[]; total: number };
  // Expense rows: one per category that has activity.
  expenseRows: { category: string; months: number[]; total: number }[];
  expenseTotals: { months: number[]; total: number };
  // Net profit before + after estimated tax.
  netBeforeTax: { months: number[]; total: number };
  taxRatePercent: number;
  estimatedTax: { months: number[]; total: number };
  netAfterTax: { months: number[]; total: number };
};

/** Full-year P&L broken out by month, computed from confirmed (non-pending) revenue + expenses. */
export async function getProfitAndLoss(year: number): Promise<PLResult> {
  const settings = await getSettings();
  const start = new Date(`${year}-01-01T00:00:00`);
  const end = new Date(`${year}-12-31T23:59:59.999`);

  const sources = await db.revenueSource.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const entries = await db.revenueEntry.findMany({
    where: { receivedOn: { gte: start, lte: end }, pending: false },
    select: { sourceId: true, receivedOn: true, amountCents: true },
  });
  const expenses = await db.expense.findMany({
    where: { incurredOn: { gte: start, lte: end }, pending: false },
    select: { category: true, incurredOn: true, amountCents: true },
  });

  // --- Revenue by source ---
  const bySource = new Map<string, number[]>();
  for (const s of sources) bySource.set(s.id, zero12());
  for (const e of entries) {
    const arr = bySource.get(e.sourceId) ?? zero12();
    arr[monthIdx(e.receivedOn)] += e.amountCents;
    bySource.set(e.sourceId, arr);
  }
  const revenueRows = sources.map((s) => {
    const months = bySource.get(s.id) ?? zero12();
    return { id: s.id, name: s.name, kind: s.kind, months, total: months.reduce((a, b) => a + b, 0) };
  });
  const revenueTotals = { months: zero12(), total: 0 };
  for (const r of revenueRows) {
    r.months.forEach((v, i) => (revenueTotals.months[i] += v));
    revenueTotals.total += r.total;
  }

  // --- Expenses by category ---
  const byCat = new Map<string, number[]>();
  for (const e of expenses) {
    const arr = byCat.get(e.category) ?? zero12();
    arr[monthIdx(e.incurredOn)] += e.amountCents;
    byCat.set(e.category, arr);
  }
  // Keep the admin's category order, then append any historical categories no longer in the list.
  const activeCats = await getActiveExpenseCategoryNames();
  const orderedCats = [
    ...activeCats.filter((c) => byCat.has(c)),
    ...[...byCat.keys()].filter((c) => !activeCats.includes(c)),
  ];
  const expenseRows = orderedCats.map((category) => {
    const months = byCat.get(category)!;
    return { category, months, total: months.reduce((a, b) => a + b, 0) };
  });
  const expenseTotals = { months: zero12(), total: 0 };
  for (const r of expenseRows) {
    r.months.forEach((v, i) => (expenseTotals.months[i] += v));
    expenseTotals.total += r.total;
  }

  // --- Net + estimated tax ---
  const netBeforeTax = { months: zero12(), total: 0 };
  revenueTotals.months.forEach((_, i) => {
    netBeforeTax.months[i] = revenueTotals.months[i] - expenseTotals.months[i];
  });
  netBeforeTax.total = revenueTotals.total - expenseTotals.total;

  const rate = settings.taxRatePercent || 0;
  const estimatedTax = { months: zero12(), total: 0 };
  const netAfterTax = { months: zero12(), total: 0 };
  netBeforeTax.months.forEach((v, i) => {
    const tax = v > 0 ? Math.round((v * rate) / 100) : 0; // only tax positive-profit months
    estimatedTax.months[i] = tax;
    netAfterTax.months[i] = v - tax;
  });
  estimatedTax.total = estimatedTax.months.reduce((a, b) => a + b, 0);
  netAfterTax.total = netBeforeTax.total - estimatedTax.total;

  return {
    year,
    monthLabels: MONTH_LABELS,
    revenueRows,
    revenueTotals,
    expenseRows,
    expenseTotals,
    netBeforeTax,
    taxRatePercent: rate,
    estimatedTax,
    netAfterTax,
  };
}
