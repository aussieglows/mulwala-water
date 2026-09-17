"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateSiteSettings, type SiteSettingsInput,
  addExpertise, updateExpertise, deleteExpertise,
  addPlaybook, updatePlaybook, deletePlaybook,
  addPortfolio, updatePortfolio, deletePortfolio,
} from "@/lib/actions/site";

type Settings = SiteSettingsInput;
type Expertise = { id: string; text: string; active: boolean };
type PlaybookT = { id: string; title: string; summary: string | null; active: boolean };
type PortfolioT = { id: string; name: string; description: string | null; url: string | null; active: boolean };

const input = "w-full px-3 py-2 border border-border rounded-lg text-sm bg-white";
const labelCls = "flex flex-col gap-1 text-[12px] text-muted font-medium";

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className={labelCls}>
      {label}
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${input} resize-y`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={input} />
      )}
    </label>
  );
}

export function SiteEditor({ settings, expertise, playbooks, portfolio }: { settings: Settings; expertise: Expertise[]; playbooks: PlaybookT[]; portfolio: PortfolioT[] }) {
  const router = useRouter();
  const [f, setF] = useState<Settings>(settings);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = (k: keyof Settings) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  async function saveSettings() {
    setBusy(true); setSaved(false);
    try { await updateSiteSettings(f); setSaved(true); router.refresh(); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* --- Text content --- */}
      <Section title="Brand & contact">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Site name" value={f.siteName} onChange={set("siteName")} />
          <Field label="Legal name" value={f.legalName} onChange={set("legalName")} />
          <Field label="Phone" value={f.phone} onChange={set("phone")} />
          <Field label="Email" value={f.email} onChange={set("email")} />
          <Field label="Tagline" value={f.tagline} onChange={set("tagline")} />
        </div>
      </Section>

      <Section title="Hero">
        <div className="grid grid-cols-1 gap-3">
          <Field label="Headline" value={f.heroHeadline} onChange={set("heroHeadline")} />
          <Field label="Sub-text" value={f.heroSubtext} onChange={set("heroSubtext")} />
          <Field label="Call-to-action button label" value={f.ctaLabel} onChange={set("ctaLabel")} />
        </div>
      </Section>

      <Section title="About section">
        <div className="grid grid-cols-1 gap-3">
          <Field label="About heading" value={f.aboutHeading} onChange={set("aboutHeading")} />
          <Field label="Vision heading" value={f.visionHeading} onChange={set("visionHeading")} />
          <Field label="Vision body" value={f.visionBody} onChange={set("visionBody")} textarea />
          <Field label="Approach heading" value={f.approachHeading} onChange={set("approachHeading")} />
          <Field label="Approach tagline" value={f.approachTagline} onChange={set("approachTagline")} />
          <Field label="Approach body" value={f.approachBody} onChange={set("approachBody")} textarea />
          <Field label="Expertise heading" value={f.expertiseHeading} onChange={set("expertiseHeading")} />
          <Field label="Expertise intro" value={f.expertiseIntro} onChange={set("expertiseIntro")} />
        </div>
      </Section>

      <Section title="Leadership (About page)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Founder name" value={f.founderName} onChange={set("founderName")} />
          <Field label="Founder title" value={f.founderTitle} onChange={set("founderTitle")} />
        </div>
        <div className="mt-3"><Field label="Founder bio" value={f.founderBio} onChange={set("founderBio")} textarea /></div>
      </Section>

      <Section title="Section intros & footer">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Playbooks heading" value={f.playbooksHeading} onChange={set("playbooksHeading")} />
          <Field label="Playbooks intro" value={f.playbooksIntro} onChange={set("playbooksIntro")} />
          <Field label="Portfolio heading" value={f.portfolioHeading} onChange={set("portfolioHeading")} />
          <Field label="Portfolio intro" value={f.portfolioIntro} onChange={set("portfolioIntro")} />
        </div>
        <div className="mt-3"><Field label="Footer text" value={f.footerText} onChange={set("footerText")} /></div>
      </Section>

      <div className="flex items-center gap-3">
        <button onClick={saveSettings} disabled={busy} className="bg-brand text-white border-none rounded-full px-6 py-2.5 text-sm font-bold cursor-pointer disabled:opacity-50">{busy ? "Saving…" : "Save text content"}</button>
        {saved && <span className="text-[13px] text-green font-medium">✓ Saved</span>}
      </div>

      {/* --- Lists --- */}
      <ExpertiseManager items={expertise} onChanged={() => router.refresh()} />
      <PlaybooksManager items={playbooks} onChanged={() => router.refresh()} />
      <PortfolioManager items={portfolio} onChanged={() => router.refresh()} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">{title}</h2>
      {children}
    </div>
  );
}

function ExpertiseManager({ items, onChanged }: { items: Expertise[]; onChanged: () => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); onChanged(); } finally { setBusy(false); } };
  return (
    <Section title="Our Expertise (bullets)">
      <div className="flex flex-col gap-2">
        {items.map((e) => <ExpertiseRow key={e.id} e={e} busy={busy} run={run} />)}
      </div>
      <div className="flex gap-2 mt-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a bullet…" className={input} />
        <button onClick={() => run(async () => { await addExpertise(text); setText(""); })} disabled={busy || !text.trim()} className="bg-brand text-white rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50 whitespace-nowrap">Add</button>
      </div>
    </Section>
  );
}
function ExpertiseRow({ e, busy, run }: { e: Expertise; busy: boolean; run: (fn: () => Promise<void>) => Promise<void> }) {
  const [text, setText] = useState(e.text);
  const [active, setActive] = useState(e.active);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input value={text} onChange={(ev) => setText(ev.target.value)} className={`${input} flex-1 min-w-[200px]`} />
      <label className="flex items-center gap-1 text-[12px] text-muted"><input type="checkbox" checked={active} onChange={(ev) => setActive(ev.target.checked)} /> Show</label>
      <button onClick={() => run(() => updateExpertise(e.id, text, active))} disabled={busy} className="text-[12px] font-bold text-brand-dark bg-transparent border-none cursor-pointer">Save</button>
      <button onClick={() => run(() => deleteExpertise(e.id))} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer">Delete</button>
    </div>
  );
}

function PlaybooksManager({ items, onChanged }: { items: PlaybookT[]; onChanged: () => void }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); onChanged(); } finally { setBusy(false); } };
  return (
    <Section title="Playbooks">
      <div className="flex flex-col gap-3">
        {items.map((p) => <PlaybookRow key={p.id} p={p} busy={busy} run={run} />)}
      </div>
      <div className="border-t border-border mt-3 pt-3 flex flex-col gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New playbook title" className={input} />
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary" rows={2} className={`${input} resize-y`} />
        <button onClick={() => run(async () => { await addPlaybook(title, summary); setTitle(""); setSummary(""); })} disabled={busy || !title.trim()} className="self-start bg-brand text-white rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">Add playbook</button>
      </div>
    </Section>
  );
}
function PlaybookRow({ p, busy, run }: { p: PlaybookT; busy: boolean; run: (fn: () => Promise<void>) => Promise<void> }) {
  const [title, setTitle] = useState(p.title);
  const [summary, setSummary] = useState(p.summary ?? "");
  const [active, setActive] = useState(p.active);
  return (
    <div className="border border-border rounded-lg p-2.5 flex flex-col gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className={`${input} resize-y`} />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1 text-[12px] text-muted"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Show</label>
        <button onClick={() => run(() => updatePlaybook(p.id, title, summary, active))} disabled={busy} className="text-[12px] font-bold text-brand-dark bg-transparent border-none cursor-pointer">Save</button>
        <button onClick={() => run(() => deletePlaybook(p.id))} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer">Delete</button>
      </div>
    </div>
  );
}

function PortfolioManager({ items, onChanged }: { items: PortfolioT[]; onChanged: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); onChanged(); } finally { setBusy(false); } };
  return (
    <Section title="Portfolio companies">
      <div className="flex flex-col gap-3">
        {items.map((c) => <PortfolioRow key={c.id} c={c} busy={busy} run={run} />)}
      </div>
      <div className="border-t border-border mt-3 pt-3 flex flex-col gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Company name" className={input} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className={input} />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https:// (optional)" className={input} />
        <button onClick={() => run(async () => { await addPortfolio(name, description, url); setName(""); setDescription(""); setUrl(""); })} disabled={busy || !name.trim()} className="self-start bg-brand text-white rounded-full px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">Add company</button>
      </div>
    </Section>
  );
}
function PortfolioRow({ c, busy, run }: { c: PortfolioT; busy: boolean; run: (fn: () => Promise<void>) => Promise<void> }) {
  const [name, setName] = useState(c.name);
  const [description, setDescription] = useState(c.description ?? "");
  const [url, setUrl] = useState(c.url ?? "");
  const [active, setActive] = useState(c.active);
  return (
    <div className="border border-border rounded-lg p-2.5 flex flex-col gap-2">
      <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
      <input value={description} onChange={(e) => setDescription(e.target.value)} className={input} />
      <input value={url} onChange={(e) => setUrl(e.target.value)} className={input} />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1 text-[12px] text-muted"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Show</label>
        <button onClick={() => run(() => updatePortfolio(c.id, name, description, url, active))} disabled={busy} className="text-[12px] font-bold text-brand-dark bg-transparent border-none cursor-pointer">Save</button>
        <button onClick={() => run(() => deletePortfolio(c.id))} disabled={busy} className="text-[12px] font-bold text-red bg-transparent border-none cursor-pointer">Delete</button>
      </div>
    </div>
  );
}
