"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "@/app/Navbar";
import FloatingCards from "./FloatingCards";
import {
  creditAnalysisLink,
  creditRepairLink,
  creditFixLink,
} from "@/app/constants";

const PILLARS = [
  {
    title: "Analyze",
    desc: "Upload your credit report. Get an AI breakdown of what's hurting your score and a personalized fix plan in 60 seconds.",
    href: "/credit/analyze",
    cta: "Start Free Analysis",
    badge: "FREE TOOL",
  },
  {
    title: "Dispute",
    desc: "Generate FCRA-compliant dispute letters for all 3 bureaus in 3 rounds. Metro 2 citations. Download PDFs. Mail certified.",
    href: "/credit/disputes",
    cta: "Generate Letters",
    badge: "DIY TOOL",
  },
  {
    title: "Learn",
    desc: "Everything you need to know — how scores work, reading your report, building credit, collections playbook.",
    href: "/credit/learn",
    cta: "Open Library",
    badge: "FREE",
  },
];

const TIERS = [
  {
    name: "Analysis",
    price: 49,
    period: "one-time",
    tagline: "Know exactly what's wrong.",
    features: [
      "AI-powered report scan",
      "Full disputable-items list",
      "Personalized 30/60/90-day plan",
      "Bureau-by-bureau breakdown",
    ],
    href: creditAnalysisLink,
    cta: "Get Analysis — $49",
    highlight: false,
  },
  {
    name: "Repair Monthly",
    price: 149,
    period: "/mo",
    tagline: "Ongoing done-for-you disputes.",
    features: [
      "Everything in Analysis",
      "Monthly dispute letter generation",
      "Round 1 → 2 → 3 escalation",
      "All 3 bureaus tracked",
      "Direct coaching access",
    ],
    href: creditRepairLink,
    cta: "Start Repair — $149/mo",
    highlight: true,
  },
  {
    name: "Complete Credit Fix",
    price: 1500,
    period: "one-time",
    tagline: "We do everything. You get results.",
    features: [
      "Full DFY credit restoration",
      "90-day intensive program",
      "All dispute rounds executed",
      "Score optimization strategy",
      "Capital-ready in 90 days",
    ],
    href: creditFixLink,
    cta: "Get the Fix — $1,500",
    highlight: false,
  },
];

export default function CreditPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        {/* HERO */}
        <section
          id="top"
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(201,168,78,0.18), transparent 70%)",
            }}
          />
          <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[var(--gold)] opacity-[0.06] blur-[160px]" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-w-4xl flex-col items-center text-center"
          >
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold-dim)] px-5 py-2 text-[11px] font-bold tracking-[0.22em] uppercase text-[var(--gold)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
              Credit Restoration Pillar
            </span>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[4rem] lg:text-[5rem] text-[var(--text)]">
              Fix Your Credit.
              <br />
              <span className="text-gold">Unlock Capital.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
              Trader-grade tools meet premium credit restoration. Analyze your report, dispute negatives, and build the score that unlocks funded accounts, real estate, and business capital.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 w-full sm:flex-row sm:justify-center">
              <Link
                href="/credit/analyze"
                className="gold-btn w-full sm:w-auto rounded-xl bg-[var(--gold)] px-10 py-4 text-base font-bold text-[#0a0a0e] tracking-wide transition-all hover:bg-[var(--gold-light)] hover:shadow-[0_20px_60px_rgba(201,168,78,0.25)] hover:scale-[1.02]"
              >
                Free Credit Analysis
              </Link>
              <Link
                href="#pricing"
                className="w-full sm:w-auto rounded-xl border border-[var(--gold)]/30 bg-transparent px-10 py-4 text-base font-semibold text-[var(--gold)] tracking-wide transition-all hover:border-[var(--gold)]/60 hover:bg-[var(--gold-dim)] hover:scale-[1.02]"
              >
                See Pricing
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--muted)] tracking-wide">
              <span>FCRA compliant</span>
              <span className="hidden sm:inline text-[var(--border)]">·</span>
              <span>Metro 2 certified</span>
              <span className="hidden sm:inline text-[var(--border)]">·</span>
              <span>Results in 30–90 days</span>
            </div>
          </motion.div>

          <div className="relative z-10 mt-16 sm:mt-20 w-full max-w-5xl mx-auto">
            <FloatingCards />
          </div>
        </section>

        {/* THREE PILLARS */}
        <section className="section-alt px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                Three Tools · One System
              </span>
              <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-[-0.02em] text-[var(--text)]">
                Everything You Need to Fix Credit
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="feature-card card-panel rounded-2xl p-8 flex flex-col"
                >
                  <span className="inline-block self-start rounded-full border border-[var(--gold)]/30 bg-[var(--gold-dim)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)] mb-5">
                    {p.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-[var(--text)] mb-3">{p.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">{p.desc}</p>
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {p.cta} <span>→</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                Pricing · Simple Tiers
              </span>
              <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-[-0.02em] text-[var(--text)]">
                Pick Your Path
              </h2>
              <p className="mt-4 text-[var(--text-secondary)] max-w-2xl mx-auto">
                Start free with Analysis. Upgrade when you&apos;re ready to execute.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TIERS.map((t) => (
                <div
                  key={t.name}
                  className={`card-panel rounded-2xl p-8 flex flex-col ${
                    t.highlight ? "border-[var(--gold)]/40 shadow-[0_20px_60px_rgba(201,168,78,0.1)]" : ""
                  }`}
                >
                  {t.highlight && (
                    <span className="self-start mb-4 rounded-full premium-badge px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a0a0e]">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-[var(--text)] mb-2">{t.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">{t.tagline}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-[var(--gold)]">${t.price}</span>
                    <span className="text-sm text-[var(--muted)]">{t.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--gold)] mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={t.href}
                    className={`block text-center rounded-xl py-3 font-bold text-sm tracking-wide transition-all ${
                      t.highlight
                        ? "gold-btn bg-[var(--gold)] text-[#0a0a0e] hover:bg-[var(--gold-light)]"
                        : "border border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold-dim)]"
                    }`}
                  >
                    {t.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ECOSYSTEM TIE-IN */}
        <section className="section-alt px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
              The Phimindflow Ecosystem
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-[var(--text)]">
              Credit + Capital. One System.
            </h2>
            <p className="mt-6 text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Good credit opens capital. Trading builds capital. Together they build wealth.
              That&apos;s why Phimindflow runs both pillars under one roof.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="rounded-xl border border-[var(--gold)]/30 bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--gold)] hover:bg-[var(--gold-dim)] transition-all"
              >
                ← Back to Trading
              </Link>
              <Link
                href="/credit/analyze"
                className="gold-btn rounded-xl bg-[var(--gold)] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#0a0a0e] hover:bg-[var(--gold-light)] transition-all"
              >
                Start Free Analysis →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
