import { isAuthenticated } from "@/lib/auth";
import { authUrl, googleConfigured } from "@/lib/google";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Starts the Google connect flow (admin only) — redirects to Google's consent screen.
export async function GET(request: Request) {
  if (!(await isAuthenticated())) return new Response("Not authorized", { status: 401 });
  if (!googleConfigured()) {
    return Response.redirect(new URL("/admin/settings?google=notconfigured", request.url));
  }
  return Response.redirect(authUrl());
}
