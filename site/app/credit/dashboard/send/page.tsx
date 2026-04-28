import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BUREAU_ADDRESS: Record<string, { name: string; address: string }> = {
  equifax: {
    name: "Equifax Information Services LLC",
    address: "P.O. Box 740256\nAtlanta, GA 30374",
  },
  experian: {
    name: "Experian",
    address: "P.O. Box 4500\nAllen, TX 75013",
  },
  transunion: {
    name: "TransUnion Consumer Solutions",
    address: "P.O. Box 2000\nChester, PA 19016",
  },
};

export default async function SendLettersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: drafts } = await supabase
    .from("credit_disputes")
    .select("id,subject,bureau,status,letter_text,date_sent,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Send your letters</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Mail dispute letters certified to all 3 bureaus with one click. Or file a free CFPB complaint when bureaus stonewall.
        </p>
      </header>

      {/* LetterStream banner */}
      <section className="rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[rgba(201,168,78,0.08)] to-transparent p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">📬</div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[var(--gold)]">LetterStream — Certified Mail Automation</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              We&apos;re finalizing the LetterStream API connection. Once live, you&apos;ll click <strong className="text-[var(--gold)]">Send</strong> next to any dispute and we&apos;ll print + USPS-mail it certified to the bureau, with tracking auto-saved here. <strong className="text-[var(--gold)]">~$5–7 per certified letter.</strong>
            </p>
            <p className="mt-3 text-[11px] text-[var(--muted)]">
              Status: API request sent · Awaiting bureau-grade approval · ETA 1–2 business days
            </p>
          </div>
        </div>
      </section>

      {/* CFPB always-available */}
      <section className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">⚖️</div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[var(--text)]">File a CFPB Complaint — Free, Right Now</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              The Consumer Financial Protection Bureau is a federal regulator. If a credit bureau ignores your dispute past 30 days, file directly — bureaus often respond within days because their compliance team is required to address every CFPB complaint.
            </p>
            <a
              href="https://www.consumerfinance.gov/complaint/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-transparent px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text)] transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
            >
              File CFPB Complaint ↗
            </a>
          </div>
        </div>
      </section>

      <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Your saved letters</h2>

      {(drafts ?? []).length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-8 text-center">
          <p className="text-sm text-[var(--text-secondary)]">No dispute letters saved yet.</p>
          <Link
            href="/credit/dashboard/disputes"
            className="mt-4 inline-block rounded-full bg-[var(--gold)] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e] transition hover:shadow-[0_4px_20px_rgba(201,168,78,0.3)]"
          >
            + Draft your first letter
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {drafts!.map((d) => {
            const bureau = BUREAU_ADDRESS[d.bureau];
            return (
              <div key={d.id} className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold text-[var(--text)]">{d.subject || `${d.bureau} dispute`}</div>
                    <div className="mt-1 text-[11px] text-[var(--muted)]">
                      <span className="capitalize">{d.bureau}</span>
                      {" · "}<span className="capitalize">{d.status}</span>
                      {d.date_sent && <> · sent {d.date_sent}</>}
                    </div>
                    {bureau && (
                      <div className="mt-3 rounded-lg border border-[var(--border)] bg-[rgba(0,0,0,0.3)] p-3 font-mono text-[10px] leading-relaxed text-[var(--text-secondary)]">
                        <strong className="text-[var(--gold)]">Mailing to:</strong>
                        {"\n"}{bureau.name}
                        {"\n"}{bureau.address.split("\n").map((l, i) => <span key={i}>{l}<br/></span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <button
                      type="button"
                      disabled
                      title="LetterStream integration coming soon — will print + USPS-mail certified, ~$5–7/letter, with auto-saved tracking."
                      className="cursor-not-allowed rounded-full bg-[var(--gold)] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e] opacity-60"
                    >
                      📬 Send via LetterStream
                    </button>
                    <a
                      href="https://www.consumerfinance.gov/complaint/"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[var(--border)] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
                    >
                      ⚖️ File CFPB ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
