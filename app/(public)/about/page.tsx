import { getSiteSettings, getActiveExpertise } from "@/lib/site";
import { ContactForm } from "@/components/public/ContactForm";
import { PageBanner } from "@/components/public/PageBanner";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const s = await getSiteSettings();
  const expertise = await getActiveExpertise();

  return (
    <main>
      <PageBanner title={s.aboutHeading} subtitle={s.tagline} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">{s.visionHeading}</h2>
          <p className="text-muted mt-3 leading-relaxed">{s.visionBody}</p>
          <h2 className="text-2xl font-bold text-brand-dark mt-10">{s.approachHeading}</h2>
          <p className="text-ink font-medium mt-3">{s.approachTagline}</p>
          <p className="text-muted mt-1 leading-relaxed">{s.approachBody}</p>
        </div>
        <div className="bg-gray-bg rounded-2xl p-6 self-start">
          <h2 className="text-2xl font-bold text-brand-dark">{s.expertiseHeading}</h2>
          <p className="text-muted text-sm mt-1">{s.expertiseIntro}</p>
          <ul className="mt-4 flex flex-col gap-3">
            {expertise.map((e) => (
              <li key={e.id} className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-xs shrink-0">✓</span>
                <span className="text-ink">{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Leadership — hidden until turned on in the admin (Website → Leadership) */}
      {s.showLeadership && (
        <section className="bg-gray-bg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/founder.jpg" alt={s.founderName} className="w-full max-w-[280px] rounded-2xl object-cover shadow-sm mx-auto" />
            <div>
              <div className="text-[11px] font-bold text-brand-dark uppercase tracking-wide">Leadership</div>
              <h2 className="text-3xl font-bold mt-1">{s.founderName}</h2>
              <p className="text-brand-dark font-medium">{s.founderTitle}</p>
              <p className="text-muted mt-3 leading-relaxed max-w-xl">{s.founderBio}</p>
            </div>
          </div>
        </section>
      )}

      {/* Photo band — boardroom */}
      <section className="relative overflow-hidden">
        <div className="h-72 sm:h-80 bg-cover bg-center" style={{ backgroundImage: "url('/images/boardroom.jpg')" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(20,32,48,0.85) 0%, rgba(20,32,48,0.3) 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <p className="text-white text-2xl sm:text-3xl font-bold max-w-lg leading-snug drop-shadow-lg">{s.approachTagline}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="text-muted mt-2">Ready to take the first step?</p>
          <div className="mt-5 flex flex-col gap-1 text-sm">
            <a href={`mailto:${s.email}`} className="text-brand-dark font-medium no-underline">{s.email}</a>
            <a href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`} className="text-brand-dark font-medium no-underline">{s.phone}</a>
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
