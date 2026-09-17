import { getSiteSettings, getActiveExpertise } from "@/lib/site";
import { db } from "@/lib/db";
import { SiteEditor } from "@/components/SiteEditor";

export const dynamic = "force-dynamic";

export default async function SiteAdminPage() {
  const s = await getSiteSettings();
  // Admin sees ALL items (incl. hidden) to manage them.
  const [expertise, playbooks, portfolio] = await Promise.all([
    db.expertisePoint.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    db.playbook.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    db.portfolioCompany.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
  ]);

  const settings = {
    siteName: s.siteName, legalName: s.legalName, tagline: s.tagline, phone: s.phone, email: s.email,
    heroHeadline: s.heroHeadline, heroSubtext: s.heroSubtext, ctaLabel: s.ctaLabel,
    aboutHeading: s.aboutHeading, visionHeading: s.visionHeading, visionBody: s.visionBody,
    expertiseHeading: s.expertiseHeading, expertiseIntro: s.expertiseIntro,
    approachHeading: s.approachHeading, approachTagline: s.approachTagline, approachBody: s.approachBody,
    playbooksHeading: s.playbooksHeading, playbooksIntro: s.playbooksIntro,
    portfolioHeading: s.portfolioHeading, portfolioIntro: s.portfolioIntro, footerText: s.footerText,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Website content</h1>
          <p className="text-sm text-muted">Edit the public mulwalawater.com site. Changes go live immediately.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium bg-white text-brand-dark no-underline">View site ↗</a>
      </div>
      <SiteEditor settings={settings} expertise={expertise} playbooks={playbooks} portfolio={portfolio} />
    </div>
  );
}
