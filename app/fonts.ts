import { Space_Grotesk, Inter } from "next/font/google";

// Type set: Space Grotesk (display + labels) + Inter (body). Free, self-hosted.
export const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--ff-display",
});

export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--ff-body",
});

// Labels/metrics use the display face too (no separate mono in this direction).
export const mono = display;

export const fontVariables = `${display.variable} ${body.variable}`;
