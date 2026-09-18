import type { Metadata } from "next";
import { home } from "@/content/home";
import { ctaPrimary } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { DoorCard } from "@/components/site/blocks";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Who we help",
  description:
    "We work with founder-led businesses, sponsor-backed companies, and franchise & multi-unit operators — the same operating discipline, in each one's own vocabulary.",
  alternates: { canonical: "/who-we-help" },
};

export default function WhoWeHelpPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Who We Help", href: "/who-we-help" }]} />
      <Hero
        eyebrow="WHO WE HELP"
        title="Three kinds of business. One way of working."
        lead="The problems rhyme, but the language doesn't. Pick the door that sounds like you — the vocabulary and the plays behind each one are yours, not a template."
        primary={ctaPrimary}
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {home.doors.items.map((d) => (
            <DoorCard key={d.href} title={d.title} line={d.line} href={d.href} />
          ))}
        </div>
      </Section>

      <CTABand heading="Not sure which one you are?" body="Most owners are a bit of two. Tell us what's going on and we'll tell you which door fits — or that it's not us." secondary={{ label: "See how we work", href: "/how-we-work" }} />
    </>
  );
}
