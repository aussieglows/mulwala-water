"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addRevenue, updateRevenue, deleteRevenue, confirmPendingRevenue } from "@/lib/actions/revenue";
import { extractRevenue } from "@/lib/actions/extract";
import { REVENUE_CATEGORIES, PAYMENT_METHODS } from "@/lib/categories";
import { formatCents, parseDollarsToCents } from "@/lib/money";
import { FileUpload } from "@/components/FileUpload";

export type RevenueRow = {
  id: string;
  date: string; // YYYY-MM-DD
  amountCents: number;
  sourceId: string;
  sourceName: string;
  category: string;
  payer: string | null;
  description: string | null;
  method: string | null;
  invoiceRef: string | null;
  receiptUrl: string | null;
  createdBy: string | null;
};
type Source = { id: string; name: string };
type Fields = { receivedOn: string; amountCents: number; sourceId: string; category: string; payer: string; description: string; method: string; invoiceRef: string };

const inputCls = "px-2 py-1.5 border border-border rounded-lg text-[13px] bg-white";

function FormFields({
  sources, date, setDate, amount, setAmount, sourceId, setSourceId, category, setCategory, method, setMethod, invoiceRef, setInvoiceRef, note, setNote,
}: {
  sources: Source[];
  date: string; setDate: (v: string) => void;
  amount: string; setAmount: (v: string) => void;
  sourceId: string; setSourceId: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  method: string; setMethod: (v: string) => void;
  invoiceRef: string; setInvoiceRef: (v: string) => void;
  note: string; setNote: (v: string) => void;
}) {
  return (
    <>
      <label className="flex flex-col text-[11px] text-muted">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></label>
      <label className="flex flex-col text-[11px] text-muted">Amount $<input value={amount} inputMode="decimal" placeholder="0.00" onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} className={`${inputCls} w-24`} /></label>
      <label className="flex flex-col text-[11px] text-muted">Source
        <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} className={`${inputCls}`}>
          <option value="">Choose…</option>
          {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>
      <label className="flex flex-col text-[11px] text-muted">Type
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls}`}>
          {REVENUE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="flex flex-col text-[11px] text-muted">Method
        <select value={method} onChange={(e) => setMethod(e.target.value)} className={`${inputCls}`}>
          <option value="">—</option>
          {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <label className="flex flex-col text-[11px] text-muted">Invoice #<input value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} placeholder="opt." className={`${inputCls} w-20`} /></label>
      <label className="flex flex-col text-[11px] text-muted flex-1 min-w-[120px]">Note<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. March retainer" className={`${inputCls} w-full`} /></label>
    </>
  );
}

function PendingRow({ e, sources, onConfirm, onDiscard, busy }: { e: RevenueRow; sources: Source[]; onConfirm: (f: Fields & { id: string }) => void; onDiscard: (id: string) => void; busy: boolean }) {
  const [date, setDate] = useState(e.date);
  const [amount, setAmount] = useState(e.amountCents ? (e.amountCents / 100).toFixed(2) : "");
  const [sourceId, setSourceId] = useState(e.sourceId ?? "");
  const [category, setCategory] = useState(e.category);
  const [method, setMethod] = useState(e.method ?? "");
  const [invoiceRef, setInvoiceRef] = useState(e.invoiceRef ?? "");
  const [note, setNote] = useState(e.description ?? "");
  return (
    <div className="border border-border rounded-xl p-2.5 bg-white">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="text-[11px] font-bold text-muted uppercase tracking-wide">{e.createdBy?.startsWith("Email") ? "📥 From email" : "From upload"}{e.payer ? ` · ${e.payer}` : ""}</div>
        {e.receiptUrl && <a href={e.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-brand-dark no-underline">View file</a>}
      </div>
      <div className="flex items-end gap-2 flex-wrap">
        <FormFields sources={sources} date={date} setDate={setDate} amount={amount} setAmount={setAmount} sourceId={sourceId} setSourceId={setSourceId} category={category} setCategory={setCategory} method={method} setMethod={setMethod} invoiceRef={invoiceRef} setInvoiceRef={setInvoiceRef} note={note} setNote={setNote} />
        <button onClick={() => onConfirm({ id: e.id, receivedOn: date, amountCents: parseDollarsToCents(amount), sourceId, category, payer: e.payer ?? "", description: note, method, invoiceRef })} disabled={busy || !amount || !sourceId} className="bg-brand text-white border-none rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50 shrink-0">Confirm</button>
        <button onClick={() => onDiscard(e.id)} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer disabled:opacity-50 shrink-0">Discard</button>
      </div>
    </div>
  );
}

function EditRow({ e, sources, onSave, onCancel, busy }: { e: RevenueRow; sources: Source[]; onSave: (f: Fields & { id: string }) => void; onCancel: () => void; busy: boolean }) {
  const [date, setDate] = useState(e.date);
  const [amount, setAmount] = useState((e.amountCents / 100).toFixed(2));
  const [sourceId, setSourceId] = useState(e.sourceId);
  const [category, setCategory] = useState(e.category);
  const [method, setMethod] = useState(e.method ?? "");
  const [invoiceRef, setInvoiceRef] = useState(e.invoiceRef ?? "");
  const [note, setNote] = useState(e.description ?? "");
  return (
    <div className="flex items-end gap-2 flex-wrap py-1">
      <FormFields sources={sources} date={date} setDate={setDate} amount={amount} setAmount={setAmount} sourceId={sourceId} setSourceId={setSourceId} category={category} setCategory={setCategory} method={method} setMethod={setMethod} invoiceRef={invoiceRef} setInvoiceRef={setInvoiceRef} note={note} setNote={setNote} />
      <button onClick={() => onSave({ id: e.id, receivedOn: date, amountCents: parseDollarsToCents(amount), sourceId, category, payer: e.payer ?? "", description: note, method, invoiceRef })} disabled={busy || !amount || !sourceId} className="bg-brand text-white border-none rounded-full px-3 py-1.5 text-[13px] font-bold cursor-pointer disabled:opacity-50">Save</button>
      <button onClick={onCancel} disabled={busy} className="text-[12px] font-bold text-muted bg-transparent border-none cursor-pointer">Cancel</button>
    </div>
  );
}

export function RevenueManager({ entries, pending, sources, defaultDate, aiEnabled }: { entries: RevenueRow[]; pending: RevenueRow[]; sources: Source[]; defaultDate: string; aiEnabled: boolean }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(defaultDate);
  const [amount, setAmount] = useState("");
  const [sourceId, setSourceId] = useState<string>(sources[0]?.id ?? "");
  const [category, setCategory] = useState<string>(REVENUE_CATEGORIES[0]);
  const [method, setMethod] = useState("");
  const [invoiceRef, setInvoiceRef] = useState("");
  const [note, setNote] = useState("");
  const [payer, setPayer] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  async function onFile(url: string) {
    setReceiptUrl(url);
    if (!aiEnabled) { setScanned(false); return; }
    setScanning(true);
    setScanned(false);
    try {
      const r = await extractRevenue(url);
      if (r.amountCents) setAmount((r.amountCents / 100).toFixed(2));
      if (r.date) setDate(r.date);
      if (r.category) setCategory(r.category);
      if (r.invoiceRef) setInvoiceRef(r.invoiceRef);
      if (r.description) setNote(r.description);
      if (r.payer) setPayer(r.payer);
      if (r.sourceId) setSourceId(r.sourceId);
      setScanned(true);
    } finally {
      setScanning(false);
    }
  }

  function resetForm() {
    setAmount(""); setInvoiceRef(""); setNote(""); setPayer(""); setMethod(""); setReceiptUrl(null); setScanned(false);
  }

  async function add() {
    const cents = parseDollarsToCents(amount);
    if (cents <= 0 || !sourceId) return;
    setBusy(true);
    try {
      await addRevenue({ receivedOn: date, amountCents: cents, sourceId, category, payer, description: note, method, invoiceRef, receiptUrl: receiptUrl ?? undefined });
      resetForm();
      router.refresh();
    } finally { setBusy(false); }
  }
  async function remove(id: string) { setBusy(true); try { await deleteRevenue(id); router.refresh(); } finally { setBusy(false); } }
  async function confirmPending(f: Fields & { id: string }) { if (f.amountCents <= 0 || !f.sourceId) return; setBusy(true); try { await confirmPendingRevenue(f); router.refresh(); } finally { setBusy(false); } }
  async function saveEdit(f: Fields & { id: string }) { if (f.amountCents <= 0 || !f.sourceId) return; setBusy(true); try { await updateRevenue(f); setEditingId(null); router.refresh(); } finally { setBusy(false); } }

  return (
    <div className="flex flex-col gap-3">
      {pending.length > 0 && (
        <div className="border border-green/40 rounded-xl p-2.5" style={{ background: "color-mix(in srgb, var(--color-green) 8%, white)" }}>
          <div className="text-[13px] font-bold">💰 Revenue to review ({pending.length})</div>
          <div className="text-[11px] text-muted mb-2">Uploaded or emailed-in, auto-filled by AI. Pick the source, check the details, then Confirm.</div>
          <div className="flex flex-col gap-2">
            {pending.map((e) => <PendingRow key={e.id} e={e} sources={sources} onConfirm={confirmPending} onDiscard={remove} busy={busy} />)}
          </div>
        </div>
      )}

      <div className="bg-gray-bg rounded-xl p-2.5">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <FileUpload value={receiptUrl} onUploaded={onFile} label="Upload payment / remittance" />
          <div className="text-[12px] text-muted">
            {scanning ? "📸 Reading your payment…" : scanned ? `✓ Filled${payer ? ` (payer: ${payer})` : ""} — check below, then Add.` : aiEnabled ? "Upload a payment screenshot / remittance (PDF or photo) to auto-fill — or type it in and Add." : "Upload to attach a file, then type the details in and Add."}
          </div>
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          <FormFields sources={sources} date={date} setDate={setDate} amount={amount} setAmount={setAmount} sourceId={sourceId} setSourceId={setSourceId} category={category} setCategory={setCategory} method={method} setMethod={setMethod} invoiceRef={invoiceRef} setInvoiceRef={setInvoiceRef} note={note} setNote={setNote} />
          <button onClick={add} disabled={busy || scanning || !amount || !sourceId} className="bg-brand text-white border-none rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50 shrink-0">{busy ? "…" : "Add"}</button>
        </div>
        {sources.length === 0 && <div className="text-[12px] text-red mt-2">Add a revenue source first on the Sources page.</div>}
      </div>

      <div className="overflow-x-auto bg-surface border border-border rounded-xl">
        <table className="w-full text-[13px] min-w-[760px]">
          <thead>
            <tr className="text-[11px] font-bold text-muted uppercase tracking-wide border-b border-border">
              <th className="text-left py-2 px-3">Date</th>
              <th className="text-left py-2 px-3">Source</th>
              <th className="text-left py-2 px-3">Type</th>
              <th className="text-left py-2 px-3">Invoice</th>
              <th className="text-left py-2 px-3">Note</th>
              <th className="text-left py-2 px-3">File</th>
              <th className="text-right py-2 px-3">Amount</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && <tr><td colSpan={8} className="py-4 text-center text-muted">No revenue logged for this year yet.</td></tr>}
            {entries.map((e) => (
              editingId === e.id ? (
                <tr key={e.id} className="border-b border-border last:border-b-0"><td colSpan={8} className="py-2 px-3"><EditRow e={e} sources={sources} onSave={saveEdit} onCancel={() => setEditingId(null)} busy={busy} /></td></tr>
              ) : (
                <tr key={e.id} className="border-b border-border last:border-b-0">
                  <td className="py-2 px-3 whitespace-nowrap">{e.date}</td>
                  <td className="py-2 px-3 font-medium">{e.sourceName}</td>
                  <td className="py-2 px-3 text-muted">{e.category}</td>
                  <td className="py-2 px-3 text-muted">{e.invoiceRef ?? "—"}</td>
                  <td className="py-2 px-3 text-muted">{e.description ?? ""}</td>
                  <td className="py-2 px-3">{e.receiptUrl ? <a href={e.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-brand-dark font-bold no-underline">View</a> : <span className="text-muted">—</span>}</td>
                  <td className="py-2 px-3 text-right font-bold tabular-nums">${formatCents(e.amountCents)}</td>
                  <td className="py-2 px-3 text-right whitespace-nowrap">
                    <button onClick={() => setEditingId(e.id)} disabled={busy} className="text-[12px] font-bold text-brand-dark bg-transparent border-none cursor-pointer disabled:opacity-50 mr-2">Edit</button>
                    <button onClick={() => remove(e.id)} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer disabled:opacity-50">Delete</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
