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
const PANEL = "#111111";
const TEXT = "#F5F5F5";
const MUTED = "#A0A0A0";
const GREEN = "#22C55E";
const RED = "#EF4444";

export const COMMENT_YES_DURATION = 600; // 20s at 30fps

function FadeIn({
  children,
  delay = 0,
  distance = 40,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, 15], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
}

/* ── Scene 1: Hook (0-4s = 0-120 frames) ── */
function SceneHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - 5, fps, config: { damping: 12 } });

  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.04, 0.12],
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
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: GOLD,
          opacity: glowPulse,
          filter: "blur(180px)",
        }}
      />
      <FadeIn>
        <p
          style={{
            fontSize: 26,
            color: MUTED,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Your 9-to-5 pays the bills.
        </p>
      </FadeIn>
      <FadeIn delay={18}>
        <h1
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.1,
            marginTop: 24,
            transform: `scale(${scale})`,
          }}
        >
          This pays the
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, #B8972F, ${GOLD}, ${GOLD_LIGHT})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            freedom.
          </span>
        </h1>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ── Scene 2: Problem (4-8s = 120-240 frames) ── */
function SceneProblem() {
  const frame = useCurrentFrame();

  const problems = [
    { text: "Chasing signals", x: 140 },
    { text: "Guessing entries", x: 460 },
    { text: "Emotional trades", x: 780 },
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
      <FadeIn>
        <p
          style={{
            fontSize: 24,
            color: RED,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 48,
          }}
        >
          Why most traders lose
        </p>
      </FadeIn>

      {problems.map((p, i) => {
        const op = interpolate(frame - (12 + i * 14), [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const strikeW = interpolate(frame - (24 + i * 14), [0, 15], [0, 100], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              opacity: op,
              marginBottom: 36,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: TEXT,
                opacity: 0.5,
              }}
            >
              {p.text}
            </span>
            <div
              style={{
                position: "absolute",
                left: "10%",
                top: "50%",
                height: 4,
                width: `${strikeW}%`,
                maxWidth: "80%",
                background: RED,
                borderRadius: 2,
              }}
            />
          </div>
        );
      })}

      <FadeIn delay={60}>
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: GOLD,
            marginTop: 48,
            textAlign: "center",
          }}
        >
          There's a better way.
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ── Scene 3: The System (8-14s = 240-420 frames) ── */
function SceneSystem() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { label: "Avg Monthly Growth", value: "34.8%", color: GREEN },
    { label: "Trades Executed", value: "847+", color: GOLD },
    { label: "Risk / Reward", value: "1 : 2.4", color: GOLD_LIGHT },
  ];

  const lineProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pathLen = 600;

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
      <FadeIn>
        <p
          style={{
            fontSize: 22,
            color: GOLD,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          The Fibonacci Growth System
        </p>
      </FadeIn>
      <FadeIn delay={8}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Math. Not emotion.
        </h2>
      </FadeIn>

      {/* Mini chart */}
      <FadeIn delay={14}>
        <svg width="800" height="280" viewBox="0 0 800 280">
          {/* Grid lines */}
          {[70, 140, 210].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="800"
              y2={y}
              stroke="#1a1a1a"
              strokeWidth="1"
            />
          ))}
          {/* Fib levels */}
          {[
            { y: 85, label: "0.236" },
            { y: 145, label: "0.382" },
            { y: 190, label: "0.618" },
          ].map((lv) => {
            const op = interpolate(frame - 20, [0, 15], [0, 0.5], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <React.Fragment key={lv.label}>
                <line
                  x1="0"
                  y1={lv.y}
                  x2="800"
                  y2={lv.y}
                  stroke={GOLD}
                  strokeWidth="1"
                  strokeDasharray="8,6"
                  opacity={op}
                />
                <text
                  x="810"
                  y={lv.y + 5}
                  fill={GOLD}
                  fontSize="16"
                  fontFamily="monospace"
                  opacity={op}
                >
                  {lv.label}
                </text>
              </React.Fragment>
            );
          })}
          {/* Growth line */}
          <path
            d="M 20 250 L 100 230 L 180 240 L 260 200 L 340 210 L 400 160 L 480 170 L 540 120 L 620 100 L 700 60 L 780 30"
            stroke={GOLD}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen * (1 - lineProgress)}
          />
        </svg>
      </FadeIn>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: 48,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {stats.map((s, i) => (
          <FadeIn key={s.label} delay={40 + i * 10} distance={30}>
            <div
              style={{
                background: PANEL,
                borderRadius: 20,
                padding: "32px 36px",
                border: "1px solid #1E1E1E",
                textAlign: "center",
                minWidth: 220,
              }}
            >
              <p
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: s.color,
                  marginBottom: 8,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: 16,
                  color: MUTED,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 4: Pricing (14-17s = 420-510 frames) ── */
function ScenePricing() {
  const frame = useCurrentFrame();

  const tiers = [
    {
      step: "01",
      title: "Open Broker",
      price: "FREE",
      desc: "5 minutes to start",
      accent: GREEN,
    },
    {
      step: "02",
      title: "The Course",
      price: "$250",
      desc: "Lifetime Telegram access",
      accent: GOLD,
    },
    {
      step: "03",
      title: "Premium Mgmt",
      price: "$1,500",
      desc: "Done for you",
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
        padding: 80,
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
            marginBottom: 48,
          }}
        >
          Your path
        </p>
      </FadeIn>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
          maxWidth: 820,
        }}
      >
        {tiers.map((t, i) => (
          <FadeIn key={t.step} delay={10 + i * 12} distance={35}>
            <div
              style={{
                background: PANEL,
                borderRadius: 22,
                padding: "36px 44px",
                border: `1px solid ${i === 1 ? "rgba(201,168,78,0.3)" : "#1E1E1E"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: t.accent,
                    opacity: 0.35,
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 70,
                  }}
                >
                  {t.step}
                </span>
                <div>
                  <h3
                    style={{ fontSize: 30, fontWeight: 700, color: TEXT }}
                  >
                    {t.title}
                  </h3>
                  <p style={{ fontSize: 18, color: MUTED, marginTop: 4 }}>
                    {t.desc}
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: t.accent,
                }}
              >
                {t.price}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 5: CTA — Comment YES (17-20s = 510-600 frames) ── */
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnScale = spring({ frame: frame - 20, fps, config: { damping: 10 } });

  const pulseOpacity = interpolate(
    Math.sin((frame - 30) * 0.12),
    [-1, 1],
    [0.1, 0.3],
  );

  const arrowBounce = interpolate(
    Math.sin(frame * 0.2),
    [-1, 1],
    [-8, 8],
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

      <FadeIn>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "rgba(201,168,78,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 700,
            color: GOLD,
            fontFamily: "serif",
            marginBottom: 36,
          }}
        >
          {"\u03C6"}
        </div>
      </FadeIn>

      <FadeIn delay={6}>
        <h2
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.15,
            position: "relative",
          }}
        >
          Want the link?
        </h2>
      </FadeIn>

      <FadeIn delay={16}>
        <div
          style={{
            marginTop: 48,
            transform: `scale(${btnScale})`,
            background: GOLD,
            borderRadius: 22,
            padding: "26px 64px",
            boxShadow: "0 4px 32px rgba(201,168,78,0.35)",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "white",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Comment YES
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={26}>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 48,
              transform: `translateY(${arrowBounce}px)`,
            }}
          >
            👇
          </span>
          <p
            style={{
              marginTop: 24,
              fontSize: 18,
              color: MUTED,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            phimindflow.com
          </p>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ── Main Composition ── */
export const CommentYesReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sequence from={0} durationInFrames={120}>
        <SceneHook />
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <SceneProblem />
      </Sequence>
      <Sequence from={240} durationInFrames={180}>
        <SceneSystem />
      </Sequence>
      <Sequence from={420} durationInFrames={90}>
        <ScenePricing />
      </Sequence>
      <Sequence from={510} durationInFrames={90}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
