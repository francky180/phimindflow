"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Navbar from "@/app/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function ResetPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/credit/dashboard");
      router.refresh();
    }, 1500);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-32 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-8 backdrop-blur-xl"
        >
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Set new password</h1>
          {authed === null && <p className="text-sm text-[var(--text-secondary)]">Verifying your reset link…</p>}
          {authed === false && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              Reset link expired or invalid. <Link href="/credit/forgot" className="text-[var(--gold)] underline">Request a new one.</Link>
            </div>
          )}
          {authed && done && (
            <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-dim)] p-4 text-sm text-[var(--gold)]">
              Password updated. Taking you to your dashboard…
            </div>
          )}
          {authed && !done && (
            <>
              <p className="mb-8 text-sm text-[var(--text-secondary)]">Choose a new password (minimum 8 characters).</p>
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">New password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)]/60 focus:bg-[rgba(201,168,78,0.04)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Confirm</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)]/60 focus:bg-[rgba(201,168,78,0.04)]"
                  />
                </div>
                {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-btn mt-2 rounded-xl bg-[var(--gold)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-[#0a0a0e] transition disabled:opacity-50"
                >
                  {loading ? "Saving…" : "Update password"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </main>
    </>
  );
}
