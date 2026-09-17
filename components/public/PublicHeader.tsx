"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    <header className="bg-navy text-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 no-underline text-white">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white text-sm font-bold">◆</span>
          <span className="font-bold text-lg tracking-tight">{siteName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium no-underline text-white/80 hover:text-white ${isActive(l.href) ? "bg-white/10 text-white" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <a href={telHref} className="ml-2 px-3 py-1.5 rounded-full text-sm font-bold bg-brand text-white no-underline hover:bg-brand-dark">
            {phone}
          </a>
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="md:hidden text-white bg-transparent border border-white/30 rounded-lg px-3 py-1.5 text-sm cursor-pointer" aria-label="Menu">☰</button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/15 px-4 py-2 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`px-3 py-2 rounded-lg text-sm font-medium no-underline text-white/85 ${isActive(l.href) ? "bg-white/10" : ""}`}>
              {l.label}
            </Link>
          ))}
          <a href={telHref} className="px-3 py-2 rounded-lg text-sm font-bold text-brand-light no-underline">{phone}</a>
        </nav>
      )}
    </header>
  );
}
