import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// Serves an uploaded invoice/receipt/screenshot by id. Financial documents — signed-in users only,
// never cached by shared caches.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return new Response("Not authorized", { status: 401 });
  const { id } = await params;
  const asset = await db.mediaAsset.findUnique({ where: { id }, select: { contentType: true, data: true } });
  if (!asset) return new Response("Not found", { status: 404 });

  const body = new Uint8Array(asset.data);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "private, max-age=3600",
      "Content-Length": String(body.byteLength),
    },
  });
}
