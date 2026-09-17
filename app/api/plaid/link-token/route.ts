import { isAuthenticated } from "@/lib/auth";
import { createLinkToken, plaidConfigured } from "@/lib/plaid";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Returns a Plaid Link token for the browser to open the connect flow (admin only).
export async function POST() {
  if (!(await isAuthenticated())) return new Response("Not authorized", { status: 401 });
  if (!plaidConfigured()) return Response.json({ error: "Plaid is not configured. Add PLAID_CLIENT_ID / PLAID_SECRET to .env." }, { status: 400 });
  try {
    const link_token = await createLinkToken();
    return Response.json({ link_token });
  } catch (e) {
    console.error("link token failed:", e);
    return Response.json({ error: "Couldn't create a Plaid link token." }, { status: 500 });
  }
}
