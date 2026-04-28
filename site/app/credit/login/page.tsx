"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Navbar from "@/app/Navbar";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/credit/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)]/60 focus:bg-[rgba(201,168,78,0.04)]"
        />
      </div>
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)]/60 focus:bg-[rgba(201,168,78,0.04)]"
        />
      </div>
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="gold-btn mt-2 rounded-xl bg-[var(--gold)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-[#0a0a0e] transition disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-xs text-[var(--muted)]">
        New here?{" "}
        <Link href={`/credit/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-[var(--gold)] hover:underline">
          Create your free account
        </Link>
      </p>
      <p className="text-center text-xs text-[var(--muted)]">
        <Link href="/credit/forgot" className="hover:text-[var(--gold)]">Forgot password?</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
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
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mb-8 text-sm text-[var(--text-secondary)]">Sign in to your credit dashboard.</p>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </motion.div>
      </main>
    </>
  );
}
