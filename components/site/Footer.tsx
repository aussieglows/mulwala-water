import Link from "next/link";
import { footer, site } from "@/content/site";
import { Truss, TrussMark } from "@/components/site/Truss";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-3" aria-label={site.name}>
              <span className="text-river"><TrussMark className="w-8 h-auto" /></span>
              <span className="font-serif text-lg font-semibold tracking-tight text-ink">Mulwala Water</span>
            </Link>
            <p className="t-small text-muted max-w-xs">
              We advise, operate, and invest in founder-led, family-owned, sponsor-backed and multi-unit businesses.
            </p>
          </div>

          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="t-eyebrow text-muted mb-3">{col.title}</h3>
              <ul className="space-y-2 list-none p-0 m-0">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ink hover:text-river-deep no-underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 -mx-1 text-line" aria-hidden>
          <Truss spans={24} stretch className="w-full h-4" strokeWidth={0.75} />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="t-small text-muted m-0">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="t-small text-muted m-0">
            <a href={`mailto:${site.email}`} className="text-muted hover:text-river-deep no-underline">{site.email}</a>
            <span className="mx-2" aria-hidden>·</span>
            <a href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`} className="text-muted hover:text-river-deep no-underline">{site.phone}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
