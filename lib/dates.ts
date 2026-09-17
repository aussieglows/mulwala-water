import { BUSINESS_TIMEZONE } from "@/lib/config";

/** Today as YYYY-MM-DD in the business timezone. */
export function todayYmd(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts; // en-CA gives YYYY-MM-DD
}

/** A Date -> YYYY-MM-DD in the business timezone (for display in forms). */
export function toYmd(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function currentYear(): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: BUSINESS_TIMEZONE, year: "numeric" }).format(new Date()));
}

/** Parse a ?year= search param, defaulting to the current year. */
export function parseYear(v: string | string[] | undefined): number {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isInteger(n) && n >= 2000 && n <= 2100 ? n : currentYear();
}
