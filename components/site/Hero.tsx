import Image from "next/image";
import { Container, Button } from "@/components/site/ui";

// Photo hero (classic design): full-bleed image + navy overlay, white text.
// `image` carries a hero photo across every page; defaults to the Mulwala aerial.
export function Hero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  image = "/images/bridge-aerial.jpg",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
  variant?: "light" | "dark"; // accepted for compatibility; the classic hero is always a photo
  image?: string;
}) {
  return (
    <section className="relative text-white overflow-hidden">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(20,32,48,.58) 0%, rgba(20,32,48,.78) 100%)" }}
      />
      <Container className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="max-w-3xl">
          {eyebrow && <p className="t-eyebrow text-white/85 m-0 mb-5">{eyebrow}</p>}
          <h1 className="t-display-lg text-white m-0">{title}</h1>
          {lead && <p className="t-body-lg text-white/90 mt-6 measure">{lead}</p>}
          {(primary || secondary) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {primary && <Button href={primary.href} variant="primary">{primary.label}</Button>}
              {secondary && (
                <a
                  href={secondary.href}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-white/60 text-white hover:border-white no-underline transition-colors"
                >
                  {secondary.label}
                </a>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
