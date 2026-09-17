import Link from "next/link";
import { getSiteSettings, getActivePlaybooks } from "@/lib/site";
import { PLAYBOOK_CATEGORIES } from "@/lib/categories";
import { PageBanner } from "@/components/public/PageBanner";

export const dynamic = "force-dynamic";

export default async function PlaybooksPage() {
  const s = await getSiteSettings();
  const playbooks = await getActivePlaybooks();

  // Group active plays by category, in canonical order, then any custom categories.
  const cats = [
    ...PLAYBOOK_CATEGORIES.filter((c) => playbooks.some((p) => p.category === c)),
    ...[...new Set(playbooks.map((p) => p.category))].filter((c) => !(PLAYBOOK_CATEGORIES as readonly string[]).includes(c)),
  ];

  return (
    <main>
      <PageBanner title={s.playbooksHeading} />

      {/* Definition + intro */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
        <div className="text-brand-dark font-semibold tracking-[0.3em] text-sm uppercase">[ pleɪ · bʊk ] &nbsp;noun</div>
        <p className="text-muted italic mt-3 leading-relaxed">
          a notebook containing a detailed stock of the tactics and methods a team or organization uses to
          achieve a specified goal — where &ldquo;plays&rdquo; become a common language, practiced and measured against outcomes.
        </p>
        <p className="text-ink text-lg mt-8 leading-relaxed">{s.playbooksIntro}</p>
      </section>

      {/* Photo band */}
      <section className="relative overflow-hidden mb-6">
        <div className="h-64 bg-cover bg-center" style={{ backgroundImage: "url('/images/bridge-pano.jpg')" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(20,32,48,0.82) 0%, rgba(20,32,48,0.3) 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <p className="text-white text-xl sm:text-3xl font-bold max-w-lg leading-snug drop-shadow-lg">A play for every inflection point.</p>
          </div>
        </div>
      </section>

      {/* Plays grouped by category */}
      {cats.length === 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <p className="text-muted">Playbooks coming soon.</p>
        </section>
      )}
      {cats.map((cat) => {
        const plays = playbooks.filter((p) => p.category === cat);
        return (
          <section key={cat} className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
            <h2 className="text-2xl font-bold mb-1">Our {cat} Playbooks</h2>
            <div className="h-1 w-12 bg-brand rounded-full mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {plays.map((p) => (
                <div key={p.id} className="bg-surface border border-border rounded-2xl p-6 hover:border-brand/50 transition-colors">
                  <h3 className="text-lg font-bold text-brand-dark">{p.title}</h3>
                  {p.summary && <p className="text-muted mt-2 leading-relaxed text-[15px]">{p.summary}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-navy text-white rounded-2xl px-6 py-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Not sure which play fits your situation?</h2>
          <p className="text-white/80 mt-2 max-w-xl mx-auto">Let&apos;s work out the right approach together.</p>
          <a href={`mailto:${s.email}?subject=${encodeURIComponent("Playbooks enquiry")}`} className="inline-block mt-6 px-7 py-3 rounded-full bg-brand text-white font-bold no-underline hover:bg-brand-dark transition-colors">
            Get in touch
          </a>
          <div className="mt-3"><Link href="/portfolio-companies" className="text-white/70 text-sm no-underline">See our portfolio →</Link></div>
        </div>
      </section>
    </main>
  );
}
