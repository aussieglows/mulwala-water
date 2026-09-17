"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addExpenseCategory, updateExpenseCategory, deleteExpenseCategory, reorderExpenseCategory } from "@/lib/actions/expense-categories";
import { formatDollars } from "@/lib/money";

export type CategoryRow = { id: string; name: string; active: boolean; count: number; totalCents: number };

const inputCls = "px-2 py-1.5 border border-border rounded-lg text-[13px] bg-white";

export function ExpenseCategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  async function add() {
    if (!newName.trim()) return;
    setBusy(true);
    try { await addExpenseCategory(newName); setNewName(""); router.refresh(); }
    catch (e) { alert(e instanceof Error ? e.message : "Couldn't add."); }
    finally { setBusy(false); }
  }
  async function move(id: string, dir: "up" | "down") { setBusy(true); try { await reorderExpenseCategory(id, dir); router.refresh(); } finally { setBusy(false); } }
  async function remove(id: string) { setBusy(true); try { await deleteExpenseCategory(id); router.refresh(); } catch (e) { alert(e instanceof Error ? e.message : "Couldn't delete."); } finally { setBusy(false); } }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-gray-bg rounded-xl p-3 flex items-end gap-2 flex-wrap">
        <label className="flex flex-col text-[11px] text-muted flex-1 min-w-[200px]">New expense category
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Salaries & wages" className={`${inputCls} w-full`} onKeyDown={(e) => { if (e.key === "Enter") add(); }} />
        </label>
        <button onClick={add} disabled={busy || !newName.trim()} className="bg-brand text-white border-none rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">Add category</button>
      </div>

      <div className="overflow-x-auto bg-surface border border-border rounded-xl">
        <table className="w-full text-[13px] min-w-[560px]">
          <thead>
            <tr className="text-[11px] font-bold text-muted uppercase tracking-wide border-b border-border">
              <th className="text-left py-2 px-3">Order</th>
              <th className="text-left py-2 px-3">Category</th>
              <th className="text-left py-2 px-3">Status</th>
              <th className="text-right py-2 px-3">Used</th>
              <th className="text-right py-2 px-3">All-time</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <CategoryLine
                key={c.id}
                c={c}
                first={i === 0}
                last={i === categories.length - 1}
                editing={editingId === c.id}
                onEdit={() => setEditingId(c.id)}
                onCancel={() => setEditingId(null)}
                onSaved={() => { setEditingId(null); router.refresh(); }}
                onMove={move}
                onRemove={remove}
                busy={busy}
                setBusy={setBusy}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryLine({ c, first, last, editing, onEdit, onCancel, onSaved, onMove, onRemove, busy, setBusy }: {
  c: CategoryRow; first: boolean; last: boolean; editing: boolean;
  onEdit: () => void; onCancel: () => void; onSaved: () => void;
  onMove: (id: string, dir: "up" | "down") => void; onRemove: (id: string) => void;
  busy: boolean; setBusy: (v: boolean) => void;
}) {
  const [name, setName] = useState(c.name);
  const [active, setActive] = useState(c.active);

  async function save() {
    setBusy(true);
    try { await updateExpenseCategory({ id: c.id, name, active }); onSaved(); }
    catch (e) { alert(e instanceof Error ? e.message : "Couldn't save."); }
    finally { setBusy(false); }
  }

  if (editing) {
    return (
      <tr className="border-b border-border last:border-b-0">
        <td className="py-2 px-3 text-muted">—</td>
        <td className="py-2 px-3"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></td>
        <td className="py-2 px-3"><label className="flex items-center gap-1 text-[12px]"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active</label></td>
        <td className="py-2 px-3 text-right text-muted">{c.count}</td>
        <td className="py-2 px-3 text-right tabular-nums">{formatDollars(c.totalCents)}</td>
        <td className="py-2 px-3 text-right whitespace-nowrap">
          <button onClick={save} disabled={busy} className="text-[12px] font-bold text-brand-dark bg-transparent border-none cursor-pointer mr-2">Save</button>
          <button onClick={onCancel} disabled={busy} className="text-[12px] font-bold text-muted bg-transparent border-none cursor-pointer">Cancel</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="py-2 px-3 whitespace-nowrap">
        <button onClick={() => onMove(c.id, "up")} disabled={busy || first} className="text-muted bg-transparent border-none cursor-pointer disabled:opacity-30">▲</button>
        <button onClick={() => onMove(c.id, "down")} disabled={busy || last} className="text-muted bg-transparent border-none cursor-pointer disabled:opacity-30 ml-1">▼</button>
      </td>
      <td className="py-2 px-3 font-medium">{c.name}</td>
      <td className="py-2 px-3">{c.active ? <span className="text-green font-medium">Active</span> : <span className="text-muted">Inactive</span>}</td>
      <td className="py-2 px-3 text-right text-muted">{c.count}</td>
      <td className="py-2 px-3 text-right tabular-nums">{formatDollars(c.totalCents)}</td>
      <td className="py-2 px-3 text-right whitespace-nowrap">
        <button onClick={onEdit} disabled={busy} className="text-[12px] font-bold text-brand-dark bg-transparent border-none cursor-pointer mr-2">Edit</button>
        <button onClick={() => onRemove(c.id)} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer" title={c.count > 0 ? "In use — deactivate instead" : "Delete"}>Delete</button>
      </td>
    </tr>
  );
}
