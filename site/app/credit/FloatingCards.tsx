"use client";

import { motion } from "motion/react";

type CardData = {
  variant: "dark" | "gold";
  gradient: string;
  surfacePattern: string;
  textColor: string;
  subtleColor: string;
  chipOuter: string;
  chipInner: string;
  number: string;
  holder: string;
  expiry: string;
  network: string;
  offset: { x: number; y: number };
  rotate: { x: number; y: number; z: number };
  delay: number;
  z: number;
  scale: number;
};

const CARDS: CardData[] = [
  {
    variant: "dark",
    gradient: "linear-gradient(135deg, #0d0d12 0%, #1a1a22 40%, #0a0a0e 100%)",
    surfacePattern:
      "radial-gradient(circle at 20% 30%, rgba(201,168,78,0.14) 0%, transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
    textColor: "#D4B96A",
    subtleColor: "rgba(212,185,106,0.75)",
    chipOuter: "linear-gradient(135deg, #B8972F 0%, #D4B96A 50%, #8a6d1c 100%)",
    chipInner: "#3a2d0f",
    number: "4 8 0 0  · · · ·  · · · ·  6 1 8 0",
    holder: "MEMBER",
    expiry: "12/29",
    network: "PREMIUM",
    offset: { x: -230, y: 30 },
    rotate: { x: -4, y: -22, z: -8 },
    delay: 0.1,
    z: 10,
    scale: 0.92,
  },
  {
    variant: "gold",
    gradient:
      "linear-gradient(135deg, #D4B96A 0%, #C9A84E 30%, #B8972F 60%, #C9A84E 100%)",
    surfacePattern:
      "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35) 0%, transparent 40%), linear-gradient(115deg, rgba(255,255,255,0.12) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)",
    textColor: "#0a0a0e",
    subtleColor: "rgba(10,10,14,0.85)",
    chipOuter: "linear-gradient(135deg, #0a0a0e 0%, #2a2a35 50%, #0a0a0e 100%)",
    chipInner: "#6b6b78",
    number: "4 8 0 0  · · · ·  · · · ·  2 0 2 6",
    holder: "PHIMINDFLOW",
    expiry: "∞ / ∞",
    network: "PHIMINDFLOW ELITE",
    offset: { x: 0, y: 0 },
    rotate: { x: 2, y: 0, z: 0 },
    delay: 0,
    z: 30,
    scale: 1,
  },
  {
    variant: "dark",
    gradient: "linear-gradient(135deg, #0d0d12 0%, #1a1a22 40%, #0a0a0e 100%)",
    surfacePattern:
      "radial-gradient(circle at 80% 30%, rgba(201,168,78,0.14) 0%, transparent 50%), linear-gradient(-135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
    textColor: "#D4B96A",
    subtleColor: "rgba(212,185,106,0.75)",
    chipOuter: "linear-gradient(135deg, #B8972F 0%, #D4B96A 50%, #8a6d1c 100%)",
    chipInner: "#3a2d0f",
    number: "4 8 0 0  · · · ·  · · · ·  7 4 2 0",
    holder: "ELEVATE",
    expiry: "12/29",
    network: "PREMIUM",
    offset: { x: 230, y: 30 },
    rotate: { x: -4, y: 22, z: 8 },
    delay: 0.2,
    z: 10,
    scale: 0.92,
  },
];

