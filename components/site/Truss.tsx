// The truss bridge motif — the site's single graphic system (build spec Part 6.1).
// One component serves as section divider, the 4-phase progress device, and the list marker.
// Uses currentColor so the parent controls color/opacity. Original geometric artwork.

type TrussProps = {
  spans?: number;
  active?: number; // 0-based index rendered at full opacity (progress device)
  className?: string;
  strokeWidth?: number;
  stretch?: boolean; // stretch to fill width (dividers); false keeps triangle aspect
  baseOpacity?: number;
  title?: string;
};

export function Truss({
  spans = 8,
  active,
  className,
  strokeWidth = 1,
  stretch = false,
  baseOpacity,
  title,
}: TrussProps) {
  const u = 28; // panel width
  const h = 22; // truss height
  const W = spans * u;
  const L = (a: number, b: number, c: number, d: number, key: string) => (
    <line key={key} x1={a} y1={b} x2={c} y2={d} />
  );

  const chords = [L(0, 0, W, 0, "top"), L(0, h, W, h, "bot")];
  const verticals = Array.from({ length: spans + 1 }, (_, i) => L(i * u, 0, i * u, h, `v${i}`));
  const diagonals = Array.from({ length: spans }, (_, i) =>
    i % 2 === 0 ? L(i * u, h, (i + 1) * u, 0, `d${i}`) : L(i * u, 0, (i + 1) * u, h, `d${i}`)
  );

  const panelMembers = (i: number) => [
    L(i * u, 0, (i + 1) * u, 0, `pt${i}`),
    L(i * u, h, (i + 1) * u, h, `pb${i}`),
    L(i * u, 0, i * u, h, `pv${i}`),
    L((i + 1) * u, 0, (i + 1) * u, h, `pv2${i}`),
    i % 2 === 0 ? L(i * u, h, (i + 1) * u, 0, `pd${i}`) : L(i * u, 0, (i + 1) * u, h, `pd${i}`),
  ];

  const dimmed = baseOpacity ?? (active != null ? 0.25 : 1);

  return (
    <svg
      viewBox={`0 0 ${W} ${h}`}
      className={className}
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={dimmed}>
        {chords}
        {verticals}
        {diagonals}
      </g>
      {active != null && active >= 0 && active < spans ? (
        <g fill="none" stroke="currentColor" strokeWidth={strokeWidth + 0.4} strokeLinecap="round" strokeLinejoin="round">
          {panelMembers(active)}
        </g>
      ) : null}
    </svg>
  );
}

// A tiny two-triangle fragment for list markers / bullets.
export function TrussMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 16" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="14" x2="29" y2="14" />
        <line x1="1" y1="2" x2="29" y2="2" />
        <line x1="1" y1="14" x2="8.5" y2="2" />
        <line x1="8.5" y1="2" x2="16" y2="14" />
        <line x1="16" y1="14" x2="23.5" y2="2" />
        <line x1="23.5" y1="2" x2="29" y2="14" />
      </g>
    </svg>
  );
}
