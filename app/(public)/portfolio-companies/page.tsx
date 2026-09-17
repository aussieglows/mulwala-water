import { getSiteSettings, getActivePortfolio } from "@/lib/site";
import { PageBanner } from "@/components/public/PageBanner";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const s = await getSiteSettings();
  const companies = await getActivePortfolio();

  return (
    <main>
      <PageBanner title={s.portfolioHeading} subtitle={s.portfolioIntro} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        {companies.length === 0 ? (
          <p className="text-muted">Portfolio companies coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {companies.map((c) => {
              const inner = (
                <div className="h-36 bg-white border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-brand/50 transition-colors">
                  {c.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.logoUrl} alt={c.name} className="max-h-16 max-w-[85%] object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-navy leading-tight">{c.name}</span>
                  )}
                  {c.description && !c.logoUrl && <span className="text-[11px] text-navy/55 mt-2 uppercase tracking-wide">{c.description}</span>}
                </div>
              );
              return c.url ? (
                <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className="no-underline">{inner}</a>
              ) : (
                <div key={c.id}>{inner}</div>
              );
            })}
          </div>
        )}
      </section>

      {/* Skyline band + CTA */}
      <section className="relative overflow-hidden">
        <div className="h-80 bg-cover bg-center" style={{ backgroundImage: "url('/images/skyline.jpg')" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,32,48,0.55) 0%, rgba(20,32,48,0.85) 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full text-center text-white">
            <h2 className="text-2xl sm:text-4xl font-bold drop-shadow-lg">Your partner in business success</h2>
            <a href={`mailto:${s.email}?subject=${encodeURIComponent("Portfolio & advisory enquiry")}`} className="inline-block mt-6 px-7 py-3 rounded-full bg-brand text-white font-bold no-underline hover:bg-brand-dark transition-colors shadow-lg">
              Get in touch
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
