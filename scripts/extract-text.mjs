process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pages = {
  playbooks: "https://mulwalawater.com/playbooks",
  portfolio: "https://mulwalawater.com/portfolio-companies",
  about: "https://mulwalawater.com/about",
};

const decode = (s) => s
  .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘")
  .replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

for (const [name, url] of Object.entries(pages)) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  let html = await res.text();
  html = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  // Keep block breaks so text is readable.
  html = html.replace(/<\/(p|div|h[1-6]|li|section|br)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
  const text = decode(html.replace(/<[^>]+>/g, " "))
    .split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 1);
  // De-dupe consecutive repeats (W+M repeats a lot).
  const out = [];
  for (const l of text) if (out[out.length - 1] !== l) out.push(l);
  console.log(`\n\n========== ${name.toUpperCase()} (${url}) ==========`);
  console.log(out.join("\n"));
}
