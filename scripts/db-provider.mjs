// Picks the Prisma datasource provider from DATABASE_URL so the same codebase runs on local SQLite
// and on cloud Postgres (Vercel/Neon) without hand-editing the schema.
//   postgres://… or postgresql://…  → provider = "postgresql"
//   file:… (or unset)               → provider = "sqlite"
// Runs before `prisma generate` / `prisma db push` (see package.json scripts).
import { readFileSync, writeFileSync } from "node:fs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const provider = url.startsWith("postgres") ? "postgresql" : "sqlite";
const schemaPath = "prisma/schema.prisma";

let schema = readFileSync(schemaPath, "utf8");
const re = /(datasource\s+db\s*\{[\s\S]*?provider\s*=\s*")(sqlite|postgresql)(")/;
if (!re.test(schema)) {
  console.warn("[db-provider] could not find datasource provider; leaving schema unchanged");
  process.exit(0);
}
const current = schema.match(re)[2];
if (current !== provider) {
  schema = schema.replace(re, `$1${provider}$3`);
  writeFileSync(schemaPath, schema);
  console.log(`[db-provider] schema provider set to "${provider}"`);
} else {
  console.log(`[db-provider] schema provider already "${provider}"`);
}
