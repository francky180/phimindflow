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
const DARK = "#0A0A0A";
const BG = "#FAFAFA";
const MUTED = "#4A4A4A";
const LIGHT_GOLD = "rgba(201,168,78,0.1)";

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
        background: "white",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: LIGHT_GOLD,
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
            background: `linear-gradient(135deg, #B8972F, ${GOLD}, #D4B96A)`,
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
        background: BG,
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
            color: DARK,
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
      color: "#22C55E",
    },
    {
      num: "02",
      title: "Get Started",
      desc: "Starter tier. Fibonacci framework. Full access.",
      color: GOLD,
    },
    {
      num: "03",
      title: "Go Pro",
      desc: "Premium tier. Done-for-you execution.",
      color: "#D4B96A",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "white",
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
            color: DARK,
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          Follow the sequence.{" "}
          <span style={{ color: "#8A8A8A" }}>Skip nothing.</span>
        </h2>
      </FadeIn>
      <div style={{ display: "flex", gap: 40, width: "100%" }}>
        {steps.map((step, i) => (
          <FadeIn key={step.num} delay={18 + i * 12}>
            <div
              style={{
                flex: 1,
                background: BG,
                borderRadius: 20,
                padding: 48,
                border: "1px solid #EAEAEA",
                minWidth: 340,
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: step.color,
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
                  color: DARK,
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
        background: BG,
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
            color: DARK,
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
                background: "white",
                borderRadius: 16,
                padding: 40,
                border: "1px solid #EAEAEA",
                minWidth: 300,
              }}
            >
              <h3 style={{ fontSize: 22, fontWeight: 700, color: DARK }}>
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
        background: "white",
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
            color: DARK,
            textAlign: "center",
            marginBottom: 56,
          }}
        >
          Real metrics.{" "}
          <span style={{ color: "#8A8A8A" }}>Not promises.</span>
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
                  color: DARK,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: 16,
                  color: "#8A8A8A",
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
        background: "white",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
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
            marginBottom: 24,
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
            color: DARK,
            textAlign: "center",
            lineHeight: 1.1,
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
            color: MUTED,
            textAlign: "center",
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
