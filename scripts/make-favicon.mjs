import { mkdirSync } from "node:fs";
import sharp from "sharp";

function trussLines(x0, x1, yTop, yBot, panels) {
  const inset = (x1 - x0) * 0.12, tx0 = x0 + inset, tx1 = x1 - inset, step = (tx1 - tx0) / panels;
  const L = [[x0, yBot, x1, yBot], [tx0, yTop, tx1, yTop], [x0, yBot, tx0, yTop], [x1, yBot, tx1, yTop]];
  for (let i = 0; i <= panels; i++) { const x = tx0 + i * step; L.push([x, yBot, x, yTop]); }
  for (let i = 0; i < panels; i++) { const a = tx0 + i * step, b = tx0 + (i + 1) * step; L.push([a, yBot, b, yTop], [b, yBot, a, yTop]); }
  return L;
}
const lines = trussLines(44, 212, 108, 150, 4)
  .map((l) => `<line x1="${l[0].toFixed(1)}" y1="${l[1]}" x2="${l[2].toFixed(1)}" y2="${l[3]}"/>`).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
<rect width="256" height="256" rx="52" fill="#24384f"/>
<g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${lines}</g></svg>`;

mkdirSync("app", { recursive: true });
await sharp(Buffer.from(svg)).resize(256, 256).png().toFile("app/icon.png");
console.log("favicon written: app/icon.png (bridge mark on navy)");
