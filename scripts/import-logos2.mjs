import { statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "C:/Users/lamoo/OneDrive/Documents/Mulwala Water/Logos";
// [source, output, trim?]  (dark-background logos aren't trimmed so their tile stays intact)
const jobs = [
  ["Logo_Romina_Day_Partners-edited.png", "romina-day.png", true],
  ["apexwellnessgroup_logo.jpg", "apex.png", false],
  ["storyline.webp", "storyline.png", false],
  ["images.png", "lodi.png", true],
  ["Evans+&+Partners+-+ek+Private.webp", "evans-partners.png", true],
  ["3.png", "donovan.png", true],
  ["Logo with spray tan wording (1).jpg", "aussie-glows.png", true],
];

for (const [src, out, trim] of jobs) {
  let p = sharp(path.join(SRC, src));
  if (trim) p = p.trim({ threshold: 12 });
  await p.resize(460, 260, { fit: "inside", withoutEnlargement: true }).png().toFile(`public/images/logos/${out}`);
  console.log(out.padEnd(20), (statSync(`public/images/logos/${out}`).size / 1024).toFixed(0) + "KB");
}
console.log("done");
