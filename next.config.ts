import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native / large server-only deps kept out of the bundle.
  serverExternalPackages: ["sharp", "@prisma/adapter-better-sqlite3", "@prisma/adapter-pg", "pg", "googleapis", "google-auth-library", "plaid"],
  async redirects() {
    return [
      // /portfolio is parked for the initial launch, so send the old URL home for now
      // (temporary — restore the /portfolio destination when the page is added back).
      { source: "/portfolio-companies", destination: "/", permanent: false },
      { source: "/portfolio", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
