// Money helpers. Everything is stored in integer cents; format only at the edges.

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** "$1,234" / "-$56.70" — a signed dollar string with the sign outside the symbol. */
export function formatDollars(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${formatCents(Math.abs(cents))}`;
}

/** Parse a user-typed dollar string ("1,234.50", "$80") into integer cents. */
export function parseDollarsToCents(input: string): number {
  const n = Number(String(input).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}
