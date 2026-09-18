import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { playbookCategories, getCategory, playbooksIntro } from "@/content/playbooks";
import { site, ctaPrimary } from "@/content/site";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { TrussMark } from "@/components/site/Truss";
import { Placeholder } from "@/components/site/Placeholder";

export function generateStaticParams() {
  return playbookCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return {
    title: `${c.name} playbooks`,
    description: c.tagline,
    alternates: { canonical: `/playbooks/${c.slug}` },
  };
}

export default async function PlaybookCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${c.name} playbooks`,
    provider: { "@type": "ProfessionalService", name: site.legalName },
    areaServed: ["US", "AU"],
  };

  return (
    <>
      <Hero eyebrow={`PLAYBOOKS · ${c.name.toUpperCase()}`} title={c.tagline} primary={ctaPrimary} />

      <Section>
        <div className="mb-8">
          <Placeholder block>{playbooksIntro.reviewNote}</Placeholder>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {c.plays.map((p) => (
            <div key={p.name} className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-start gap-3">
                <TrussMark className="w-8 h-auto text-brass mt-1 shrink-0" />
                <div>
                  <h2 className="t-heading text-ink m-0">{p.name}</h2>
                  <p className="t-small text-brass-deep font-medium mt-1 mb-0">{p.subtitle}</p>
                </div>
              </div>
              <div className="mt-4">
                <Placeholder>[[Description · When it applies · What you get — Laura to confirm]]</Placeholder>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTABand heading="Book a 20-minute call." body="Tell us what's going on and we'll tell you which of these actually applies." secondary={{ label: "All playbooks", href: "/playbooks" }} />

      <Script id="playbook-service-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(serviceLd)}
      </Script>
    </>
  );
}
