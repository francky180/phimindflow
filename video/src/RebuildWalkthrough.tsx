import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

/* ═══════════════════════════════════════════════════════════════
   REBUILD FROM ZERO — full walkthrough video (v2)
   Real Windows PowerShell + Mac Terminal + Termux styling
   Includes the auto-rebuild prompt (paste-in-Claude) flow
   1920×1080 @ 30fps · ~2:20 total
   ═══════════════════════════════════════════════════════════════ */

/* ── Brand palette ── */
const GOLD = "#C9A84E";
const GOLD_LIGHT = "#D4B96A";
const DARK = "#0A0A0A";
const PANEL = "#141414";
const ELEVATED = "#111111";
const TEXT = "#F5F5F5";
const MUTED = "#A0A0A0";
const SUBTLE = "#666666";

/* ── Shared terminal text colors ── */
const TERM_PROMPT = "#7EE787";
const TERM_COMMENT = "#8B949E";
const TERM_WARN = "#D29922";
const TERM_ERR = "#F85149";
const TERM_OK = "#3FB950";
const TERM_ACCENT = "#79C0FF";

const MONO = '"JetBrains Mono","Fira Code",Menlo,Consolas,monospace';
const SANS = "Inter, system-ui, sans-serif";

/* ════════════════ REUSABLE ════════════════ */

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: number;
}> = ({ children, delay = 0, from = 40 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, 20], [from, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  );
};

const StageLabel: React.FC<{ children: React.ReactNode; num?: string }> = ({
  children,
  num,
}) => (
  <p
    style={{
      fontSize: 22,
      color: GOLD,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      fontWeight: 600,
      marginBottom: 16,
      fontFamily: SANS,
    }}
  >
    {num ? `Step ${num} · ` : ""}
    {children}
  </p>
);

const SceneHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    style={{
      fontSize: 54,
      fontWeight: 800,
      color: TEXT,
      textAlign: "center",
      lineHeight: 1.1,
      maxWidth: 1400,
      fontFamily: SANS,
      margin: 0,
    }}
  >
    {children}
  </h2>
);

const Typed: React.FC<{
  text: string;
  from: number;
  perChar?: number;
  style?: React.CSSProperties;
  showCursor?: boolean;
  cursorColor?: string;
}> = ({ text, from, perChar = 1.5, style, showCursor = true, cursorColor }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - from);
  const chars = Math.min(text.length, Math.floor(elapsed / perChar));
  const done = chars >= text.length;
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, chars)}
      {showCursor && !done && cursorOn ? (
        <span style={{ color: cursorColor || "currentColor" }}>▌</span>
      ) : null}
    </span>
  );
};

/* ════════════════ OS-SPECIFIC TERMINAL COMPONENTS ════════════════ */

