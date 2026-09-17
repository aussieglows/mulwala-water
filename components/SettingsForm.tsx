"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "@/lib/actions/settings";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const inputCls = "px-3 py-2 border border-border rounded-lg text-sm bg-white";

export function SettingsForm({ settings }: { settings: { businessName: string; currency: string; taxRatePercent: number; fiscalYearStartMonth: number } }) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [currency, setCurrency] = useState(settings.currency);
  const [taxRate, setTaxRate] = useState(String(settings.taxRatePercent));
  const [fyStart, setFyStart] = useState(settings.fiscalYearStartMonth);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      await updateSettings({ businessName, currency, taxRatePercent: Number(taxRate) || 0, fiscalYearStartMonth: fyStart });
      setSaved(true);
      router.refresh();
    } finally { setBusy(false); }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 max-w-lg">
      <label className="flex flex-col gap-1 text-[12px] text-muted">Business name
        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputCls} />
      </label>
      <div className="flex gap-3 flex-wrap">
        <label className="flex flex-col gap-1 text-[12px] text-muted">Currency
          <input value={currency} onChange={(e) => setCurrency(e.target.value)} className={`${inputCls} w-24`} />
        </label>
        <label className="flex flex-col gap-1 text-[12px] text-muted">Est. income-tax rate %
          <input value={taxRate} inputMode="decimal" onChange={(e) => setTaxRate(e.target.value.replace(/[^0-9.]/g, ""))} className={`${inputCls} w-28`} />
        </label>
        <label className="flex flex-col gap-1 text-[12px] text-muted">Fiscal year starts
          <select value={fyStart} onChange={(e) => setFyStart(Number(e.target.value))} className={inputCls}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </label>
      </div>
      <p className="text-[11px] text-muted">The tax rate is a planning estimate applied to positive net profit on the P&amp;L — not a filed tax figure.</p>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="bg-brand text-white border-none rounded-full px-5 py-2 text-sm font-bold cursor-pointer disabled:opacity-50 self-start">{busy ? "Saving…" : "Save settings"}</button>
        {saved && <span className="text-[12px] text-green font-medium">✓ Saved</span>}
      </div>
    </div>
  );
}
