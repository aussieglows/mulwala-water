import { ImageResponse } from "next/og";

// Shared 1200×630 OG card generator (spec Part 8.2). Ink ground, brass eyebrow,
// serif-ish title, wordmark, and the truss motif along the bottom.
// Uses the default font (no external font request) so generation is self-contained.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0e1720";
const PAPER = "#faf8f4";
const BRASS = "#b8863b";
const RIVER = "#2f6f66";
const MUTED = "#9aa6b0";

/** Truss motif as an inline SVG data URI (Satori renders SVG reliably via <img>). */
function trussDataUri(spans = 20, width = 1200, height = 120): string {
  const u = width / spans;
  const h = height;
  const lines: string[] = [];
  lines.push(`<line x1="0" y1="0" x2="${width}" y2="0"/>`);
  lines.push(`<line x1="0" y1="${h}" x2="${width}" y2="${h}"/>`);
  for (let i = 0; i <= spans; i++) lines.push(`<line x1="${i * u}" y1="0" x2="${i * u}" y2="${h}"/>`);
  for (let i = 0; i < spans; i++) {
    const x0 = i * u;
    const x1 = (i + 1) * u;
    lines.push(i % 2 === 0 ? `<line x1="${x0}" y1="${h}" x2="${x1}" y2="0"/>` : `<line x1="${x0}" y1="0" x2="${x1}" y2="${h}"/>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}" viewBox="0 0 ${width} ${h}"><g fill="none" stroke="${RIVER}" stroke-width="1.5" stroke-linecap="round">${lines.join("")}</g></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Small wordmark truss (two triangles) as a data URI. */
function markDataUri(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="32" viewBox="0 0 30 16"><g fill="none" stroke="${BRASS}" stroke-width="1.6" stroke-linecap="round"><line x1="1" y1="14" x2="29" y2="14"/><line x1="1" y1="2" x2="29" y2="2"/><line x1="1" y1="14" x2="8.5" y2="2"/><line x1="8.5" y1="2" x2="16" y2="14"/><line x1="16" y1="14" x2="23.5" y2="2"/><line x1="23.5" y1="2" x2="29" y2="14"/></g></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function renderOG({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markDataUri()} width={60} height={32} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: PAPER, fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>Mulwala Water</span>
            <span style={{ color: MUTED, fontSize: 15, letterSpacing: 3, textTransform: "uppercase" }}>Operating & Investment</span>
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
          {eyebrow ? (
            <span style={{ color: BRASS, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", marginBottom: 22 }}>
              {eyebrow}
            </span>
          ) : null}
          <span style={{ color: PAPER, fontSize: 68, lineHeight: 1.08, letterSpacing: -1.5, fontWeight: 600 }}>{title}</span>
        </div>

        {/* Truss motif along the bottom */}
        <div style={{ display: "flex", opacity: 0.35 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={trussDataUri()} width={1040} height={104} alt="" />
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
