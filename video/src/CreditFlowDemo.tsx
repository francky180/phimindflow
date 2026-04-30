import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";

// ─── Tokens ───────────────────────────────────────────────────────────
const BG = "#0a0a0e";
const BG_ELEV = "#13131a";
const WHITE = "#ffffff";
const MUTED = "#9a9aa6";
const GOLD = "#e4b64c";
const ACCENT = "#00e5a0";

const FPS = 30;

// ─── Scene plan ───────────────────────────────────────────────────────
type Scene = {
  id: string;
  duration: number;
  kicker: string;
  caption: string;
  image?: string; // public path (under credit-flow/)
};

const SCENES: Scene[] = [
  { id: "title",     duration: 90,  kicker: "PHIMINDFLOW",        caption: "Credit Restoration · Live Walkthrough" },
  { id: "landing",   duration: 90,  kicker: "01 · MARKETING",      caption: "Fix Your Credit. Unlock Capital.", image: "01-landing.png" },
  { id: "signup",    duration: 75,  kicker: "02 · START FREE",      caption: "Sign up in 60 seconds — no card required.", image: "02-signup.png" },
  { id: "filled",    duration: 75,  kicker: "02 · START FREE",      caption: "Name. Email. Password. That's it.", image: "03-signup-filled.png" },
  { id: "dashboard", duration: 90,  kicker: "03 · DASHBOARD",       caption: "Your private credit command center.", image: "04-dashboard.png" },
  { id: "scores",    duration: 90,  kicker: "04 · SCORES",          caption: "Track all 3 bureaus over time.", image: "05-scores.png" },
  { id: "items",     duration: 90,  kicker: "05 · NEGATIVE ITEMS",  caption: "Log every collection, late, or charge-off.", image: "06-items.png" },
  { id: "disputes",  duration: 90,  kicker: "06 · DISPUTE LETTERS", caption: "FCRA-compliant dispute letters in one click.", image: "07-disputes.png" },
  { id: "send",      duration: 90,  kicker: "07 · SEND",            caption: "Mail certified to all 3 bureaus from the dashboard.", image: "08-send.png" },
  { id: "letters",   duration: 90,  kicker: "07 · SEND",            caption: "Saved letters → certified mail. ~$7.93 each.", image: "08b-send-letters.png" },
  { id: "submitted", duration: 130, kicker: "✓ MAIL SUBMITTED",     caption: "USPS tracking issued · LetterStream API · Test Mode.", image: "09-send-success.png" },
  { id: "outro",     duration: 90,  kicker: "PHIMINDFLOW",          caption: "phimindflow.com/credit · Built 2026" },
];

export const CREDIT_FLOW_DURATION = SCENES.reduce((a, s) => a + s.duration, 0);

// ─── Helpers ──────────────────────────────────────────────────────────
const useFade = (start: number, end: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// ─── Frame chrome (kicker + caption) ──────────────────────────────────
const Kicker: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const o = useFade(2, 14);
  return (
    <div style={{
      position: "absolute", top: 56, left: 80,
      color: accent, fontSize: 22, fontWeight: 700,
      letterSpacing: 4, textTransform: "uppercase",
      opacity: o,
    }}>{text}</div>
  );
};

const Caption: React.FC<{ text: string; duration: number }> = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [10, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [duration - 16, duration - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = Math.min(fadeIn, fadeOut);
  const ty = interpolate(frame, [10, 24], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", left: 80, right: 80, bottom: 70,
      background: "rgba(15, 15, 22, 0.85)",
      border: `1px solid rgba(228, 182, 76, 0.25)`,
      borderRadius: 14,
      padding: "22px 36px",
      color: WHITE, fontSize: 30, fontWeight: 500, lineHeight: 1.4,
      opacity: o, transform: `translateY(${ty}px)`,
      textAlign: "center",
      backdropFilter: "blur(10px)",
      boxShadow: "0 8px 36px rgba(0,0,0,0.55)",
    }}>{text}</div>
  );
};

