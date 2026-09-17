import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native / large server-only deps kept out of the bundle.
  serverExternalPackages: ["sharp", "@prisma/adapter-better-sqlite3", "@prisma/adapter-pg", "pg", "googleapis", "google-auth-library", "plaid"],
};

export default nextConfig;