/* ── Windows PowerShell (dark navy classic PS blue) ── */
const WindowsPowerShell: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  admin?: boolean;
}> = ({ children, width = 1500, height = 560, admin = true }) => (
  <div
    style={{
      width,
      height,
      background: "#012456",
      borderRadius: 6,
      boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px #0A3A7A",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: MONO,
    }}
  >
    {/* Windows title bar */}
    <div
      style={{
        height: 32,
        background: "#1F1F1F",
        display: "flex",
        alignItems: "center",
        padding: "0 0 0 14px",
        gap: 10,
      }}
    >
      {/* Windows PS icon */}
      <div
        style={{
          width: 18,
          height: 18,
          background: "#012456",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          color: "#FFFFFF",
          fontFamily: SANS,
        }}
      >
        &gt;_
      </div>
      <span style={{ fontSize: 12, color: "#E0E0E0", fontFamily: SANS }}>
        {admin ? "Administrator: Windows PowerShell" : "Windows PowerShell"}
      </span>
      <div style={{ flex: 1 }} />
      {/* Min / Max / Close */}
      <div style={{ display: "flex", height: "100%" }}>
        <div
          style={{
            width: 44,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#E0E0E0",
            fontSize: 12,
          }}
        >
          ─
        </div>
        <div
          style={{
            width: 44,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#E0E0E0",
            fontSize: 11,
          }}
        >
          ▢
        </div>
        <div
          style={{
            width: 44,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#E0E0E0",
            fontSize: 14,
            background: "#E81123",
          }}
        >
          ✕
        </div>
      </div>
    </div>
    <div
      style={{
        flex: 1,
        padding: 20,
        color: "#EEEEEE",
        fontSize: 17,
        lineHeight: 1.5,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

/* ── Mac Terminal (light chrome, traffic lights) ── */
const MacTerminal: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  title?: string;
}> = ({ children, width = 780, height = 320, title = "franc — -bash — 120×30" }) => (
  <div
    style={{
      width,
      height,
      background: "#1E1E1E",
      borderRadius: 10,
      boxShadow: "0 25px 70px rgba(0,0,0,0.6), 0 0 0 1px #2A2A2A",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: MONO,
    }}
  >
    {/* Mac title bar — light gray gradient */}
    <div
      style={{
        height: 30,
        background: "linear-gradient(180deg, #E7E7E7, #C8C8C8)",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 8,
        borderBottom: "1px solid #9A9A9A",
      }}
    >
      <div style={{ width: 13, height: 13, borderRadius: 7, background: "#FF5F56", border: "0.5px solid #E0443E" }} />
      <div style={{ width: 13, height: 13, borderRadius: 7, background: "#FFBD2E", border: "0.5px solid #DEA123" }} />
      <div style={{ width: 13, height: 13, borderRadius: 7, background: "#27C93F", border: "0.5px solid #1AAB29" }} />
      <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#3C3C3C", fontFamily: SANS, fontWeight: 500 }}>
        {title}
      </div>
      <div style={{ width: 54 }} />
    </div>
    <div
      style={{
        flex: 1,
        padding: 18,
        color: "#E6EDF3",
        fontSize: 15,
        lineHeight: 1.5,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

/* ── Termux on Android (phone frame, no chrome, green-on-black) ── */
const TermuxPhone: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
}> = ({ children, width = 520, height = 800 }) => (
  <div
    style={{
      width,
      height,
      background: "#000000",
      borderRadius: 36,
      boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 6px #1A1A1A, 0 0 0 7px #2A2A2A",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: MONO,
      position: "relative",
    }}
  >
    {/* Android status bar */}
    <div
      style={{
        height: 28,
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        fontSize: 12,
        color: "#CCCCCC",
        fontFamily: SANS,
      }}
    >
      <span>9:41</span>
      <span>📶 📡 🔋</span>
    </div>
    {/* Termux app title */}
    <div
      style={{
        height: 38,
        background: "#000000",
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        gap: 10,
        borderBottom: "1px solid #222222",
      }}
    >
      <span style={{ fontSize: 14, color: "#66BB6A", fontFamily: SANS, fontWeight: 600 }}>
        Termux
      </span>
    </div>
    <div
      style={{
        flex: 1,
        padding: 16,
        color: "#66BB6A",
        fontSize: 13,
        lineHeight: 1.5,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

/* ── Claude Code window (inside-claude scenes) ── */
const ClaudeWindow: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
}> = ({ children, width = 1500, height = 640 }) => (
  <div
    style={{
      width,
      height,
      background: "#0F0F0F",
      borderRadius: 12,
      boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px #1F1F1F",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: MONO,
    }}
  >
    <div
      style={{
        height: 40,
        background: "#161616",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 10,
        borderBottom: "1px solid #262626",
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F56" }} />
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FFBD2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#27C93F" }} />
      <div
        style={{
          marginLeft: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: SANS,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 3,
            background: "#CA7B1E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "#FFFFFF",
            fontWeight: 700,
          }}
        >
          C
        </div>
        <span style={{ fontSize: 13, color: "#E0E0E0" }}>Claude Code</span>
      </div>
    </div>
    <div
      style={{
        flex: 1,
        padding: 24,
        color: "#E6EDF3",
        fontSize: 17,
        lineHeight: 1.5,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

/* ════════════════ SCENE 1 — INTRO ════════════════ */

function SceneIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
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
          textAlign: "center",
          position: "relative",
        }}
      >
        <p
          style={{
            fontSize: 22,
            color: GOLD,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          Franc System
        </p>
        <h1
          style={{
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            background: `linear-gradient(135deg, #B8972F, ${GOLD}, ${GOLD_LIGHT})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          Rebuild
          <br />
          from Zero
        </h1>
      </div>
      <FadeIn delay={28}>
        <p
          style={{
            marginTop: 40,
            fontSize: 26,
            color: MUTED,
            letterSpacing: "0.08em",
            textAlign: "center",
          }}
        >
          One command + one prompt · Any device · ~10 minutes
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 2 — OVERVIEW (7 clean steps) ════════════════ */

function SceneOverview() {
  const steps = [
    ["01", "Open Terminal"],
    ["02", "Paste Install"],
    ["03", "Claude Max Login"],
    ["04", "Paste Auto-Prompt"],
    ["05", "Claude Executes"],
    ["06", "Verify ✓"],
    ["07", "First Session"],
  ];
  return (
    <AbsoluteFill
      style={{
        background: ELEVATED,
        padding: 80,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel>The Flow</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          Cold terminal to <span style={{ color: GOLD }}>fully installed</span> — without ever leaving Claude.
        </SceneHeading>
      </FadeIn>
      <div
        style={{
          marginTop: 60,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 16,
          width: "100%",
          maxWidth: 1600,
        }}
      >
        {steps.map(([num, label], i) => (
          <FadeIn key={num} delay={24 + i * 6}>
            <div
              style={{
                background: PANEL,
                borderRadius: 16,
                padding: "28px 16px",
                border: `1px solid ${i >= 3 && i <= 5 ? GOLD + "40" : "#1E1E1E"}`,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: GOLD,
                  opacity: i >= 3 && i <= 5 ? 0.7 : 0.4,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {num}
              </p>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  color: TEXT,
                  lineHeight: 1.3,
                }}
              >
                {label}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={75}>
        <p style={{ marginTop: 36, fontSize: 18, color: MUTED, letterSpacing: "0.06em" }}>
          Steps 4-6 run <span style={{ color: GOLD }}>autonomously inside Claude</span>.
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 3 — STEP 1: OPEN TERMINAL ════════════════ */

function SceneStep1() {
  const devices = [
    {
      icon: "🪟",
      name: "Windows",
      steps: ["Start menu", "Type: powershell", "Right-click → Run as Admin"],
    },
    {
      icon: "🍎",
      name: "Mac",
      steps: ["Cmd + Space", "Type: terminal", "Press Enter"],
    },
    {
      icon: "📱",
      name: "Android",
      steps: ["Install Termux", "(F-Droid, NOT Play Store)", "Open it"],
    },
  ];
  return (
    <AbsoluteFill
      style={{
        background: DARK,
        padding: 80,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="1">Open the right terminal</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>Every device, one rule: open your shell.</SceneHeading>
      </FadeIn>
      <div style={{ marginTop: 60, display: "flex", gap: 28, maxWidth: 1600, width: "100%" }}>
        {devices.map((d, i) => (
          <FadeIn key={d.name} delay={22 + i * 10}>
            <div
              style={{
                background: PANEL,
                borderRadius: 20,
                padding: 40,
                border: "1px solid #1E1E1E",
                minWidth: 420,
                flex: 1,
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>{d.icon}</div>
              <h3 style={{ fontSize: 32, fontWeight: 700, color: TEXT, margin: 0 }}>
                {d.name}
              </h3>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                {d.steps.map((s, j) => (
                  <p key={j} style={{ fontSize: 18, color: MUTED, margin: 0, lineHeight: 1.5 }}>
                    <span style={{ color: GOLD, marginRight: 10 }}>→</span>
                    {s}
                  </p>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={55}>
        <p style={{ marginTop: 36, fontSize: 18, color: TERM_WARN, letterSpacing: "0.1em" }}>
          ⚠ Windows must run as Administrator — winget fails silently otherwise
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 4 — STEP 2A: WINDOWS POWERSHELL ════════════════ */

function SceneStep2Windows() {
  const frame = useCurrentFrame();
  const winCmd =
    "Set-ExecutionPolicy Bypass -Scope Process -Force; winget install OpenJS.NodeJS.LTS -e; winget install Git.Git -e; npm install -g @anthropic-ai/claude-code; claude";
  const logLines = [
    { t: 180, txt: "Found Node.js LTS [OpenJS.NodeJS.LTS] v22.22.2", color: "#BBBBBB" },
    { t: 200, txt: "  ████████████████████████████████████ 100%", color: TERM_ACCENT },
    { t: 220, txt: "Successfully installed", color: TERM_OK },
    { t: 240, txt: "Found Git [Git.Git] v2.53.0", color: "#BBBBBB" },
    { t: 260, txt: "Successfully installed", color: TERM_OK },
    { t: 290, txt: "+ @anthropic-ai/claude-code@2.0.15", color: TERM_ACCENT },
    { t: 310, txt: "added 142 packages in 18s", color: "#BBBBBB" },
    { t: 340, txt: "▶ Launching Claude Code...", color: TERM_WARN },
  ];
  return (
    <AbsoluteFill
      style={{
        background: ELEVATED,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="2a">Paste the install — Windows PowerShell</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          One paste. <span style={{ color: GOLD }}>Admin PowerShell.</span>
        </SceneHeading>
      </FadeIn>
      <div style={{ marginTop: 40 }}>
        <FadeIn delay={30}>
          <WindowsPowerShell width={1600} height={560} admin>
            <div style={{ color: "#FFFF00" }}>Windows PowerShell</div>
            <div style={{ color: "#AAAAAA", fontSize: 14 }}>Copyright (C) Microsoft Corporation. All rights reserved.</div>
            <div style={{ color: "#AAAAAA", fontSize: 14, marginBottom: 8 }}>
              Install the latest PowerShell for new features and improvements!
            </div>
            <div>
              <span style={{ color: "#FFFF00" }}>PS C:\Users\franc&gt;</span>{" "}
              <Typed
                text={winCmd}
                from={70}
                perChar={0.9}
                style={{ color: "#FFFFFF" }}
                showCursor={frame < 170}
                cursorColor="#FFFFFF"
              />
            </div>
            <div style={{ marginTop: 10 }}>
              {logLines.map((l, i) => {
                const on = frame >= l.t;
                return (
                  <div
                    key={i}
                    style={{
                      opacity: on ? 1 : 0,
                      transform: `translateY(${on ? 0 : 6}px)`,
                      transition: "opacity 0.25s",
                      color: l.color,
                      fontSize: 16,
                      marginTop: 4,
                      fontFamily: MONO,
                    }}
                  >
                    {l.txt}
                  </div>
                );
              })}
            </div>
          </WindowsPowerShell>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 5 — STEP 2B: MAC TERMINAL ════════════════ */

function SceneStep2Mac() {
  const frame = useCurrentFrame();
  const macCmd =
    '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install node && npm install -g @anthropic-ai/claude-code && claude';
  const out = [
    { t: 160, txt: "==> Checking for `sudo` access...", color: "#AAAAAA" },
    { t: 180, txt: "==> Installing Homebrew...", color: TERM_ACCENT },
    { t: 200, txt: "==> Downloading and installing Node.js v22.22.2", color: "#AAAAAA" },
    { t: 220, txt: "🍺 /opt/homebrew/Cellar/node/22.22.2", color: TERM_OK },
    { t: 240, txt: "+ @anthropic-ai/claude-code@2.0.15", color: TERM_ACCENT },
    { t: 260, txt: "▶ Launching Claude Code...", color: TERM_WARN },
  ];
  return (
    <AbsoluteFill
      style={{
        background: DARK,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="2b">Paste the install — Mac Terminal</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          Same paste, <span style={{ color: GOLD }}>Homebrew + Node.</span>
        </SceneHeading>
      </FadeIn>
      <div style={{ marginTop: 40 }}>
        <FadeIn delay={30}>
          <MacTerminal width={1400} height={520} title="franc — -zsh — 120×30">
            <div>
              <span style={{ color: TERM_PROMPT }}>franc@MacBook-Pro ~ %</span>{" "}
              <Typed
                text={macCmd}
                from={65}
                perChar={0.9}
                style={{ color: "#E6EDF3" }}
                showCursor={frame < 150}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              {out.map((l, i) => {
                const on = frame >= l.t;
                return (
                  <div
                    key={i}
                    style={{
                      opacity: on ? 1 : 0,
                      color: l.color,
                      fontSize: 15,
                      marginTop: 4,
                      fontFamily: MONO,
                    }}
                  >
                    {l.txt}
                  </div>
                );
              })}
            </div>
          </MacTerminal>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 6 — STEP 2C: TERMUX (ANDROID) ════════════════ */

function SceneStep2Termux() {
  const frame = useCurrentFrame();
  const termuxCmd = "pkg upgrade -y && pkg install nodejs-lts -y && npm install -g @anthropic-ai/claude-code && claude";
  const out = [
    { t: 130, txt: "Checking available disk space...", color: "#888888" },
    { t: 145, txt: "Fetching nodejs-lts v22.22.2", color: "#888888" },
    { t: 160, txt: "✓ Installed", color: "#66BB6A" },
    { t: 180, txt: "+ @anthropic-ai/claude-code@2.0.15", color: "#81D4FA" },
    { t: 200, txt: "▶ Launching Claude Code...", color: "#FFB74D" },
  ];
  return (
    <AbsoluteFill
      style={{
        background: ELEVATED,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="2c">Paste the install — Android (Termux)</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          Phone in your pocket, <span style={{ color: GOLD }}>same system.</span>
        </SceneHeading>
      </FadeIn>
      <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 60 }}>
        <FadeIn delay={22}>
          <TermuxPhone width={480} height={720}>
            <div style={{ color: "#66BB6A" }}>~ $</div>
            <div style={{ color: "#E0E0E0", marginTop: 4, fontSize: 12, wordBreak: "break-all" }}>
              <Typed
                text={termuxCmd}
                from={40}
                perChar={1}
                style={{ color: "#E0E0E0" }}
                showCursor={frame < 140}
              />
            </div>
            <div style={{ marginTop: 14 }}>
              {out.map((l, i) => {
                const on = frame >= l.t;
                return (
                  <div
                    key={i}
                    style={{
                      opacity: on ? 1 : 0,
                      color: l.color,
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    {l.txt}
                  </div>
                );
              })}
            </div>
          </TermuxPhone>
        </FadeIn>
        <FadeIn delay={40}>
          <div style={{ maxWidth: 700 }}>
            <p style={{ color: MUTED, fontSize: 22, lineHeight: 1.6 }}>
              Install Termux from <span style={{ color: GOLD }}>F-Droid</span> (not Play Store — outdated there). Open the app, paste, go.
            </p>
            <p style={{ color: MUTED, fontSize: 22, lineHeight: 1.6, marginTop: 24 }}>
              Same result: Claude Code running, ready for the prompt.
            </p>
          </div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 7 — STEP 3: CLAUDE MAX LOGIN ════════════════ */

function SceneStep3Login() {
  const frame = useCurrentFrame();
  const checkIn = interpolate(frame - 120, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: DARK,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="3">Log in to Claude Max</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          Browser pops → sign in → <span style={{ color: GOLD }}>back to terminal.</span>
        </SceneHeading>
      </FadeIn>
      <div style={{ display: "flex", gap: 40, marginTop: 40, alignItems: "center" }}>
        <FadeIn delay={25}>
          <div
            style={{
              width: 680,
              height: 420,
              background: "#FFFFFF",
              borderRadius: 12,
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: 44,
                background: "#F6F8FA",
                borderBottom: "1px solid #D0D7DE",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: 8,
              }}
            >
              <div style={{ width: 11, height: 11, borderRadius: 6, background: "#FF5F56" }} />
              <div style={{ width: 11, height: 11, borderRadius: 6, background: "#FFBD2E" }} />
              <div style={{ width: 11, height: 11, borderRadius: 6, background: "#27C93F" }} />
              <div
                style={{
                  marginLeft: 24,
                  flex: 1,
                  background: "#FFFFFF",
                  border: "1px solid #D0D7DE",
                  borderRadius: 6,
                  padding: "4px 12px",
                  fontSize: 13,
                  color: "#57606A",
                  fontFamily: MONO,
                }}
              >
                claude.ai/login
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "linear-gradient(180deg,#FFFFFF,#F6F8FA)",
                padding: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 800, color: "#1F2328", marginBottom: 12, fontFamily: SANS }}>
                Sign in to Claude
              </div>
              <p style={{ fontSize: 15, color: "#57606A", marginBottom: 28 }}>
                Use your Claude Max account
              </p>
              <div
                style={{
                  background: "#CA7B1E",
                  color: "#FFFFFF",
                  padding: "14px 40px",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: SANS,
                }}
              >
                Continue →
              </div>
              <p style={{ fontSize: 13, color: "#8C959F", marginTop: 24 }}>
                claude.ai/pricing · Max subscription required
              </p>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={50}>
          <div style={{ fontSize: 60, color: GOLD, padding: 20 }}>→</div>
        </FadeIn>
        <FadeIn delay={70}>
          <ClaudeWindow width={560} height={240}>
            <div style={{ fontSize: 15, lineHeight: 1.6 }}>
              <span style={{ color: TERM_COMMENT }}>Opening browser for auth...</span>
              <br />
              <span style={{ color: TERM_OK, opacity: checkIn }}>✓ Signed in as franc</span>
              <br />
              <br />
              <span style={{ color: TERM_TEXT_LIGHT() }}>Welcome to Claude Code</span>
              <br />
              <span style={{ color: TERM_PROMPT }}>&gt;</span>{" "}
              <span style={{ color: TERM_ACCENT }}>_</span>
            </div>
          </ClaudeWindow>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}
function TERM_TEXT_LIGHT() {
  return "#E6EDF3";
}

/* ════════════════ SCENE 8 — STEP 4: PASTE THE AUTO-REBUILD PROMPT ════════════════ */

function SceneStep4PastePrompt() {
  const frame = useCurrentFrame();
  const promptLines = [
    "🚀 REBUILD MISSION — install the full franc-system from",
    "inside Claude. Execute every step, don't ask me anything,",
    "report at the end.",
    "",
    "STEP 1 · CLONE",
    "   git clone https://github.com/francky180/franc-system-template",
    "          ~/franc-system-template",
    "",
    "STEP 2 · INSTALL ALL (115 skills, 4 MCPs, BRAIN, hook)",
    "   cd ~/franc-system-template && bash ai-tools/install-all.sh",
    "",
    "STEP 3 · VERIFY — run each, capture output",
    "   - node --version",
    "   - git --version",
    "   - claude --version",
    "   - find ~/.claude/skills -maxdepth 1 -type d | wc -l",
    "   - grep -c rebuild-sync ~/.claude/settings.json",
    "",
    "STEP 4 · REPORT: ✅ each step, end with...",
    '   "Rebuild complete. Type /help, then fd121 for total recall."',
    "",
    "RULES",
    "• Execute, don't ask. No 'can I?' — just do it.",
    "• If a step fails, don't halt. Show the one-line fix.",
    "• Tone: short, confident, no apologies.",
  ];
  return (
    <AbsoluteFill
      style={{
        background: ELEVATED,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="4">Paste the auto-rebuild prompt</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          One prompt — <span style={{ color: GOLD }}>Claude does the rest.</span>
        </SceneHeading>
      </FadeIn>
      <div style={{ marginTop: 30 }}>
        <FadeIn delay={25}>
          <ClaudeWindow width={1500} height={620}>
            <div style={{ fontSize: 14, lineHeight: 1.55, fontFamily: MONO }}>
              <span style={{ color: TERM_PROMPT }}>&gt;</span>{" "}
              {promptLines.map((line, i) => {
                const lineAppearAt = 40 + i * 7;
                const on = frame >= lineAppearAt;
                return (
                  <div
                    key={i}
                    style={{
                      opacity: on ? 1 : 0,
                      color: line.startsWith("🚀")
                        ? GOLD
                        : line.startsWith("STEP")
                        ? TERM_ACCENT
                        : line.startsWith("RULES")
                        ? TERM_WARN
                        : line.startsWith("•")
                        ? TERM_OK
                        : "#D0D7DE",
                      fontWeight: line.startsWith("STEP") || line.startsWith("🚀") ? 700 : 400,
                    }}
                  >
                    {line || "\u00A0"}
                  </div>
                );
              })}
            </div>
          </ClaudeWindow>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 9 — STEP 5: CLAUDE AUTO-EXECUTES ════════════════ */

function SceneStep5AutoExecute() {
  const frame = useCurrentFrame();
  const events = [
    { t: 25, txt: "Running: git clone https://github.com/francky180/franc-system-template ...", color: TERM_COMMENT },
    { t: 50, txt: "  Cloning into ~/franc-system-template...", color: TERM_COMMENT },
    { t: 75, txt: "  ✓ Receiving objects: 100% (1203/1203), 4.2 MiB", color: TERM_OK },
    { t: 100, txt: "", color: TERM_TEXT_LIGHT() },
    { t: 105, txt: "Running: cd ~/franc-system-template && bash ai-tools/install-all.sh", color: TERM_COMMENT },
    { t: 130, txt: "  Copying 115 skills → ~/.claude/skills/", color: TERM_COMMENT },
    { t: 150, txt: "    ✓ gstack (40 skills)", color: TERM_OK },
    { t: 170, txt: "    ✓ creator-marketing (31 skills)", color: TERM_OK },
    { t: 190, txt: "    ✓ marketing-suite (15 skills)", color: TERM_OK },
    { t: 210, txt: "    ✓ design-system (12 skills)", color: TERM_OK },
    { t: 230, txt: "    ✓ gitnexus + utilities (17 skills)", color: TERM_OK },
    { t: 250, txt: "  Setting up BRAIN Obsidian vault · 104 principles", color: TERM_OK },
    { t: 270, txt: "  Installing 4 MCP servers (Vercel, Stripe, GitNexus, Playwright)", color: TERM_OK },
    { t: 290, txt: "  Writing PostToolUse auto-sync hook", color: TERM_OK },
    { t: 310, txt: "  ✅ Install complete", color: TERM_OK },
  ];
  return (
    <AbsoluteFill
      style={{
        background: DARK,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="5">Claude executes autonomously</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          No more typing. <span style={{ color: GOLD }}>Claude runs the whole chain.</span>
        </SceneHeading>
      </FadeIn>
      <div style={{ marginTop: 30 }}>
        <FadeIn delay={20}>
          <ClaudeWindow width={1500} height={620}>
            <div style={{ fontSize: 15, lineHeight: 1.55, fontFamily: MONO }}>
              <span style={{ color: GOLD }}>Claude Code</span>{" "}
              <span style={{ color: TERM_COMMENT }}>· executing rebuild mission...</span>
              <div style={{ marginTop: 10 }}>
                {events.map((l, i) => {
                  const on = frame >= l.t;
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: on ? 1 : 0,
                        color: l.color,
                        fontSize: 15,
                        marginTop: 4,
                        fontWeight: l.txt.includes("✅") ? 700 : 400,
                      }}
                    >
                      {l.txt || "\u00A0"}
                    </div>
                  );
                })}
              </div>
            </div>
          </ClaudeWindow>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 10 — STEP 6: VERIFY (Claude's report) ════════════════ */

function SceneStep6Verify() {
  const frame = useCurrentFrame();
  const checks = [
    { t: 40, label: "node --version", out: "v22.22.2" },
    { t: 75, label: "git --version", out: "git 2.53.0" },
    { t: 110, label: "claude --version", out: "2.0.15" },
    { t: 145, label: "skills installed", out: "115" },
    { t: 180, label: "auto-sync hook", out: "✓ present" },
    { t: 215, label: "/help commands", out: "100+" },
  ];
  return (
    <AbsoluteFill
      style={{
        background: ELEVATED,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="6">Claude reports back</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          Six checks. <span style={{ color: GOLD }}>All green = ready.</span>
        </SceneHeading>
      </FadeIn>
      <div
        style={{
          marginTop: 40,
          width: "100%",
          maxWidth: 1400,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {checks.map((c, i) => {
          const on = frame >= c.t;
          const tick = interpolate(frame - (c.t + 10), [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={c.label}
              style={{
                opacity: on ? 1 : 0,
                transform: `translateX(${on ? 0 : -30}px)`,
                transition: "all 0.4s",
                background: PANEL,
                borderRadius: 14,
                padding: "20px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #1E1E1E",
                fontFamily: MONO,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: tick > 0 ? TERM_OK : "#333",
                    color: "#000",
                    fontWeight: 900,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${0.5 + tick * 0.5})`,
                  }}
                >
                  ✓
                </span>
                <span style={{ color: TERM_TEXT_LIGHT(), fontSize: 20 }}>{c.label}</span>
              </div>
              <span style={{ color: TERM_PROMPT, fontSize: 20 }}>{c.out}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 11 — STEP 7: FIRST SESSION ════════════════ */

function SceneStep7FirstSession() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: DARK,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel num="7">Your first real session</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          <span style={{ color: GOLD }}>fd121</span> recalls everything ·{" "}
          <span style={{ color: GOLD }}>fd321</span> audits everything.
        </SceneHeading>
      </FadeIn>
      <div style={{ marginTop: 36, display: "flex", gap: 32 }}>
        <FadeIn delay={22}>
          <ClaudeWindow width={720} height={440}>
            <div style={{ fontSize: 16, lineHeight: 1.6 }}>
              <span style={{ color: TERM_PROMPT }}>&gt;</span>{" "}
              <Typed
                text="fd121"
                from={30}
                perChar={2}
                style={{ color: TERM_ACCENT }}
                showCursor={frame < 50}
              />
              {frame > 60 && (
                <div style={{ color: TERM_TEXT_LIGHT(), marginTop: 12, fontSize: 15 }}>
                  <span style={{ color: TERM_WARN }}>fd121 loaded — total recall online.</span>
                  <br />
                  <br />
                  <span style={{ color: TERM_OK }}>LIVE now:</span>
                  <br />
                  &nbsp;• phimindflow.com — Trade + Credit
                  <br />
                  &nbsp;• ai-system-factory.vercel.app
                  <br />
                  &nbsp;• creditpath-delta.vercel.app
                  <br />
                  &nbsp;• @fitflybusiness — 14.7K
                  <br />
                  <br />
                  <span style={{ color: TERM_ACCENT }}>$10K in 30 — Day 4</span>
                </div>
              )}
            </div>
          </ClaudeWindow>
        </FadeIn>
        <FadeIn delay={55}>
          <ClaudeWindow width={720} height={440}>
            <div style={{ fontSize: 16, lineHeight: 1.6 }}>
              <span style={{ color: TERM_PROMPT }}>&gt;</span>{" "}
              <Typed
                text="fd321"
                from={70}
                perChar={2}
                style={{ color: TERM_ACCENT }}
                showCursor={frame < 90}
              />
              {frame > 100 && (
                <div style={{ color: TERM_TEXT_LIGHT(), marginTop: 12, fontSize: 15 }}>
                  <span style={{ color: TERM_OK }}>✓ Claude harness</span>
                  <br />
                  <span style={{ color: TERM_OK }}>✓ Memory system</span>
                  <br />
                  <span style={{ color: TERM_OK }}>✓ Projects</span>
                  <br />
                  <span style={{ color: TERM_OK }}>✓ Vercel/git</span>
                  <br />
                  <span style={{ color: TERM_OK }}>✓ BRAIN vault</span>
                  <br />
                  <span style={{ color: TERM_OK }}>✓ System tools</span>
                  <br />
                  <span style={{ color: TERM_OK }}>✓ Secrets in gitignore</span>
                  <br />
                  <br />
                  <span style={{ color: GOLD, fontWeight: 700 }}>All clean. Ship.</span>
                </div>
              )}
            </div>
          </ClaudeWindow>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 12 — STUMBLES ════════════════ */

function SceneStumbles() {
  const stumbles = [
    {
      problem: "claude: command not found (Windows)",
      fix: "Close & reopen PowerShell — PATH needs refresh",
    },
    {
      problem: "bash not found on Windows install-all.sh",
      fix: "Re-run: winget install Git.Git",
    },
    {
      problem: "Browser doesn't open on claude launch",
      fix: "Copy the URL from terminal, paste in browser manually",
    },
    {
      problem: "Prompt runs but no /help skills show up",
      fix: "Claude needs to finish install-all.sh — wait for ✅ Install complete",
    },
  ];
  return (
    <AbsoluteFill
      style={{
        background: ELEVATED,
        padding: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: SANS,
      }}
    >
      <FadeIn>
        <StageLabel>If something stumbles</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <SceneHeading>
          Four common trips, <span style={{ color: GOLD }}>four one-line fixes.</span>
        </SceneHeading>
      </FadeIn>
      <div
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          maxWidth: 1600,
          width: "100%",
        }}
      >
        {stumbles.map((s, i) => (
          <FadeIn key={i} delay={22 + i * 10}>
            <div
              style={{
                background: PANEL,
                borderRadius: 16,
                padding: 30,
                border: "1px solid #1E1E1E",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    background: TERM_ERR,
                    color: "#000",
                    fontSize: 18,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  !
                </span>
                <span style={{ color: TEXT, fontSize: 18, fontWeight: 600, fontFamily: MONO }}>
                  {s.problem}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginLeft: 42 }}>
                <span style={{ color: TERM_OK, fontSize: 20, fontWeight: 900 }}>→</span>
                <span style={{ color: MUTED, fontSize: 16, lineHeight: 1.5 }}>{s.fix}</span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ════════════════ SCENE 13 — OUTRO ════════════════ */

function SceneOutro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill
      style={{
        background: DARK,
        padding: 100,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: GOLD,
          opacity: 0.05,
          filter: "blur(180px)",
        }}
      />
      <FadeIn>
        <StageLabel>Result</StageLabel>
      </FadeIn>
      <FadeIn delay={10}>
        <h2
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.05,
            margin: 0,
            maxWidth: 1600,
          }}
        >
          One command, one prompt,{" "}
          <span
            style={{
              background: `linear-gradient(135deg, #B8972F, ${GOLD}, ${GOLD_LIGHT})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            full operating system
          </span>{" "}
          in ~10 minutes.
        </h2>
      </FadeIn>
      <FadeIn delay={30}>
        <div
          style={{
            transform: `scale(${scale})`,
            marginTop: 46,
            background: PANEL,
            borderRadius: 16,
            padding: "22px 44px",
            fontFamily: MONO,
            fontSize: 22,
            color: "#E6EDF3",
            border: `1px solid ${GOLD}40`,
            boxShadow: `0 0 40px ${GOLD}20`,
          }}
        >
          <span style={{ color: TERM_COMMENT }}>▸ </span>
          github.com/francky180/<span style={{ color: GOLD }}>franc-system-template</span>
        </div>
      </FadeIn>
      <FadeIn delay={55}>
        <p
          style={{
            marginTop: 32,
            fontSize: 18,
            color: SUBTLE,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Never leave Claude · Every skill · Every device
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
}

/* ════════════════ MAIN COMPOSITION ════════════════ */

export const REBUILD_DURATION = 4200; // 2:20 @ 30fps — v2 walkthrough

export const RebuildWalkthrough: React.FC = () => {
  let cursor = 0;
  const slot = (len: number) => {
    const from = cursor;
    cursor += len;
    return { from, durationInFrames: len };
  };

  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      {/* 1  Intro              180  (6s) */}
      <Sequence {...slot(180)}>
        <SceneIntro />
      </Sequence>
      {/* 2  Overview           270  (9s) */}
      <Sequence {...slot(270)}>
        <SceneOverview />
      </Sequence>
      {/* 3  Open Terminal      300  (10s) */}
      <Sequence {...slot(300)}>
        <SceneStep1 />
      </Sequence>
      {/* 4  Paste Install — Windows PS  480  (16s) */}
      <Sequence {...slot(480)}>
        <SceneStep2Windows />
      </Sequence>
      {/* 5  Paste Install — Mac Terminal  360  (12s) */}
      <Sequence {...slot(360)}>
        <SceneStep2Mac />
      </Sequence>
      {/* 6  Paste Install — Termux        300  (10s) */}
      <Sequence {...slot(300)}>
        <SceneStep2Termux />
      </Sequence>
      {/* 7  Claude Max Login               330  (11s) */}
      <Sequence {...slot(330)}>
        <SceneStep3Login />
      </Sequence>
      {/* 8  Paste the Prompt               450  (15s) */}
      <Sequence {...slot(450)}>
        <SceneStep4PastePrompt />
      </Sequence>
      {/* 9  Claude Auto-Executes           390  (13s) */}
      <Sequence {...slot(390)}>
        <SceneStep5AutoExecute />
      </Sequence>
      {/* 10 Verify (Claude reports)        330  (11s) */}
      <Sequence {...slot(330)}>
        <SceneStep6Verify />
      </Sequence>
      {/* 11 First Session                  330  (11s) */}
      <Sequence {...slot(330)}>
        <SceneStep7FirstSession />
      </Sequence>
      {/* 12 Stumbles                       300  (10s) */}
      <Sequence {...slot(300)}>
        <SceneStumbles />
      </Sequence>
      {/* 13 Outro                          180  (6s) */}
      <Sequence {...slot(180)}>
        <SceneOutro />
      </Sequence>
      {/* total = 180+270+300+480+360+300+330+450+390+330+330+300+180 = 4200 */}
    </AbsoluteFill>
  );
};
