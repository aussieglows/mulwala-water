import type { Metadata } from "next";
import { home } from "@/content/home";
import { ctaPrimary, ctaContact } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { DoorCard } from "@/components/site/blocks";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Who we help",
  description:
    "We work with founder-led, family-owned, sponsor-backed and multi-unit businesses — the same operating discipline, in each one's own vocabulary.",
  alternates: { canonical: "/who-we-help" },
};

export default function WhoWeHelpPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Who We Help", href: "/who-we-help" }]} />
      <Hero
        eyebrow="WHO WE HELP"
        title="Most of our work starts in one of four places."
        lead="The problems rhyme, but the language doesn't. Pick the door that sounds like you — the vocabulary and the plays behind each one are yours, not a template."
        primary={ctaPrimary}
        image="/images/skyline.jpg"
      />

      <Section>
        <h2 className="t-eyebrow text-brass-deep m-0 mb-6">Four doors</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.doors.items.map((d) => (
            <DoorCard key={d.href} title={d.title} line={d.line} href={d.href} />
          ))}
        </div>
      </Section>

      <CTABand
        heading="None of these quite fit?"
        body="Most owners are a bit of two, and some are none of them. The door matters less than whether the problem is the kind we're good at. Tell us what's going on and we'll tell you — including when the answer is that it isn't us."
        secondary={ctaContact}
      />
    </>
  );
}
