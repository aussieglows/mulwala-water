import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native / large server-only deps kept out of the bundle.
  serverExternalPackages: ["sharp", "@prisma/adapter-better-sqlite3", "@prisma/adapter-pg", "pg", "googleapis", "google-auth-library", "plaid"],
  async redirects() {
    return [
      // Preserve the old URL after the rebuild (spec Part 5).
      { source: "/portfolio-companies", destination: "/portfolio", permanent: true },
    ];
  },
};

export default nextConfig;
