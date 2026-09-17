import { getProfitAndLoss } from "@/lib/pl";
import { parseYear } from "@/lib/dates";
import { formatDollars } from "@/lib/money";
import { YearSelector } from "@/components/YearSelector";
import { PLTable } from "@/components/PLTable";
import { ExportCsvButton } from "@/components/ExportCsvButton";

export const dynamic = "force-dynamic";

export default async function PLPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year: yearParam } = await searchParams;
  const year = parseYear(yearParam);
  const pl = await getProfitAndLoss(year);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Profit &amp; Loss — {year}</h1>
          <p className="text-sm text-muted">By month, from confirmed revenue and expenses.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportCsvButton pl={pl} />
          <YearSelector year={year} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Kpi label="Total revenue" value={formatDollars(pl.revenueTotals.total)} tone="brand" />
        <Kpi label="Total expenses" value={formatDollars(pl.expenseTotals.total)} tone="muted" />
        <Kpi label={pl.taxRatePercent > 0 ? "Net profit (after tax)" : "Net profit"} value={formatDollars(pl.taxRatePercent > 0 ? pl.netAfterTax.total : pl.netBeforeTax.total)} tone={(pl.taxRatePercent > 0 ? pl.netAfterTax.total : pl.netBeforeTax.total) >= 0 ? "pos" : "neg"} />
      </div>

      <PLTable pl={pl} />
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone: "brand" | "muted" | "pos" | "neg" }) {
  const color = tone === "pos" ? "text-green" : tone === "neg" ? "text-red" : tone === "brand" ? "text-brand-dark" : "text-ink";
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="text-[11px] font-bold text-muted uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
