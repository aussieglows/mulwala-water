import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mulwalawater.com"),
  title: {
    default: "Mulwala Water — Operating & Investment",
    template: "%s | Mulwala Water",
  },
  description:
    "We advise, operate, and invest in founder-led, sponsor-backed and multi-unit businesses — a plan you can act on, an operator who steps in and runs it, or capital alongside you.",
  openGraph: { type: "website", siteName: "Mulwala Water", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={fontVariables}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
