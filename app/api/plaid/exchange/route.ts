import { isAuthenticated } from "@/lib/auth";
import { exchangePublicToken } from "@/lib/plaid";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Receives the public_token from a successful Plaid Link and stores the connection (admin only).
export async function POST(request: Request) {
  if (!(await isAuthenticated())) return new Response("Not authorized", { status: 401 });
  const body = await request.json().catch(() => null);
  const publicToken = body?.public_token;
  if (!publicToken || typeof publicToken !== "string") return Response.json({ error: "Missing public_token" }, { status: 400 });
  try {
    await exchangePublicToken(publicToken);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("exchange failed:", e);
    return Response.json({ error: "Couldn't link that account." }, { status: 500 });
  }
}
