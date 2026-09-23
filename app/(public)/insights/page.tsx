import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/insights";
import { ctaPrimary, ctaContact } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { TrussMark } from "@/components/site/Truss";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes on operating founder-led, family-owned, sponsor-backed and multi-unit businesses — narrow, specific, and written by the people who do the work.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <Hero
        eyebrow="INSIGHTS"
        title="Field notes, not content."
        lead="A few times a year, on narrow and ownable territory — the questions we actually get asked, answered the way we'd answer them in the room."
        primary={ctaPrimary}
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((a) => {
            const inner = (
              <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col h-full hover:border-river transition-colors">
                <p className="t-eyebrow text-brass-deep flex items-center gap-2 m-0">
                  <TrussMark className="w-5 h-auto text-brass" /> {a.tag}
                </p>
                <h2 className="t-heading text-ink mt-3 mb-0">{a.title}</h2>
                <p className="t-small text-muted mt-2">{a.dek}</p>
                <p className="t-small text-muted mt-auto pt-4">
                  {a.published ? "Read →" : "Coming soon"}
                </p>
              </div>
            );
            return a.published ? (
              <Link key={a.slug} href={`/insights/${a.slug}`} className="no-underline">{inner}</Link>
            ) : (
              <div key={a.slug}>{inner}</div>
            );
          })}
        </div>
      </Section>

      <CTABand heading="Book a 20-minute call." body="Twenty minutes, no deck. We'll tell you whether this is a problem we're good at." secondary={ctaContact} />
    </>
  );
}
