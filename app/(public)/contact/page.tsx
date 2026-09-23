import type { Metadata } from "next";
import { site, bookingHref } from "@/content/site";
import { Section, Container } from "@/components/site/ui";
import { ContactForm } from "@/components/site/ContactForm";
import { isPlaceholder } from "@/components/site/Placeholder";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what's actually going on. No deck, no discovery process — twenty minutes on a call and a straight answer on whether this is a problem we're good at.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <h1 className="t-display-lg text-ink m-0">Tell us what&rsquo;s actually going on.</h1>
          <p className="t-body-lg text-muted mt-5 measure">
            No deck, no discovery process. Twenty minutes on a call, and a straight answer on whether this is a problem we&rsquo;re good at.
          </p>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <ContactForm />
            <p className="t-small text-muted mt-4 measure">
              We reply within one business day. Your details come straight to us and nowhere else — we don&rsquo;t add you to a list.
            </p>
          </div>

          <aside className="lg:border-l lg:border-line lg:pl-10">
            <h2 className="t-eyebrow text-muted m-0">Other ways to reach us</h2>
            <dl className="mt-4 space-y-4 m-0">
              <div>
                <dt className="t-small text-muted">Email</dt>
                <dd className="m-0"><a href={`mailto:${site.email}`} className="t-body-lg text-ink hover:text-river-deep no-underline">{site.email}</a></dd>
              </div>
              <div>
                <dt className="t-small text-muted">Phone</dt>
                <dd className="m-0">
                  <a href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`} className="t-body-lg text-ink hover:text-river-deep no-underline">{site.phone}</a>
                  {!isPlaceholder(site.phoneHours) && (
                    <span className="block t-small text-muted mt-1">{site.phoneHours}</span>
                  )}
                </dd>
              </div>
              {!isPlaceholder(site.linkedin) && (
                <div>
                  <dt className="t-small text-muted">LinkedIn</dt>
                  <dd className="m-0"><a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="t-body-lg text-ink hover:text-river-deep no-underline">Connect on LinkedIn →</a></dd>
                </div>
              )}
            </dl>
            <p className="t-small text-ink2 mt-8">
              Already know you want to talk?{" "}
              <a href={bookingHref} className="font-semibold text-river-deep hover:text-river no-underline">
                Book a 20-minute call →
              </a>
            </p>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
