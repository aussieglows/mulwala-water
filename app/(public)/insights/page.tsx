import type { Metadata } from "next";
import { ctaPrimary } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { Placeholder } from "@/components/site/Placeholder";
import { TrussMark } from "@/components/site/Truss";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes on operating founder-led, sponsor-backed and multi-unit businesses — narrow, specific, and written by the people who do the work.",
  alternates: { canonical: "/insights" },
};

// Planned launch pieces (spec Part 6.11). Published one a month, under a named author.
const planned = [
  { title: "Units awarded is a vanity metric. Here's the one that isn't.", tag: "Franchise" },
  { title: "What actually happens in the first 100 days inside a founder-led portfolio company", tag: "Private equity" },
  { title: "The five numbers a $20M business should look at weekly, and the twenty it shouldn't", tag: "Systems" },
  { title: "Why most operating improvements don't survive the consultant leaving", tag: "Operating" },
  { title: "Running an American business as an Australian, and the four things that don't translate", tag: "Cross-border" },
  { title: "Four-wall EBITDA: the arithmetic most multi-unit operators aren't doing", tag: "Multi-unit" },
];

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
        <div className="max-w-3xl mb-8">
          <Placeholder block>[[Laura — these six are planned launch pieces (Part 6.11). Each publishes under a named author once written; nothing goes up we wouldn&rsquo;t defend in a room.]]</Placeholder>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {planned.map((a) => (
            <div key={a.title} className="rounded-2xl border border-line bg-surface p-6 flex flex-col h-full">
              <p className="t-eyebrow text-brass-deep flex items-center gap-2 m-0">
                <TrussMark className="w-5 h-auto text-brass" /> {a.tag}
              </p>
              <h2 className="t-heading text-ink mt-3 mb-0">{a.title}</h2>
              <p className="t-small text-muted mt-auto pt-4">Coming soon</p>
            </div>
          ))}
        </div>
      </Section>

      <CTABand heading="Book a 20-minute call." body="Twenty minutes, no deck. We'll tell you whether this is a problem we're good at." secondary={null} />
    </>
  );
}
