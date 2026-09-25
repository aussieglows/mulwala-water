import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { publishedArticles, getArticle } from "@/content/insights";
import { site, ctaContact } from "@/content/site";
import { Section, Container } from "@/components/site/ui";
import { CTABand } from "@/components/site/bands";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

// Only published articles are routable; unpublished slugs 404 and stay out of the sitemap.
export function generateStaticParams() {
  return publishedArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a || !a.published) return {};
  return {
    title: a.title,
    description: a.dek,
    alternates: { canonical: `/insights/${a.slug}` },
    openGraph: { type: "article", publishedTime: a.date ?? undefined },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a || !a.published) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    datePublished: a.date ?? undefined,
    author: a.author ? { "@type": "Person", name: a.author } : { "@type": "Organization", name: site.legalName },
    publisher: { "@type": "Organization", name: site.legalName },
    mainEntityOfPage: `https://www.mulwalawater.com/insights/${a.slug}`,
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: a.title, href: `/insights/${a.slug}` },
        ]}
      />
      <Section>
        <Container>
          <article className="max-w-2xl mx-auto">
            <p className="t-eyebrow text-brass-deep m-0">{a.tag}</p>
            <h1 className="t-display-lg text-ink mt-4 m-0">{a.title}</h1>
            <p className="t-body-lg text-muted mt-5 measure">{a.dek}</p>
            <div className="flex items-center gap-3 mt-6 pb-6 border-b border-line t-small text-muted">
              {a.author && <span>{a.author}</span>}
              {a.date && <span>{new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>}
              {a.readingMinutes && <span>{a.readingMinutes} min read</span>}
            </div>
            <div className="mt-8 space-y-5">
              {a.body?.map((p, i) => (
                <p key={i} className="t-body-lg text-ink2 measure">{p}</p>
              ))}
            </div>
          </article>
        </Container>
      </Section>

      <CTABand heading="Book a 20-minute call." body="Twenty minutes, no deck. We'll tell you whether this is a problem we're good at." secondary={ctaContact} />

      <Script id="article-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(articleLd)}
      </Script>
    </>
  );
}
