import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

const COOKIE_NAME = "cpl_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set — add it to .env");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function checkPasscode(passcode: string): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) throw new Error("ADMIN_PASSCODE is not set — add it to .env");
  const a = Buffer.from(passcode);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `s.${expiresAt}`;
  const token = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const isAuthenticated = cache(async (): Promise<boolean> => {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "s") return false;
  const [, expiresAtStr, sig] = parts;
  if (!safeEqualHex(sign(`s.${expiresAtStr}`), sig)) return false;
  const expiresAt = Number(expiresAtStr);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
});

/** Throw if not signed in — use at the top of server actions and API routes. */
export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) throw new Error("Not authorized.");
}

/** Redirect to the admin login if not signed in — use at the top of protected server components. */
export async function requireAuthPage(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}
