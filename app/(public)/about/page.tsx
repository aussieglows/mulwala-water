import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/content/about";
import { ctaPrimary, ctaContact } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section, Container } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { PrincipalProfile } from "@/components/site/PrincipalProfile";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mulwala Water puts big-company operating discipline inside founder-led, family-owned, sponsor-backed and multi-unit businesses — by advising, operating, or investing.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Hero eyebrow={about.eyebrow} title={about.h1} lead={about.lead} primary={ctaPrimary} />

      {/* Our story */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="t-display-md text-ink m-0">{about.story.h2}</h2>
          {about.story.body.map((p, i) => (
            <p key={i} className="t-body-lg text-ink2 mt-5 measure">{p}</p>
          ))}
        </div>
      </Section>

      {/* The name — with the Mulwala aerial */}
      <Section className="bg-surface border-y border-line">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="t-display-md text-ink m-0">{about.name.h2}</h2>
            <p className="t-body-lg text-ink2 mt-5 measure">{about.name.body}</p>
          </div>
          <figure className="m-0">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-line">
              <Image
                src={about.name.image.src}
                alt={about.name.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ filter: "saturate(0.8) sepia(0.06)" }}
              />
            </div>
            <figcaption className="t-small text-muted mt-3">{about.name.caption}</figcaption>
          </figure>
        </div>
      </Section>

      {/* Approach */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="t-display-md text-ink m-0">{about.approach.h2}</h2>
          <p className="t-body-lg text-ink2 mt-5 measure">{about.approach.body}</p>
        </div>
      </Section>

      {/* Principal */}
      <Section className="bg-surface border-y border-line">
        <h2 className="t-display-md text-ink m-0">{about.principalHeading}</h2>
        <div className="mt-8">
          <PrincipalProfile />
        </div>
      </Section>

      <CTABand heading="Book a 20-minute call." body="Twenty minutes, no deck. We'll tell you whether this is a problem we're good at." secondary={ctaContact} />
    </>
  );
}
