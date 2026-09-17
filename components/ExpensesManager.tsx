"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addExpense, updateExpense, deleteExpense, confirmPendingExpense } from "@/lib/actions/expenses";
import { extractExpense } from "@/lib/actions/extract";
import { PAYMENT_METHODS } from "@/lib/categories";
import { formatCents, parseDollarsToCents } from "@/lib/money";
import { FileUpload } from "@/components/FileUpload";

export type ExpenseRow = {
  id: string;
  date: string; // YYYY-MM-DD
  amountCents: number;
  category: string;
  vendor: string | null;
  description: string | null;
  method: string | null;
  billable: boolean;
  clientId: string | null;
  receiptUrl: string | null;
  createdBy: string | null;
};
type Source = { id: string; name: string };

const inputCls = "px-2 py-1.5 border border-border rounded-lg text-[13px] bg-white";

function CategorySelect({ value, onChange, categories, className }: { value: string; onChange: (v: string) => void; categories: string[]; className?: string }) {
  // If a row's saved category is no longer in the active list, keep showing it so nothing looks lost.
  const options = categories.includes(value) || !value ? categories : [value, ...categories];
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={className ?? inputCls}>
      {options.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}

function Fields({
  categories, date, setDate, amount, setAmount, category, setCategory, vendor, setVendor, note, setNote, method, setMethod,
}: {
  categories: string[];
  date: string; setDate: (v: string) => void;
  amount: string; setAmount: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  vendor: string; setVendor: (v: string) => void;
  note: string; setNote: (v: string) => void;
  method: string; setMethod: (v: string) => void;
}) {
  return (
    <>
      <label className="flex flex-col text-[11px] text-muted">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></label>
      <label className="flex flex-col text-[11px] text-muted">Amount $<input value={amount} inputMode="decimal" placeholder="0.00" onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} className={`${inputCls} w-24`} /></label>
      <label className="flex flex-col text-[11px] text-muted">Category<CategorySelect value={category} onChange={setCategory} categories={categories} /></label>
      <label className="flex flex-col text-[11px] text-muted">Vendor<input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Delta" className={`${inputCls} w-32`} /></label>
      <label className="flex flex-col text-[11px] text-muted">Method
        <select value={method} onChange={(e) => setMethod(e.target.value)} className={`${inputCls}`}>
          <option value="">—</option>
          {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <label className="flex flex-col text-[11px] text-muted flex-1 min-w-[120px]">Note<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was it for?" className={`${inputCls} w-full`} /></label>
    </>
  );
}

function PendingRow({ e, categories, onConfirm, onDiscard, busy }: { e: ExpenseRow; categories: string[]; onConfirm: (f: FormFields & { id: string }) => void; onDiscard: (id: string) => void; busy: boolean }) {
  const [date, setDate] = useState(e.date);
  const [amount, setAmount] = useState(e.amountCents ? (e.amountCents / 100).toFixed(2) : "");
  const [category, setCategory] = useState(e.category);
  const [vendor, setVendor] = useState(e.vendor ?? "");
  const [note, setNote] = useState(e.description ?? "");
  const [method, setMethod] = useState(e.method ?? "");
  return (
    <div className="border border-border rounded-xl p-2.5 bg-white">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="text-[11px] font-bold text-muted uppercase tracking-wide">{e.createdBy?.startsWith("Email") ? "📥 From email" : "From upload"}</div>
        {e.receiptUrl && <a href={e.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-brand-dark no-underline">View file</a>}
      </div>
      <div className="flex items-end gap-2 flex-wrap">
        <Fields categories={categories} date={date} setDate={setDate} amount={amount} setAmount={setAmount} category={category} setCategory={setCategory} vendor={vendor} setVendor={setVendor} note={note} setNote={setNote} method={method} setMethod={setMethod} />
        <button onClick={() => onConfirm({ id: e.id, incurredOn: date, amountCents: parseDollarsToCents(amount), category, vendor, description: note, method })} disabled={busy || !amount} className="bg-brand text-white border-none rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50 shrink-0">Confirm</button>
        <button onClick={() => onDiscard(e.id)} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer disabled:opacity-50 shrink-0">Discard</button>
      </div>
    </div>
  );
}

type FormFields = { incurredOn: string; amountCents: number; category: string; vendor: string; description: string; method: string };

function EditRow({ e, categories, onSave, onCancel, busy }: { e: ExpenseRow; categories: string[]; onSave: (f: FormFields & { id: string }) => void; onCancel: () => void; busy: boolean }) {
  const [date, setDate] = useState(e.date);
  const [amount, setAmount] = useState((e.amountCents / 100).toFixed(2));
  const [category, setCategory] = useState(e.category);
  const [vendor, setVendor] = useState(e.vendor ?? "");
  const [note, setNote] = useState(e.description ?? "");
  const [method, setMethod] = useState(e.method ?? "");
  return (
    <div className="flex items-end gap-2 flex-wrap py-1">
      <Fields categories={categories} date={date} setDate={setDate} amount={amount} setAmount={setAmount} category={category} setCategory={setCategory} vendor={vendor} setVendor={setVendor} note={note} setNote={setNote} method={method} setMethod={setMethod} />
      <button onClick={() => onSave({ id: e.id, incurredOn: date, amountCents: parseDollarsToCents(amount), category, vendor, description: note, method })} disabled={busy || !amount} className="bg-brand text-white border-none rounded-full px-3 py-1.5 text-[13px] font-bold cursor-pointer disabled:opacity-50">Save</button>
      <button onClick={onCancel} disabled={busy} className="text-[12px] font-bold text-muted bg-transparent border-none cursor-pointer">Cancel</button>
    </div>
  );
}

export function ExpensesManager({ expenses, pending, sources, categories, defaultDate, aiEnabled }: { expenses: ExpenseRow[]; pending: ExpenseRow[]; sources: Source[]; categories: string[]; defaultDate: string; aiEnabled: boolean }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(defaultDate);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(categories[0] ?? "Other");
  const [vendor, setVendor] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState("");
  const [billable, setBillable] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [items, setItems] = useState<{ description: string; amount: string; category: string }[]>([]);

  const setItem = (i: number, patch: Partial<{ description: string; amount: string; category: string }>) => setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const removeItem = (i: number) => setItems((arr) => arr.filter((_, idx) => idx !== i));

  async function onFile(url: string) {
    setReceiptUrl(url);
    setItems([]);
    if (!aiEnabled) { setScanned(false); return; }
    setScanning(true);
    setScanned(false);
    try {
      const r = await extractExpense(url);
      if (r.vendor) setVendor(r.vendor);
      if (r.date) setDate(r.date);
      if (r.items.length > 1) {
        setItems(r.items.map((it) => ({ description: it.description, amount: (it.amountCents / 100).toFixed(2), category: it.category })));
      } else if (r.items.length === 1) {
        setAmount((r.items[0].amountCents / 100).toFixed(2));
        setCategory(r.items[0].category);
        setNote(r.items[0].description);
      }
      setScanned(true);
    } finally {
      setScanning(false);
    }
  }

  function resetForm() {
    setAmount(""); setVendor(""); setNote(""); setMethod(""); setBillable(false); setClientId(""); setReceiptUrl(null); setScanned(false); setItems([]);
  }

  async function add() {
    const cents = parseDollarsToCents(amount);
    if (cents <= 0) return;
    setBusy(true);
    try {
      await addExpense({ incurredOn: date, amountCents: cents, category, vendor, description: note, method, billable, clientId: billable ? clientId || null : null, receiptUrl: receiptUrl ?? undefined });
      resetForm();
      router.refresh();
    } finally { setBusy(false); }
  }

  async function addAllItems() {
    const valid = items.filter((it) => parseDollarsToCents(it.amount) > 0);
    if (valid.length === 0) return;
    setBusy(true);
    try {
      for (const it of valid) {
        await addExpense({ incurredOn: date, amountCents: parseDollarsToCents(it.amount), category: it.category, vendor, description: it.description, method, receiptUrl: receiptUrl ?? undefined });
      }
      resetForm();
      router.refresh();
    } finally { setBusy(false); }
  }

  async function remove(id: string) { setBusy(true); try { await deleteExpense(id); router.refresh(); } finally { setBusy(false); } }
  async function confirmPending(f: FormFields & { id: string }) { if (f.amountCents <= 0) return; setBusy(true); try { await confirmPendingExpense(f); router.refresh(); } finally { setBusy(false); } }
  async function saveEdit(f: FormFields & { id: string }) { if (f.amountCents <= 0) return; setBusy(true); try { await updateExpense(f); setEditingId(null); router.refresh(); } finally { setBusy(false); } }

  const sourceName = (id: string | null) => sources.find((s) => s.id === id)?.name ?? null;

  return (
    <div className="flex flex-col gap-3">
      {pending.length > 0 && (
        <div className="border border-amber/40 rounded-xl p-2.5" style={{ background: "color-mix(in srgb, var(--color-amber) 8%, white)" }}>
          <div className="text-[13px] font-bold">🧾 Invoices to review ({pending.length})</div>
          <div className="text-[11px] text-muted mb-2">Uploaded or emailed-in, auto-filled by AI. Check the details, then Confirm to count them.</div>
          <div className="flex flex-col gap-2">
            {pending.map((e) => <PendingRow key={e.id} e={e} categories={categories} onConfirm={confirmPending} onDiscard={remove} busy={busy} />)}
          </div>
        </div>
      )}

      <div className="bg-gray-bg rounded-xl p-2.5">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <FileUpload value={receiptUrl} onUploaded={onFile} label="Upload invoice / receipt" />
          <div className="text-[12px] text-muted">
            {scanning ? "📸 Reading your invoice…" : scanned ? "✓ Filled from your file — check below, then Add." : aiEnabled ? "Upload an invoice (PDF or photo) to auto-fill — or just type it in and Add." : "Upload to attach a file, then type the details in and Add."}
          </div>
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          <Fields categories={categories} date={date} setDate={setDate} amount={amount} setAmount={setAmount} category={category} setCategory={setCategory} vendor={vendor} setVendor={setVendor} note={note} setNote={setNote} method={method} setMethod={setMethod} />
          <button onClick={add} disabled={busy || scanning || !amount} className="bg-brand text-white border-none rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50 shrink-0">{busy ? "…" : "Add"}</button>
        </div>
        <label className="flex items-center gap-2 text-[12px] mt-2 cursor-pointer flex-wrap">
          <input type="checkbox" checked={billable} onChange={(e) => setBillable(e.target.checked)} />
          <span>Billable / reimbursable to a client</span>
          {billable && (
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={`${inputCls}`}>
              <option value="">Choose client…</option>
              {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
        </label>

        {items.length > 1 && (
          <div className="mt-3 border-t border-border pt-2.5">
            <div className="text-[12px] font-bold">This invoice has {items.length} line items — each becomes its own row</div>
            <div className="text-[11px] text-muted mb-2">Edit or remove any, then add them all (shares vendor + date above).</div>
            <div className="flex flex-col gap-1.5">
              {items.map((it, i) => (
                <div key={i} className="flex items-end gap-2 flex-wrap">
                  <input value={it.description} onChange={(e) => setItem(i, { description: e.target.value })} placeholder="Item" className={`${inputCls} flex-1 min-w-[140px]`} />
                  <span className="text-muted text-[13px]">$</span>
                  <input value={it.amount} inputMode="decimal" onChange={(e) => setItem(i, { amount: e.target.value.replace(/[^0-9.]/g, "") })} className={`${inputCls} w-24`} />
                  <CategorySelect value={it.category} onChange={(v) => setItem(i, { category: v })} categories={categories} />
                  <button onClick={() => removeItem(i)} className="text-[13px] font-bold text-red bg-transparent border-none cursor-pointer">✕</button>
                </div>
              ))}
            </div>
            <button onClick={addAllItems} disabled={busy} className="mt-2.5 bg-brand text-white border-none rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">{busy ? "Adding…" : `Add all ${items.length} items`}</button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-surface border border-border rounded-xl">
        <table className="w-full text-[13px] min-w-[720px]">
          <thead>
            <tr className="text-[11px] font-bold text-muted uppercase tracking-wide border-b border-border">
              <th className="text-left py-2 px-3">Date</th>
              <th className="text-left py-2 px-3">Category</th>
              <th className="text-left py-2 px-3">Vendor</th>
              <th className="text-left py-2 px-3">Note</th>
              <th className="text-left py-2 px-3">Billable</th>
              <th className="text-left py-2 px-3">File</th>
              <th className="text-right py-2 px-3">Amount</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 && <tr><td colSpan={8} className="py-4 text-center text-muted">No expenses logged for this year yet.</td></tr>}
            {expenses.map((e) => (
              editingId === e.id ? (
                <tr key={e.id} className="border-b border-border last:border-b-0"><td colSpan={8} className="py-2 px-3"><EditRow e={e} categories={categories} onSave={saveEdit} onCancel={() => setEditingId(null)} busy={busy} /></td></tr>
              ) : (
                <tr key={e.id} className="border-b border-border last:border-b-0">
                  <td className="py-2 px-3 whitespace-nowrap">{e.date}</td>
                  <td className="py-2 px-3">{e.category}</td>
                  <td className="py-2 px-3">{e.vendor ?? "—"}</td>
                  <td className="py-2 px-3 text-muted">{e.description ?? ""}</td>
                  <td className="py-2 px-3 text-muted">{e.billable ? (sourceName(e.clientId) ?? "Yes") : "—"}</td>
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
