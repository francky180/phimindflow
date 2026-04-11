import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const PURPLE = "#D701C8";
const PURPLE_DIM = "rgba(215,1,200,0.10)";
const DARK = "#0A0A0A";
const PANEL = "#131313";
const TEXT = "#F5F5F5";
const MUTED = "#999999";
const SUBTLE = "#555555";
const RED = "#EF4444";
const GREEN = "#22C55E";
const YELLOW = "#F59E0B";

function Fade({
  children,
  delay = 0,
  duration = 20,
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
  const y = interpolate(frame - delay, [0, duration], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
}

function Glow({ top = "40%", size = 500, color = PURPLE }: { top?: string; size?: number; color?: string }) {
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
        background: color,
        opacity: 0.06,
        filter: "blur(160px)",
        pointerEvents: "none",
      }}
    />
  );
}

function ScoreBar({ score, width = 300 }: { score: number; width?: number }) {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [0, 40], [0, score], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const color = score >= 70 ? GREEN : score >= 50 ? YELLOW : RED;
  return (
    <div style={{ width, height: 10, background: "#1E1E1E", borderRadius: 5, overflow: "hidden" }}>
      <div
        style={{
          width: `${fill}%`,
          height: "100%",
          background: color,
          borderRadius: 5,
          transition: "width 0.1s",
        }}
      />
    </div>
  );
}

