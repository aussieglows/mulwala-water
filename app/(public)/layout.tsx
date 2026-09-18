import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
