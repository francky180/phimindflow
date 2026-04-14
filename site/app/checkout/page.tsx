'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const STRIPE_COURSE = 'https://buy.stripe.com/3cI14n7Og2rn6g00Vhao804';
const STRIPE_MANAGEMENT = 'https://buy.stripe.com/14k2bnf256Oh0gwdQQ';

type Plan = 'course' | 'management';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') === 'management' ? 'management' : 'course';
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, plan }),
      });
    } catch {
      // Non-blocking
    }

    window.location.href = plan === 'management' ? STRIPE_MANAGEMENT : STRIPE_COURSE;
  };

  return (
    <main className="min-h-screen" style={{ background: '#0a0a0e', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px', background: 'rgba(10,10,14,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(228,182,76,0.12)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#e4b64c', fontWeight: 700, letterSpacing: '0.25em', fontSize: 15, textDecoration: 'none' }}>
            φ PHIMINDFLOW
          </Link>
          <Link href="/" style={{ color: '#7a7a86', fontSize: 13, textDecoration: 'none' }}>← Back</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '120px 24px 80px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(228,182,76,0.08)', border: '1px solid rgba(228,182,76,0.25)', borderRadius: 999, padding: '8px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: '#e4b64c', textTransform: 'uppercase', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e4b64c' }} />
            Secure Checkout
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 12px' }}>
            Choose your <span style={{ color: '#e4b64c' }}>level.</span>
          </h1>
          <p style={{ fontSize: 16, color: '#c0c0c8', maxWidth: 480, margin: '0 auto' }}>
            Select your plan, enter your info, and you&apos;ll be redirected to secure Stripe checkout.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {([
            {
              id: 'course' as Plan,
              tag: 'STEP 2',
              title: 'Fibonacci Framework',
              price: '$250',
              unit: 'one-time',
              features: ['Fibonacci methodology', 'Risk management system', 'Execution playbook', 'Position sizing rules', 'Lifetime access'],
            },
            {
              id: 'management' as Plan,
              tag: 'STEP 3',
              badge: 'PREMIUM',
              title: 'Managed Execution',
              price: '$1,500',
              unit: 'one-time',
              features: ['Everything in Course', 'Professional execution', 'Risk-adjusted strategies', 'Compounding returns', 'Priority support'],
            },
          ]).map((p) => {
            const selected = plan === p.id;
            return (
              <button key={p.id} onClick={() => setPlan(p.id)} type="button" style={{
                background: selected ? 'linear-gradient(135deg, rgba(228,182,76,0.12), rgba(18,18,24,1))' : '#121218',
                border: selected ? '2px solid #e4b64c' : '1px solid rgba(228,182,76,0.15)',
                borderRadius: 20, padding: 28, textAlign: 'left', cursor: 'pointer', position: 'relative',
                transition: 'all 0.2s',
                boxShadow: selected ? '0 20px 80px rgba(228,182,76,0.15)' : 'none',
              }}>
                {p.badge && (
                  <span style={{ position: 'absolute', top: -8, right: 16, background: '#e4b64c', color: '#0a0a0e', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', padding: '4px 12px', borderRadius: 999 }}>
                    {p.badge}
                  </span>
                )}
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: '#e4b64c', marginBottom: 8 }}>{p.tag}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', marginBottom: 4 }}>{p.title}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '16px 0 20px' }}>
                  <span style={{ fontSize: 42, fontWeight: 800, color: '#f5f5f7' }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: '#7a7a86' }}>{p.unit}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: '#e4b64c', fontSize: 14, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 13, color: '#c0c0c8' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: '10px 0', borderTop: '1px solid rgba(228,182,76,0.15)', textAlign: 'center', fontSize: 13, fontWeight: 700, color: selected ? '#e4b64c' : '#7a7a86' }}>
                  {selected ? '● Selected' : '○ Click to select'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div style={{ background: '#121218', border: '1px solid rgba(228,182,76,0.2)', borderRadius: 20, padding: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: '#e4b64c', marginBottom: 16 }}>YOUR INFORMATION</div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#c0c0c8' }}>Full Name</span>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name"
                  style={{ background: '#0a0a0e', border: '1px solid rgba(228,182,76,0.15)', borderRadius: 12, padding: '12px 16px', color: '#f5f5f7', fontSize: 14, outline: 'none' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#c0c0c8' }}>Email</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com"
                  style={{ background: '#0a0a0e', border: '1px solid rgba(228,182,76,0.15)', borderRadius: 12, padding: '12px 16px', color: '#f5f5f7', fontSize: 14, outline: 'none' }} />
              </label>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#c0c0c8' }}>Phone (optional)</span>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567"
                style={{ background: '#0a0a0e', border: '1px solid rgba(228,182,76,0.15)', borderRadius: 12, padding: '12px 16px', color: '#f5f5f7', fontSize: 14, outline: 'none' }} />
            </label>
            <button type="submit" disabled={loading || !form.name || !form.email} style={{
              background: '#e4b64c', color: '#0a0a0e', border: 'none', borderRadius: 12, padding: '16px 32px',
              fontSize: 16, fontWeight: 800, cursor: loading ? 'wait' : 'pointer',
              opacity: loading || !form.name || !form.email ? 0.5 : 1, transition: 'all 0.2s',
            }}>
              {loading ? 'Processing...' : `Continue to Payment → ${plan === 'management' ? '$1,500' : '$250'}`}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
