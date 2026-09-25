import { Container, Button, Eyebrow } from "@/components/site/ui";
import { Truss } from "@/components/site/Truss";

export function Hero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  variant = "light",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <section className={`relative overflow-hidden ${dark ? "bg-ink text-paper" : "bg-paper"}`}>
      {/* Truss backdrop — the site's single graphic system */}
      <div
        className={`pointer-events-none absolute bottom-0 right-0 w-[70%] max-w-3xl ${dark ? "text-river/[0.18]" : "text-river/15"}`}
        aria-hidden
      >
        <Truss spans={16} stretch className="w-full h-40" strokeWidth={0.75} />
      </div>
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-24 relative">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow className={`mb-5 ${dark ? "text-brass" : ""}`}>{eyebrow}</Eyebrow>}
          <h1 className={`t-display-lg m-0 ${dark ? "text-paper" : "text-ink"}`}>{title}</h1>
          {lead && <p className={`t-body-lg mt-6 measure ${dark ? "text-paper/80" : "text-muted"}`}>{lead}</p>}
          {(primary || secondary) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {primary && <Button href={primary.href} variant="primary">{primary.label}</Button>}
              {secondary && (
                <Button
                  href={secondary.href}
                  variant="secondary"
                  className={dark ? "text-paper border-paper/30 hover:border-paper hover:text-paper" : ""}
                >
                  {secondary.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
