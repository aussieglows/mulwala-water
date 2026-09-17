import { getSiteSettings, getActivePortfolio } from "@/lib/site";
import { PageBanner } from "@/components/public/PageBanner";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const s = await getSiteSettings();
  const companies = await getActivePortfolio();

  return (
    <main>
      <PageBanner title={s.portfolioHeading} subtitle={s.portfolioIntro} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {companies.length === 0 ? (
          <p className="text-muted">Portfolio companies coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map((c) => (
              <div key={c.id} className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-ink">{c.name}</h2>
                {c.description && <p className="text-muted mt-2 text-sm leading-relaxed">{c.description}</p>}
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-brand-dark font-bold text-sm no-underline">
                    Visit site →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
