import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { doors, getDoor } from "@/content/whoWeHelp";
import { getCategory } from "@/content/playbooks";
import { howWeWork } from "@/content/howWeWork";
import { site } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { EngagementCard, PlayCard } from "@/components/site/blocks";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { TrussMark } from "@/components/site/Truss";
import { isPlaceholder } from "@/components/site/Placeholder";
import { ctaPrimary } from "@/content/site";

export function generateStaticParams() {
  return doors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDoor(slug);
  if (!d) return {};
  return {
    title: d.h1,
    description: d.lead,
    alternates: { canonical: `/who-we-help/${d.slug}` },
  };
}

export default async function DoorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDoor(slug);
  if (!d) notFound();

  const cats = d.about.playbooks.map(getCategory).filter(Boolean);
  const shapes = howWeWork.shapes.cards.filter((s) => d.shapes.includes(s.name));

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: d.serviceType,
    provider: { "@type": "ProfessionalService", name: site.legalName },
    areaServed: ["US", "AU"],
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Who We Help", href: "/who-we-help" },
          { label: d.name, href: `/who-we-help/${d.slug}` },
        ]}
      />
      <Hero eyebrow={d.eyebrow} title={d.h1} lead={d.lead} primary={ctaPrimary} />

      {/* What we usually find */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="t-display-md text-ink m-0">{d.find.h2}</h2>
          <ul className="list-none p-0 m-0 mt-8 space-y-4">
            {d.find.items.map((it, i) => (
              <li key={i} className="flex gap-3 t-body-lg text-ink2">
                <TrussMark className="w-6 h-auto text-brass mt-2 shrink-0" />
                <span className="measure">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* What we do about it */}
      <Section className="bg-surface border-y border-line">
        <div className="max-w-3xl">
          <h2 className="t-display-md text-ink m-0">{d.about.h2}</h2>
          <p className="t-body-lg text-ink2 mt-5 measure">{d.about.body}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cats.map((c) => (
            <PlayCard
              key={c!.slug}
              title={c!.name}
              line={c!.home.line}
              plays={c!.home.examples}
              href="/playbooks"
            />
          ))}
        </div>
      </Section>

      {/* Audience case study — hidden from the public site until a real one is supplied */}
      {!isPlaceholder(d.caseStudy) && (
        <Section>
          <h2 className="t-display-md text-ink m-0">Proof from this side of the business.</h2>
          <p className="t-body-lg text-ink2 mt-5 measure">{d.caseStudy}</p>
        </Section>
      )}

      {/* Relevant engagement shapes */}
      <Section>
        <h2 className="t-display-md text-ink m-0">How this usually starts.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {shapes.map((s) => (
            <EngagementCard key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <CTABand heading="Book a 20-minute call." body="Twenty minutes, no deck. We'll tell you whether this is a problem we're good at." secondary={{ label: "See how we work", href: "/how-we-work" }} />

      <Script id="door-service-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(serviceLd)}
      </Script>
    </>
  );
}
