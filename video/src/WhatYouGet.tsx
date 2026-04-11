import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// ─────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────
const BG = "#05060A";
const BG_MID = "#0A0B14";
const PANEL = "#0E1018";
const BORDER = "#1A1D29";
const TEXT = "#F5F7FA";
const MUTED = "#8A8FA3";
const DIM = "#565A6E";
const CYAN = "#00D4FF";
const CYAN_DIM = "rgba(0,212,255,0.12)";
const PURPLE = "#7C5CFF";
const GREEN = "#22C55E";

const FONT =
  '"Inter", "SF Pro Display", -apple-system, system-ui, sans-serif';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
}> = ({ children, delay = 0, duration = 22, y = 24 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const opacity = interpolate(t, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ty = interpolate(t, [0, duration], [y, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${ty}px)` }}>{children}</div>
  );
};

const SceneFade: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  const inOp = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const outOp = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  return (
    <AbsoluteFill style={{ opacity: Math.min(inOp, outOp) }}>
      {children}
    </AbsoluteFill>
  );
};

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 80) * 20;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% ${50 + drift}%, ${BG_MID} 0%, ${BG} 60%, #000 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, ${CYAN_DIM} 0%, transparent 40%)`,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 80% 70%, rgba(124,92,255,0.08) 0%, transparent 40%)`,
        }}
      />
      {/* grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Card: React.FC<{
  title: string;
  subtitle?: string;
  width?: number;
  accent?: string;
  delay?: number;
}> = ({ title, subtitle, width = 280, accent = CYAN, delay = 0 }) => {
  return (
    <FadeIn delay={delay}>
      <div
        style={{
          width,
          padding: "24px 28px",
          background: PANEL,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            color: TEXT,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: -0.3,
            fontFamily: FONT,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              color: MUTED,
              fontSize: 16,
              marginTop: 6,
              fontFamily: FONT,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </FadeIn>
  );
};

const Pill: React.FC<{ label: string; delay?: number; accent?: string }> = ({
  label,
  delay = 0,
  accent = CYAN,
}) => (
  <FadeIn delay={delay} y={12}>
    <div
      style={{
        padding: "10px 18px",
        background: PANEL,
        border: `1px solid ${BORDER}`,
        borderRadius: 999,
        color: TEXT,
        fontSize: 18,
        fontWeight: 500,
        fontFamily: FONT,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          background: accent,
          borderRadius: "50%",
          boxShadow: `0 0 10px ${accent}`,
        }}
      />
      {label}
    </div>
  </FadeIn>
);

// ─────────────────────────────────────────────────────────────
// Scene 1 — Intro title
// ─────────────────────────────────────────────────────────────
const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 40], [0.96, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <FadeIn delay={0}>
          <div
            style={{
              color: CYAN,
              fontSize: 18,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            FRANC × CLAUDE OPUS 4.6
          </div>
        </FadeIn>
        <FadeIn delay={12}>
          <div
            style={{
              color: TEXT,
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            What You Get
          </div>
        </FadeIn>
        <FadeIn delay={28}>
          <div
            style={{
              color: MUTED,
              fontSize: 32,
              marginTop: 24,
              fontWeight: 400,
            }}
          >
            The Complete System
          </div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 2 — YOU (the client)
// ─────────────────────────────────────────────────────────────
const Scene2Client: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: DIM,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            It starts with you
          </div>
          <div
            style={{
              width: 620,
              padding: "44px 64px",
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 24,
              boxShadow: `0 40px 120px rgba(0,212,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            <div
              style={{
                color: TEXT,
                fontSize: 56,
                fontWeight: 700,
                letterSpacing: -1.5,
              }}
            >
              YOU
            </div>
            <div style={{ color: CYAN, fontSize: 22, marginTop: 8 }}>
              The Client
            </div>
          </div>
          <FadeIn delay={22}>
            <div
              style={{
                color: MUTED,
                fontSize: 26,
                marginTop: 36,
                fontWeight: 400,
              }}
            >
              One request → Full delivery
            </div>
          </FadeIn>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 3 — Franc + Claude hub
// ─────────────────────────────────────────────────────────────
const Scene3Hub: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div style={{ textAlign: "center", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: -80,
              background: `radial-gradient(circle, ${CYAN_DIM} 0%, transparent 60%)`,
              opacity: 0.5 + pulse * 0.4,
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              width: 720,
              padding: "56px 72px",
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 24,
              position: "relative",
              boxShadow: `0 40px 120px rgba(0,0,0,0.6)`,
            }}
          >
            <div
              style={{
                color: CYAN,
                fontSize: 16,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              THE ENGINE
            </div>
            <div
              style={{
                color: TEXT,
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1.05,
              }}
            >
              FRANC + CLAUDE
            </div>
            <div style={{ color: PURPLE, fontSize: 32, marginTop: 8 }}>
              Opus 4.6 · 1M context
            </div>
            <div
              style={{
                color: MUTED,
                fontSize: 22,
                marginTop: 24,
                fontWeight: 400,
              }}
            >
              AI-powered solo dev studio · 24/7 execution
            </div>
          </div>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 4 — Three pillars reveal
// ─────────────────────────────────────────────────────────────
const Scene4Pillars: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div
          style={{
            color: DIM,
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Three pillars · One system
        </div>
      </FadeIn>
      <div style={{ display: "flex", gap: 40 }}>
        <Card
          title="STRATEGY"
          subtitle="Think"
          accent={CYAN}
          delay={10}
          width={320}
        />
        <Card
          title="BUILD & SHIP"
          subtitle="Execute"
          accent={PURPLE}
          delay={22}
          width={320}
        />
        <Card
          title="GROWTH & OPS"
          subtitle="Scale"
          accent={GREEN}
          delay={34}
          width={320}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 5 — STRATEGY detail
// ─────────────────────────────────────────────────────────────
const Scene5Strategy: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: CYAN,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            PILLAR 01
          </div>
          <div
            style={{
              color: TEXT,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
              marginTop: 8,
            }}
          >
            Strategy
          </div>
          <div
            style={{
              color: MUTED,
              fontSize: 24,
              marginTop: 8,
              marginBottom: 44,
            }}
          >
            Before a line of code is written
          </div>
        </div>
      </FadeIn>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          maxWidth: 900,
          justifyContent: "center",
        }}
      >
        <Pill label="YC Office Hours" delay={20} />
        <Pill label="CEO Review" delay={28} />
        <Pill label="Eng Review" delay={36} />
        <Pill label="Design Review" delay={44} />
        <Pill label="Security Audit (CSO)" delay={52} />
        <Pill label="Architecture Planning" delay={60} />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 6 — BUILD & SHIP detail
// ─────────────────────────────────────────────────────────────
const Scene6Build: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: PURPLE,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            PILLAR 02
          </div>
          <div
            style={{
              color: TEXT,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
              marginTop: 8,
            }}
          >
            Build & Ship
          </div>
          <div
            style={{
              color: MUTED,
              fontSize: 24,
              marginTop: 8,
              marginBottom: 44,
            }}
          >
            Production in days, not months
          </div>
        </div>
      </FadeIn>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          maxWidth: 1000,
          justifyContent: "center",
        }}
      >
        <Pill label="Next.js Sites" delay={18} accent={PURPLE} />
        <Pill label="Remotion Video" delay={24} accent={PURPLE} />
        <Pill label="Design Systems" delay={30} accent={PURPLE} />
        <Pill label="Automated QA" delay={36} accent={PURPLE} />
        <Pill label="Vercel Deploy" delay={42} accent={PURPLE} />
        <Pill label="Logs · Env · DNS · Blob · KV · Postgres" delay={48} accent={PURPLE} />
        <Pill label="Canary · Benchmarks" delay={58} accent={PURPLE} />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 7 — GROWTH detail
// ─────────────────────────────────────────────────────────────
const Scene7Growth: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: GREEN,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            PILLAR 03
          </div>
          <div
            style={{
              color: TEXT,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
              marginTop: 8,
            }}
          >
            Growth & Ops
          </div>
          <div
            style={{
              color: MUTED,
              fontSize: 24,
              marginTop: 8,
              marginBottom: 44,
            }}
          >
            From launch to revenue
          </div>
        </div>
      </FadeIn>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          maxWidth: 1000,
          justifyContent: "center",
        }}
      >
        <Pill label="Marketing Suite" delay={18} accent={GREEN} />
        <Pill label="Ads · SEO · Email" delay={24} accent={GREEN} />
        <Pill label="Funnels · Landing Pages" delay={30} accent={GREEN} />
        <Pill label="Creator Outreach" delay={36} accent={GREEN} />
        <Pill label="Rates · Briefs · Contracts" delay={42} accent={GREEN} />
        <Pill label="ROI Tracking · Scorecards" delay={48} accent={GREEN} />
        <Pill label="Brand · Copy · Social" delay={56} accent={GREEN} />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 8 — Knowledge & Memory Layer
// ─────────────────────────────────────────────────────────────
const Scene8Memory: React.FC = () => {
  const items = [
    { title: "GitNexus", sub: "9 repos · code graph" },
    { title: "BRAIN", sub: "Obsidian vault" },
    { title: "Memory", sub: "Persistent sessions" },
    { title: "Auto-Sync", sub: "Git backup on edit" },
  ];
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              color: CYAN,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            THE SECRET WEAPON
          </div>
          <div
            style={{
              color: TEXT,
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -2,
              marginTop: 12,
            }}
          >
            Knowledge & Memory
          </div>
          <div
            style={{
              color: MUTED,
              fontSize: 22,
              marginTop: 10,
            }}
          >
            Nothing forgotten · Always getting smarter
          </div>
        </div>
      </FadeIn>
      <div style={{ display: "flex", gap: 24 }}>
        {items.map((it, i) => (
          <Card
            key={it.title}
            title={it.title}
            subtitle={it.sub}
            accent={i % 2 === 0 ? CYAN : PURPLE}
            delay={20 + i * 10}
            width={240}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 9 — What this means: three layers
// ─────────────────────────────────────────────────────────────
const Scene9Means: React.FC = () => {
  const rows = [
    { num: "01", label: "Plans like a CEO", color: CYAN },
    { num: "02", label: "Builds like a senior engineer", color: PURPLE },
    { num: "03", label: "Ships like DevOps", color: GREEN },
    { num: "04", label: "Markets like an agency", color: "#F59E0B" },
    { num: "05", label: "Never forgets a decision", color: "#EC4899" },
  ];
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div
          style={{
            color: TEXT,
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: -1.5,
            marginBottom: 50,
            textAlign: "center",
          }}
        >
          One person. Infinite leverage.
        </div>
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => (
          <FadeIn key={r.num} delay={18 + i * 12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "18px 36px",
                background: PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                width: 760,
              }}
            >
              <div
                style={{
                  color: r.color,
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: -1,
                  fontVariantNumeric: "tabular-nums",
                  width: 60,
                }}
              >
                {r.num}
              </div>
              <div
                style={{
                  color: TEXT,
                  fontSize: 30,
                  fontWeight: 500,
                }}
              >
                {r.label}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 10 — Guarantee
// ─────────────────────────────────────────────────────────────
const Scene10Guarantee: React.FC = () => {
  const guarantees = [
    { k: "Ship fast", v: "Days, not months" },
    { k: "Zero-bug first pass", v: "Code tested before delivery" },
    { k: "Proof, not promises", v: "Every deploy verified live" },
    { k: "Own your stack", v: "Code, data, domains — all yours" },
  ];
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div
            style={{
              color: GREEN,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            THE GUARANTEE
          </div>
          <div
            style={{
              color: TEXT,
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              marginTop: 10,
            }}
          >
            No excuses.
          </div>
        </div>
      </FadeIn>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {guarantees.map((g, i) => (
          <FadeIn key={g.k} delay={20 + i * 10}>
            <div
              style={{
                width: 420,
                padding: "24px 28px",
                background: PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  color: GREEN,
                  fontSize: 18,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                ✓ {g.k}
              </div>
              <div style={{ color: MUTED, fontSize: 20 }}>{g.v}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Scene 11 — Bottom line CTA
// ─────────────────────────────────────────────────────────────
const Scene11CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 10);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <FadeIn>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: DIM,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Bottom line
          </div>
          <div
            style={{
              color: TEXT,
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.1,
              maxWidth: 1400,
            }}
          >
            You describe the outcome.
            <br />
            <span style={{ color: CYAN }}>
              The system delivers it end-to-end.
            </span>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={36}>
        <div
          style={{
            marginTop: 60,
            color: MUTED,
            fontSize: 26,
            letterSpacing: 0.5,
          }}
        >
          One contact · One invoice · One brain that never sleeps
        </div>
      </FadeIn>
      <FadeIn delay={60}>
        <div
          style={{
            marginTop: 48,
            padding: "20px 56px",
            background: `linear-gradient(135deg, ${CYAN}22, ${PURPLE}22)`,
            border: `1px solid ${CYAN}`,
            borderRadius: 999,
            color: TEXT,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            boxShadow: `0 0 ${40 + glow * 40}px ${CYAN_DIM}`,
          }}
        >
          Let's build
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Root composition
// ─────────────────────────────────────────────────────────────
export const WhatYouGet: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("bg.wav")} volume={0.55} />
      <Backdrop />
      <Sequence from={0} durationInFrames={120}>
        <SceneFade durationInFrames={120}>
          <Scene1Intro />
        </SceneFade>
      </Sequence>
      <Sequence from={120} durationInFrames={180}>
        <SceneFade durationInFrames={180}>
          <Scene2Client />
        </SceneFade>
      </Sequence>
      <Sequence from={300} durationInFrames={180}>
        <SceneFade durationInFrames={180}>
          <Scene3Hub />
        </SceneFade>
      </Sequence>
      <Sequence from={480} durationInFrames={240}>
        <SceneFade durationInFrames={240}>
          <Scene4Pillars />
        </SceneFade>
      </Sequence>
      <Sequence from={720} durationInFrames={300}>
        <SceneFade durationInFrames={300}>
          <Scene5Strategy />
        </SceneFade>
      </Sequence>
      <Sequence from={1020} durationInFrames={300}>
        <SceneFade durationInFrames={300}>
          <Scene6Build />
        </SceneFade>
      </Sequence>
      <Sequence from={1320} durationInFrames={300}>
        <SceneFade durationInFrames={300}>
          <Scene7Growth />
        </SceneFade>
      </Sequence>
      <Sequence from={1620} durationInFrames={240}>
        <SceneFade durationInFrames={240}>
          <Scene8Memory />
        </SceneFade>
      </Sequence>
      <Sequence from={1860} durationInFrames={300}>
        <SceneFade durationInFrames={300}>
          <Scene9Means />
        </SceneFade>
      </Sequence>
      <Sequence from={2160} durationInFrames={240}>
        <SceneFade durationInFrames={240}>
          <Scene10Guarantee />
        </SceneFade>
      </Sequence>
      <Sequence from={2400} durationInFrames={300}>
        <SceneFade durationInFrames={300}>
          <Scene11CTA />
        </SceneFade>
      </Sequence>
    </AbsoluteFill>
  );
};
