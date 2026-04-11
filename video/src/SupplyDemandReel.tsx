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
const TEXT = "#F5F5F5";
const MUTED = "#A0A0A0";
const SUBTLE = "#666666";
const RED = "#E74C3C";
const GREEN = "#22C55E";

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
  const scale = spring({ frame: frame - 5, fps, config: { damping: 14 } });

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
          opacity: 0.05,
          filter: "blur(200px)",
        }}
      />
      <FadeSlide>
        <p
          style={{
            fontSize: 26,
            color: GOLD,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Where Big Money Trades
        </p>
      </FadeSlide>
      <FadeSlide delay={12}>
        <h1
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.1,
            marginTop: 32,
            transform: `scale(${scale})`,
          }}
        >
          Supply &
          <br />
          <span style={{ color: GOLD }}>Demand</span>
        </h1>
      </FadeSlide>
      <FadeSlide delay={24}>
        <p
          style={{
            fontSize: 24,
            color: MUTED,
            textAlign: "center",
            marginTop: 28,
          }}
        >
          Know where to enter. Every time.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
}

/* ── Scene 2: Supply Zone ── */
function SceneSupply() {
  const frame = useCurrentFrame();

  const zoneWidth = interpolate(frame - 10, [0, 20], [0, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
            fontSize: 22,
            color: RED,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          Supply Zone
        </p>
      </FadeSlide>
      <FadeSlide delay={8}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 48,
          }}
        >
          Where sellers
          <br />
          <span style={{ color: RED }}>overwhelm buyers.</span>
        </h2>
      </FadeSlide>

      {/* Animated supply zone box */}
      <div
        style={{
          width: zoneWidth,
          height: 90,
          background: "rgba(231,76,60,0.08)",
          border: "2px dashed rgba(231,76,60,0.4)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {frame > 25 && (
          <svg width="700" height="80" viewBox="0 0 700 80">
            {/* Bearish candles falling from supply */}
            {[0, 1, 2, 3, 4].map((i) => {
              const op = interpolate(frame - (28 + i * 5), [0, 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const x = 100 + i * 120;
              return (
                <React.Fragment key={i}>
                  <line x1={x} y1={10} x2={x} y2={70} stroke={RED} strokeWidth="2" opacity={op} />
                  <rect x={x - 8} y={15 + i * 3} width="16" height={40 - i * 2} fill={RED} rx="2" opacity={op} />
                </React.Fragment>
              );
            })}
          </svg>
        )}
      </div>

      <FadeSlide delay={50}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40 }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 4 L12 20 M6 14 L12 20 L18 14" stroke={RED} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontSize: 22, color: RED, fontWeight: 600 }}>
            Price drops from this level
          </p>
        </div>
      </FadeSlide>
    </AbsoluteFill>
  );
}

/* ── Scene 3: Demand Zone ── */
function SceneDemand() {
  const frame = useCurrentFrame();

  const zoneWidth = interpolate(frame - 10, [0, 20], [0, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
            fontSize: 22,
            color: GREEN,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          Demand Zone
        </p>
      </FadeSlide>
      <FadeSlide delay={8}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 48,
          }}
        >
          Where buyers
          <br />
          <span style={{ color: GREEN }}>overwhelm sellers.</span>
        </h2>
      </FadeSlide>

      {/* Animated demand zone box */}
      <div
        style={{
          width: zoneWidth,
          height: 90,
          background: "rgba(34,197,94,0.08)",
          border: "2px dashed rgba(34,197,94,0.4)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {frame > 25 && (
          <svg width="700" height="80" viewBox="0 0 700 80">
            {/* Bullish candles rising from demand */}
            {[0, 1, 2, 3, 4].map((i) => {
              const op = interpolate(frame - (28 + i * 5), [0, 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const x = 100 + i * 120;
              return (
                <React.Fragment key={i}>
                  <line x1={x} y1={10} x2={x} y2={70} stroke={GREEN} strokeWidth="2" opacity={op} />
                  <rect x={x - 8} y={55 - i * 8} width="16" height={40 + i * 2} fill={GREEN} rx="2" opacity={op} />
                </React.Fragment>
              );
            })}
          </svg>
        )}
      </div>

      <FadeSlide delay={50}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40 }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 20 L12 4 M6 10 L12 4 L18 10" stroke={GREEN} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontSize: 22, color: GREEN, fontWeight: 600 }}>
            Price rallies from this level
          </p>
        </div>
      </FadeSlide>
    </AbsoluteFill>
  );
}

