"use client";

import type { PLResult } from "@/lib/pl";

function dollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function ExportCsvButton({ pl }: { pl: PLResult }) {
  function download() {
    const header = ["Line", ...pl.monthLabels, "Year total"];
    const rows: (string | number)[][] = [header];
    rows.push(["REVENUE"]);
    for (const r of pl.revenueRows) rows.push([r.name, ...r.months.map(dollars), dollars(r.total)]);
    rows.push(["Total revenue", ...pl.revenueTotals.months.map(dollars), dollars(pl.revenueTotals.total)]);
    rows.push(["EXPENSES"]);
    for (const r of pl.expenseRows) rows.push([r.category, ...r.months.map(dollars), dollars(r.total)]);
    rows.push(["Total expenses", ...pl.expenseTotals.months.map(dollars), dollars(pl.expenseTotals.total)]);
    rows.push(["Net profit (before tax)", ...pl.netBeforeTax.months.map(dollars), dollars(pl.netBeforeTax.total)]);
    if (pl.taxRatePercent > 0) {
      rows.push([`Est. tax (${pl.taxRatePercent}%)`, ...pl.estimatedTax.months.map(dollars), dollars(pl.estimatedTax.total)]);
      rows.push(["Net profit (after tax)", ...pl.netAfterTax.months.map(dollars), dollars(pl.netAfterTax.total)]);
    }
    const csv = rows.map((r) => r.map((c) => (typeof c === "string" && /[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profit-and-loss-${pl.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={download} className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium bg-white text-brand-dark cursor-pointer hover:bg-brand-light">
      Export CSV
    </button>
  );
}
