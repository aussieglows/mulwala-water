process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { mkdirSync, statSync } from "node:fs";
import sharp from "sharp";

const base = "https://img1.wsimg.com/isteam/ip/a2c4970a-4beb-4690-a98d-e226ff40af2e/Mulwala%20Water%20Logo.png";
const variants = [
  base + "/:/rs=w:800,h:800,cg:true",
  base + "/:/rs=w:512",
  base + "/:/rs=w:512,h:512,cg:true",
  base,
];

let best = null;
for (const url of variants) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) { console.log("skip", res.status, url.slice(-40)); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    const m = await sharp(buf).metadata();
    console.log(`${m.width}x${m.height} alpha=${m.hasAlpha} ${buf.length}b  ${url.slice(-40)}`);
    if (!best || (m.width || 0) > best.w) best = { buf, w: m.width || 0, h: m.height || 0 };
  } catch (e) { console.log("err", String(e).slice(0, 80)); }
}

if (best) {
  mkdirSync("public/images", { recursive: true });
  // Logo, transparency preserved, trimmed of surrounding transparent padding, capped at 400px.
  await sharp(best.buf).trim().resize(400, 400, { fit: "inside", withoutEnlargement: true }).png().toFile("public/images/logo.png");
  // Favicon for the browser tab (Next uses app/icon.png automatically).
  mkdirSync("app", { recursive: true });
  await sharp(best.buf).trim().resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile("app/icon.png");
  const lm = await sharp("public/images/logo.png").metadata();
  console.log("saved logo.png", lm.width + "x" + lm.height, statSync("public/images/logo.png").size, "b; app/icon.png created");
}
