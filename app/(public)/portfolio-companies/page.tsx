import { redirect } from "next/navigation";

// Old URL preserved after the rebuild. The 301 in next.config.ts handles this at the edge;
// this fallback covers any request that reaches the route directly (spec Part 5).
export default function PortfolioCompaniesRedirect() {
  redirect("/portfolio");
}
