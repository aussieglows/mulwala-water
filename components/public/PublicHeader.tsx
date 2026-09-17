"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/portfolio-companies", label: "Portfolio Companies" },
];

export function PublicHeader({ siteName, phone }: { siteName: string; phone: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <header className="bg-white border-b border-border sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center no-underline" aria-label={siteName}>
          <Logo layout="horizontal" color="#1c2530" className="h-11 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium no-underline ${isActive(l.href) ? "bg-brand-light text-brand-dark" : "text-muted hover:text-ink"}`}
            >
              {l.label}
            </Link>
          ))}
          <a href={telHref} className="ml-2 px-4 py-2 rounded-full text-sm font-bold bg-brand text-white no-underline hover:bg-brand-dark">
            {phone}
          </a>
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="md:hidden text-ink bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm cursor-pointer" aria-label="Menu">☰</button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border px-4 py-2 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`px-3 py-2 rounded-lg text-sm font-medium no-underline ${isActive(l.href) ? "bg-brand-light text-brand-dark" : "text-muted"}`}>
              {l.label}
            </Link>
          ))}
          <a href={telHref} className="px-3 py-2 rounded-lg text-sm font-bold text-brand-dark no-underline">{phone}</a>
        </nav>
      )}
    </header>
  );
}
