import { getSiteSettings, getActivePlaybooks } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function PlaybooksPage() {
  const s = await getSiteSettings();
  const playbooks = await getActivePlaybooks();

  return (
    <main>
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold">{s.playbooksHeading}</h1>
          <p className="text-white/75 mt-3 max-w-2xl">{s.playbooksIntro}</p>
        </div>
      </section>

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
