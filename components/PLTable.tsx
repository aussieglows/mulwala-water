import { formatDollars } from "@/lib/money";
import type { PLResult } from "@/lib/pl";

function Cell({ cents, bold, accent }: { cents: number; bold?: boolean; accent?: "pos" | "neg" | "muted" }) {
  const color = accent === "pos" ? "text-green" : accent === "neg" ? "text-red" : accent === "muted" ? "text-muted" : "";
  return (
    <td className={`py-1.5 px-2 text-right tabular-nums whitespace-nowrap ${bold ? "font-bold" : ""} ${color}`}>
      {cents === 0 ? <span className="text-muted">—</span> : formatDollars(cents)}
    </td>
  );
}

function Row({ label, months, total, bold, indent, accent, top }: { label: string; months: number[]; total: number; bold?: boolean; indent?: boolean; accent?: "pos" | "neg" | "muted"; top?: boolean }) {
  return (
    <tr className={top ? "border-t-2 border-border" : "border-t border-border/60"}>
      <td className={`py-1.5 px-3 sticky left-0 bg-surface z-10 whitespace-nowrap ${bold ? "font-bold" : ""} ${indent ? "pl-6 text-muted font-normal" : ""}`}>{label}</td>
      {months.map((m, i) => <Cell key={i} cents={m} bold={bold} accent={accent} />)}
      <Cell cents={total} bold accent={accent} />
    </tr>
  );
}

export function PLTable({ pl }: { pl: PLResult }) {
  const netAccent = (v: number): "pos" | "neg" | undefined => (v > 0 ? "pos" : v < 0 ? "neg" : undefined);
  return (
    <div className="overflow-x-auto bg-surface border border-border rounded-xl">
      <table className="w-full text-[12px] min-w-[900px]">
        <thead>
          <tr className="text-[11px] font-bold text-muted uppercase tracking-wide border-b border-border">
            <th className="text-left py-2 px-3 sticky left-0 bg-surface z-10"> </th>
            {pl.monthLabels.map((m) => <th key={m} className="text-right py-2 px-2">{m}</th>)}
            <th className="text-right py-2 px-2">Year</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={14} className="py-1.5 px-3 text-[11px] font-bold uppercase tracking-wide text-brand-dark bg-brand-light/40">Revenue</td></tr>
          {pl.revenueRows.length === 0 && <tr><td colSpan={14} className="py-2 px-3 text-muted">No revenue sources yet.</td></tr>}
          {pl.revenueRows.map((r) => <Row key={r.id} label={r.name} months={r.months} total={r.total} indent />)}
          <Row label="Total revenue" months={pl.revenueTotals.months} total={pl.revenueTotals.total} bold top />

          <tr><td colSpan={14} className="py-1.5 px-3 text-[11px] font-bold uppercase tracking-wide text-brand-dark bg-brand-light/40">Expenses</td></tr>
          {pl.expenseRows.length === 0 && <tr><td colSpan={14} className="py-2 px-3 text-muted">No expenses yet.</td></tr>}
          {pl.expenseRows.map((r) => <Row key={r.category} label={r.category} months={r.months} total={r.total} indent />)}
          <Row label="Total expenses" months={pl.expenseTotals.months} total={pl.expenseTotals.total} bold top />

          <Row label="Net profit (before tax)" months={pl.netBeforeTax.months} total={pl.netBeforeTax.total} bold top accent={netAccent(pl.netBeforeTax.total)} />
          {pl.taxRatePercent > 0 && (
            <>
              <Row label={`Est. tax (${pl.taxRatePercent}%)`} months={pl.estimatedTax.months} total={pl.estimatedTax.total} indent accent="muted" />
              <Row label="Net profit (after tax)" months={pl.netAfterTax.months} total={pl.netAfterTax.total} bold accent={netAccent(pl.netAfterTax.total)} />
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
