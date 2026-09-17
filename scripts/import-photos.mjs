import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "C:/Users/lamoo/OneDrive/Documents/Mulwala Water/New folder";
mkdirSync("public/images", { recursive: true });

// source file -> [outName, width, quality]
const jobs = [
  ["Sun set Lake Mulwala.jpg", "hero-sunset.jpg", 2400, 84],
  ["Mulwala Bridge Aireal 2.jpg", "bridge-aerial.jpg", 2000, 84],
  ["Mulwala Bridge Aireal 2.jpg", "bridge-aerial-md.jpg", 1200, 82],
  ["Mulwala Bridge Panaramic.jpg", "bridge-pano.jpg", 2000, 84],
  ["Office foyer.jpg", "office.jpg", 1600, 82],
  ["Boardroom from outside.jpg", "boardroom.jpg", 1600, 82],
  ["Head shot.jpg", "founder.jpg", 1000, 84],
];

for (const [src, out, w, q] of jobs) {
  const inPath = path.join(SRC, src);
  await sharp(inPath).rotate().resize(w, null, { withoutEnlargement: true }).jpeg({ quality: q }).toFile(`public/images/${out}`);
  const { size } = statSync(`public/images/${out}`);
  console.log(`${out.padEnd(22)} ${(size / 1024).toFixed(0)}KB`);
}
console.log("done");
