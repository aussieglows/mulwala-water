// Renders a value that still needs Laura's input as a clearly-visible marker (spec Part 0).
// Placeholders must never look like finished copy and must not be silently dropped.

export function Placeholder({ children, block = false }: { children: React.ReactNode; block?: boolean }) {
  const cls =
    "font-mono text-[0.8em] font-semibold text-brass-deep bg-[color-mix(in_srgb,var(--color-brass)_16%,white)] border border-dashed border-brass/60 rounded px-1.5 py-0.5";
  if (block) {
    return (
      <div className={`${cls} inline-block`} role="note" aria-label="Placeholder — needs input">
        ⚠ {children}
      </div>
    );
  }
  return (
    <span className={cls} role="note" aria-label="Placeholder — needs input">
      ⚠ {children}
    </span>
  );
}

/** True when a string is an unresolved [[PLACEHOLDER]]. */
export function isPlaceholder(v: string | null | undefined): boolean {
  return !!v && v.trim().startsWith("[[") && v.trim().endsWith("]]");
}

/** Render a string that may contain inline [[...]] markers, wrapping each marker in <Placeholder>. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[[") && p.endsWith("]]") ? <Placeholder key={i}>{p}</Placeholder> : <span key={i}>{p}</span>
      )}
    </>
  );
}
