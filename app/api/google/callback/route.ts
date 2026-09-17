import { isAuthenticated } from "@/lib/auth";
import { connectFromCode } from "@/lib/google";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Google redirects back here with ?code=… — exchange it for tokens and store the connection.
export async function GET(request: Request) {
  if (!(await isAuthenticated())) return new Response("Not authorized", { status: 401 });
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error || !code) {
    return Response.redirect(new URL(`/admin/settings?google=${error ? "denied" : "nocode"}`, request.url));
  }
  try {
    await connectFromCode(code);
    return Response.redirect(new URL("/admin/settings?google=connected", request.url));
  } catch (e) {
    console.error("Google connect failed:", e);
    return Response.redirect(new URL("/admin/settings?google=error", request.url));
  }
}
