import type { Metadata } from "next";
import { ctaPrimary } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { TrussMark } from "@/components/site/Truss";

export const metadata: Metadata = {
  title: "Results",
  description:
    "Case studies and outcomes from Mulwala Water engagements — the situation, what we changed, and the number, with a named quote from the company.",
  alternates: { canonical: "/results" },
};

const template = [
  { h: "Situation", d: "Business type, size, what was happening." },
  { h: "What we found", d: "The diagnosis, including anything that surprised us." },
  { h: "What we changed", d: "Specific actions, not categories." },
  { h: "The number", d: "One headline figure with a time frame." },
  { h: "Quote", d: "From the named person at that company, with their title." },
];

export default function ResultsPage() {
  return (
    <>
      <Hero
        eyebrow="RESULTS"
        title="What it looks like when it works."
        lead="One number, stated plainly, beats five. Each case study below is one screen: the situation, what we changed, the result, and a quote from the person we did it with."
        primary={ctaPrimary}
      />

      <Section>
        <h2 className="t-heading text-ink m-0">How each case study reads</h2>
        <ol className="list-none p-0 m-0 mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {template.map((t, i) => (
            <li key={t.h} className="rounded-xl border border-line bg-surface p-5">
              <TrussMark className="w-6 h-auto text-brass mb-3" />
              <p className="t-eyebrow text-brass-deep m-0">{String(i + 1).padStart(2, "0")}</p>
              <p className="t-body-lg text-ink font-medium mt-1 mb-1">{t.h}</p>
              <p className="t-small text-muted m-0">{t.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CTABand heading="Book a 20-minute call." body="We'll walk you through work like yours on the call, in detail, even before the written case studies are up." secondary={{ label: "See how we work", href: "/how-we-work" }} />
    </>
  );
}
