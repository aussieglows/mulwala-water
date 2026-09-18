import type { Metadata } from "next";
import Link from "next/link";
import { playbooksIntro, playbookCategories } from "@/content/playbooks";
import { ctaPrimary } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { TrussMark } from "@/components/site/Truss";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = {
  title: "Playbooks",
  description:
    "The work falls into four kinds — growth, systems, turnaround, and owner & exit. Every play is something we have run inside a real business.",
  alternates: { canonical: "/playbooks" },
};

export default function PlaybooksPage() {
  return (
    <>
      <Hero eyebrow={playbooksIntro.eyebrow} title={playbooksIntro.h1} lead={playbooksIntro.lead} primary={ctaPrimary} />

      <Section>
        <div className="mb-8">
          <Placeholder block>{playbooksIntro.reviewNote}</Placeholder>
        </div>
        <div className="space-y-16">
          {playbookCategories.map((cat) => (
            <div key={cat.slug} id={cat.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="t-heading text-ink m-0">{cat.name}</h2>
                <Link href={`/playbooks/${cat.slug}`} className="t-small font-semibold text-river-deep hover:text-river no-underline">
                  View {cat.name} →
                </Link>
              </div>
              <p className="t-body-lg text-muted mt-2 measure">{cat.tagline}</p>
              <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {cat.plays.map((p) => (
                  <div key={p.name} className="flex gap-3 py-2 border-b border-line">
                    <TrussMark className="w-6 h-auto text-brass mt-1.5 shrink-0" />
                    <div>
                      <p className="t-body-lg text-ink font-medium m-0">{p.name}</p>
                      <p className="t-small text-muted m-0">{p.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTABand heading="Not sure which play you need?" body="Tell us what's going on. Twenty minutes on a call and we'll point you at the right one — or tell you it's not us." secondary={{ label: "See how we work", href: "/how-we-work" }} />
    </>
  );
}
