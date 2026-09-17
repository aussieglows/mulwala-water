import { getSiteSettings } from "@/lib/site";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteSettings();
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader siteName={s.siteName} phone={s.phone} />
      <div className="flex-1">{children}</div>
      <PublicFooter siteName={s.siteName} email={s.email} phone={s.phone} footerText={s.footerText} />
    </div>
  );
}
