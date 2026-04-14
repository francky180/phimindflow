"use client";

import { motion } from "motion/react";

type ChartData = {
  variant: "dark" | "gold";
  gradient: string;
  surfacePattern: string;
  accentColor: string;
  subtleColor: string;
  pair: string;
  price: string;
  delta: string;
  change: "up" | "down";
  path: string;
  area: string;
  offset: { x: number; y: number };
  rotate: { x: number; y: number; z: number };
  delay: number;
  z: number;
  scale: number;
};

const CHART_PATH_UP = "M0,75 C30,70 55,64 80,56 C105,50 130,44 160,36 C190,28 220,22 260,16 C300,10 340,7 380,5 C420,3 450,2 480,1";
const CHART_PATH_MID = "M0,55 C40,62 80,58 120,48 C160,40 200,50 240,44 C280,38 320,28 360,22 C400,18 440,14 480,8";
const CHART_PATH_DOWN = "M0,20 C40,24 80,30 120,36 C160,44 200,42 240,48 C280,54 320,58 360,62 C400,66 440,70 480,72";

const CHARTS: ChartData[] = [
  {
    variant: "dark",
    gradient: "linear-gradient(135deg, #0d0d12 0%, #1a1a22 40%, #0a0a0e 100%)",
    surfacePattern:
      "radial-gradient(circle at 20% 30%, rgba(201,168,78,0.14) 0%, transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
    accentColor: "#D4B96A",
    subtleColor: "rgba(212,185,106,0.75)",
    pair: "EUR / USD",
    price: "1.0847",
    delta: "+0.42%",
    change: "up",
    path: CHART_PATH_UP,
    area: CHART_PATH_UP + " L480,90 L0,90 Z",
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
    accentColor: "#0a0a0e",
    subtleColor: "rgba(10,10,14,0.85)",
    pair: "XAU / USD",
    price: "2,408.30",
    delta: "+1.24%",
    change: "up",
    path: CHART_PATH_MID,
    area: CHART_PATH_MID + " L480,90 L0,90 Z",
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
    accentColor: "#D4B96A",
    subtleColor: "rgba(212,185,106,0.75)",
    pair: "GBP / JPY",
    price: "196.58",
    delta: "-0.18%",
    change: "down",
    path: CHART_PATH_DOWN,
    area: CHART_PATH_DOWN + " L480,90 L0,90 Z",
    offset: { x: 230, y: 30 },
    rotate: { x: -4, y: 22, z: 8 },
    delay: 0.2,
    z: 10,
    scale: 0.92,
  },
];

function ChartCard({ data }: { data: ChartData }) {
  const isGold = data.variant === "gold";
  const deltaColor = data.change === "up" ? (isGold ? "#1a5c2a" : "#34d399") : (isGold ? "#7a1c1c" : "#f87171");

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
        className="relative w-[320px] h-[200px] sm:w-[360px] sm:h-[225px] rounded-[22px] overflow-hidden"
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
            className="text-[11px] font-extrabold tracking-[0.22em] mb-1"
            style={{
              color: data.accentColor,
              textShadow: isGold ? "0 1px 0 rgba(255,255,255,0.3)" : "0 1px 8px rgba(0,0,0,0.7)",
            }}
          >
            {data.pair}
          </div>
          <div
            className="text-[8px] uppercase tracking-[0.3em] font-bold"
            style={{
              color: data.subtleColor,
              textShadow: isGold ? "none" : "0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            PHIMINDFLOW · LIVE
          </div>
        </div>

        <div className="absolute top-5 right-6 sm:top-6 sm:right-7 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: deltaColor }} />
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: data.subtleColor }}>
            H1
          </span>
        </div>

        <div className="absolute top-[58px] sm:top-[68px] left-6 sm:left-7 right-6 sm:right-7 flex items-baseline justify-between">
          <div
            className="font-mono font-extrabold tracking-[0.04em] text-[22px] sm:text-[26px]"
            style={{
              color: data.accentColor,
              textShadow: isGold
                ? "0 1px 0 rgba(255,255,255,0.35)"
                : "0 1px 10px rgba(0,0,0,0.75), 0 0 24px rgba(201,168,78,0.2)",
            }}
          >
            {data.price}
          </div>
          <div
            className="text-[12px] font-extrabold tracking-[0.08em]"
            style={{ color: deltaColor, textShadow: isGold ? "none" : "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            {data.delta}
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 h-[90px] px-2">
          <svg viewBox="0 0 480 90" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id={`fc-line-${data.pair}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={data.accentColor} stopOpacity={isGold ? 0.6 : 0.3} />
                <stop offset="100%" stopColor={data.accentColor} stopOpacity={isGold ? 1 : 0.85} />
              </linearGradient>
              <linearGradient id={`fc-area-${data.pair}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={data.accentColor} stopOpacity={isGold ? 0.35 : 0.18} />
                <stop offset="100%" stopColor={data.accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={data.area} fill={`url(#fc-area-${data.pair})`} />
            <path d={data.path} fill="none" stroke={`url(#fc-line-${data.pair})`} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>

        <div
          className="absolute inset-0 rounded-[22px] pointer-events-none"
          style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, transparent 30%)" }}
        />
      </div>
    </motion.div>
  );
}

export default function FloatingCharts() {
  return (
    <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center pointer-events-none" style={{ perspective: 2000 }}>
      {CHARTS.map((c, i) => (
        <ChartCard key={i} data={c} />
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
