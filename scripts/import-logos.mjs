import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "C:/Users/lamoo/OneDrive/Documents/Mulwala Water";
mkdirSync("public/images/logos", { recursive: true });

// source file -> output (kept format: png preserves transparency, jpg for white-bg marks)
const jobs = [
  ["F45 logo.jpg", "f45.jpg"],
  ["Noom.jpg", "noom.jpg"],
  ["Iris logo.png", "iris.png"],
  ["dixon projects logo.jpg", "dixon.jpg"],
  ["aussie glows.png", "aussie-glows.png"],
  ["Donovan Realty Group logo.jpg", "donovan.jpg"],
  ["PHG logo.jpg", "phg.jpg"],
];

for (const [src, out] of jobs) {
  const inPath = path.join(SRC, src);
  let pipe = sharp(inPath).trim({ threshold: 12 }).resize(440, 240, { fit: "inside", withoutEnlargement: true });
  pipe = out.endsWith(".png") ? pipe.png() : pipe.flatten({ background: "#ffffff" }).jpeg({ quality: 92 });
  await pipe.toFile(`public/images/logos/${out}`);
  console.log(out.padEnd(18), (statSync(`public/images/logos/${out}`).size / 1024).toFixed(0) + "KB");
}
console.log("done");
