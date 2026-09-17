import Link from "next/link";
import { db } from "@/lib/db";
import { getProfitAndLoss } from "@/lib/pl";
import { currentYear, toYmd } from "@/lib/dates";
import { formatDollars } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const year = currentYear();
  const pl = await getProfitAndLoss(year);
  const [pendingRev, pendingExp] = await Promise.all([
    db.revenueEntry.count({ where: { pending: true } }),
    db.expense.count({ where: { pending: true } }),
  ]);

  const recentRev = await db.revenueEntry.findMany({ where: { pending: false }, orderBy: { receivedOn: "desc" }, take: 5, include: { source: { select: { name: true } } } });
  const recentExp = await db.expense.findMany({ where: { pending: false }, orderBy: { incurredOn: "desc" }, take: 5 });

  const net = pl.taxRatePercent > 0 ? pl.netAfterTax.total : pl.netBeforeTax.total;
  const topSources = [...pl.revenueRows].filter((r) => r.total > 0).sort((a, b) => b.total - a.total).slice(0, 4);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold">Dashboard <span className="text-muted font-normal text-base">· {year}</span></h1>
      </div>

      {(pendingRev > 0 || pendingExp > 0) && (
        <div className="flex flex-wrap gap-3">
          {pendingRev > 0 && (
            <Link href="/admin/revenue" className="flex-1 min-w-[220px] bg-green-light border border-green/30 rounded-xl p-3 no-underline">
              <div className="text-sm font-bold text-ink">💰 {pendingRev} revenue item{pendingRev > 1 ? "s" : ""} to review</div>
              <div className="text-[12px] text-muted">Auto-drafted from uploads/email — confirm to count them.</div>
            </Link>
          )}
          {pendingExp > 0 && (
            <Link href="/admin/expenses" className="flex-1 min-w-[220px] bg-amber-light border border-amber/30 rounded-xl p-3 no-underline">
              <div className="text-sm font-bold text-ink">🧾 {pendingExp} invoice{pendingExp > 1 ? "s" : ""} to review</div>
              <div className="text-[12px] text-muted">Auto-drafted from uploads/email — confirm to count them.</div>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Kpi label="Revenue (YTD)" value={formatDollars(pl.revenueTotals.total)} href="/admin/revenue" tone="brand" />
        <Kpi label="Expenses (YTD)" value={formatDollars(pl.expenseTotals.total)} href="/admin/expenses" tone="muted" />
        <Kpi label={pl.taxRatePercent > 0 ? "Net profit (after tax)" : "Net profit"} value={formatDollars(net)} href="/admin/pl" tone={net >= 0 ? "pos" : "neg"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold">Top revenue sources</h2>
            <Link href="/admin/pl" className="text-[12px] font-bold no-underline">Full P&amp;L →</Link>
          </div>
          {topSources.length === 0 ? (
            <p className="text-[13px] text-muted">No revenue yet. <Link href="/admin/revenue" className="font-bold">Add some →</Link></p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {topSources.map((s) => {
                const pct = pl.revenueTotals.total ? Math.round((s.total / pl.revenueTotals.total) * 100) : 0;
                return (
                  <li key={s.id}>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium">{s.name}</span>
                      <span className="tabular-nums">{formatDollars(s.total)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-bg mt-1 overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <h2 className="text-sm font-bold mb-2">Recent activity</h2>
          <div className="flex flex-col gap-1 text-[13px]">
            {recentRev.length === 0 && recentExp.length === 0 && <p className="text-muted">Nothing logged yet.</p>}
            {recentRev.map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <span className="text-muted"><span className="text-green font-bold">+</span> {e.source?.name ?? "—"} <span className="text-muted/70">· {toYmd(e.receivedOn)}</span></span>
                <span className="tabular-nums font-medium">{formatDollars(e.amountCents)}</span>
              </div>
            ))}
            {recentExp.map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <span className="text-muted"><span className="text-red font-bold">−</span> {e.category}{e.vendor ? ` · ${e.vendor}` : ""} <span className="text-muted/70">· {toYmd(e.incurredOn)}</span></span>
                <span className="tabular-nums font-medium">{formatDollars(e.amountCents)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <QuickLink href="/admin/revenue" label="+ Add revenue" />
        <QuickLink href="/admin/expenses" label="+ Add expense" />
        <QuickLink href="/admin/pl" label="View P&L" />
        <QuickLink href="/admin/settings" label="Automation setup" />
      </div>
    </div>
  );
}

function Kpi({ label, value, href, tone }: { label: string; value: string; href: string; tone: "brand" | "muted" | "pos" | "neg" }) {
  const color = tone === "pos" ? "text-green" : tone === "neg" ? "text-red" : tone === "brand" ? "text-brand-dark" : "text-ink";
  return (
    <Link href={href} className="bg-surface border border-border rounded-xl p-4 no-underline hover:border-brand/40 transition-colors">
      <div className="text-[11px] font-bold text-muted uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${color}`}>{value}</div>
    </Link>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-3 py-2 rounded-lg text-sm font-medium bg-surface border border-border no-underline text-brand-dark hover:bg-brand-light">
      {label}
    </Link>
  );
}