/* ── Scene 1: Title Card ── */
function SceneTitle() {
  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Glow size={600} />
      <Fade>
        <p
          style={{
            fontSize: 20,
            color: PURPLE,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Marketing Audit Report
        </p>
      </Fade>
      <Fade delay={10}>
        <h1
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.08,
          }}
        >
          EPIK Studios
        </h1>
      </Fade>
      <Fade delay={20}>
        <p
          style={{
            marginTop: 20,
            fontSize: 24,
            color: MUTED,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Real Estate Media Production — Florida
        </p>
      </Fade>
      <Fade delay={32}>
        <p style={{ marginTop: 32, fontSize: 16, color: SUBTLE }}>
          April 2026
        </p>
      </Fade>
    </AbsoluteFill>
  );
}

/* ── Scene 2: Overall Score ── */
function SceneOverallScore() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scoreNum = interpolate(frame, [10, 50], [0, 42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = spring({ frame: frame - 5, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Glow top="45%" size={550} />
      <Fade>
        <p
          style={{
            fontSize: 18,
            color: PURPLE,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Overall Marketing Score
        </p>
      </Fade>
      <div
        style={{
          transform: `scale(${scale})`,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 140,
            fontWeight: 800,
            color: RED,
            lineHeight: 1,
          }}
        >
          {Math.round(scoreNum)}
        </span>
        <span style={{ fontSize: 48, fontWeight: 600, color: SUBTLE }}>
          / 100
        </span>
      </div>
      <Fade delay={40}>
        <div
          style={{
            marginTop: 20,
            background: "rgba(239,68,68,0.15)",
            borderRadius: 12,
            padding: "12px 32px",
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 700, color: RED }}>
            Grade: D — Below Average
          </span>
        </div>
      </Fade>
      <Fade delay={55}>
        <p
          style={{
            marginTop: 28,
            fontSize: 18,
            color: MUTED,
            textAlign: "center",
            maxWidth: 650,
            lineHeight: 1.6,
          }}
        >
          Strong product, weak go-to-market execution
        </p>
      </Fade>
    </AbsoluteFill>
  );
}

/* ── Scene 3: Score Breakdown ── */
function SceneBreakdown() {
  const scores = [
    { label: "Content & Messaging", score: 50, weight: "25%" },
    { label: "Conversion Optimization", score: 31, weight: "20%" },
    { label: "SEO & Discoverability", score: 19, weight: "20%" },
    { label: "Competitive Positioning", score: 52, weight: "15%" },
    { label: "Brand & Trust", score: 55, weight: "10%" },
    { label: "Growth & Strategy", score: 60, weight: "10%" },
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
      <Fade>
        <h2
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: TEXT,
            marginBottom: 48,
          }}
        >
          Score Breakdown
        </h2>
      </Fade>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 750 }}>
        {scores.map((s, i) => (
          <Fade key={s.label} delay={10 + i * 8}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span
                style={{
                  fontSize: 18,
                  color: MUTED,
                  width: 250,
                  textAlign: "right",
                }}
              >
                {s.label}
              </span>
              <ScoreBar score={s.score} width={320} />
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: s.score >= 50 ? YELLOW : RED,
                  width: 60,
                }}
              >
                {s.score}
              </span>
            </div>
          </Fade>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 4: Critical Issues ── */
function SceneCritical() {
  const issues = [
    { icon: "!", text: '"Click Me!" placeholder CTA is live on production', color: RED },
    { icon: "!", text: "Site renders ZERO HTML to search engines", color: RED },
    { icon: "!", text: "No lead capture forms anywhere on the page", color: RED },
    { icon: "!", text: "4.8 star claim links to nothing verifiable", color: YELLOW },
    { icon: "!", text: "No pricing shown — agents comparison-shop", color: YELLOW },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#0E0E0E",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <Fade>
        <h2
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: TEXT,
            marginBottom: 50,
          }}
        >
          Critical Issues Found
        </h2>
      </Fade>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {issues.map((item, i) => (
          <Fade key={i} delay={12 + i * 10}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: PANEL,
                borderRadius: 14,
                padding: "18px 32px",
                borderLeft: `4px solid ${item.color}`,
                minWidth: 700,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: item.color,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `${item.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </span>
              <span style={{ fontSize: 20, color: TEXT }}>{item.text}</span>
            </div>
          </Fade>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 5: Strengths ── */
function SceneStrengths() {
  const strengths = [
    "Mobile app + Aryeo portal = real retention moat",
    "Branded listing websites for each property",
    "Full service stack: photo, video, 3D, reels, drone",
    "24-48hr turnaround matches national competitors",
    "Personal branding service is a smart adjacent play",
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
      <Glow top="50%" color={GREEN} size={400} />
      <Fade>
        <h2
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: TEXT,
            marginBottom: 50,
          }}
        >
          What's <span style={{ color: GREEN }}>Working</span>
        </h2>
      </Fade>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {strengths.map((s, i) => (
          <Fade key={i} delay={10 + i * 8}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 20, color: GREEN, fontWeight: 700 }}>
                {"\u2713"}
              </span>
              <span style={{ fontSize: 20, color: MUTED }}>{s}</span>
            </div>
          </Fade>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 6: Quick Wins ── */
function SceneQuickWins() {
  const wins = [
    { num: "01", text: 'Replace "Click Me!" with "Book Your Shoot"', impact: "+10-15% conversions" },
    { num: "02", text: "Write meta description (currently empty)", impact: "+CTR from search" },
    { num: "03", text: "Link 4.8 star rating to Google reviews", impact: "+trust near CTAs" },
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
            color: PURPLE,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Implement This Week
        </p>
      </Fade>
      <Fade delay={8}>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: TEXT,
            marginBottom: 48,
          }}
        >
          Top 3 Quick Wins
        </h2>
      </Fade>
      <div style={{ display: "flex", gap: 28, width: "100%" }}>
        {wins.map((w, i) => (
          <Fade key={w.num} delay={18 + i * 12}>
            <div
              style={{
                flex: 1,
                background: PANEL,
                borderRadius: 20,
                padding: 36,
                border: "1px solid #1E1E1E",
                minWidth: 300,
              }}
            >
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: PURPLE,
                  opacity: 0.35,
                  lineHeight: 1,
                }}
              >
                {w.num}
              </span>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: TEXT,
                  marginTop: 14,
                  lineHeight: 1.3,
                }}
              >
                {w.text}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: GREEN,
                  marginTop: 12,
                  fontWeight: 600,
                }}
              >
                {w.impact}
              </p>
            </div>
          </Fade>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ── Scene 7: Revenue Impact ── */
function SceneRevenue() {
  const frame = useCurrentFrame();
  const low = interpolate(frame, [10, 45], [0, 4000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const high = interpolate(frame, [10, 45], [0, 12000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0E0E0E",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Glow top="45%" size={500} color={GREEN} />
      <Fade>
        <p
          style={{
            fontSize: 18,
            color: GREEN,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Estimated Revenue Impact
        </p>
      </Fade>
      <Fade delay={8}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontSize: 72, fontWeight: 800, color: TEXT }}>
            ${Math.round(low / 1000)}K
          </span>
          <span style={{ fontSize: 36, color: SUBTLE, fontWeight: 600 }}>to</span>
          <span style={{ fontSize: 72, fontWeight: 800, color: GREEN }}>
            ${Math.round(high / 1000)}K
          </span>
        </div>
      </Fade>
      <Fade delay={30}>
        <p style={{ marginTop: 12, fontSize: 24, color: MUTED }}>
          per month — from all recommendations
        </p>
      </Fade>
      <Fade delay={45}>
        <p style={{ marginTop: 32, fontSize: 16, color: SUBTLE }}>
          Conservative to aggressive estimate over 3-6 months
        </p>
      </Fade>
    </AbsoluteFill>
  );
}

/* ── Scene 8: CTA ── */
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnScale = spring({ frame: frame - 20, fps, config: { damping: 12 } });

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
            fontSize: 18,
            color: PURPLE,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Next Steps
        </p>
      </Fade>
      <Fade delay={10}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.12,
            maxWidth: 800,
          }}
        >
          Fix the foundation.
          <br />
          <span style={{ color: PURPLE }}>Unlock the growth.</span>
        </h2>
      </Fade>
      <Fade delay={28}>
        <div
          style={{
            marginTop: 44,
            transform: `scale(${btnScale})`,
            background: `linear-gradient(135deg, ${PURPLE}, #A001C8)`,
            borderRadius: 20,
            padding: "20px 52px",
            boxShadow: "0 4px 28px rgba(215,1,200,0.3)",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Full Report: MARKETING-AUDIT.md
          </span>
        </div>
      </Fade>
      <Fade delay={42}>
        <p style={{ marginTop: 28, fontSize: 16, color: SUBTLE }}>
          AI Marketing Suite — /market audit
        </p>
      </Fade>
    </AbsoluteFill>
  );
}

/* ── Main Composition ── */
export const EpikAuditVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sequence from={0} durationInFrames={90}>
        <SceneTitle />
      </Sequence>
      <Sequence from={90} durationInFrames={105}>
        <SceneOverallScore />
      </Sequence>
      <Sequence from={195} durationInFrames={105}>
        <SceneBreakdown />
      </Sequence>
      <Sequence from={300} durationInFrames={105}>
        <SceneCritical />
      </Sequence>
      <Sequence from={405} durationInFrames={90}>
        <SceneStrengths />
      </Sequence>
      <Sequence from={495} durationInFrames={105}>
        <SceneQuickWins />
      </Sequence>
      <Sequence from={600} durationInFrames={90}>
        <SceneRevenue />
      </Sequence>
      <Sequence from={690} durationInFrames={90}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
