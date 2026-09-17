import Link from "next/link";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { Logo } from "@/components/Logo";

export function PublicFooter({ siteName, email, phone, footerText }: { siteName: string; email: string; phone: string; footerText: string }) {
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  return (
    <footer className="bg-navy text-white/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Logo layout="stacked" color="#ffffff" className="h-24 w-auto" />
          <p className="text-sm mt-3 max-w-xs">Expert consulting services to boost growth and profitability.</p>
        </div>
        <div>
          <div className="text-white font-semibold text-sm uppercase tracking-wide mb-2">Contact</div>
          <a href={`mailto:${email}`} className="block text-sm text-white/80 hover:text-white no-underline">{email}</a>
          <a href={telHref} className="block text-sm text-white/80 hover:text-white no-underline mt-1">{phone}</a>
          <div className="flex gap-3 mt-3 text-sm">
            <Link href="/about" className="text-white/80 hover:text-white no-underline">About</Link>
            <Link href="/playbooks" className="text-white/80 hover:text-white no-underline">Playbooks</Link>
            <Link href="/portfolio-companies" className="text-white/80 hover:text-white no-underline">Portfolio</Link>
          </div>
        </div>
        <div>
          <div className="text-white font-semibold text-sm uppercase tracking-wide mb-2">Subscribe</div>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap text-xs text-white/60">
          <span>{footerText}</span>
          <Link href="/admin" className="text-white/50 hover:text-white/80 no-underline">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
