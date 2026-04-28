import Navbar from "@/app/Navbar";
import Link from "next/link";

export const metadata = {
  title: "Learn · PHIMINDFLOW",
  description: "Learn the three pillars of the PHIMINDFLOW ecosystem — trade with structure, fix your credit, build your business with AI.",
};

type PillarCard = {
  tag: string;
  title: string;
  headline: string;
  copy: string;
  href: string;
  cta: string;
  external: boolean;
  icon: string;
};

const pillars: PillarCard[] = [
  {
    tag: "TRADE",
    title: "Fibonacci Trade System",
    headline: "Structured entries. Zero guesswork.",
    copy: "The Fibonacci-driven framework that shows you exactly where the market turns — before it does. Liquidity, structure, execution. A system you can verify, not just trust.",
    href: "/#process",
    cta: "Learn the system",
    external: false,
    icon: "M3 3v18h18M7 16l4-6 4 4 6-8",
  },
  {
    tag: "CREDIT",
    title: "Credit Repair Education",
    headline: "Understand your score. Control your future.",
    copy: "How credit scores work, what kills them, how to dispute errors, what collections do, and the exact steps to rebuild. Every lesson is written for real people, not bankers.",
    href: "/credit/learn",
    cta: "Open credit education",
    external: false,
    icon: "M2 4h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V4zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V4z",
  },
  {
    tag: "BUSINESS",
    title: "AI System Factory",
    headline: "Own the stack that builds your business.",
    copy: "A done-for-you AI operating system that ships products, runs marketing, posts content, and handles payments — one command surface, 115+ skills, your own copy of the stack Franc uses daily.",
    href: "https://ai-system-factory.vercel.app/demo",
    cta: "See the live demo",
    external: true,
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
];

export default function LearnHub() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute left-1/2 top-[20%] -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-[#C9A84E] opacity-[0.05] blur-[180px]" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C9A84E]">
            The ecosystem, explained
          </p>
          <h1 className="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Learn the three pillars.
            <br />
            <span className="text-gold">Then own them.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-[16px] leading-[1.8] text-[#A0A0A0]">
            PHIMINDFLOW is where you trade, fix your credit, and build your business.
            Pick a pillar below. Every section is self-paced — read, learn, execute.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-32">
        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((p) => (
            <PillarCard key={p.tag} {...p} />
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-2xl text-center">
          <p className="text-[13px] uppercase tracking-[0.25em] text-[#666666]">One ecosystem · three exits from chaos</p>
          <p className="mt-4 text-[14px] leading-[1.8] text-[#A0A0A0]">
            Trade structure your income. Credit fixes your foundation. Business gives you the leverage.
            Most people only work on one. The operators work on all three.
          </p>
        </div>
      </section>
    </main>
  );
}

function PillarCard({ tag, title, headline, copy, href, cta, external, icon }: PillarCard) {
  const body = (
    <div className="card-panel feature-card flex h-full flex-col rounded-2xl p-8 transition-all duration-500 hover:border-[rgba(201,168,78,0.3)]">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84E]">{tag}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(201,168,78,0.08)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d={icon} />
          </svg>
        </span>
      </div>

      <h2 className="text-[22px] font-bold leading-[1.15] tracking-[-0.01em] text-[#F5F5F5]">
        {title}
      </h2>
      <p className="mt-3 text-[15px] font-semibold text-[#C9A84E]">{headline}</p>
      <p className="mt-5 flex-1 text-[14px] leading-[1.75] text-[#A0A0A0]">{copy}</p>

      <div className="mt-8 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#C9A84E] group-hover:text-[#D4B96A]">
        {cta}
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
          <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block h-full">
      {body}
    </a>
  ) : (
    <Link href={href} className="group block h-full">
      {body}
    </Link>
  );
}
