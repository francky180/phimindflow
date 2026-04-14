'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// TODO: Replace with real Stripe Payment Links once products are created.
// Until then, these redirect back to the credit landing page with a pending flag.
const STRIPE_LINKS: Record<string, string> = {
  analysis: '/credit?checkout=pending&plan=analysis',
  'repair-monthly': '/credit?checkout=pending&plan=repair-monthly',
  'credit-fix': '/credit?checkout=pending&plan=credit-fix',
};

const PLAN_LABELS: Record<string, { name: string; price: string }> = {
  analysis: { name: 'Credit Analysis', price: '$49 one-time' },
  'repair-monthly': { name: 'Credit Repair Monthly', price: '$149/mo' },
  'credit-fix': { name: 'Complete Credit Fix', price: '$1,500 one-time' },
};

type Plan = 'analysis' | 'repair-monthly' | 'credit-fix';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initial = (searchParams.get('plan') as Plan) || 'analysis';
  const [plan, setPlan] = useState<Plan>(
    ['analysis', 'repair-monthly', 'credit-fix'].includes(initial) ? initial : 'analysis'
  );
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          plan,
          pillar: 'credit',
        }),
      });
    } catch {
      // non-blocking
    }

    window.location.href = STRIPE_LINKS[plan];
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 px-6 py-4 bg-[rgba(10,10,10,0.92)] backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-[var(--gold)] font-bold tracking-[0.25em] text-sm no-underline">
            φ PHIMINDFLOW
          </Link>
          <Link href="/credit" className="text-[var(--muted)] text-xs hover:text-[var(--gold)] transition">
            ← Back to Credit
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            Credit Checkout
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-[-0.02em]">
            Almost there.
          </h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Confirm your details. You'll be redirected to secure checkout.
          </p>
        </div>

        {/* Plan picker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {(Object.keys(PLAN_LABELS) as Plan[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`card-panel rounded-xl p-4 text-left transition-all ${
                plan === p
                  ? 'border-[var(--gold)] shadow-[0_10px_30px_rgba(201,168,78,0.15)]'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                {PLAN_LABELS[p].name}
              </div>
              <div className="mt-2 text-sm text-[var(--text-secondary)]">
                {PLAN_LABELS[p].price}
              </div>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-panel rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--gold)] focus:outline-none transition"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--gold)] focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--gold)] focus:outline-none transition"
              placeholder="(555) 555-5555"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="gold-btn w-full rounded-xl bg-[var(--gold)] px-10 py-4 text-base font-bold text-[#0a0a0e] tracking-wide transition-all hover:bg-[var(--gold-light)] disabled:opacity-60"
          >
            {loading ? 'Processing…' : `Continue to Payment — ${PLAN_LABELS[plan].price}`}
          </button>
          <p className="text-[10px] text-center text-[var(--muted)] tracking-wide">
            Secure checkout · Your info is confidential
          </p>
        </form>
      </div>
    </main>
  );
}

export default function CreditCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <CheckoutContent />
    </Suspense>
  );
}
