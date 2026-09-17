import { db } from "@/lib/db";
import { parseYear, todayYmd, toYmd } from "@/lib/dates";
import { YearSelector } from "@/components/YearSelector";
import { RevenueManager, type RevenueRow } from "@/components/RevenueManager";

export const dynamic = "force-dynamic";

export default async function RevenuePage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year: yearParam } = await searchParams;
  const year = parseYear(yearParam);
  const start = new Date(`${year}-01-01T00:00:00`);
  const end = new Date(`${year}-12-31T23:59:59.999`);
  const aiEnabled = !!process.env.ANTHROPIC_API_KEY;

  const sources = await db.revenueSource.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, name: true } });

  const rows = await db.revenueEntry.findMany({
    where: { receivedOn: { gte: start, lte: end } },
    orderBy: { receivedOn: "desc" },
    include: { source: { select: { name: true } } },
  });
  // Pending items (any date) always surface for review, regardless of year.
  const pendingRaw = await db.revenueEntry.findMany({ where: { pending: true }, orderBy: { createdAt: "desc" }, include: { source: { select: { name: true } } } });

  const toRow = (e: (typeof rows)[number]): RevenueRow => ({
    id: e.id, date: toYmd(e.receivedOn), amountCents: e.amountCents, sourceId: e.sourceId, sourceName: e.source?.name ?? "—",
    category: e.category, payer: e.payer, description: e.description, method: e.method, invoiceRef: e.invoiceRef, receiptUrl: e.receiptUrl, createdBy: e.createdBy,
  });

  const entries = rows.filter((e) => !e.pending).map(toRow);
  const pending = pendingRaw.map(toRow);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Revenue</h1>
          <p className="text-sm text-muted">Log income by source. Upload a payment screenshot to auto-fill.</p>
        </div>
        <YearSelector year={year} />
      </div>
      <RevenueManager entries={entries} pending={pending} sources={sources} defaultDate={todayYmd()} aiEnabled={aiEnabled} />
    </div>
  );
}
