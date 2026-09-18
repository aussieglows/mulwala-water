import { Source_Serif_4, Inter, IBM_Plex_Mono } from "next/font/google";

// Free, self-hosted type set (build spec Part 6.2). Poppins removed entirely.
export const display = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--ff-display",
  axes: ["opsz"],
});

export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--ff-body",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
  variable: "--ff-mono",
});

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
