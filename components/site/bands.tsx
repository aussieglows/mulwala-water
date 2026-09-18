import { Container, Button } from "@/components/site/ui";
import { Placeholder, isPlaceholder } from "@/components/site/Placeholder";
import { Truss } from "@/components/site/Truss";
import { ctaPrimary, ctaSecondary } from "@/content/site";

export type Metric = { value: string; label: string };

/** A band of headline metrics. Values may be [[PLACEHOLDER]] until Laura supplies real numbers. */
export function MetricBand({ metrics, className = "" }: { metrics: Metric[]; className?: string }) {
  return (
    <div className={`border-y border-line bg-surface ${className}`}>
      <Container className="py-12">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {metrics.map((m, i) => (
            <div key={i}>
              <dt className="sr-only">{m.label}</dt>
              <dd className="m-0">
                {isPlaceholder(m.value) ? (
                  <Placeholder block>{m.value}</Placeholder>
                ) : (
                  <span className="t-metric text-river-deep block">{m.value}</span>
                )}
                <span className="t-small text-muted mt-2 block">{m.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}

/** Full-width closing call-to-action with the truss motif. */
export function CTABand({
  heading,
  body,
  primary = ctaPrimary,
  secondary = ctaSecondary,
}: {
  heading: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
}) {
  return (
    <section className="bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 text-river/30" aria-hidden>
        <Truss spans={28} stretch className="w-full h-20" strokeWidth={0.75} />
      </div>
      <Container className="py-20 relative">
        <div className="max-w-2xl">
          <h2 className="t-display-md text-paper m-0">{heading}</h2>
          {body && <p className="t-body-lg text-paper/80 mt-4 mb-0">{body}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={primary.href} variant="primary">{primary.label}</Button>
            {secondary && (
              <Button href={secondary.href} className="text-paper border-paper/30 hover:border-paper hover:text-paper" variant="secondary">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
