import { createClient } from "@/lib/supabase/server";
import { addScore, deleteScore } from "../actions";

export const dynamic = "force-dynamic";

export default async function ScoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: scores } = await supabase
    .from("credit_scores")
    .select("id,bureau,score,recorded_at,notes")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Score history</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Log your scores per bureau over time.</p>
      </header>

      <form action={async (fd) => { "use server"; await addScore(fd); }} className="grid grid-cols-1 gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6 sm:grid-cols-4">
        <select name="bureau" required className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm capitalize">
          <option value="equifax">Equifax</option>
          <option value="experian">Experian</option>
          <option value="transunion">TransUnion</option>
        </select>
        <input type="number" name="score" min={300} max={850} required placeholder="Score" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm" />
        <input type="date" name="recorded_at" defaultValue={new Date().toISOString().slice(0, 10)} className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm" />
        <button type="submit" className="gold-btn rounded-xl bg-[var(--gold)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e]">
          + Log
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)]">
        {(scores ?? []).length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-secondary)]">No scores logged yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Bureau</th>
                <th className="px-6 py-3 text-left">Score</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {scores!.map((s) => (
                <tr key={s.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-6 py-3">{s.recorded_at}</td>
                  <td className="px-6 py-3 capitalize">{s.bureau}</td>
                  <td className="px-6 py-3 font-bold text-[var(--gold)]">{s.score}</td>
                  <td className="px-6 py-3 text-right">
                    <form action={async () => { "use server"; await deleteScore(s.id); }}>
                      <button type="submit" className="text-[11px] text-[var(--muted)] hover:text-red-400">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
