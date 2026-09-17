// Mulwala Water logo (option D) — a minimal single-span truss bridge line mark with a spaced wordmark.
// Vector, so it stays crisp anywhere. `color` themes it (ink on light, white on dark).

function trussLines(x0: number, x1: number, yTop: number, yBot: number, panels: number): [number, number, number, number][] {
  const inset = (x1 - x0) * 0.12;
  const tx0 = x0 + inset;
  const tx1 = x1 - inset;
  const step = (tx1 - tx0) / panels;
  const lines: [number, number, number, number][] = [
    [x0, yBot, x1, yBot], // bottom chord
    [tx0, yTop, tx1, yTop], // top chord
    [x0, yBot, tx0, yTop], // left end post
    [x1, yBot, tx1, yTop], // right end post
  ];
  for (let i = 0; i <= panels; i++) {
    const x = tx0 + i * step;
    lines.push([x, yBot, x, yTop]); // verticals
  }
  for (let i = 0; i < panels; i++) {
    const a = tx0 + i * step;
    const b = tx0 + (i + 1) * step;
    lines.push([a, yBot, b, yTop], [b, yBot, a, yTop]); // X cross-bracing
  }
  return lines;
}

const round = (n: number) => Math.round(n * 10) / 10;

export function Logo({
  color = "#1c2530",
  layout = "horizontal",
  className,
}: {
  color?: string;
  layout?: "horizontal" | "stacked";
  className?: string;
}) {
  const wordStyle = { fontFamily: "var(--font-poppins), system-ui, sans-serif", fontWeight: 500 as const };
  const subStyle = { fontFamily: "var(--font-poppins), system-ui, sans-serif", fontWeight: 400 as const };
  const label = "Mulwala Water Operating & Investment Company";

  if (layout === "stacked") {
    const lines = trussLines(84, 216, 50, 72, 4);
    return (
      <svg viewBox="0 0 300 150" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          {lines.map((l, i) => <line key={i} x1={round(l[0])} y1={l[1]} x2={round(l[2])} y2={l[3]} />)}
        </g>
        <text x="150" y="110" textAnchor="middle" fill={color} style={{ ...wordStyle, fontSize: "19px", letterSpacing: "9px" }}>MULWALA WATER</text>
        <text x="150" y="131" textAnchor="middle" fill={color} opacity={0.75} style={{ ...subStyle, fontSize: "8.5px", letterSpacing: "3px" }}>OPERATING &amp; INVESTMENT COMPANY</text>
      </svg>
    );
  }

  // horizontal lockup: small bridge mark, wordmark on one line + sub beneath
  const lines = trussLines(6, 112, 26, 50, 4);
  return (
    <svg viewBox="0 0 452 74" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        {lines.map((l, i) => <line key={i} x1={round(l[0])} y1={l[1]} x2={round(l[2])} y2={l[3]} />)}
      </g>
      <text x="134" y="38" fill={color} style={{ ...wordStyle, fontSize: "22px", letterSpacing: "5px" }}>MULWALA WATER</text>
      <text x="136" y="58" fill={color} opacity={0.72} style={{ ...subStyle, fontSize: "8.5px", letterSpacing: "2.2px" }}>OPERATING &amp; INVESTMENT COMPANY</text>
    </svg>
  );
}
