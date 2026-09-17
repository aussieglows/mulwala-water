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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-10">
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
