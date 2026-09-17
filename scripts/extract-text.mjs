process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pages = {
  home: "https://mulwalawater.com/",
  about: "https://mulwalawater.com/about",
};

const decode = (s) => s
  .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘")
  .replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const boiler = new Set(["Sign In", "Create Account", "Bookings", "My Account", "Signed in as:", "filler@godaddy.com", "Sign out", "Home", "About", "Playbooks", "Portfolio Companies", "Account", "(201) 657-2292", "Powered by", "Accept", "This website uses cookies.", "Copyright © 2024 Mulwala Water Operating & Investment LLC - All Rights Reserved."]);

for (const [name, url] of Object.entries(pages)) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  let html = await res.text();
  html = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  html = html.replace(/<\/(p|div|h[1-6]|li|section|br)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
  const lines = decode(html.replace(/<[^>]+>/g, " ")).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 1);
  const out = [];
  for (const l of lines) if (out[out.length - 1] !== l && !boiler.has(l) && !l.includes("cookies")) out.push(l);
  console.log(`\n\n========== ${name.toUpperCase()} ==========`);
  console.log(out.join("\n"));
}
