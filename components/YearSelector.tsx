"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function YearSelector({ year }: { year: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const now = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => now + 1 - i); // next year down to 5 years back

  function go(y: number) {
    const p = new URLSearchParams(params.toString());
    p.set("year", String(y));
    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <select
      value={year}
      onChange={(e) => go(Number(e.target.value))}
      className="px-3 py-1.5 border border-border rounded-lg text-sm bg-white font-medium"
    >
      {years.map((y) => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  );
}
