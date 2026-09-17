"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncGmailNow, saveGmailLabels, disconnectGoogleNow } from "@/lib/actions/integrations";

type Account = { email: string | null; expenseLabel: string; revenueLabel: string; lastSyncAt: string | null } | null;
const input = "px-2 py-1.5 border border-border rounded-lg text-[13px] bg-white";

export function GoogleConnect({ configured, account }: { configured: boolean; account: Account }) {
  const router = useRouter();
  const [expenseLabel, setExpenseLabel] = useState(account?.expenseLabel ?? "Expenses");
  const [revenueLabel, setRevenueLabel] = useState(account?.revenueLabel ?? "Revenue");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function sync() {
    setBusy(true); setMsg(null);
    try {
      const r = await syncGmailNow();
      setMsg(r.error ? r.error : `Scanned ${r.scanned} email(s): ${r.expense} expense + ${r.revenue} revenue drafted for review.`);
      router.refresh();
    } finally { setBusy(false); }
  }
  async function saveLabels() {
    setBusy(true); setMsg(null);
    try { await saveGmailLabels({ expenseLabel, revenueLabel }); setMsg("Labels saved."); router.refresh(); } finally { setBusy(false); }
  }
  async function disconnect() {
    if (!confirm("Disconnect this Google account?")) return;
    setBusy(true);
    try { await disconnectGoogleNow(); router.refresh(); } finally { setBusy(false); }
  }

  if (!configured) {
    return (
      <p className="text-[13px] text-muted">
        Not configured yet. Add <code>GOOGLE_CLIENT_ID</code> / <code>GOOGLE_CLIENT_SECRET</code> to <code>.env</code> (see the setup steps), then reload.
      </p>
    );
  }

  if (!account) {
    return (
      <div>
        <p className="text-[13px] text-muted mb-2">Connect the Gmail account you&apos;ll forward receipts and revenue emails to.</p>
        <a href="/api/google/auth" className="inline-block bg-brand text-white rounded-full px-5 py-2 text-sm font-bold no-underline">Connect Google account</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[13px]">
        Connected as <span className="font-bold">{account.email ?? "Google account"}</span>
        {account.lastSyncAt && <span className="text-muted"> · last sync {account.lastSyncAt}</span>}
      </div>
      <div className="text-[12px] text-muted">
        Forward (or auto-filter) expense documents into a Gmail label and revenue emails into another. Set the label names below, then Sync.
      </div>
      <div className="flex items-end gap-2 flex-wrap">
        <label className="flex flex-col text-[11px] text-muted">Expense label<input value={expenseLabel} onChange={(e) => setExpenseLabel(e.target.value)} className={input} /></label>
        <label className="flex flex-col text-[11px] text-muted">Revenue label<input value={revenueLabel} onChange={(e) => setRevenueLabel(e.target.value)} className={input} /></label>
        <button onClick={saveLabels} disabled={busy} className="text-[13px] font-bold text-brand-dark bg-white border border-border rounded-full px-3 py-1.5 cursor-pointer disabled:opacity-50">Save labels</button>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={sync} disabled={busy} className="bg-brand text-white rounded-full px-5 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">{busy ? "Syncing…" : "Sync now"}</button>
        <button onClick={disconnect} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer">Disconnect</button>
      </div>
      {msg && <div className="text-[12px] text-ink bg-gray-bg rounded-lg px-3 py-2">{msg}</div>}
    </div>
  );
}