/* ── Scene 4: Full Chart ── */
function SceneChart() {
  const frame = useCurrentFrame();

  const pathLength = 900;
  const lineProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashOffset = pathLength * (1 - lineProgress);

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <FadeSlide>
        <p
          style={{
            fontSize: 22,
            color: GOLD,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          The Full Picture
        </p>
      </FadeSlide>

      <svg width="960" height="1200" viewBox="0 0 960 1200">
        {/* Supply zone */}
        <rect x="60" y="150" width="840" height="80" fill="rgba(231,76,60,0.08)" rx="4" opacity={interpolate(frame - 8, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <rect x="60" y="150" width="840" height="80" fill="none" stroke={RED} strokeWidth="1.5" strokeDasharray="8,6" opacity={interpolate(frame - 8, [0, 15], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} rx="4" />
        <text x="75" y="175" fill={RED} fontSize="16" fontFamily="Arial" fontWeight="bold" letterSpacing="3" opacity={interpolate(frame - 12, [0, 10], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>SUPPLY</text>

        {/* Demand zone */}
        <rect x="60" y="850" width="840" height="80" fill="rgba(34,197,94,0.08)" rx="4" opacity={interpolate(frame - 8, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <rect x="60" y="850" width="840" height="80" fill="none" stroke={GREEN} strokeWidth="1.5" strokeDasharray="8,6" opacity={interpolate(frame - 8, [0, 15], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} rx="4" />
        <text x="75" y="875" fill={GREEN} fontSize="16" fontFamily="Arial" fontWeight="bold" letterSpacing="3" opacity={interpolate(frame - 12, [0, 10], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>DEMAND</text>

        {/* Animated price line: drop from supply, bounce at demand, rise back */}
        <path
          d="M 100 200 L 180 280 L 240 350 L 300 420 L 350 500 L 400 580 L 430 680 L 450 850 L 480 800 L 530 680 L 580 560 L 640 440 L 700 350 L 760 260 L 820 190"
          stroke={GOLD}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
        />

        {/* SELL arrow at supply */}
        {frame > 20 && (
          <>
            <path d="M 140 170 L 140 250" stroke={RED} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity={interpolate(frame - 20, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <path d="M 133 240 L 140 255 L 147 240" stroke={RED} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(frame - 20, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <text x="155" y="220" fill={RED} fontSize="18" fontFamily="Arial" fontWeight="bold" opacity={interpolate(frame - 22, [0, 10], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>SELL</text>
          </>
        )}

        {/* BUY arrow at demand */}
        {frame > 45 && (
          <>
            <path d="M 470 890 L 470 810" stroke={GREEN} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity={interpolate(frame - 45, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <path d="M 463 820 L 470 805 L 477 820" stroke={GREEN} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(frame - 45, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <text x="485" y="860" fill={GREEN} fontSize="18" fontFamily="Arial" fontWeight="bold" opacity={interpolate(frame - 47, [0, 10], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>BUY</text>
          </>
        )}

        {/* Profit arrow */}
        {frame > 70 && (
          <>
            <path d="M 850 190 L 890 190" stroke={GOLD} strokeWidth="2" strokeDasharray="6,4" opacity={interpolate(frame - 70, [0, 10], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <text x="820" y="170" fill={GOLD} fontSize="16" fontFamily="Arial" fontWeight="bold" opacity={interpolate(frame - 72, [0, 10], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>TARGET</text>
          </>
        )}
      </svg>

      <FadeSlide delay={75}>
        <p
          style={{
            fontSize: 22,
            color: MUTED,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Sell at supply. Buy at demand. Repeat.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
}

/* ── Scene 5: CTA ── */
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnScale = spring({ frame: frame - 18, fps, config: { damping: 12 } });
  const pulseOpacity = interpolate(Math.sin((frame - 30) * 0.15), [-1, 1], [0.15, 0.35]);

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
            fontSize: 58,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.15,
            position: "relative",
          }}
        >
          Stop chasing.
          <br />
          <span style={{ color: GOLD }}>Start positioning.</span>
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
            Link in Bio {"\u2192"}
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

export const SupplyDemandReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>
      <Sequence from={90} durationInFrames={100}>
        <SceneSupply />
      </Sequence>
      <Sequence from={190} durationInFrames={100}>
        <SceneDemand />
      </Sequence>
      <Sequence from={290} durationInFrames={120}>
        <SceneChart />
      </Sequence>
      <Sequence from={410} durationInFrames={100}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
