"use client";

import { motion, useTransform, useScroll, useInView, useMotionValue, useSpring, MotionValue } from "motion/react";
import { useRef, useState, useEffect } from "react";
import Navbar from "./Navbar";

/* ════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════ */

const brokerLink = "https://dashboard.genesisfxmarkets.com/auth/register?ref=FRADEL185";
const courseLink = "https://buy.stripe.com/3cI14n7Og2rn6g00Vhao804";
const managementLink = "https://buy.stripe.com/14k2bnf256Oh0gwdQQ";

/* -- Chart path (upward growth curve) -- */
const chartPath = "M0,85 C30,82 55,78 80,72 C105,66 130,58 160,48 C190,38 220,28 260,20 C300,12 340,7 380,4 C420,2 450,1 480,0";

/* -- Animation -- */
const ease = [0.22, 0.9, 0.36, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.9, ease },
};
const stagger = (d: number) => ({ ...reveal, transition: { duration: 0.9, delay: d, ease } });

/* ════════════════════════════════════════════════════
   UI COMPONENTS
   ════════════════════════════════════════════════════ */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C9A84E]">
      {children}
    </p>
  );
}

function GoldBtn({ href, children, large }: { href: string; children: React.ReactNode; large?: boolean }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`gold-btn relative inline-flex items-center gap-2.5 rounded-2xl bg-[#C9A84E] font-bold uppercase tracking-[0.12em] text-white shadow-[0_2px_12px_rgba(201,168,78,0.25)] transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(201,168,78,0.35)] ${
        large ? "px-10 py-5 text-[14px]" : "px-8 py-4 text-[13px]"
      }`}
    >
      {children}
      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
        <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.a>
  );
}

function OutlineBtn({ href, children, highlight }: { href: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`inline-flex items-center gap-2.5 rounded-2xl border px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
        highlight
          ? "border-[rgba(201,168,78,0.4)] text-[#C9A84E] hover:border-[#C9A84E] hover:shadow-[0_4px_20px_rgba(201,168,78,0.15)] hover:bg-[rgba(201,168,78,0.05)]"
          : "border-[#EAEAEA] text-[#4A4A4A] hover:border-[rgba(201,168,78,0.4)] hover:text-[#C9A84E] hover:bg-[rgba(201,168,78,0.05)]"
      }`}
    >
      {children}
    </motion.a>
  );
}

function SectionBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2.5 rounded-2xl border border-[#EAEAEA] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#4A4A4A] transition-all duration-300 hover:border-[rgba(201,168,78,0.4)] hover:text-[#C9A84E] hover:bg-[rgba(201,168,78,0.05)]"
    >
      {children}
    </a>
  );
}

function Divider() {
  return <div className="gold-rule w-full" />;
}

/* -- Simple SVG icons (24x24 stroke-based) -- */
function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#C9A84E]">
      <path d={d} />
    </svg>
  );
}

const icons = {
  target: "M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M9.76 14.24l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0",
  chart: "M3 3v18h18M7 16l4-6 4 4 6-8",
  shield: "M12 2l8 4v6c0 5.25-3.4 10.15-8 12-4.6-1.85-8-6.75-8-12V6l8-4z",
  book: "M2 4h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V4zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V4z",
  trending: "M2 18l6-6 4 4L22 6m0 0h-6m6 0v6",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8",
  lock: "M17 11V7a5 5 0 0 0-10 0v4M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z",
};

/* -- Animated counter (scroll-triggered) -- */
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 }) as MotionValue<number>;
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v: number) => {
      if (Number.isInteger(value)) {
        setDisplay(Math.round(v).toLocaleString());
      } else {
        setDisplay(v.toFixed(1));
      }
    });
    return unsubscribe;
  }, [spring, value]);

  return (
    <span ref={ref} className="stat-value text-[20px] font-bold text-[#0A0A0A]">
      {prefix}{display}{suffix}
    </span>
  );
}

