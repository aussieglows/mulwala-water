import { requireAuthPage } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { NavBar } from "@/components/NavBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAuthPage();
  const settings = await getSettings();
  return (
    <div className="min-h-screen">
      <NavBar businessName={settings.businessName} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
