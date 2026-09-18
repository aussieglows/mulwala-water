import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { home } from "@/content/home";
import { playbookCategories } from "@/content/playbooks";
import { howWeWork } from "@/content/howWeWork";
import { ctaPrimary, ctaSecondary, site } from "@/content/site";
import { getActivePortfolio } from "@/lib/site";
import { Hero } from "@/components/site/Hero";
import { Section, Container, Button } from "@/components/site/ui";
import { MetricBand, CTABand } from "@/components/site/bands";
import { DoorCard, PlayCard, PhaseStrip } from "@/components/site/blocks";
import { TrussMark } from "@/components/site/Truss";
import { Placeholder } from "@/components/site/Placeholder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description:
    "We advise, operate, and invest in founder-led, family-owned, sponsor-backed and multi-unit businesses — a plan you can act on, an operator who steps in and runs it, or capital alongside you.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const companies = await getActivePortfolio();

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    url: "https://www.mulwalawater.com",
    email: site.email,
    telephone: site.phone,
    areaServed: ["US", "AU"],
  };

  return (
    <>
      {/* 1 — Hero */}
      <Hero
        variant="dark"
        eyebrow={home.hero.eyebrow}
        title={home.hero.h1}
        lead={home.hero.lead}
        primary={ctaPrimary}
        secondary={ctaSecondary}
      />

      {/* 2 — Metrics */}
      <MetricBand metrics={home.metrics} />

      {/* 3 — The four doors */}
      <Section>
        <h2 className="t-display-md text-ink m-0">{home.doors.h2}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.doors.items.map((d) => (
            <DoorCard key={d.href} {...d} />
          ))}
        </div>
      </Section>

      {/* 3.5 — Three ways to work with us (advise / operate / invest) */}
      <Section className="bg-surface border-y border-line">
        <h2 className="t-display-md text-ink m-0">{home.modes.h2}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {home.modes.items.map((m) => (
            <div key={m.title} className="rounded-2xl border border-line bg-paper p-7 flex flex-col h-full">
              <TrussMark className="w-8 h-auto text-brass mb-4" />
              <h3 className="t-heading text-ink m-0">{m.title}</h3>
              <p className="t-body-lg text-muted mt-3 mb-0">{m.line}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4 — Approach */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="t-display-md text-ink m-0">{home.approach.h2}</h2>
          <p className="t-body-lg text-ink2 mt-5 measure">{home.approach.body}</p>
        </div>
      </Section>

      {/* 5 — What we do (four kinds) */}
      <Section className="bg-surface border-y border-line">
        <h2 className="t-display-md text-ink m-0">{home.whatWeDo.h2}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {playbookCategories.map((cat) => (
            <PlayCard
              key={cat.slug}
              title={cat.name}
              line={cat.home.line}
              plays={cat.home.examples}
              href={`/playbooks/${cat.slug}`}
            />
          ))}
        </div>
      </Section>

      {/* 6 — Proof (gated on case studies) */}
      <Section>
        <h2 className="t-display-md text-ink m-0">{home.proof.h2}</h2>
        <div className="mt-6">
          <Placeholder block>{home.proof.placeholder}</Placeholder>
        </div>
      </Section>

      {/* 7 — How we work, in brief */}
      <Section className="bg-surface border-y border-line">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="t-display-md text-ink m-0">{home.phasesBrief.h2}</h2>
          <Button href={home.phasesBrief.cta.href} variant="ghost">{home.phasesBrief.cta.label} →</Button>
        </div>
        <PhaseStrip items={howWeWork.phases.items} className="mt-12" />
      </Section>

      {/* 8 — Portfolio strip */}
      {companies.length > 0 && (
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="t-display-md text-ink m-0">{home.portfolioStrip.h2}</h2>
            <Button href={home.portfolioStrip.cta.href} variant="ghost">{home.portfolioStrip.cta.label} →</Button>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {companies.map((c) =>
              c.logoUrl ? (
                <div key={c.id} className="h-24 rounded-xl border border-line bg-paper flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.logoUrl} alt={c.name} className="max-h-12 max-w-[80%] object-contain opacity-70 grayscale" />
                </div>
              ) : (
                <div key={c.id} className="h-24 rounded-xl border border-line bg-paper flex items-center justify-center p-4 text-center">
                  <span className="t-small font-semibold text-ink2">{c.name}</span>
                </div>
              )
            )}
          </div>
        </Section>
      )}

      {/* 9 — Closing CTA */}
      <CTABand heading={home.closing.heading} body={home.closing.body} secondary={null} />

      <Script id="service-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(serviceLd)}
      </Script>
    </>
  );
}
