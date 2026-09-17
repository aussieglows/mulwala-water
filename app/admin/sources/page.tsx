import { db } from "@/lib/db";
import { SourcesManager, type SourceRow } from "@/components/SourcesManager";
import { ExpenseCategoriesManager, type CategoryRow } from "@/components/ExpenseCategoriesManager";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await db.revenueSource.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { entries: { select: { amountCents: true, pending: true } } },
  });

  const sourceRows: SourceRow[] = sources.map((s) => {
    const counted = s.entries.filter((e) => !e.pending);
    return {
      id: s.id,
      name: s.name,
      kind: s.kind,
      active: s.active,
      entryCount: counted.length,
      totalCents: counted.reduce((sum, e) => sum + e.amountCents, 0),
    };
  });

  // Expense categories with usage stats (matched by name).
  const categories = await db.expenseCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  const expenses = await db.expense.findMany({ where: { pending: false }, select: { category: true, amountCents: true } });
  const stats = new Map<string, { count: number; total: number }>();
  for (const e of expenses) {
    const s = stats.get(e.category) ?? { count: 0, total: 0 };
    s.count += 1;
    s.total += e.amountCents;
    stats.set(e.category, s);
  }
  const categoryRows: CategoryRow[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    active: c.active,
    count: stats.get(c.name)?.count ?? 0,
    totalCents: stats.get(c.name)?.total ?? 0,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold">Sources</h1>
        <p className="text-sm text-muted">Manage your revenue sources and expense categories — the line items on your P&amp;L.</p>
      </div>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-bold">Revenue sources</h2>
          <p className="text-sm text-muted">Clients and income streams. Add/rename/reorder/deactivate.</p>
        </div>
        <SourcesManager sources={sourceRows} />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-bold">Expense categories</h2>
          <p className="text-sm text-muted">The buckets your costs group into. Add new ones (e.g. Salaries &amp; wages) — they appear in the Expenses form and on the P&amp;L.</p>
        </div>
        <ExpenseCategoriesManager categories={categoryRows} />
      </section>
    </div>
  );
}
