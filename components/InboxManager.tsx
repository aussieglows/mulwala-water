"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markMessageRead, deleteMessage, deleteSignup } from "@/lib/actions/inbox";

export type Message = { id: string; name: string | null; email: string; message: string | null; read: boolean; createdAt: string };
export type Signup = { id: string; email: string; createdAt: string };

export function InboxManager({ messages, signups }: { messages: Message[]; signups: Signup[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); router.refresh(); } finally { setBusy(false); } };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide">Contact messages ({messages.length})</h2>
        {messages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`border rounded-xl p-3 ${m.read ? "border-border bg-surface" : "border-brand/40 bg-brand-light/30"}`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-sm font-bold">{m.name || "—"} · <a href={`mailto:${m.email}`} className="text-brand-dark no-underline font-medium">{m.email}</a></div>
              <div className="text-[11px] text-muted">{m.createdAt}</div>
            </div>
            {m.message && <p className="text-sm text-ink mt-2 whitespace-pre-wrap">{m.message}</p>}
            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => run(() => markMessageRead(m.id, !m.read))} disabled={busy} className="text-[12px] font-bold text-brand-dark bg-transparent border-none cursor-pointer">{m.read ? "Mark unread" : "Mark read"}</button>
              <button onClick={() => run(() => deleteMessage(m.id))} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide">Newsletter ({signups.length})</h2>
        {signups.length === 0 && <p className="text-sm text-muted">No sign-ups yet.</p>}
        <div className="bg-surface border border-border rounded-xl divide-y divide-border">
          {signups.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-2 p-2.5">
              <a href={`mailto:${s.email}`} className="text-sm text-brand-dark no-underline">{s.email}</a>
              <button onClick={() => run(() => deleteSignup(s.id))} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