// ─── Title scene (no image) ───────────────────────────────────────────
const TitleScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const titleO = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subO = interpolate(frame, [22, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(frame, [10, 30], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [duration - 14, duration - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 40%, ${BG_ELEV} 0%, ${BG} 70%)`,
      alignItems: "center", justifyContent: "center", flexDirection: "column",
      opacity: fadeOut,
    }}>
      <div style={{
        color: GOLD, fontSize: 22, fontWeight: 700, letterSpacing: 6,
        textTransform: "uppercase", marginBottom: 28,
        opacity: titleO,
      }}>φ  PHIMINDFLOW</div>
      <div style={{
        color: WHITE, fontSize: 92, fontWeight: 800, letterSpacing: -2,
        textAlign: "center", maxWidth: 1500, lineHeight: 1.05,
        opacity: titleO, transform: `translateY(${ty}px)`,
      }}>
        Fix Your Credit.<br/>
        <span style={{ color: GOLD }}>Unlock Capital.</span>
      </div>
      <div style={{
        color: MUTED, fontSize: 28, fontWeight: 400, marginTop: 36,
        opacity: subO, letterSpacing: 1,
      }}>A live walkthrough · signup → certified mail in under 2 minutes</div>
    </AbsoluteFill>
  );
};

// ─── Outro scene (no image) ───────────────────────────────────────────
const OutroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const o1 = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o2 = interpolate(frame, [18, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o3 = interpolate(frame, [32, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [duration - 14, duration - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 50%, ${BG_ELEV} 0%, ${BG} 80%)`,
      alignItems: "center", justifyContent: "center", flexDirection: "column",
      opacity: fadeOut,
    }}>
      <div style={{
        color: ACCENT, fontSize: 24, fontWeight: 700, letterSpacing: 8,
        textTransform: "uppercase", opacity: o1,
      }}>Live in Production</div>
      <div style={{
        color: WHITE, fontSize: 78, fontWeight: 800, letterSpacing: -1,
        marginTop: 30, opacity: o2, textAlign: "center",
      }}>phimindflow.com<span style={{ color: GOLD }}>/credit</span></div>
      <div style={{
        color: MUTED, fontSize: 24, marginTop: 36, opacity: o3,
        display: "flex", gap: 28, alignItems: "center",
      }}>
        <span>FCRA · Metro 2</span>
        <span style={{ width: 4, height: 4, borderRadius: 2, background: MUTED }} />
        <span>LetterStream API</span>
        <span style={{ width: 4, height: 4, borderRadius: 2, background: MUTED }} />
        <span>USPS Certified Mail</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Screen (image-centric) scene ─────────────────────────────────────
const ScreenScene: React.FC<{
  scene: Scene;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [scene.duration - 14, scene.duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = Math.min(fadeIn, fadeOut);

  // Subtle Ken Burns: scale 1 → 1.03 over scene
  const scale = interpolate(frame, [0, scene.duration], [1, 1.03], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Use accent gold by default; mail-submitted scene uses green
  const accent = scene.id === "submitted" ? ACCENT : GOLD;

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 35%, ${scene.id === "submitted" ? "rgba(0,229,160,0.12)" : "rgba(228,182,76,0.08)"} 0%, transparent 60%)`,
      }} />

      <Kicker text={scene.kicker} accent={accent} />

      {/* Image frame */}
      <div style={{
        position: "absolute", top: 130, left: 80, right: 80, bottom: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: o,
      }}>
        <div style={{
          position: "relative",
          maxWidth: "100%", maxHeight: "100%",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${accent}33`,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}>
          {scene.image && (
            <Img
              src={staticFile(`credit-flow/${scene.image}`)}
              style={{ display: "block", maxWidth: "100%", maxHeight: "750px", objectFit: "contain" }}
            />
          )}
        </div>
      </div>

      <Caption text={scene.caption} duration={scene.duration} />
    </AbsoluteFill>
  );
};

// ─── Composition ──────────────────────────────────────────────────────
export const CreditFlowDemo: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Inter, -apple-system, sans-serif" }}>
      {SCENES.map((scene) => {
        const seq = (
          <Sequence key={scene.id} from={from} durationInFrames={scene.duration} name={scene.id}>
            {scene.id === "title" ? (
              <TitleScene duration={scene.duration} />
            ) : scene.id === "outro" ? (
              <OutroScene duration={scene.duration} />
            ) : (
              <ScreenScene scene={scene} />
            )}
          </Sequence>
        );
        from += scene.duration;
        return seq;
      })}
    </AbsoluteFill>
  );
};
