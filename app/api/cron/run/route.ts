import { syncGmail } from "@/lib/google";
import { syncPlaid } from "@/lib/plaid";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Scheduled automation: run Gmail + Plaid sync. Secured by CRON_SECRET (?key=… or Bearer header).
// After deploy, point a scheduler (Vercel Cron / GitHub Actions) at this endpoint.
async function run(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (key !== secret && bearer !== secret) return new Response("Forbidden", { status: 403 });
  }
  const gmail = await syncGmail().catch((e) => ({ error: String(e) }));
  const plaid = await syncPlaid().catch((e) => ({ error: String(e) }));
  return Response.json({ ok: true, gmail, plaid });
}

export async function GET(request: Request) {
  return run(request);
}
export async function POST(request: Request) {
  return run(request);
}
