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
    "Hands-on operating help for founder-led, sponsor-backed and multi-unit businesses. We take an operating seat, run the play, and hand it over.",
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
