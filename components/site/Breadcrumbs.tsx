import Link from "next/link";
import { Container } from "@/components/site/ui";

export type Crumb = { label: string; href: string };

// Visible breadcrumb trail + BreadcrumbList JSON-LD (spec Part 8.3).
// Pass the trail INCLUDING Home and the current page.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `https://www.mulwalawater.com${c.href}`,
    })),
  };

  return (
    <div className="border-b border-line bg-paper">
      <Container>
        <nav aria-label="Breadcrumb" className="py-3">
          <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0 t-small text-muted">
            {items.map((c, i) => {
              const last = i === items.length - 1;
              return (
                <li key={c.href} className="flex items-center gap-1.5">
                  {last ? (
                    <span aria-current="page" className="text-ink2">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="text-muted hover:text-river-deep no-underline">{c.label}</Link>
                  )}
                  {!last && <span aria-hidden className="text-line">/</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
