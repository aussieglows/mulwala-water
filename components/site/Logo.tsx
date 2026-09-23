// The Mulwala Water wordmark logo (matches the live site): truss bridge + text.
// Single-colour via currentColor, so the parent sets the colour.
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 452 74"
      className={className}
      role="img"
      aria-label="Mulwala Water Operating & Investment Company"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="50" x2="112" y2="50" />
        <line x1="18.7" y1="26" x2="99.3" y2="26" />
        <line x1="6" y1="50" x2="18.7" y2="26" />
        <line x1="112" y1="50" x2="99.3" y2="26" />
        <line x1="18.7" y1="50" x2="18.7" y2="26" />
        <line x1="38.9" y1="50" x2="38.9" y2="26" />
        <line x1="59" y1="50" x2="59" y2="26" />
        <line x1="79.1" y1="50" x2="79.1" y2="26" />
        <line x1="99.3" y1="50" x2="99.3" y2="26" />
        <line x1="18.7" y1="50" x2="38.9" y2="26" />
        <line x1="38.9" y1="50" x2="18.7" y2="26" />
        <line x1="38.9" y1="50" x2="59" y2="26" />
        <line x1="59" y1="50" x2="38.9" y2="26" />
        <line x1="59" y1="50" x2="79.1" y2="26" />
        <line x1="79.1" y1="50" x2="59" y2="26" />
        <line x1="79.1" y1="50" x2="99.3" y2="26" />
        <line x1="99.3" y1="50" x2="79.1" y2="26" />
      </g>
      <text x="134" y="38" fill="currentColor" style={{ fontFamily: "var(--ff-display), sans-serif", fontWeight: 500, fontSize: "22px", letterSpacing: "5px" }}>
        MULWALA WATER
      </text>
      <text x="136" y="58" fill="currentColor" opacity="0.72" style={{ fontFamily: "var(--ff-display), sans-serif", fontWeight: 400, fontSize: "8.5px", letterSpacing: "2.2px" }}>
        OPERATING &amp; INVESTMENT COMPANY
      </text>
    </svg>
  );
}
