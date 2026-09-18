import { redirect } from "next/navigation";

// Old URL. /portfolio is parked for launch, so this and the next.config redirect both send home
// for now. Restore "/portfolio" here (and in next.config.ts) when the page is added back.
export default function PortfolioCompaniesRedirect() {
  redirect("/");
}