function Card({ data }: { data: CardData }) {
  const isGold = data.variant === "gold";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: data.offset.y + 60,
        rotateX: data.rotate.x,
        rotateY: data.rotate.y,
        rotateZ: data.rotate.z,
        scale: data.scale * 0.8,
      }}
      animate={{
        opacity: 1,
        y: [data.offset.y, data.offset.y - 14, data.offset.y],
        rotateX: [data.rotate.x, data.rotate.x + 2, data.rotate.x],
        rotateY: [data.rotate.y, data.rotate.y - 3, data.rotate.y],
        rotateZ: [data.rotate.z, data.rotate.z + 0.5, data.rotate.z],
        scale: data.scale,
      }}
      transition={{
        opacity: { duration: 1.2, delay: data.delay, ease: "easeOut" },
        scale: { duration: 1.2, delay: data.delay, ease: "easeOut" },
        y: { duration: 7, delay: data.delay + 1.2, repeat: Infinity, ease: "easeInOut" },
        rotateX: { duration: 7, delay: data.delay + 1.2, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 7, delay: data.delay + 1.2, repeat: Infinity, ease: "easeInOut" },
        rotateZ: { duration: 7, delay: data.delay + 1.2, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        translateX: `calc(-50% + ${data.offset.x}px)`,
        translateY: "-50%",
        transformStyle: "preserve-3d",
        zIndex: data.z,
      }}
    >
      <div
        className="relative w-[320px] h-[200px] sm:w-[360px] sm:h-[225px] rounded-[22px]"
        style={{
          background: data.gradient,
          boxShadow: isGold
            ? `0 60px 120px rgba(201,168,78,0.38), 0 30px 60px rgba(201,168,78,0.25), 0 15px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2) inset, 0 2px 0 rgba(255,255,255,0.35) inset, 0 -2px 0 rgba(0,0,0,0.3) inset`
            : `0 50px 100px rgba(0,0,0,0.7), 0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,78,0.25) inset, 0 1px 0 rgba(201,168,78,0.15) inset, 0 -1px 0 rgba(0,0,0,0.5) inset`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-0 rounded-[22px] pointer-events-none" style={{ background: data.surfacePattern }} />

        <motion.div
          className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden mix-blend-overlay"
          style={{
            background: isGold
              ? "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.22) 50%, transparent 62%)"
              : "linear-gradient(105deg, transparent 42%, rgba(201,168,78,0.1) 50%, transparent 58%)",
            backgroundSize: "200% 200%",
          }}
          animate={{ backgroundPosition: ["200% 200%", "-100% -100%"] }}
          transition={{ duration: 10, delay: data.delay + 2, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute top-5 left-6 sm:top-6 sm:left-7">
          <div
            className="text-[12px] font-extrabold tracking-[0.28em] mb-0.5"
            style={{
              color: data.textColor,
              textShadow: isGold ? "0 1px 0 rgba(255,255,255,0.3)" : "0 1px 8px rgba(0,0,0,0.7)",
            }}
          >
            PHIMINDFLOW
          </div>
          <div
            className="text-[8px] uppercase tracking-[0.3em] font-bold"
            style={{
              color: data.subtleColor,
              textShadow: isGold ? "none" : "0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            {data.network}
          </div>
        </div>

        <div className="absolute top-5 right-6 sm:top-6 sm:right-7 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: data.textColor, opacity: 0.7 }}>
            <path d="M2 8.5 C 2 8.5, 6 4, 12 4 S 22 8.5, 22 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 12 C 5 12, 8 9, 12 9 S 19 12, 19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 15.5 C 8 15.5, 10 14, 12 14 S 16 15.5, 16 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
          </svg>
        </div>

        <div className="absolute top-[62px] left-6 sm:top-[72px] sm:left-7">
          <div
            className="w-[44px] h-[34px] sm:w-[48px] sm:h-[38px] rounded-[5px] relative overflow-hidden"
            style={{ background: data.chipOuter, boxShadow: `0 1px 2px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(0,0,0,0.3) inset` }}
          >
            <div
              className="absolute inset-1"
              style={{
                background: `linear-gradient(90deg, transparent 30%, ${data.chipInner} 30%, ${data.chipInner} 32%, transparent 32%, transparent 65%, ${data.chipInner} 65%, ${data.chipInner} 67%, transparent 67%), linear-gradient(0deg, transparent 20%, ${data.chipInner} 20%, ${data.chipInner} 22%, transparent 22%, transparent 48%, ${data.chipInner} 48%, ${data.chipInner} 50%, transparent 50%, transparent 76%, ${data.chipInner} 76%, ${data.chipInner} 78%, transparent 78%)`,
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[10px] sm:w-[16px] sm:h-[12px] rounded-sm"
              style={{ background: data.chipInner, boxShadow: `0 0 0 0.5px rgba(0,0,0,0.5)` }}
            />
          </div>
        </div>

        <div
          className="absolute bottom-[56px] sm:bottom-[64px] left-6 right-6 sm:left-7 sm:right-7 font-mono font-extrabold tracking-[0.08em] text-[15px] sm:text-[17px]"
          style={{
            color: data.textColor,
            textShadow: isGold
              ? "0 1px 0 rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.15)"
              : "0 1px 10px rgba(0,0,0,0.75), 0 0 24px rgba(201,168,78,0.2)",
          }}
        >
          {data.number}
        </div>

        <div className="absolute bottom-5 left-6 sm:bottom-6 sm:left-7">
          <div
            className="text-[8px] uppercase tracking-[0.22em] font-bold mb-1"
            style={{ color: data.subtleColor, textShadow: isGold ? "none" : "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            Cardholder
          </div>
          <div
            className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.14em]"
            style={{
              color: data.textColor,
              textShadow: isGold ? "0 1px 0 rgba(255,255,255,0.3)" : "0 1px 6px rgba(0,0,0,0.55)",
            }}
          >
            {data.holder}
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:bottom-6">
          <div
            className="text-[8px] uppercase tracking-[0.22em] font-bold mb-1 text-center"
            style={{ color: data.subtleColor, textShadow: isGold ? "none" : "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            Valid Thru
          </div>
          <div
            className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.1em] font-mono text-center"
            style={{
              color: data.textColor,
              textShadow: isGold ? "0 1px 0 rgba(255,255,255,0.3)" : "0 1px 6px rgba(0,0,0,0.55)",
            }}
          >
            {data.expiry}
          </div>
        </div>

        <div className="absolute bottom-5 right-6 sm:bottom-6 sm:right-7 flex items-center">
          <div className="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] rounded-full" style={{ background: data.textColor, opacity: 0.75 }} />
          <div
            className="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] rounded-full -ml-[14px] sm:-ml-[16px]"
            style={{ background: data.textColor, opacity: 0.45, mixBlendMode: "screen" }}
          />
        </div>

        <div
          className="absolute inset-0 rounded-[22px] pointer-events-none"
          style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, transparent 30%)" }}
        />
      </div>
    </motion.div>
  );
}

export default function FloatingCards() {
  return (
    <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center pointer-events-none" style={{ perspective: 2000 }}>
      {CARDS.map((card, i) => (
        <Card key={i} data={card} />
      ))}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[480px] h-[50px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(201,168,78,0.5) 0%, rgba(201,168,78,0.15) 40%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[360px] h-[30px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(201,168,78,0.7) 0%, transparent 60%)",
          filter: "blur(18px)",
        }}
      />
    </div>
  );
}
