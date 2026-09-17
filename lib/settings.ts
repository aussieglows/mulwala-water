import "server-only";
import { db } from "@/lib/db";

export async function getSettings() {
  return (
    (await db.appSettings.findUnique({ where: { id: "singleton" } })) ??
    (await db.appSettings.create({ data: { id: "singleton" } }))
  );
}
