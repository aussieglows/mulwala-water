import { mkdirSync, statSync } from "node:fs";
import sharp from "sharp";

const base = "https://img1.wsimg.com/isteam/ip/a2c4970a-4beb-4690-a98d-e226ff40af2e/Mulwala%20Bridge%20Aireal.png";
const variants = [
  base,
  base + "/:/",
  base + "/:/rs=w:3837,m",
  base + "/:/rs=w:3840",
  base + "/:/rs=w:2400,h:1350,cg:true",
];

let best = null;
for (const url of variants) {
  try {
    const res = await fetch(url);
    if (!res.ok) { console.log("skip", res.status, url); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();
    console.log(`${meta.width}x${meta.height}\t${buf.length}b\t${url}`);
    if (!best || (meta.width || 0) > best.w) best = { buf, w: meta.width || 0, h: meta.height || 0 };
  } catch (e) {
    console.log("err", url, String(e).slice(0, 80));
  }
}

if (best) {
  mkdirSync("public/images", { recursive: true });
  await sharp(best.buf).resize(2400, null, { withoutEnlargement: true }).jpeg({ quality: 85 }).toFile("public/images/mulwala-bridge.jpg");
  await sharp(best.buf).resize(1200, null, { withoutEnlargement: true }).jpeg({ quality: 82 }).toFile("public/images/mulwala-bridge-md.jpg");
  console.log("BEST", best.w + "x" + best.h, "-> hero", statSync("public/images/mulwala-bridge.jpg").size, "b");
}
