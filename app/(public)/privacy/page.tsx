import type { Metadata } from "next";
import { site } from "@/content/site";
import { Section, Container } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Mulwala Water handles the information you share through this site: what we collect, why, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const updated = "September 2026";
  return (
    <Section>
      <Container>
        <div className="max-w-3xl">
          <h1 className="t-display-lg text-ink m-0">Privacy</h1>
          <p className="t-small text-muted mt-3">Last updated {updated}</p>

          <div className="mt-8 space-y-6 t-body-lg text-ink2">
            <p className="measure">
              This site collects only what you choose to give us. We don&rsquo;t sell your information, and we don&rsquo;t
              share it with anyone outside {site.legalName} except where we need a service provider to operate the site
              (for example, our hosting provider).
            </p>

            <div>
              <h2 className="t-heading text-ink">What we collect</h2>
              <ul className="list-disc pl-5 mt-3 space-y-2 measure">
                <li><strong className="text-ink">Contact form.</strong> Your name, email, company and message, so we can reply. It goes to us and nowhere else, and we don&rsquo;t add you to any list from it.</li>
                <li><strong className="text-ink">Newsletter.</strong> If you sign up, we store your email address to send the occasional note. Every email has a working unsubscribe link, and unsubscribing removes you.</li>
              </ul>
            </div>

            <div>
              <h2 className="t-heading text-ink">How we use it</h2>
              <p className="measure mt-3">
                To respond to you, to run an engagement if we start one, and — only if you opted in — to send the
                newsletter. We keep it as long as we have a reason to, and remove it when you ask.
              </p>
            </div>

            <div>
              <h2 className="t-heading text-ink">Cookies and analytics</h2>
              <p className="measure mt-3">
                We keep tracking to a minimum. Any analytics we use are privacy-respecting and aggregate — we&rsquo;re
                measuring whether the site works, not building a profile of you.
              </p>
            </div>

            <div>
              <h2 className="t-heading text-ink">Your choices</h2>
              <p className="measure mt-3">
                Email us at <a href={`mailto:${site.email}`} className="text-river-deep hover:text-river no-underline">{site.email}</a>{" "}
                to see what we hold about you, correct it, or have it deleted. We&rsquo;ll action it promptly.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
