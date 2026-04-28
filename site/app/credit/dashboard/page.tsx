import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BUREAUS = ["equifax", "experian", "transunion"] as const;

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: scores }, { data: items }, { data: disputes }, { data: files }] = await Promise.all([
    supabase.from("credit_profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("credit_scores").select("bureau,score,recorded_at").eq("user_id", user.id).order("recorded_at", { ascending: false }),
    supabase.from("credit_items").select("id,creditor,status").eq("user_id", user.id),
    supabase.from("credit_disputes").select("id,status,bureau,date_sent").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("credit_files").select("id").eq("user_id", user.id),
  ]);

  const latestByBureau: Record<string, { score: number; recorded_at: string } | null> = { equifax: null, experian: null, transunion: null };
  (scores ?? []).forEach((s) => {
    if (!latestByBureau[s.bureau]) latestByBureau[s.bureau] = { score: s.score, recorded_at: s.recorded_at };
  });

  const itemCount = items?.length ?? 0;
  const removedCount = (items ?? []).filter((i) => i.status === "removed").length;
  const disputingCount = (items ?? []).filter((i) => i.status === "disputing").length;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Your private command center for fixing your credit.</p>
      </header>

      <section>
        <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Latest scores</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {BUREAUS.map((b) => {
            const s = latestByBureau[b];
            return (
              <div key={b} className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">{b}</div>
                <div className="mt-3 text-4xl font-extrabold text-[var(--text)]">{s?.score ?? "—"}</div>
                <div className="mt-1 text-[11px] text-[var(--muted)]">{s ? `as of ${s.recorded_at}` : "no reading yet"}</div>
              </div>
            );
          })}
        </div>
        <Link href="/credit/dashboard/scores" className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--gold)] hover:underline">
          + Log new score
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Negative items" value={itemCount} href="/credit/dashboard/items" />
        <Stat label="Disputing" value={disputingCount} href="/credit/dashboard/items" />
        <Stat label="Removed" value={removedCount} href="/credit/dashboard/items" accent />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Recent disputes</h3>
            <Link href="/credit/dashboard/disputes" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline">View all</Link>
          </div>
          {(disputes ?? []).length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No dispute letters yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {(disputes ?? []).map((d) => (
                <li key={d.id} className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="text-sm font-semibold capitalize text-[var(--text)]">{d.bureau}</div>
                    <div className="text-[11px] text-[var(--muted)]">{d.date_sent ? `Sent ${d.date_sent}` : "Not sent"}</div>
                  </div>
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">{d.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Files</h3>
            <Link href="/credit/dashboard/files" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline">Upload / view</Link>
          </div>
          <p className="text-3xl font-extrabold">{files?.length ?? 0}</p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">Credit reports, IDs, dispute responses</p>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, href, accent }: { label: string; value: number; href: string; accent?: boolean }) {
  return (
    <Link href={href} className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6 transition hover:border-[var(--gold)]/40">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">{label}</div>
      <div className={`mt-3 text-4xl font-extrabold ${accent ? "text-[var(--gold)]" : "text-[var(--text)]"}`}>{value}</div>
    </Link>
  );
}
