import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";
import { toYmd } from "@/lib/dates";
import { googleConfigured, getGoogleAccount } from "@/lib/google";
import { plaidConfigured } from "@/lib/plaid";
import { SettingsForm } from "@/components/SettingsForm";
import { GoogleConnect } from "@/components/integrations/GoogleConnect";
import { PlaidConnect } from "@/components/integrations/PlaidConnect";

export const dynamic = "force-dynamic";

function StatusPill({ on, onText, offText }: { on: boolean; onText: string; offText: string }) {
  return on ? (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-light text-green">{onText}</span>
  ) : (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-bg text-muted">{offText}</span>
  );
}

function Card({ n, title, pill, children }: { n: number; title: string; pill: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-sm">{n} · {title}</span>
        {pill}
      </div>
      {children}
    </div>
  );
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ google?: string }> }) {
  const { google: googleStatus } = await searchParams;
  const settings = await getSettings();
  const aiEnabled = !!process.env.ANTHROPIC_API_KEY;
  const gConfigured = googleConfigured();
  const pConfigured = plaidConfigured();

  const gAcct = await getGoogleAccount();
  const banks = await db.bankConnection.findMany({ orderBy: { createdAt: "asc" } });

  const account = gAcct
    ? { email: gAcct.email, expenseLabel: gAcct.expenseLabel, revenueLabel: gAcct.revenueLabel, lastSyncAt: gAcct.lastSyncAt ? toYmd(gAcct.lastSyncAt) : null }
    : null;
  const bankRows = banks.map((b) => ({ id: b.id, institutionName: b.institutionName, lastSyncAt: b.lastSyncAt ? toYmd(b.lastSyncAt) : null }));

  const googleNote: Record<string, string> = {
    connected: "✓ Google account connected.",
    denied: "Connection was cancelled.",
    error: "Something went wrong connecting Google — check your OAuth settings and try again.",
    notconfigured: "Add GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET to .env first.",
    nocode: "No authorization code came back from Google.",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted">Business details, tax estimate, and automation.</p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide">Business</h2>
        <SettingsForm settings={settings} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide">Automation</h2>

        <Card n={1} title="AI reading of invoices & payments" pill={<StatusPill on={aiEnabled} onText="On" offText="Off — add API key" />}>
          <p className="text-[13px] text-muted">
            Upload an invoice (PDF or photo) on Expenses, or a payment screenshot on Revenue, and Claude auto-fills an editable draft.
            {aiEnabled ? " Active." : " To turn on, add ANTHROPIC_API_KEY to .env and restart."}
          </p>
        </Card>

        <Card n={2} title="Email — forward receipts & revenue (Gmail)" pill={<StatusPill on={!!account} onText="Connected" offText={gConfigured ? "Not connected" : "Not configured"} />}>
          {googleStatus && googleNote[googleStatus] && (
            <div className="text-[12px] mb-2 rounded-lg px-3 py-2 bg-gray-bg">{googleNote[googleStatus]}</div>
          )}
          <GoogleConnect configured={gConfigured} account={account} />
        </Card>

        <Card n={3} title="Bank + investments (Plaid)" pill={<StatusPill on={banks.length > 0} onText={`${banks.length} linked`} offText={pConfigured ? "None linked" : "Not configured"} />}>
          <p className="text-[13px] text-muted mb-3">
            Automatic feed: bank transactions become draft revenue/expenses and investment dividends/interest become draft Investment Income — all for your review.
          </p>
          <PlaidConnect configured={pConfigured} banks={bankRows} />
        </Card>

        <Card n={4} title="Upload screenshots & invoices" pill={<StatusPill on={true} onText="Ready" offText="" />}>
          <p className="text-[13px] text-muted">Drag/drop or snap a photo/PDF on the Revenue and Expenses pages — always available.</p>
        </Card>
      </section>
    </div>
  );
}
