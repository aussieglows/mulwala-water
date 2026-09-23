import type { Metadata } from "next";
import { site } from "@/content/site";
import { isPlaceholder } from "@/components/site/Placeholder";
import { Hero } from "@/components/site/Hero";
import { Section, Container, Button } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Book a 20-minute call",
  description:
    "Pick a time for a 20-minute call. No deck — a straight answer on whether this is a problem we're good at.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  // Embed the scheduler once a real URL is set in content/site.ts (site.bookingUrl).
  const ready = !isPlaceholder(site.bookingUrl) && /^https?:\/\//.test(site.bookingUrl);

  return (
    <>
      <Hero
        eyebrow="BOOK A CALL"
        title="Book a 20-minute call."
        lead="Pick a time that suits you. Twenty minutes, no deck — we'll tell you whether this is a problem we're good at."
        image="/images/skyline.jpg"
      />

      <Section>
        <Container>
          {ready ? (
            <div className="rounded-2xl overflow-hidden border border-line bg-surface shadow-sm">
              <iframe
                src={site.bookingUrl}
                title="Booking calendar"
                className="w-full"
                style={{ height: "820px", border: 0 }}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="max-w-2xl rounded-2xl border border-line bg-surface p-8">
              <h2 className="t-heading text-ink m-0">Our online scheduler is being set up.</h2>
              <p className="t-body-lg text-ink2 mt-4 measure">
                In the meantime, email{" "}
                <a href={`mailto:${site.email}?subject=${encodeURIComponent("Book a 20-minute call")}`} className="text-river-deep font-semibold no-underline">
                  {site.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`} className="text-river-deep font-semibold no-underline">
                  {site.phone}
                </a>{" "}
                and we&rsquo;ll get a time in the diary.
              </p>
              <div className="mt-6">
                <Button href="/contact" variant="primary">Send us a note instead</Button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
