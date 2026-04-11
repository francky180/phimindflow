import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  staticFile,
  Sequence,
  spring,
  useVideoConfig,
} from "remotion";

const GOLD = "#C9A84E";
const BG = "#0A0A0A";

/* ─── Reusable Scene Wrapper ─────────────────────────── */

function Scene({
  children,
  from,
  duration,
}: {
  children: React.ReactNode;
  from: number;
  duration: number;
}) {
  return (
    <Sequence from={from} durationInFrames={duration}>
      {children}
    </Sequence>
  );
}

/* ─── Fade + Scale Animation ─────────────────────────── */

function FadeScale({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 80, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

/* ─── Title Card ─────────────────────────────────────── */

function TitleCard() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [15, 45], [0, 300], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "0.4em",
          color: GOLD,
          textTransform: "uppercase",
          fontFamily: "Inter, sans-serif",
        }}
      >
        PHIMINDFLOW
      </div>
      <div
        style={{
          width: lineWidth,
          height: 1,
          backgroundColor: GOLD,
          marginTop: 24,
          marginBottom: 24,
          opacity: 0.4,
        }}
      />
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#F5F5F5",
          textAlign: "center",
          lineHeight: 1.15,
          fontFamily: "Inter, sans-serif",
        }}
      >
        The Fibonacci
        <br />
        Growth System
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#888888",
          marginTop: 20,
          letterSpacing: "0.05em",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Structured wealth. Zero guesswork.
      </div>
    </AbsoluteFill>
  );
}

/* ─── Screenshot Scene ───────────────────────────────── */

function ScreenshotScene({
  src,
  label,
  step,
  price,
}: {
  src: string;
  label: string;
  step: string;
  price?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 150 },
  });
  const labelOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [10, 25], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Screenshot */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: `translateX(-50%) scale(${imgScale})`,
          width: 1200,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
          border: `1px solid rgba(201,168,78,0.15)`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
      </div>

      {/* Step Label */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: `translateX(-50%) translateY(${labelY}px)`,
          opacity: labelOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.3em",
            color: GOLD,
            textTransform: "uppercase",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {step}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#F5F5F5",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {label}
        </div>
        {price && (
          <div
            style={{
              fontSize: 22,
              color: GOLD,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {price}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

/* ─── CTA Card ───────────────────────────────────────── */

function CTACard() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const btnScale = spring({
    frame: Math.max(0, frame - 30),
    fps: 30,
    config: { damping: 80, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: "#F5F5F5",
          textAlign: "center",
          lineHeight: 1.2,
          fontFamily: "Inter, sans-serif",
        }}
      >
        Start Your Journey
        <br />
        <span style={{ color: GOLD }}>Today</span>
      </div>
      <div
        style={{
          marginTop: 40,
          transform: `scale(${btnScale})`,
          backgroundColor: GOLD,
          color: BG,
          fontSize: 20,
          fontWeight: 700,
          padding: "18px 48px",
          borderRadius: 50,
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        Start Free — Open Broker
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 14,
          color: "#666666",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Step 1 of 3 · Free · Takes 5 minutes
      </div>
    </AbsoluteFill>
  );
}

/* ─── Main Composition ───────────────────────────────── */

export const FunnelShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Scene 1: Title (0-90 frames = 3s) */}
      <Scene from={0} duration={90}>
        <TitleCard />
      </Scene>

      {/* Scene 2: Homepage (90-180 = 3s) */}
      <Scene from={90} duration={90}>
        <FadeScale>
          <ScreenshotScene
            src="screenshots/02-hero.png"
            label="Premium Landing Page"
            step="The System"
          />
        </FadeScale>
      </Scene>

      {/* Scene 3: Broker CTA (180-300 = 4s) */}
      <Scene from={180} duration={120}>
        <FadeScale>
          <ScreenshotScene
            src="screenshots/03-broker-cta.png"
            label="Open Your Broker"
            step="Step 1"
            price="Free"
          />
        </FadeScale>
      </Scene>

      {/* Scene 4: Course CTA (300-420 = 4s) */}
      <Scene from={300} duration={120}>
        <FadeScale>
          <ScreenshotScene
            src="screenshots/04-course-cta.png"
            label="Unlock The System"
            step="Step 2"
            price="$250"
          />
        </FadeScale>
      </Scene>

      {/* Scene 5: Management CTA (420-540 = 4s) */}
      <Scene from={420} duration={120}>
        <FadeScale>
          <ScreenshotScene
            src="screenshots/05-management-cta.png"
            label="Managed Execution"
            step="Step 3"
            price="$1,500"
          />
        </FadeScale>
      </Scene>

      {/* Scene 6: Mobile view (540-630 = 3s) */}
      <Scene from={540} duration={90}>
        <FadeScale>
          <ScreenshotScene
            src="screenshots/10-mobile-sticky-cta.png"
            label="Works On Mobile"
            step="Responsive"
          />
        </FadeScale>
      </Scene>

      {/* Scene 7: CTA Card (630-750 = 4s) */}
      <Scene from={630} duration={120}>
        <CTACard />
      </Scene>
    </AbsoluteFill>
  );
};
