"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, ctaPrimary, site } from "@/content/site";
import { TrussMark } from "@/components/site/Truss";

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0" aria-label={site.name}>
      <span className="text-river"><TrussMark className="w-8 h-auto" /></span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.15rem] font-semibold tracking-tight text-ink">Mulwala Water</span>
        <span className="t-eyebrow text-[0.55rem] text-muted mt-0.5">Operating &amp; Investment</span>
      </span>
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile
  const [openMenu, setOpenMenu] = useState<string | null>(null); // desktop dropdown

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); setOpenMenu(null); }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-40 transition-colors ${scrolled ? "bg-paper/95 backdrop-blur border-b border-line" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[72px]">
        <Wordmark />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-full text-sm font-medium no-underline inline-flex items-center gap-1 ${isActive(item.href) ? "text-river-deep" : "text-ink hover:text-river-deep"}`}
                  aria-expanded={openMenu === item.label}
                >
                  {item.label}
                  <span aria-hidden className="text-[0.6em] mt-0.5">▾</span>
                </Link>
                {openMenu === item.label && (
                  <div className="absolute left-0 top-full pt-2 min-w-[260px]">
                    <div className="bg-surface border border-line rounded-xl shadow-lg p-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`block px-3 py-2 rounded-lg text-sm no-underline text-ink hover:bg-river-wash ${"divider" in c && c.divider ? "border-t border-line mt-1 pt-3 text-muted" : ""}`}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-full text-sm font-medium no-underline ${isActive(item.href) ? "text-river-deep" : "text-ink hover:text-river-deep"}`}
              >
                {item.label}
              </Link>
            )
          )}
          <Link href={ctaPrimary.href} className="ml-2 px-4 py-2 rounded-full text-sm font-semibold no-underline bg-river text-white hover:bg-river-deep">
            {ctaPrimary.label}
          </Link>
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="lg:hidden text-ink bg-transparent border border-line rounded-lg px-3 py-2 text-sm cursor-pointer" aria-label="Menu" aria-expanded={open}>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-line bg-paper px-4 py-3 flex flex-col gap-1" aria-label="Mobile">
          {nav.map((item) => (
            <div key={item.label} className="py-0.5">
              <Link href={item.href} className="block px-2 py-2 rounded-lg text-[15px] font-medium no-underline text-ink">
                {item.label}
              </Link>
              {item.children && (
                <div className="pl-3 flex flex-col">
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} className="block px-2 py-1.5 rounded-lg text-sm no-underline text-muted">
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href={ctaPrimary.href} className="mt-2 text-center px-4 py-2.5 rounded-full text-sm font-semibold no-underline bg-river text-white">
            {ctaPrimary.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
