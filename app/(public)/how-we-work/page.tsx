import type { Metadata } from "next";
import Script from "next/script";
import { howWeWork as c } from "@/content/howWeWork";
import { Hero } from "@/components/site/Hero";
import { Section, Container, Eyebrow } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { EngagementCard, PhaseStrip, ComparisonTable, FAQ } from "@/components/site/blocks";
import { Placeholder, isPlaceholder, RichText } from "@/components/site/Placeholder";
import { ctaPrimary } from "@/content/site";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "What an engagement actually looks like: four shapes, four phases, fixed fees, and a leaving date written in before we start.",
  alternates: { canonical: "/how-we-work" },
};

export default function HowWeWorkPage() {
  // FAQPage structured data only from questions with real (non-placeholder) answers.
  const answered = c.faq.items.filter((i) => !isPlaceholder(i.a));
  const faqLd =
    answered.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: answered.map((i) => ({
            "@type": "Question",
            name: i.q,
            acceptedAnswer: { "@type": "Answer", text: i.a },
          })),
        }
      : null;

  return (
    <>
      <Hero eyebrow={c.eyebrow} title={c.h1} lead={c.lead} primary={ctaPrimary} />

      {/* Four shapes */}
      <Section>
        <h2 className="t-display-md text-ink m-0">{c.shapes.h2}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {c.shapes.cards.map((s) => (
            <EngagementCard key={s.name} {...s} />
          ))}
        </div>
      </Section>

      {/* Four phases */}
      <Section className="bg-surface border-y border-line">
        <h2 className="t-display-md text-ink m-0">{c.phases.h2}</h2>
        <PhaseStrip items={c.phases.items} className="mt-12" />
      </Section>

      {/* What we don't do */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="t-display-md text-ink m-0">{c.dontDo.h2}</h2>
          <ul className="list-none p-0 m-0 mt-8 space-y-5">
            {c.dontDo.items.map((it, i) => (
              <li key={i} className="t-body-lg text-ink2 measure">
                <strong className="text-ink font-semibold"><RichText text={it.lead} /></strong>{" "}
                {it.rest}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Price */}
      <Section className="bg-surface border-y border-line">
        <div className="max-w-3xl">
          <h2 className="t-display-md text-ink m-0">{c.price.h2}</h2>
          {c.price.body.map((p, i) => (
            <p key={i} className="t-body-lg text-ink2 mt-4 measure">{p}</p>
          ))}
          <div className="mt-4">
            <Placeholder block>{c.price.optional}</Placeholder>
          </div>
        </div>
      </Section>

      {/* Alternatives */}
      <Section>
        <div className="max-w-2xl">
          <h2 className="t-display-md text-ink m-0">{c.alternatives.h2}</h2>
        </div>
        <div className="mt-10">
          <ComparisonTable columns={c.alternatives.columns} rows={c.alternatives.rows} />
        </div>
      </Section>

      {/* Where the risk sits — must not ship unapproved */}
      <Section className="bg-surface border-y border-line">
        <div className="max-w-3xl">
          <Eyebrow className="mb-4">WHERE THE RISK SITS</Eyebrow>
          <h2 className="t-display-md text-ink m-0">{c.risk.h2}</h2>
          <div className="mt-4">
            <Placeholder block>{c.risk.approvalNote}</Placeholder>
          </div>
          <blockquote className="mt-5 border-l-2 border-brass pl-5 t-body-lg text-ink2 measure italic">
            {c.risk.body}
          </blockquote>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="t-display-md text-ink m-0">{c.faq.h2}</h2>
          <div className="mt-8">
            <FAQ items={c.faq.items} />
          </div>
        </div>
      </Section>

      <CTABand heading={c.cta.heading} body={c.cta.sub} secondary={null} />

      {faqLd && (
        <Script id="faq-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(faqLd)}
        </Script>
      )}
    </>
  );
}
