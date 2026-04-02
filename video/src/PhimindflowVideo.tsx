import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const GOLD = "#C9A84E";
const GOLD_LIGHT = "#D4B96A";
const DARK = "#0A0A0A";
const PANEL = "#141414";
const ELEVATED = "#111111";
const TEXT = "#F5F5F5";
const MUTED = "#A0A0A0";
const SUBTLE = "#666666";

/* ── Reusable fade-in ── */
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, 20], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
}

/* ── Scene 1: Title / Brand ── */
function SceneTitle() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: GOLD,
          opacity: 0.06,
          filter: "blur(180px)",
        }}
      />
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          alignItems: "center",
          gap: 24,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: "rgba(201,168,78,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 700,
            color: GOLD,
            fontFamily: "serif",
          }}
        >
          {"\u03C6"}
        </div>
        <span
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "0.3em",
            background: `linear-gradient(135deg, #B8972F, ${GOLD}, ${GOLD_LIGHT})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PHIMINDFLOW
        </span>
      </div>
      <FadeIn delay={20}>
        <p
          style={{
            marginTop: 32,
            fontSize: 26,
            color: MUTED,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          The Fibonacci Growth System
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ── Scene 2: Problem ── */
function SceneProblem() {
  return (
    <AbsoluteFill
      style={{
        background: ELEVATED,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
        flexDirection: "column",
      }}
    >
      <FadeIn>
        <p
          style={{
            fontSize: 22,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          The Problem
        </p>
      </FadeIn>
      <FadeIn delay={10}>
        <h2
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          Most traders fail because they{" "}
          <span style={{ color: GOLD }}>skip steps.</span>
        </h2>
      </FadeIn>
      <FadeIn delay={25}>
        <p
          style={{
            marginTop: 32,
            fontSize: 24,
            color: MUTED,
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: 700,
          }}
        >
          No structure. No process. No guided path. Just guesswork and chaos.
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ── Scene 3: The 3 Steps ── */
function SceneSteps() {
  const steps = [
    {
      num: "01",
      title: "Open Broker Account",
      desc: "Free. 5 minutes. Your foundation.",
      accent: "#22C55E",
    },
    {
      num: "02",
      title: "Unlock the System",
      desc: "$250. Fibonacci framework. Lifetime access.",
      accent: GOLD,
    },
    {
      num: "03",
      title: "Managed Execution",
      desc: "$1,500. Done-for-you. Premium tier.",
      accent: GOLD_LIGHT,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <FadeIn>
        <p
          style={{
            fontSize: 20,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Three Steps. One System.
        </p>
      </FadeIn>
      <FadeIn delay={8}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          Follow the sequence.{" "}
          <span style={{ color: SUBTLE }}>Skip nothing.</span>
        </h2>
      </FadeIn>
      <div style={{ display: "flex", gap: 40, width: "100%" }}>
        {steps.map((step, i) => (
          <FadeIn key={step.num} delay={18 + i * 12}>
            <div
              style={{
                flex: 1,
                background: PANEL,
                borderRadius: 20,
                padding: 48,
                border: "1px solid #1E1E1E",
                minWidth: 340,
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: step.accent,
                  opacity: 0.35,
                  lineHeight: 1,
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: TEXT,
                  marginTop: 16,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 18,
                  color: MUTED,
                  marginTop: 12,
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 4: Why This Order ── */
function SceneWhyOrder() {
  return (
    <AbsoluteFill
      style={{
        background: ELEVATED,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
        flexDirection: "column",
      }}
    >
      <FadeIn>
        <p
          style={{
            fontSize: 20,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Why This Order
        </p>
      </FadeIn>
      <FadeIn delay={10}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          The sequence is{" "}
          <span style={{ color: GOLD }}>the system.</span>
        </h2>
      </FadeIn>
      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: 48,
          maxWidth: 1100,
        }}
      >
        {[
          ["Broker creates commitment", "Your trading infrastructure is live and ready."],
          ["Course creates understanding", "You know the Fibonacci methodology inside out."],
          ["Management compounds results", "Professionals execute what you now fully understand."],
        ].map(([title, desc], i) => (
          <FadeIn key={title} delay={20 + i * 10}>
            <div
              style={{
                flex: 1,
                background: PANEL,
                borderRadius: 16,
                padding: 40,
                border: "1px solid #1E1E1E",
                minWidth: 300,
              }}
            >
              <h3 style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>
                {title}
              </h3>
              <p
                style={{
                  fontSize: 17,
                  color: MUTED,
                  marginTop: 12,
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 5: Results ── */
function SceneResults() {
  const frame = useCurrentFrame();
  const stats = [
    { label: "Trades Executed", value: "847+" },
    { label: "Avg. Growth", value: "34.8%" },
    { label: "Risk/Reward", value: "1:2.4" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
        flexDirection: "column",
      }}
    >
      <FadeIn>
        <p
          style={{
            fontSize: 20,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Live System Results
        </p>
      </FadeIn>
      <FadeIn delay={10}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            marginBottom: 56,
          }}
        >
          Real metrics.{" "}
          <span style={{ color: SUBTLE }}>Not promises.</span>
        </h2>
      </FadeIn>
      <div style={{ display: "flex", gap: 48 }}>
        {stats.map((s, i) => {
          const progress = interpolate(frame - (20 + i * 8), [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={s.label}
              style={{
                opacity: progress,
                transform: `translateY(${(1 - progress) * 30}px)`,
                textAlign: "center",
                minWidth: 250,
              }}
            >
              <p
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  color: TEXT,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: 16,
                  color: SUBTLE,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 6: CTA ── */
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - 10, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 100,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: GOLD,
          opacity: 0.05,
          filter: "blur(160px)",
          top: "30%",
        }}
      />
      <FadeIn>
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
          Your Next Step
        </p>
      </FadeIn>
      <FadeIn delay={10}>
        <h2
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.1,
            position: "relative",
          }}
        >
          The system is ready.
          <br />
          <span style={{ color: GOLD }}>Are you?</span>
        </h2>
      </FadeIn>
      <FadeIn delay={25}>
        <div
          style={{
            marginTop: 48,
            transform: `scale(${scale})`,
            background: GOLD,
            borderRadius: 20,
            padding: "24px 64px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 4px 24px rgba(201,168,78,0.3)",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Start Free — Open Broker
          </span>
          <span style={{ fontSize: 22, color: "white" }}>{"\u2192"}</span>
        </div>
      </FadeIn>
      <FadeIn delay={40}>
        <p
          style={{
            marginTop: 32,
            fontSize: 18,
            color: SUBTLE,
            textAlign: "center",
            position: "relative",
          }}
        >
          phimindflow.com
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ── Main composition ── */
export const PhimindflowVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sequence from={0} durationInFrames={75}>
        <SceneTitle />
      </Sequence>
      <Sequence from={75} durationInFrames={75}>
        <SceneProblem />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <SceneSteps />
      </Sequence>
      <Sequence from={240} durationInFrames={75}>
        <SceneWhyOrder />
      </Sequence>
      <Sequence from={315} durationInFrames={60}>
        <SceneResults />
      </Sequence>
      <Sequence from={375} durationInFrames={75}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
