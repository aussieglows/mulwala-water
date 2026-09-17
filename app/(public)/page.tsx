import Link from "next/link";
import { getSiteSettings, getActiveExpertise } from "@/lib/site";
import { ContactForm } from "@/components/public/ContactForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const s = await getSiteSettings();
  const expertise = await getActiveExpertise();
  const ctaMail = `mailto:${s.email}?subject=${encodeURIComponent(s.ctaLabel)}&body=${encodeURIComponent("I am ready to take action toward improving business outcomes and would like to take the first step.\n\nPlease contact me to begin the journey.")}`;

  return (
    <main>
      {/* Hero — Mulwala Bridge aerial with a navy overlay */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-sunset.jpg')" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,32,48,0.78) 0%, rgba(20,32,48,0.55) 45%, rgba(20,32,48,0.9) 100%)" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 sm:py-40">
          <h1 className="text-4xl sm:text-6xl font-bold max-w-3xl leading-tight drop-shadow-lg">{s.heroHeadline}</h1>
          <p className="text-white/85 text-lg mt-5 max-w-xl drop-shadow">{s.heroSubtext}</p>
          <a href={ctaMail} className="inline-block mt-8 px-8 py-3.5 rounded-full bg-brand text-white font-bold no-underline hover:bg-brand-dark transition-colors shadow-lg">
            {s.ctaLabel}
          </a>
        </div>
      </section>

      {/* Who we are */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold">{s.aboutHeading}</h2>
            <h3 className="text-brand-dark font-semibold text-lg mt-6">{s.visionHeading}</h3>
            <p className="text-muted mt-2 leading-relaxed">{s.visionBody}</p>
            <h3 className="text-brand-dark font-semibold text-lg mt-6">{s.approachHeading}</h3>
            <p className="text-ink font-medium mt-2">{s.approachTagline}</p>
            <p className="text-muted mt-1 leading-relaxed">{s.approachBody}</p>
          </div>
          <div className="bg-gray-bg rounded-2xl p-6">
            <h3 className="text-brand-dark font-semibold text-lg">{s.expertiseHeading}</h3>
            <p className="text-muted text-sm mt-1">{s.expertiseIntro}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {expertise.map((e) => (
                <li key={e.id} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-xs shrink-0">✓</span>
                  <span className="text-ink">{e.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="inline-block mt-5 text-brand-dark font-bold no-underline">Learn more about us →</Link>
          </div>
        </div>
      </section>

      {/* Photo band — office */}
      <section className="relative overflow-hidden">
        <div className="h-72 sm:h-80 bg-cover bg-center" style={{ backgroundImage: "url('/images/office.jpg')" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(20,32,48,0.88) 0%, rgba(20,32,48,0.45) 55%, rgba(20,32,48,0.15) 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <p className="text-white text-2xl sm:text-3xl font-bold max-w-lg leading-snug drop-shadow-lg">Big-business insight, brought to founder-led companies.</p>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/playbooks" className="group bg-surface border border-border rounded-2xl p-6 no-underline hover:border-brand/50 transition-colors">
            <div className="text-xl font-bold text-ink">{s.playbooksHeading}</div>
            <p className="text-muted text-sm mt-1">{s.playbooksIntro}</p>
            <span className="inline-block mt-3 text-brand-dark font-bold">View playbooks →</span>
          </Link>
          <Link href="/portfolio-companies" className="group bg-surface border border-border rounded-2xl p-6 no-underline hover:border-brand/50 transition-colors">
            <div className="text-xl font-bold text-ink">{s.portfolioHeading}</div>
            <p className="text-muted text-sm mt-1">{s.portfolioIntro}</p>
            <span className="inline-block mt-3 text-brand-dark font-bold">View portfolio →</span>
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold">Contact Us</h2>
            <p className="text-muted mt-2">Drop us a line and we&apos;ll get back to you.</p>
            <div className="mt-5 flex flex-col gap-1 text-sm">
              <a href={`mailto:${s.email}`} className="text-brand-dark font-medium no-underline">{s.email}</a>
              <a href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`} className="text-brand-dark font-medium no-underline">{s.phone}</a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
