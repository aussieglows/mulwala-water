import type { Metadata } from "next";
import { Section, Container } from "@/components/site/ui";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Diagnostic } from "@/components/site/Diagnostic";

export const metadata: Metadata = {
  title: "Which play do you need?",
  description:
    "Eight questions, under three minutes. A straight read on where your business is and the two plays to start with — no email required to see the answer.",
  alternates: { canonical: "/playbooks/diagnostic" },
};

export default function DiagnosticPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Playbooks", href: "/playbooks" },
          { label: "Which play do you need?", href: "/playbooks/diagnostic" },
        ]}
      />
      <Section>
        <Container>
          <div className="max-w-2xl mb-10">
            <p className="t-eyebrow text-brass-deep m-0">DIAGNOSTIC</p>
            <h1 className="t-display-lg text-ink mt-4 m-0">Which play do you need?</h1>
            <p className="t-body-lg text-muted mt-5 measure">
              Eight questions, under three minutes. You&rsquo;ll get a straight read on where the business is and
              the two plays we&rsquo;d start with. No email required to see the answer.
            </p>
          </div>
          <div className="max-w-2xl">
            <Diagnostic />
          </div>
        </Container>
      </Section>
    </>
  );
}
