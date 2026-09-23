import { Poppins } from "next/font/google";

// Classic design: Poppins throughout (matches the original site).
export const display = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--ff-display",
});

export const body = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--ff-body",
});

// Labels/metrics use the same family.
export const mono = display;

export const fontVariables = `${display.variable} ${body.variable}`;
