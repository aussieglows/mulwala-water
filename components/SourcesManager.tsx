"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addSource, updateSource, deleteSource, reorderSource } from "@/lib/actions/sources";
import { SOURCE_KINDS, sourceKindLabel } from "@/lib/categories";
import { formatDollars } from "@/lib/money";

export type SourceRow = { id: string; name: string; kind: string; active: boolean; entryCount: number; totalCents: number };

const inputCls = "px-2 py-1.5 border border-border rounded-lg text-[13px] bg-white";

export function SourcesManager({ sources }: { sources: SourceRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState<string>("CLIENT");

  async function add() {
    if (!newName.trim()) return;
    setBusy(true);
    try { await addSource({ name: newName, kind: newKind }); setNewName(""); router.refresh(); } finally { setBusy(false); }
  }
  async function move(id: string, dir: "up" | "down") { setBusy(true); try { await reorderSource(id, dir); router.refresh(); } finally { setBusy(false); } }
  async function remove(id: string) { setBusy(true); try { await deleteSource(id); router.refresh(); } catch (e) { alert(e instanceof Error ? e.message : "Couldn't delete."); } finally { setBusy(false); } }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-gray-bg rounded-xl p-3 flex items-end gap-2 flex-wrap">
        <label className="flex flex-col text-[11px] text-muted flex-1 min-w-[180px]">New source / client
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Acme Corp" className={`${inputCls} w-full`} />
        </label>
        <label className="flex flex-col text-[11px] text-muted">Kind
          <select value={newKind} onChange={(e) => setNewKind(e.target.value)} className={inputCls}>
            {SOURCE_KINDS.map((k) => <option key={k} value={k}>{sourceKindLabel[k]}</option>)}
          </select>
        </label>
        <button onClick={add} disabled={busy || !newName.trim()} className="bg-brand text-white border-none rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">Add source</button>
      </div>

      <div className="overflow-x-auto bg-surface border border-border rounded-xl">
        <table className="w-full text-[13px] min-w-[600px]">
          <thead>
            <tr className="text-[11px] font-bold text-muted uppercase tracking-wide border-b border-border">
              <th className="text-left py-2 px-3">Order</th>
              <th className="text-left py-2 px-3">Name</th>
              <th className="text-left py-2 px-3">Kind</th>
              <th className="text-left py-2 px-3">Status</th>
              <th className="text-right py-2 px-3">Entries</th>
              <th className="text-right py-2 px-3">All-time</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <SourceLine
                key={s.id}
                s={s}
                first={i === 0}
                last={i === sources.length - 1}
                editing={editingId === s.id}
                onEdit={() => setEditingId(s.id)}
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

function SourceLine({ s, first, last, editing, onEdit, onCancel, onSaved, onMove, onRemove, busy, setBusy }: {
  s: SourceRow; first: boolean; last: boolean; editing: boolean;
  onEdit: () => void; onCancel: () => void; onSaved: () => void;
  onMove: (id: string, dir: "up" | "down") => void; onRemove: (id: string) => void;
  busy: boolean; setBusy: (v: boolean) => void;
}) {
  const [name, setName] = useState(s.name);
  const [kind, setKind] = useState(s.kind);
  const [active, setActive] = useState(s.active);

  async function save() {
    setBusy(true);
    try { await updateSource({ id: s.id, name, kind, active }); onSaved(); } finally { setBusy(false); }
  }

  if (editing) {
    return (
      <tr className="border-b border-border last:border-b-0">
        <td className="py-2 px-3 text-muted">—</td>
        <td className="py-2 px-3"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></td>
        <td className="py-2 px-3">
          <select value={kind} onChange={(e) => setKind(e.target.value)} className={inputCls}>
            {SOURCE_KINDS.map((k) => <option key={k} value={k}>{sourceKindLabel[k]}</option>)}
          </select>
        </td>
        <td className="py-2 px-3">
          <label className="flex items-center gap-1 text-[12px]"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active</label>
        </td>
        <td className="py-2 px-3 text-right text-muted">{s.entryCount}</td>
        <td className="py-2 px-3 text-right tabular-nums">{formatDollars(s.totalCents)}</td>
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
        <button onClick={() => onMove(s.id, "up")} disabled={busy || first} className="text-muted bg-transparent border-none cursor-pointer disabled:opacity-30">▲</button>
        <button onClick={() => onMove(s.id, "down")} disabled={busy || last} className="text-muted bg-transparent border-none cursor-pointer disabled:opacity-30 ml-1">▼</button>
      </td>
      <td className="py-2 px-3 font-medium">{s.name}</td>
      <td className="py-2 px-3 text-muted">{sourceKindLabel[s.kind] ?? s.kind}</td>
      <td className="py-2 px-3">{s.active ? <span className="text-green font-medium">Active</span> : <span className="text-muted">Inactive</span>}</td>
      <td className="py-2 px-3 text-right text-muted">{s.entryCount}</td>
      <td className="py-2 px-3 text-right tabular-nums">{formatDollars(s.totalCents)}</td>
      <td className="py-2 px-3 text-right whitespace-nowrap">
        <button onClick={onEdit} disabled={busy} className="text-[12px] font-bold text-brand-dark bg-transparent border-none cursor-pointer mr-2">Edit</button>
        <button onClick={() => onRemove(s.id)} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer" title={s.entryCount > 0 ? "Has entries — deactivate instead" : "Delete"}>Delete</button>
      </td>
    </tr>
  );
}
