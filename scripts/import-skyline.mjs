import { statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
const SRC = "C:/Users/lamoo/OneDrive/Documents/Mulwala Water/New folder";
await sharp(path.join(SRC, "0.jpg")).rotate().resize(2000, null, { withoutEnlargement: true }).jpeg({ quality: 82 }).toFile("public/images/skyline.jpg");
console.log("skyline.jpg", (statSync("public/images/skyline.jpg").size / 1024).toFixed(0) + "KB");
