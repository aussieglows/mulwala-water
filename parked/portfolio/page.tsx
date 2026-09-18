import type { Metadata } from "next";
import { getActivePortfolio } from "@/lib/site";
import { ctaPrimary } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio & advisory companies",
  description:
    "Companies Mulwala Water has invested in, advised or operated — across fitness, hospitality, real estate and technology, in Australia and America.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const companies = await getActivePortfolio();

  return (
    <>
      <Hero
        eyebrow="PORTFOLIO & ADVISORY"
        title="Companies we've backed, advised and operated."
        lead="A mix of investments, advisory mandates and operating seats — the businesses where we've done the work, not just talked about it."
        primary={ctaPrimary}
      />

      <Section>
        {companies.length === 0 ? (
          <p className="text-muted">Portfolio companies coming soon.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((c) => {
              const card = (
                <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col h-full hover:border-river transition-colors">
                  <div className="h-16 flex items-center">
                    {c.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logoUrl} alt={c.name} className="max-h-12 max-w-[70%] object-contain grayscale opacity-80" />
                    ) : (
                      <span className="t-heading text-ink">{c.name}</span>
                    )}
                  </div>
                  {c.description && <p className="t-small text-ink2 mt-4 mb-0">{c.description}</p>}
                </div>
              );
              return c.url ? (
                <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className="no-underline">{card}</a>
              ) : (
                <div key={c.id}>{card}</div>
              );
            })}
          </div>
        )}

        <p className="t-small text-muted mt-10 max-w-3xl">
          Logos are shown to indicate a working relationship and remain the property of their respective owners.
          Inclusion here does not imply endorsement.
        </p>
      </Section>

      <CTABand heading="Book a 20-minute call." body="Twenty minutes, no deck. We'll tell you whether this is a problem we're good at." secondary={null} />
    </>
  );
}
