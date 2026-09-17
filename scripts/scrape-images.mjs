process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { writeFileSync } from "node:fs";

const pages = {
  home: "https://mulwalawater.com/",
  about: "https://mulwalawater.com/about",
  playbooks: "https://mulwalawater.com/playbooks",
  portfolio: "https://mulwalawater.com/portfolio-companies",
};

const guids = new Set();
for (const [name, url] of Object.entries(pages)) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const text = await res.text();
  writeFileSync(`scripts/page-${name}.html`, text);
  // isteam image paths: isteam/ip/<guid>/<filename> — pull the whole thing incl. filename.
  const isteam = text.match(/isteam\/ip\/[0-9a-f-]+\/[^"'\\ )?]+/gi) || [];
  isteam.forEach((m) => guids.add(m));
  // Also any data/config endpoints that hold the site model.
  const data = text.match(/https?:\/\/[^"'\\ )]*(?:sitedata|websites|published|api)[^"'\\ )]*/gi) || [];
  console.log(`# ${name}: ${res.status}, isteam=${isteam.length}, dataUrls=${new Set(data).size}`);
  [...new Set(data)].slice(0, 6).forEach((d) => console.log("   data:", d.slice(0, 140)));
}

console.log("\n=== unique isteam image paths ===");
for (const g of guids) console.log(g);
console.log("total:", guids.size);
