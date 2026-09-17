import { db } from "@/lib/db";
import { toYmd } from "@/lib/dates";
import { InboxManager } from "@/components/InboxManager";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const [messages, signups] = await Promise.all([
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    db.newsletterSignup.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">Inbox</h1>
        <p className="text-sm text-muted">Messages and newsletter sign-ups from the public website.</p>
      </div>
      <InboxManager
        messages={messages.map((m) => ({ id: m.id, name: m.name, email: m.email, message: m.message, read: m.read, createdAt: toYmd(m.createdAt) }))}
        signups={signups.map((s) => ({ id: s.id, email: s.email, createdAt: toYmd(s.createdAt) }))}
      />
    </div>
  );
}
