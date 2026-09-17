import { db } from "@/lib/db";
import { parseYear, todayYmd, toYmd } from "@/lib/dates";
import { getActiveExpenseCategoryNames } from "@/lib/expense-categories";
import { YearSelector } from "@/components/YearSelector";
import { ExpensesManager, type ExpenseRow } from "@/components/ExpensesManager";

export const dynamic = "force-dynamic";

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year: yearParam } = await searchParams;
  const year = parseYear(yearParam);
  const start = new Date(`${year}-01-01T00:00:00`);
  const end = new Date(`${year}-12-31T23:59:59.999`);
  const aiEnabled = !!process.env.ANTHROPIC_API_KEY;

  const sources = await db.revenueSource.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, name: true } });
  const categories = await getActiveExpenseCategoryNames();

  const rows = await db.expense.findMany({ where: { incurredOn: { gte: start, lte: end } }, orderBy: { incurredOn: "desc" } });
  const pendingRaw = await db.expense.findMany({ where: { pending: true }, orderBy: { createdAt: "desc" } });

  const toRow = (e: (typeof rows)[number]): ExpenseRow => ({
    id: e.id, date: toYmd(e.incurredOn), amountCents: e.amountCents, category: e.category, vendor: e.vendor,
    description: e.description, method: e.method, billable: e.billable, clientId: e.clientId, receiptUrl: e.receiptUrl, createdBy: e.createdBy,
  });

  const expenses = rows.filter((e) => !e.pending).map(toRow);
  const pending = pendingRaw.map(toRow);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Expenses</h1>
          <p className="text-sm text-muted">Log costs by category. Upload an invoice (PDF or photo) to auto-fill.</p>
        </div>
        <YearSelector year={year} />
      </div>
      <ExpensesManager expenses={expenses} pending={pending} sources={sources} categories={categories} defaultDate={todayYmd()} aiEnabled={aiEnabled} />
    </div>
  );
}
