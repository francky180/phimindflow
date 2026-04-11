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
const TEXT = "#F5F5F5";
const MUTED = "#A0A0A0";
const SUBTLE = "#666666";

function FadeSlide({
  children,
  delay = 0,
  distance = 50,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, 18], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
}

/* ── Scene 1: Hook ── */
function SceneHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 80,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: GOLD,
          opacity: 0.06,
          filter: "blur(200px)",
        }}
      />
      <FadeSlide>
        <p
          style={{
            fontSize: 28,
            color: GOLD,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Stop Guessing.
        </p>
      </FadeSlide>
      <FadeSlide delay={12}>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.1,
            marginTop: 32,
            transform: `scale(${scale})`,
          }}
        >
          Start Using
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, #B8972F, ${GOLD}, ${GOLD_LIGHT})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fibonacci.
          </span>
        </h1>
      </FadeSlide>
    </AbsoluteFill>
  );
}

/* ── Scene 2: Chart + Levels ── */
function SceneChart() {
  const frame = useCurrentFrame();

  const lineProgress = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pathLength = 800;
  const dashOffset = pathLength * (1 - lineProgress);

  const levels = [
    { y: 380, label: "0.236", delay: 20 },
    { y: 520, label: "0.382", delay: 28 },
    { y: 700, label: "0.500", delay: 36 },
    { y: 880, label: "0.618", delay: 44 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <FadeSlide>
        <p
          style={{
            fontSize: 24,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Fibonacci Retracement
        </p>
      </FadeSlide>

      <svg width="900" height="1100" viewBox="0 0 900 1100">
        {/* Grid */}
        {[200, 400, 600, 800, 1000].map((y) => (
          <line
            key={y}
            x1="50"
            y1={y}
            x2="850"
            y2={y}
            stroke="#1a1a1a"
            strokeWidth="1"
          />
        ))}

        {/* Fib levels */}
        {levels.map((level) => {
          const op = interpolate(frame - level.delay, [0, 15], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <React.Fragment key={level.label}>
              <line
                x1="50"
                y1={level.y}
                x2="850"
                y2={level.y}
                stroke={GOLD}
                strokeWidth="1.5"
                strokeDasharray="10,8"
                opacity={op}
              />
              <text
                x="860"
                y={level.y + 6}
                fill={GOLD}
                fontSize="22"
                fontFamily="monospace"
                opacity={op}
              >
                {level.label}
              </text>
            </React.Fragment>
          );
        })}

        {/* Price line */}
        <path
          d="M 80 950 L 180 900 L 260 920 L 340 820 L 420 850 L 480 720 L 560 750 L 620 600 L 700 550 L 760 480 L 820 350"
          stroke={GOLD}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
        />

        {/* Candles */}
        {[
          { x: 260, y: 880, h: 60, color: GOLD },
          { x: 420, y: 800, h: 70, color: "#E74C3C" },
          { x: 560, y: 700, h: 65, color: GOLD },
          { x: 700, y: 520, h: 55, color: GOLD },
          { x: 820, y: 340, h: 50, color: GOLD },
        ].map((c, i) => {
          const candleOp = interpolate(frame - (10 + i * 8), [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <React.Fragment key={i}>
              <line
                x1={c.x}
                y1={c.y - 15}
                x2={c.x}
                y2={c.y + c.h + 15}
                stroke={c.color}
                strokeWidth="2"
                opacity={candleOp}
              />
              <rect
                x={c.x - 8}
                y={c.y}
                width="16"
                height={c.h}
                fill={c.color}
                rx="2"
                opacity={candleOp}
              />
            </React.Fragment>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}

/* ── Scene 3: 3 Steps ── */
function SceneSteps() {
  const steps = [
    { num: "01", title: "Open Broker", desc: "Free. 5 min.", accent: "#22C55E" },
    { num: "02", title: "Learn the System", desc: "Fibonacci framework.", accent: GOLD },
    { num: "03", title: "Premium Mgmt", desc: "Done for you.", accent: GOLD_LIGHT },
  ];

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <FadeSlide>
        <p
          style={{
            fontSize: 24,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          3 Steps. 1 System.
        </p>
      </FadeSlide>
      <FadeSlide delay={8}>
        <h2
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          Follow the sequence.
        </h2>
      </FadeSlide>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          width: "100%",
          maxWidth: 800,
        }}
      >
        {steps.map((step, i) => (
          <FadeSlide key={step.num} delay={16 + i * 10} distance={40}>
            <div
              style={{
                background: PANEL,
                borderRadius: 24,
                padding: "40px 48px",
                border: "1px solid #1E1E1E",
                display: "flex",
                alignItems: "center",
                gap: 36,
              }}
            >
              <span
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: step.accent,
                  opacity: 0.4,
                  fontVariantNumeric: "tabular-nums",
                  minWidth: 80,
                }}
              >
                {step.num}
              </span>
              <div>
                <h3
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 20, color: MUTED, marginTop: 6 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          </FadeSlide>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 4: CTA ── */
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnScale = spring({ frame: frame - 18, fps, config: { damping: 12 } });

  const pulseOpacity = interpolate(
    Math.sin((frame - 30) * 0.15),
    [-1, 1],
    [0.15, 0.35],
  );

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 80,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: GOLD,
          opacity: pulseOpacity,
          filter: "blur(200px)",
        }}
      />
      <FadeSlide>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(201,168,78,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            fontWeight: 700,
            color: GOLD,
            fontFamily: "serif",
            marginBottom: 40,
          }}
        >
          {"\u03C6"}
        </div>
      </FadeSlide>
      <FadeSlide delay={8}>
        <h2
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.1,
            position: "relative",
          }}
        >
          The system
          <br />
          is ready.
          <br />
          <span style={{ color: GOLD }}>Are you?</span>
        </h2>
      </FadeSlide>
      <FadeSlide delay={20}>
        <div
          style={{
            marginTop: 56,
            transform: `scale(${btnScale})`,
            background: GOLD,
            borderRadius: 24,
            padding: "28px 72px",
            boxShadow: "0 4px 32px rgba(201,168,78,0.35)",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Link in Bio →
          </span>
        </div>
      </FadeSlide>
      <FadeSlide delay={30}>
        <p
          style={{
            marginTop: 40,
            fontSize: 22,
            color: SUBTLE,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          phimindflow.com
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
}

/* ── Main Reel Composition ── */
export const InstaReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>
      <Sequence from={90} durationInFrames={120}>
        <SceneChart />
      </Sequence>
      <Sequence from={210} durationInFrames={120}>
        <SceneSteps />
      </Sequence>
      <Sequence from={330} durationInFrames={120}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
