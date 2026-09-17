"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pl", label: "P&L" },
  { href: "/admin/revenue", label: "Revenue" },
  { href: "/admin/expenses", label: "Expenses" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/site", label: "Website" },
  { href: "/admin/settings", label: "Settings" },
];

export function NavBar({ businessName }: { businessName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-brand-dark font-bold text-lg truncate">{businessName}</span>
          <span className="text-muted text-xs hidden sm:inline">· Admin</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-2.5 py-1.5 rounded-full text-sm font-medium no-underline ${
                isActive(l.href) ? "bg-brand-light text-brand-dark" : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noopener noreferrer" className="ml-1 px-2.5 py-1.5 rounded-full text-sm font-medium text-muted hover:text-ink no-underline">
            View site ↗
          </a>
          <form action={logout}>
            <button className="px-2.5 py-1.5 rounded-full text-sm font-medium text-muted hover:text-ink bg-transparent border-none cursor-pointer">
              Sign out
            </button>
          </form>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-ink bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm cursor-pointer"
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border px-4 py-2 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium no-underline ${
                isActive(l.href) ? "bg-brand-light text-brand-dark" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg text-sm font-medium text-muted no-underline">View site ↗</a>
          <form action={logout}>
            <button className="text-left px-3 py-2 rounded-lg text-sm font-medium text-muted bg-transparent border-none cursor-pointer w-full">
              Sign out
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