/* -- Trust ticker -- */
function TrustTicker() {
  const items = [
    "Fibonacci-Driven",
    "Risk-Managed",
    "Precision Execution",
    "Structured Growth",
    "Premium Capital Management",
    "Mathematical Edge",
    "Compounding Architecture",
    "Elite Framework",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-[#F0F0F0] bg-[rgba(255,255,255,0.6)] py-4">
      <div className="ticker-scroll flex items-center gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8A8A8A]">
            <span className="h-1 w-1 rounded-full bg-[#C9A84E]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -- Expandable FAQ item -- */
function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      {...stagger(delay)}
      className="feature-card card-panel rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-7 text-left"
      >
        <h3 className="text-[15px] font-bold text-[#0A0A0A] pr-4">{q}</h3>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EAEAEA] text-[#8A8A8A]"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease }}
        className="overflow-hidden"
      >
        <p className="px-7 pb-7 text-[14px] leading-[1.75] text-[#4A4A4A]">{a}</p>
      </motion.div>
    </motion.div>
  );
}

/* -- Check item for feature lists -- */
function CheckItem({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,78,0.1)]">
        <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#C9A84E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <p className="text-[14px] font-semibold text-[#0A0A0A]">{title}</p>
        <p className="mt-0.5 text-[13px] text-[#4A4A4A]">{desc}</p>
      </div>
    </li>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════ */

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <main id="top" className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] overflow-x-hidden">
      <Navbar />

      {/* ──────────── HERO ──────────── */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen overflow-hidden bg-white">
        {/* Subtle ambient gradient */}
        <div className="pointer-events-none absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-[#C9A84E] opacity-[0.04] blur-[200px]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-32 pb-20">
          <div className="grid w-full gap-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            {/* Left -- Copy */}
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
                <Label>The Fibonacci Growth System</Label>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease }}
                className="text-[clamp(2.8rem,7vw,5.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[#0A0A0A]"
              >
                Build wealth with
                <br />
                <span className="text-gold">mathematical precision.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease }}
                className="mt-8 max-w-lg text-[17px] leading-[1.85] text-[#4A4A4A]"
              >
                A structured, three-step path to financial growth — built on Fibonacci
                mathematics, designed for people who want clarity over chaos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease }}
                className="mt-12 flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center gap-5">
                  <GoldBtn href={brokerLink} large>Start Free — Open Broker</GoldBtn>
                  <SectionBtn href="#process">See the Process</SectionBtn>
                </div>
                <p className="text-[12px] text-[#8A8A8A]">Free to open &middot; Takes 5 minutes &middot; Required first step</p>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-14"
              >
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C9A84E]">Live system results</p>
                <div className="flex items-center gap-10">
                  <div>
                    <AnimatedCounter value={847} suffix="+" />
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A]">Trades Executed</p>
                  </div>
                  <div>
                    <AnimatedCounter value={34.8} suffix="%" />
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A]">Avg. Growth</p>
                  </div>
                  <div>
                    <span className="stat-value text-[20px] font-bold text-[#0A0A0A]">1:2.4</span>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A]">Risk/Reward</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right -- Hero stat card (fintech feel) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease }}
              className="hidden lg:block"
            >
              <div className="card-panel rounded-2xl p-6">
                <div className="rounded-xl bg-[#FAFAFA] p-5">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A84E]">Portfolio Overview</span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] uppercase tracking-[0.15em] text-emerald-600">Live</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      ["$127,450", "Balance", "+12.4%"],
                      ["+34.8%", "Growth", "+5.2%"],
                      ["847", "Trades", "+89"],
                    ].map(([val, label, delta]) => (
                      <div key={label} className="card-panel rounded-xl p-4 text-center">
                        <p className="stat-value text-lg font-bold text-[#0A0A0A]">{val}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A]">{label}</p>
                        <p className="mt-1.5 text-[10px] font-semibold text-emerald-600">{delta}</p>
                      </div>
                    ))}
                  </div>
                  {/* Mini chart */}
                  <div className="card-panel rounded-xl p-4">
                    <svg viewBox="0 0 480 90" className="w-full h-auto">
                      <defs>
                        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#C9A84E" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#C9A84E" stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A84E" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#C9A84E" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={chartPath + " L480,90 L0,90 Z"} fill="url(#cf)" />
                      <path d={chartPath} fill="none" stroke="url(#cg)" strokeWidth="2" strokeLinecap="round" className="chart-line" />
                      <circle cx="480" cy="0" r="3" fill="#C9A84E" opacity="0.7">
                        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust ticker bar */}
        <TrustTicker />
      </motion.section>

      {/* ──────────── CREDIBILITY / POSITIONING ──────────── */}
      <section id="credibility" className="bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <motion.div {...reveal} className="text-center">
            <Label>Why PHIMINDFLOW</Label>
            <h2 className="mx-auto max-w-2xl text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#0A0A0A]">
              Built for serious results.{" "}
              <span className="text-gold">Not speculation.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.8] text-[#4A4A4A]">
              Every component follows the golden ratio. Structure replaces guesswork. Real metrics replace promises. A system you can verify, not just trust.
            </p>
          </motion.div>

          {/* Performance metrics */}
          <motion.div {...stagger(0.1)} className="mt-16 card-panel rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A84E]">System Snapshot</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.15em] text-emerald-600">Live</span>
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["$127,450", "Account Balance", "+12.4% this quarter"],
                ["34.8%", "Avg. Monthly Growth", "Compounding"],
                ["847+", "Executed Trades", "Verified on-chain"],
                ["1:2.4", "Risk/Reward Ratio", "Maintained consistently"],
              ].map(([value, label, change]) => (
                <div key={label} className="feature-card card-panel rounded-xl p-6">
                  <p className="stat-value text-2xl font-bold text-[#0A0A0A]">{value}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#8A8A8A]">{label}</p>
                  <p className="mt-3 text-[12px] font-semibold text-emerald-600">{change}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="mt-8 rounded-xl bg-[#FAFAFA] p-6 border border-[#F0F0F0]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A8A8A]">Growth Trajectory</span>
                <div className="flex items-center gap-2">
                  <span className="h-[3px] w-4 rounded-full bg-[#C9A84E]" />
                  <span className="text-[10px] text-[#8A8A8A]">Performance</span>
                </div>
              </div>
              <svg viewBox="0 0 480 90" className="w-full h-auto">
                <defs>
                  <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C9A84E" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#C9A84E" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#D4B96A" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="cf2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84E" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#C9A84E" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 22, 45, 67, 90].map((y) => (
                  <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(201,168,78,0.08)" strokeWidth="0.5" />
                ))}
                <path d={chartPath + " L480,90 L0,90 Z"} fill="url(#cf2)" />
                <path d={chartPath} fill="none" stroke="url(#cg2)" strokeWidth="1.5" strokeLinecap="round" className="chart-line" />
                <circle cx="480" cy="0" r="3" fill="#C9A84E" opacity="0.6">
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </motion.div>

          {/* Feature pillars */}
          <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {([
              [icons.target, "Fibonacci Precision", "Every trade follows the golden ratio. Mathematical structure behind every decision, every system layer."],
              [icons.shield, "Capital Protection First", "Risk management is built into every step. Your capital is protected by structured rules, not gut feelings."],
              [icons.chart, "Transparent Performance", "Real metrics from real execution. No projections, no backtests — verifiable results you can audit."],
              [icons.book, "Complete Education System", "The course delivers the full framework — process, methodology, and execution playbook before you deploy capital."],
              [icons.trending, "Compounding Architecture", "Each step compounds on the last. Broker feeds into course, course feeds into management. The system multiplies."],
              [icons.zap, "Done-For-You Management", "Hands-off execution built on your established foundation. The premium tier for those who want results without the screen time."],
            ] as const).map(([icon, title, desc], i) => (
              <motion.div
                key={title}
                {...stagger(0.06 * i)}
                className="feature-card card-panel rounded-2xl p-8 group cursor-default"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(201,168,78,0.1)] transition-all duration-500 group-hover:bg-[rgba(201,168,78,0.2)] group-hover:scale-110">
                  <Icon d={icon} />
                </div>
                <h3 className="mt-6 text-[16px] font-bold tracking-tight text-[#0A0A0A]">{title}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-[#4A4A4A] transition-colors duration-500 group-hover:text-[#0A0A0A]">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Member signals */}
          <motion.div {...stagger(0.25)} className="mt-20 grid gap-5 sm:grid-cols-3">
            {[
              {
                quote: "The structured approach changed everything. I finally stopped guessing and started following a system.",
                who: "Course member",
                detail: "6 months in the system",
              },
              {
                quote: "Broker first, course second — it clicked once I followed the order. Management was the natural next step.",
                who: "Management client",
                detail: "Full funnel completed",
              },
              {
                quote: "The risk framework alone was worth it. I know exactly why every trade happens.",
                who: "Course member",
                detail: "Active since Q1",
              },
            ].map((r, i) => (
              <motion.div
                key={i}
                {...stagger(0.08 * i)}
                className="card-panel rounded-2xl p-7"
              >
                <p className="text-[14px] leading-[1.75] text-[#4A4A4A]">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0A0A0A]">{r.who}</span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#C9A84E]">{r.detail}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust bar */}
          <motion.div {...stagger(0.3)} className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {[
              "Fibonacci-Driven System",
              "Stripe-Secured Payments",
              "Structured Risk Management",
              "Lifetime Course Access",
            ].map((item) => (
              <span key={item} className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#8A8A8A]">
                <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3 shrink-0">
                  <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#C9A84E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </span>
            ))}
          </motion.div>
        </div>
        <Divider />
      </section>

      {/* ──────────── 3-STEP PROCESS ──────────── */}
      <section id="process" className="section-alt">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <motion.div {...reveal} className="text-center">
            <Label>Your Three-Step Path</Label>
            <h2 className="mx-auto max-w-2xl text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#0A0A0A]">
              Follow the sequence.{" "}
              <span className="text-[#8A8A8A]">Skip nothing.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-[1.8] text-[#4A4A4A]">
              Each step builds on the last. This is a system, not a menu.
              The order exists because each phase prepares you for the next.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-6 lg:grid-cols-3">
            {/* Step 1 -- Broker */}
            <motion.div {...stagger(0.05)} className="feature-card card-panel rounded-2xl p-10 group">
              <span className="step-num">01</span>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#0A0A0A]">Open Your Broker Account</h3>
              <p className="mt-4 text-[14px] leading-[1.75] text-[#4A4A4A]">
                Your foundation. Set up the trading infrastructure so every step
                that follows has a live account ready. Free, takes 5 minutes.
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-emerald-600">Free &middot; 5 minutes</p>
              <div className="mt-8">
                <GoldBtn href={brokerLink}>Start Free — Open Broker</GoldBtn>
              </div>
            </motion.div>

            {/* Step 2 -- Course */}
            <motion.div {...stagger(0.12)} className="feature-card card-panel rounded-2xl p-10 group">
              <span className="step-num">02</span>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#0A0A0A]">Unlock the System</h3>
              <p className="mt-4 text-[14px] leading-[1.75] text-[#4A4A4A]">
                Master the Fibonacci framework, risk rules, and execution process.
                Clarity before capital. Knowledge before management.
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#C9A84E]">$250 — One-time access</p>
              <p className="mt-1.5 text-[11px] text-[#8A8A8A]">Lifetime access. Learn at your pace.</p>
              <div className="mt-8">
                <OutlineBtn href={courseLink}>Unlock The System</OutlineBtn>
              </div>
            </motion.div>

            {/* Step 3 -- Management (Premium) */}
            <motion.div {...stagger(0.19)} className="feature-card card-panel rounded-2xl p-10 group border-[rgba(201,168,78,0.2)] relative">
              <div className="absolute top-5 right-5 premium-badge rounded-full px-3 py-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">Premium</span>
              </div>
              <span className="step-num">03</span>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#0A0A0A]">Upgrade to Managed Execution</h3>
              <p className="mt-4 text-[14px] leading-[1.75] text-[#4A4A4A]">
                The premium tier. Once your account and course are in place,
                step into done-for-you execution by professionals who use the same system.
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#C9A84E]">$1,500 — Premium tier</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#8A8A8A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84E] animate-pulse" />
                Limited management spots available
              </p>
              <div className="mt-8">
                <OutlineBtn href={managementLink} highlight>Upgrade to Managed Execution</OutlineBtn>
              </div>
            </motion.div>
          </div>
        </div>
        <Divider />
      </section>

      {/* ──────────── WHY THIS ORDER MATTERS ──────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
            <motion.div {...reveal}>
              <Label>Why This Order</Label>
              <h2 className="max-w-lg text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#0A0A0A]">
                The sequence is{" "}
                <span className="text-gold">the system.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-[1.8] text-[#4A4A4A]">
                Most people fail because they skip steps. They buy a course without
                a broker. They want management without understanding the framework.
                This system eliminates that chaos.
              </p>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8] text-[#4A4A4A]">
                The broker creates commitment. The course creates understanding.
                Management becomes the natural next step — not a leap of faith.
              </p>
            </motion.div>

            <motion.div {...stagger(0.1)} className="space-y-5">
              {[
                [
                  "01",
                  "Foundation First",
                  "The broker account is free and takes minutes. It signals commitment and creates the infrastructure everything else runs on.",
                ],
                [
                  "02",
                  "Knowledge Before Capital",
                  "The course gives you the complete framework before you deploy money. You understand the process, the methodology, the risk rules.",
                ],
                [
                  "03",
                  "Management With Full Context",
                  "By this point you understand the system. Management is not a black box — it is a premium extension of what you have already learned.",
                ],
              ].map(([num, title, desc], i) => (
                <motion.div
                  key={num}
                  {...stagger(0.08 * i)}
                  className="feature-card card-panel rounded-2xl p-7 flex gap-6 items-start"
                >
                  <span className="text-3xl font-extrabold text-[rgba(201,168,78,0.3)] shrink-0">{num}</span>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0A0A0A]">{title}</h3>
                    <p className="mt-2 text-[13px] leading-[1.75] text-[#4A4A4A]">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        <Divider />
      </section>

      {/* ──────────── COURSE SECTION ──────────── */}
      <section id="course" className="section-alt">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div {...reveal}>
              <Label>Step 2 — The Course</Label>
              <h2 className="max-w-lg text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#0A0A0A]">
                The complete{" "}
                <span className="text-gold">Fibonacci framework.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-[1.8] text-[#4A4A4A]">
                Not another theory course. This is the exact process — the Fibonacci
                methodology, risk framework, and execution playbook used inside the live system.
                You will know exactly what is happening with your capital and why.
              </p>

              <ul className="mt-10 space-y-5">
                <CheckItem title="Fibonacci methodology" desc="Understand the mathematical framework behind every trade decision." />
                <CheckItem title="Risk management system" desc="Know exactly how your capital is protected before you deploy it." />
                <CheckItem title="Execution playbook" desc="Follow a step-by-step process from setup to live trading." />
                <CheckItem title="Lifetime access" desc="Return whenever you need to. The system is yours permanently." />
              </ul>

              <div className="mt-8 rounded-xl bg-[rgba(201,168,78,0.04)] border border-[rgba(201,168,78,0.12)] p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#C9A84E] mb-2">After the course, you will:</p>
                <p className="text-[13px] leading-[1.75] text-[#4A4A4A]">
                  Understand every trade in the system. Read the methodology. Apply the risk rules. Know exactly what management does with your capital — and why.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-4">
                <div className="flex items-center gap-6">
                  <GoldBtn href={courseLink}>Unlock The System — $250</GoldBtn>
                  <span className="text-[12px] uppercase tracking-[0.15em] text-[#8A8A8A]">One-time payment</span>
                </div>
                <p className="text-[12px] text-[#8A8A8A]">Secure Stripe checkout &middot; Instant access &middot; Lifetime updates included</p>
              </div>
            </motion.div>

            {/* Course visual card */}
            <motion.div {...stagger(0.15)} className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="card-panel rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(201,168,78,0.1)]">
                      <Icon d={icons.book} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A84E]">Course</p>
                      <p className="text-2xl font-bold text-gold stat-value">$250</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Complete Fibonacci methodology",
                      "Step-by-step execution process",
                      "Risk management framework",
                      "Position sizing rules",
                      "Entry and exit strategies",
                      "Lifetime access included",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl bg-[#FAFAFA] px-4 py-3 border border-[#F0F0F0]">
                        <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3 shrink-0">
                          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#C9A84E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[13px] text-[#4A4A4A]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Divider />
      </section>

      {/* ──────────── MANAGEMENT SECTION ──────────── */}
      <section id="management" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Management visual card -- left on desktop */}
            <motion.div {...stagger(0.15)} className="order-2 lg:order-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="card-panel rounded-2xl p-8 border-[rgba(201,168,78,0.2)]">
                  <div className="absolute -top-3 left-8 premium-badge rounded-full px-4 py-1.5 shadow-[0_2px_12px_rgba(201,168,78,0.25)]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Premium</span>
                  </div>
                  <div className="flex items-center gap-4 mb-8 mt-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(201,168,78,0.1)]">
                      <Icon d={icons.layers} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A84E]">Management</p>
                      <p className="text-2xl font-bold text-gold stat-value">$1,500</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Done-for-you account management",
                      "Built on your existing foundation",
                      "Fibonacci-driven execution",
                      "Hands-off growth system",
                      "Direct system access",
                      "Priority support included",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl bg-[#FAFAFA] px-4 py-3 border border-[#F0F0F0]">
                        <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3 shrink-0">
                          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#C9A84E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[13px] text-[#4A4A4A]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Management copy -- right on desktop */}
            <motion.div {...reveal} className="order-1 lg:order-2">
              <Label>Step 3 — Premium Management</Label>
              <h2 className="max-w-lg text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#0A0A0A]">
                Done-for-you{" "}
                <span className="text-gold">execution.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-[1.8] text-[#4A4A4A]">
                You know the system. You understand the framework. Now let professionals
                execute it for you. Hands-off growth built on the foundation you already established.
              </p>

              <ul className="mt-10 space-y-5">
                <CheckItem title="Professional execution" desc="Your capital managed using the same Fibonacci system you learned." />
                <CheckItem title="Built on your foundation" desc="Your broker account, your knowledge — now amplified by experts." />
                <CheckItem title="Premium-level access" desc="The highest tier of the system. Everything compounds here." />
              </ul>

              <div className="mt-12 flex flex-col gap-4">
                <div className="flex items-center gap-6">
                  <GoldBtn href={managementLink}>Upgrade to Managed Execution</GoldBtn>
                  <span className="text-[12px] uppercase tracking-[0.15em] text-[#8A8A8A]">Premium tier</span>
                </div>
                <p className="flex items-center gap-2 text-[12px] text-[#8A8A8A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84E] animate-pulse" />
                  Limited spots — we cap management clients to maintain execution quality
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <Divider />
      </section>

      {/* ──────────── WHO THIS IS FOR ──────────── */}
      <section className="section-alt">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <motion.div {...reveal}>
              <Label>Is This For You</Label>
              <h2 className="max-w-lg text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#0A0A0A]">
                Built for people who{" "}
                <span className="text-gold">want structure.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-[1.8] text-[#4A4A4A]">
                PHIMINDFLOW is not for everyone. It is for people who value a clear process, structured risk, and a guided path over random signals and hype.
              </p>
              <div className="mt-8 rounded-xl bg-[rgba(10,10,10,0.02)] border border-[#EAEAEA] p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#8A8A8A] mb-3">This is not for you if:</p>
                <ul className="space-y-2">
                  {["You want overnight riches without a process", "You are not willing to follow steps in order", "You expect guarantees instead of structured methodology"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[13px] text-[#8A8A8A]">
                      <span className="text-[10px]">&times;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div {...stagger(0.1)} className="space-y-5">
              {[
                ["You want a system, not signals", "You prefer structure over noise. A framework you can understand, verify, and follow with confidence."],
                ["You are ready to commit to a process", "You will follow steps in order, do the work, and build your financial foundation properly."],
                ["You want transparency over promises", "Real metrics, real execution, real methodology — no hype, no projections, no guesswork."],
              ].map(([title, desc], i) => (
                <motion.div
                  key={title}
                  {...stagger(0.08 * i)}
                  className="feature-card card-panel rounded-2xl p-7"
                >
                  <div className="flex gap-4 items-start">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,78,0.1)]">
                      <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                        <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#C9A84E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#0A0A0A]">{title}</h3>
                      <p className="mt-2 text-[13px] leading-[1.75] text-[#4A4A4A]">{desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        <Divider />
      </section>

      {/* ──────────── FAQ ──────────── */}
      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-28">
          <motion.div {...reveal} className="text-center">
            <Label>FAQ</Label>
            <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-bold tracking-[-0.025em] text-[#0A0A0A]">
              Common questions.{" "}
              <span className="text-[#8A8A8A]">Clear answers.</span>
            </h2>
          </motion.div>

          <div className="mt-16 space-y-4">
            {[
              ["Why does the broker account come first?", "The broker account is the foundation. It is free, takes 5 minutes, and creates the infrastructure that everything else runs on. Without it, the course material has no context and management has no account to operate with."],
              ["What makes the course worth $250?", "It is the complete Fibonacci methodology — the same framework used in the management system. You get the process, risk management rules, position sizing, entry/exit strategies, and lifetime access. This is not theory — it is the operating manual for the entire system."],
              ["When should I purchase management?", "After you understand the system. Management is designed as the third step because it builds on your broker account and course knowledge. You will know exactly what is being done with your capital and why — management becomes a premium extension, not a black box."],
              ["Can I skip the course and go straight to management?", "The system is designed to be followed in order. Each step prepares you for the next. Skipping reduces effectiveness and your ability to understand what management delivers. The order is the system."],
              ["Is there a refund policy?", "All purchases are processed through Stripe with standard payment protections. Contact support for any questions about your purchase."],
              ["How is this different from other trading systems?", "PHIMINDFLOW is built on Fibonacci mathematics — a precise, repeatable framework. Most systems sell signals or hype. This system delivers structure: a methodology, a risk framework, and a management path that compounds over time. You can verify every component."],
            ].map(([q, a], i) => (
              <FaqItem key={q} q={q} a={a} delay={0.04 * i} />
            ))}
          </div>
        </div>
        <Divider />
      </section>

      {/* ──────────── FINAL CTA ──────────── */}
      <section className="bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <motion.div
            {...reveal}
            className="relative overflow-hidden card-panel rounded-3xl border-[rgba(201,168,78,0.15)] px-8 py-24 text-center sm:px-16"
          >
            {/* Subtle ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#C9A84E] opacity-[0.04] blur-[160px]" />

            <div className="relative">
              <Label>Your Next Step</Label>
              <h2 className="mx-auto max-w-2xl text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0A0A0A]">
                The system is ready.{" "}
                <span className="text-gold">Are you?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[16px] leading-[1.8] text-[#4A4A4A]">
                Open your broker account. Master the framework. Activate premium management.
                Three steps — one system — structured for compounding growth.
              </p>

              <p className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#C9A84E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84E] animate-pulse" />
                Management spots are limited — start the process now
              </p>

              <div className="mt-14 flex flex-col items-center gap-6">
                <GoldBtn href={brokerLink} large>Start Free — Open Broker</GoldBtn>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <OutlineBtn href={courseLink}>Unlock The System — $250</OutlineBtn>
                  <OutlineBtn href={managementLink} highlight>Management — $1,500</OutlineBtn>
                </div>
                <p className="text-[11px] text-[#8A8A8A]">Step 1 is free. Steps 2 and 3 are one-time payments.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────── FOOTER ──────────── */}
      <Divider />
      <footer className="bg-white pb-24 md:pb-0">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(201,168,78,0.1)] text-[#C9A84E] text-xs font-bold">&phi;</span>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">PHIMINDFLOW</p>
            </div>
            <div className="flex items-center gap-8">
              <a href="#process" className="text-[11px] uppercase tracking-[0.15em] text-[#8A8A8A] transition-colors duration-300 hover:text-[#C9A84E]">Process</a>
              <a href="#course" className="text-[11px] uppercase tracking-[0.15em] text-[#8A8A8A] transition-colors duration-300 hover:text-[#C9A84E]">Course</a>
              <a href="#management" className="text-[11px] uppercase tracking-[0.15em] text-[#8A8A8A] transition-colors duration-300 hover:text-[#C9A84E]">Management</a>
              <a href="#faq" className="text-[11px] uppercase tracking-[0.15em] text-[#8A8A8A] transition-colors duration-300 hover:text-[#C9A84E]">FAQ</a>
            </div>
            <p className="text-[11px] tracking-wide text-[#8A8A8A]">
              &copy; {new Date().getFullYear()} PHIMINDFLOW
            </p>
          </div>
          <div className="mt-10 border-t border-[#F0F0F0] pt-6">
            <p className="text-center text-[10px] leading-[1.7] text-[#ABABAB]">
              Risk Disclosure: Trading foreign exchange carries a high level of risk and may not be suitable for all investors. Past performance is not indicative of future results. You should carefully consider your financial situation before making any investment decisions. PHIMINDFLOW does not guarantee profits or protection against losses.
            </p>
          </div>
        </div>
      </footer>

      {/* ──────────── STICKY MOBILE CTA ──────────── */}
      <StickyMobileCTA />
    </main>
  );
}

function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#EAEAEA] bg-[rgba(255,255,255,0.95)] backdrop-blur-xl px-4 py-3 md:hidden">
      <a
        href={brokerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="gold-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C9A84E] py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_2px_12px_rgba(201,168,78,0.25)]"
      >
        Start Free — Open Broker
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
          <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <p className="mt-1.5 text-center text-[10px] text-[#8A8A8A]">Step 1 of 3 &middot; Free &middot; Takes 5 minutes</p>
    </div>
  );
}
