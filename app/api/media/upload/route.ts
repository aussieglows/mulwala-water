import sharp from "sharp";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// Accepts an image or PDF upload from a signed-in user. Images are resized to JPEG; PDFs stored as-is.
// Returns { url } pointing at /api/media/<id>.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return new Response("Not authorized", { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return new Response("No file", { status: 400 });
  if (file.size > 15 * 1024 * 1024) return new Response("File too large (15MB max)", { status: 413 });

  try {
    const input = Buffer.from(await file.arrayBuffer());
    if (file.type === "application/pdf") {
      const asset = await db.mediaAsset.create({ data: { contentType: "application/pdf", data: new Uint8Array(input) } });
      return Response.json({ url: `/api/media/${asset.id}` });
    }
    const jpeg = await sharp(input).rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
    const asset = await db.mediaAsset.create({ data: { contentType: "image/jpeg", data: new Uint8Array(jpeg) } });
    return Response.json({ url: `/api/media/${asset.id}` });
  } catch (e) {
    console.error("Upload failed:", e);
    return new Response("Couldn't process that file.", { status: 422 });
  }
}
