"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncPlaidNow, disconnectBankNow } from "@/lib/actions/integrations";

type Bank = { id: string; institutionName: string | null; lastSyncAt: string | null };

// Load the Plaid Link script once.
function loadPlaid(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    const w = window as unknown as { Plaid?: unknown };
    if (w.Plaid) return resolve();
    const existing = document.getElementById("plaid-link-script");
    if (existing) { existing.addEventListener("load", () => resolve()); return; }
    const s = document.createElement("script");
    s.id = "plaid-link-script";
    s.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Plaid Link."));
    document.head.appendChild(s);
  });
}

export function PlaidConnect({ configured, banks }: { configured: boolean; banks: Bank[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function connect() {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/plaid/link-token", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || "Couldn't start Plaid."); return; }
      await loadPlaid();
      const Plaid = (window as unknown as { Plaid: { create: (o: unknown) => { open: () => void } } }).Plaid;
      const handler = Plaid.create({
        token: data.link_token,
        onSuccess: async (public_token: string) => {
          setBusy(true);
          const ex = await fetch("/api/plaid/exchange", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ public_token }) });
          const exData = await ex.json();
          setMsg(ex.ok ? "Bank linked. Hit “Sync now” to pull transactions." : exData.error || "Link failed.");
          setBusy(false);
          router.refresh();
        },
        onExit: () => setBusy(false),
      });
      handler.open();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Couldn't start Plaid.");
    } finally {
      setBusy(false);
    }
  }

  async function sync() {
    setBusy(true); setMsg(null);
    try {
      const r = await syncPlaidNow();
      setMsg(r.error ? r.error : `Imported ${r.expense} expense + ${r.revenue} revenue + ${r.investmentIncome} investment-income item(s) for review.`);
      router.refresh();
    } finally { setBusy(false); }
  }

  async function disconnect(id: string) {
    if (!confirm("Unlink this account?")) return;
    setBusy(true);
    try { await disconnectBankNow(id); router.refresh(); } finally { setBusy(false); }
  }

  if (!configured) {
    return (
      <p className="text-[13px] text-muted">
        Not configured yet. Add <code>PLAID_CLIENT_ID</code> / <code>PLAID_SECRET</code> / <code>PLAID_ENV</code> to <code>.env</code> (start with <code>sandbox</code>), then reload.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {banks.length > 0 && (
        <div className="bg-surface border border-border rounded-lg divide-y divide-border">
          {banks.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-2 p-2.5">
              <div className="text-[13px]">
                <span className="font-bold">{b.institutionName ?? "Linked account"}</span>
                {b.lastSyncAt && <span className="text-muted"> · last sync {b.lastSyncAt}</span>}
              </div>
              <button onClick={() => disconnect(b.id)} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer">Unlink</button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button onClick={connect} disabled={busy} className="bg-brand text-white rounded-full px-5 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">{banks.length ? "Link another bank" : "Connect a bank"}</button>
        {banks.length > 0 && <button onClick={sync} disabled={busy} className="bg-white text-brand-dark border border-border rounded-full px-5 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">{busy ? "Syncing…" : "Sync now"}</button>}
      </div>
      {msg && <div className="text-[12px] text-ink bg-gray-bg rounded-lg px-3 py-2">{msg}</div>}
    </div>
  );
}
