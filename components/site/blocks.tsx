import Link from "next/link";
import { Truss, TrussMark } from "@/components/site/Truss";
import { Placeholder, isPlaceholder } from "@/components/site/Placeholder";

/* ---- Engagement shape card (how-we-work "Four shapes") ---- */
export function EngagementCard({
  name,
  duration,
  who,
  gets,
}: {
  name: string;
  duration: string;
  who: string;
  gets: string[];
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 flex flex-col h-full">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="t-heading text-ink m-0">{name}</h3>
        <span className="t-eyebrow text-brass-deep shrink-0">{duration}</span>
      </div>
      <p className="t-small text-muted mt-2 mb-4">{who}</p>
      <ul className="list-none p-0 m-0 space-y-2.5 mt-auto">
        {gets.map((g, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] text-ink2">
            <TrussMark className="w-5 h-auto text-brass mt-1.5 shrink-0" />
            <span>{g}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- Four-phase strip, using the truss as the progress device ---- */
export function PhaseStrip({
  items,
  className = "",
}: {
  items: { n: string; name: string; body: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="grid gap-8 md:grid-cols-4">
        {items.map((p, i) => (
          <div key={p.n}>
            <div className="text-river mb-3">
              <Truss spans={items.length} active={i} className="w-full h-6" strokeWidth={1} />
            </div>
            <p className="t-eyebrow text-brass-deep m-0">{p.n} · {p.name}</p>
            <p className="t-small text-ink2 mt-2 mb-0">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Comparison table (be conspicuously fair) ---- */
export function ComparisonTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: { label: string; cells: string[] }[];
}) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full border-collapse min-w-[720px] text-left">
        <thead>
          <tr>
            <th className="p-3 border-b border-line" />
            {columns.map((c, i) => (
              <th
                key={c}
                className={`p-3 border-b border-line align-bottom t-small font-semibold ${i === 0 ? "text-river-deep" : "text-muted"}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row" className="p-3 border-b border-line align-top t-small font-medium text-ink whitespace-nowrap">
                {r.label}
              </th>
              {r.cells.map((cell, i) => (
                <td
                  key={i}
                  className={`p-3 border-b border-line align-top text-[14px] ${i === 0 ? "text-ink font-medium bg-river-wash/50" : "text-ink2"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- FAQ (native details/summary — accessible, no JS; valid FAQPage source) ---- */
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => (
        <details key={i} className="group py-4">
          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none t-body-lg text-ink font-medium">
            {it.q}
            <span className="text-brass transition-transform group-open:rotate-45 shrink-0 text-xl leading-none" aria-hidden>+</span>
          </summary>
          <div className="mt-3 t-body-lg text-ink2">
            {isPlaceholder(it.a) ? <Placeholder>{it.a}</Placeholder> : <p className="m-0 measure">{it.a}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}

/* ---- Door card (three audiences) ---- */
export function DoorCard({
  title,
  line,
  href,
}: {
  title: string;
  line: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-surface p-7 no-underline flex flex-col h-full hover:border-river transition-colors"
    >
      <TrussMark className="w-8 h-auto text-brass mb-4" />
      <h3 className="t-heading text-ink m-0">{title}</h3>
      <p className="t-body-lg text-muted mt-3 mb-6">{line}</p>
      <span className="mt-auto t-small font-semibold text-river-deep group-hover:text-river">
        Read more →
      </span>
    </Link>
  );
}

/* ---- Play-category card (four kinds of work) ---- */
export function PlayCard({
  title,
  line,
  plays,
  href,
}: {
  title: string;
  line: string;
  plays: string[];
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-surface p-7 no-underline flex flex-col h-full hover:border-river transition-colors"
    >
      <h3 className="t-heading text-ink m-0">{title}</h3>
      <p className="t-small text-muted mt-2">{line}</p>
      <ul className="list-none p-0 m-0 mt-4 space-y-1.5">
        {plays.map((p, i) => (
          <li key={i} className="t-small text-ink2 flex gap-2">
            <span className="text-brass" aria-hidden>·</span> {p}
          </li>
        ))}
      </ul>
      <span className="mt-6 t-small font-semibold text-river-deep group-hover:text-river">
        See the plays →
      </span>
    </Link>
  );
}
