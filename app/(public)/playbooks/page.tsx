import { getSiteSettings, getActivePlaybooks } from "@/lib/site";
import { PageBanner } from "@/components/public/PageBanner";

export const dynamic = "force-dynamic";

export default async function PlaybooksPage() {
  const s = await getSiteSettings();
  const playbooks = await getActivePlaybooks();

  return (
    <main>
      <PageBanner title={s.playbooksHeading} subtitle={s.playbooksIntro} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {playbooks.length === 0 ? (
          <p className="text-muted">Playbooks coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {playbooks.map((p) => (
              <div key={p.id} className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold text-ink">{p.title}</h2>
                {p.summary && <p className="text-muted mt-2 leading-relaxed">{p.summary}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
