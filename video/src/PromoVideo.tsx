import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const GOLD = "#C6A85B";
const GOLD_DIM = "rgba(198,168,91,0.12)";
const DARK = "#0A0A0A";
const PANEL = "#131313";
const TEXT = "#F5F5F5";
const MUTED = "#999999";
const SUBTLE = "#555555";

function Fade({
  children,
  delay = 0,
  duration = 22,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, duration], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
}

function Glow({ top = "40%", size = 550 }: { top?: string; size?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        borderRadius: "50%",
        background: GOLD,
        opacity: 0.055,
        filter: "blur(170px)",
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Scene 1: Hook ── */
function SceneHook() {
  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Glow />
      <Fade>
        <p
          style={{
            fontSize: 24,
            color: GOLD,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          The truth about trading
        </p>
      </Fade>
      <Fade delay={12}>
        <h1
          style={{
            fontSize: 62,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          Most people trade
          <br />
          <span style={{ color: GOLD }}>without structure.</span>
        </h1>
      </Fade>
      <Fade delay={28}>
        <p
          style={{
            marginTop: 36,
            fontSize: 24,
            color: MUTED,
            textAlign: "center",
            maxWidth: 650,
            lineHeight: 1.6,
          }}
        >
          No system. No process. No edge.
        </p>
      </Fade>
    </AbsoluteFill>
  );
}

/* ── Scene 2: Problem ── */
function SceneProblem() {
  const items = [
    "Random entries and exits",
    "Emotional position sizing",
    "No risk framework",
    "Inconsistent results",
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#0E0E0E",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 100,
      }}
    >
      <Fade>
        <h2
          style={{
            fontSize: 50,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            marginBottom: 56,
          }}
        >
          Random trades.{" "}
          <span style={{ color: SUBTLE }}>Inconsistent results.</span>
        </h2>
      </Fade>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((item, i) => (
          <Fade key={item} delay={14 + i * 8}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                minWidth: 500,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  color: "#EF4444",
                  fontWeight: 700,
                }}
              >
                ✕
              </span>
              <span style={{ fontSize: 24, color: MUTED }}>{item}</span>
            </div>
          </Fade>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 3: Solution ── */
function SceneSolution() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - 8, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Glow size={650} />
      <Fade>
        <div
          style={{
            transform: `scale(${scale})`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: GOLD_DIM,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: GOLD,
              fontFamily: "serif",
            }}
          >
            {"\u03C6"}
          </div>
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "0.3em",
              background: `linear-gradient(135deg, #B8972F, ${GOLD}, #D4B96A)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PHIMINDFLOW
          </span>
        </div>
      </Fade>
      <Fade delay={16}>
        <h2
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.12,
            maxWidth: 900,
          }}
        >
          The Fibonacci{" "}
          <span style={{ color: GOLD }}>Growth System</span>
        </h2>
      </Fade>
      <Fade delay={30}>
        <p
          style={{
            marginTop: 28,
            fontSize: 22,
            color: MUTED,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Structure. Precision. Compounding.
        </p>
      </Fade>
    </AbsoluteFill>
  );
}

/* ── Scene 4: System Breakdown ── */
function SceneBreakdown() {
  const steps = [
    { num: "01", title: "Open Broker", sub: "Free · 5 minutes", accent: "#22C55E" },
    { num: "02", title: "Unlock the Course", sub: "$250 · Lifetime access", accent: GOLD },
    { num: "03", title: "Managed Execution", sub: "$1,500 · Premium tier", accent: "#D4B96A" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
      }}
    >
      <Fade>
        <p
          style={{
            fontSize: 18,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Three Steps. One System.
        </p>
      </Fade>
      <Fade delay={8}>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            marginBottom: 56,
          }}
        >
          Follow the sequence.
        </h2>
      </Fade>
      <div style={{ display: "flex", gap: 36, width: "100%" }}>
        {steps.map((s, i) => (
          <Fade key={s.num} delay={18 + i * 12}>
            <div
              style={{
                flex: 1,
                background: PANEL,
                borderRadius: 20,
                padding: 44,
                border: "1px solid #1E1E1E",
                minWidth: 320,
              }}
            >
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: s.accent,
                  opacity: 0.3,
                  lineHeight: 1,
                }}
              >
                {s.num}
              </span>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: TEXT,
                  marginTop: 14,
                }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: 16, color: MUTED, marginTop: 10 }}>
                {s.sub}
              </p>
            </div>
          </Fade>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 5: Authority ── */
function SceneAuthority() {
  const words = ["Structured.", "Calculated.", "Scalable."];

  return (
    <AbsoluteFill
      style={{
        background: "#0E0E0E",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Glow top="50%" size={500} />
      <div style={{ display: "flex", gap: 48, position: "relative" }}>
        {words.map((w, i) => (
          <Fade key={w} delay={i * 14}>
            <span
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: i === 1 ? GOLD : TEXT,
                letterSpacing: "-0.02em",
              }}
            >
              {w}
            </span>
          </Fade>
        ))}
      </div>
      <Fade delay={44}>
        <p
          style={{
            marginTop: 40,
            fontSize: 20,
            color: SUBTLE,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Built on Fibonacci mathematics
        </p>
      </Fade>
    </AbsoluteFill>
  );
}

/* ── Scene 6: CTA ── */
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnScale = spring({ frame: frame - 18, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Glow top="35%" />
      <Fade>
        <p
          style={{
            fontSize: 20,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
            position: "relative",
          }}
        >
          Your next step
        </p>
      </Fade>
      <Fade delay={10}>
        <h2
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.1,
            position: "relative",
          }}
        >
          Start free.
          <br />
          <span style={{ color: GOLD }}>Build with precision.</span>
        </h2>
      </Fade>
      <Fade delay={24}>
        <div
          style={{
            marginTop: 48,
            transform: `scale(${btnScale})`,
            background: GOLD,
            borderRadius: 20,
            padding: "22px 60px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 4px 28px rgba(198,168,91,0.3)",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Open Broker — Free
          </span>
          <span style={{ fontSize: 20, color: "white" }}>{"\u2192"}</span>
        </div>
      </Fade>
      <Fade delay={40}>
        <p
          style={{
            marginTop: 32,
            fontSize: 17,
            color: SUBTLE,
            position: "relative",
          }}
        >
          phimindflow.com
        </p>
      </Fade>
    </AbsoluteFill>
  );
}

/* ── Main ── */
export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <SceneProblem />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <SceneSolution />
      </Sequence>
      <Sequence from={270} durationInFrames={105}>
        <SceneBreakdown />
      </Sequence>
      <Sequence from={375} durationInFrames={75}>
        <SceneAuthority />
      </Sequence>
      <Sequence from={450} durationInFrames={90}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
