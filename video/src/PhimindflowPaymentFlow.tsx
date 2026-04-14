import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';

const GOLD = '#e4b64c';
const BG = '#0a0a0e';
const TEXT = '#f5f5f7';
const MUTED = '#7a7a86';
const GREEN = '#00e5a0';

const SLIDES = [
  {
    file: 'pmf-flow-01-hero.png',
    step: '01',
    label: 'DISCOVER',
    title: 'Structured wealth. Zero guesswork.',
    subtitle: 'phimindflow.com',
  },
  {
    file: 'pmf-flow-02-process.png',
    step: '02',
    label: 'THE PATH',
    title: 'Follow the sequence. Skip nothing.',
    subtitle: 'Three steps — Broker → Course → Management',
  },
  {
    file: 'pmf-flow-03-pricing-cards.png',
    step: '03',
    label: 'PRICING',
    title: 'Free → $250 → $1,500',
    subtitle: 'Each step unlocks the next level.',
  },
  {
    file: 'pmf-flow-04-course.png',
    step: '04',
    label: 'STEP 2 · COURSE',
    title: 'The complete Fibonacci framework',
    subtitle: '$250 one-time — lifetime access',
  },
  {
    file: 'pmf-flow-05-management.png',
    step: '05',
    label: 'STEP 3 · MANAGEMENT',
    title: 'Done-for-you execution',
    subtitle: '$1,500 — professionals trade for you',
  },
  {
    file: 'pmf-flow-06-faq.png',
    step: '06',
    label: 'TRUST',
    title: 'Common questions. Clear answers.',
    subtitle: 'No confusion. No hidden fees.',
  },
  {
    file: 'pmf-flow-07-stripe-course.png',
    step: '07',
    label: 'CHECKOUT',
    title: 'Secure Stripe payment — $250',
    subtitle: 'FRANCKY D ENTERPRISES LLC',
  },
  {
    file: 'pmf-flow-08-stripe-management.png',
    step: '08',
    label: 'UPGRADE',
    title: 'Managed execution — $1,500',
    subtitle: 'Premium tier · hands-off growth',
  },
];

const INTRO_DURATION = 90; // 3s
const SLIDE_DURATION = 75; // 2.5s per slide
const OUTRO_DURATION = 120; // 4s
export const PMF_PAYMENT_DURATION =
  INTRO_DURATION + SLIDES.length * SLIDE_DURATION + OUTRO_DURATION;

// ─── Animated counter ────────────────────────────────────────────────
const Counter: React.FC<{ value: string; delay: number }> = ({ value, delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [delay, delay + 15], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontSize: 42,
        fontWeight: 800,
        color: GOLD,
        letterSpacing: '-0.02em',
      }}
    >
      {value}
    </div>
  );
};

// ─── Intro ───────────────────────────────────────────────────────────
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, from: 0.5, to: 1, durationInFrames: 25 });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [15, 35], [30, 0], { extrapolateRight: 'clamp' });
  const subtitleOpacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });
  const statsOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(228,182,76,0.06) 0%, ${BG} 70%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(228,182,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(228,182,76,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.35em',
          color: GOLD,
          marginBottom: 40,
        }}
      >
        φ PHIMINDFLOW
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 68, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Payment Flow
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, color: GOLD, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Walkthrough
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 20,
          color: MUTED,
          marginTop: 24,
          letterSpacing: '0.02em',
        }}
      >
        From discovery to checkout — the full user experience
      </div>

      {/* Stats row */}
      <div
        style={{
          opacity: statsOpacity,
          display: 'flex',
          gap: 60,
          marginTop: 48,
        }}
      >
        {[
          { label: 'PRODUCTS', value: '3' },
          { label: 'TIERS', value: 'Free → $1,500' },
          { label: 'CHECKOUT', value: 'Stripe' },
        ].map((stat, i) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <Counter value={stat.value} delay={55 + i * 8} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: MUTED, marginTop: 6 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide ───────────────────────────────────────────────────────────
const Slide: React.FC<{
  file: string;
  step: string;
  label: string;
  title: string;
  subtitle: string;
  index: number;
  total: number;
}> = ({ file, step, label, title, subtitle, index, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Image animation
  const imgScale = spring({ frame, fps, from: 1.08, to: 1, durationInFrames: 30 });
  const imgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Text animation
  const textOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: 'clamp' });
  const textY = interpolate(frame, [8, 22], [24, 0], { extrapolateRight: 'clamp' });

  // Step number animation
  const stepScale = spring({ frame: frame - 5, fps, from: 0, to: 1, durationInFrames: 20 });

  // Exit
  const exitOpacity = interpolate(
    frame,
    [SLIDE_DURATION - 12, SLIDE_DURATION],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Progress
  const progress = (index + 1) / total;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity: exitOpacity }}>
      {/* Top gold glow */}
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 80% 30% at 50% -5%, ${GOLD}15, transparent)` }}
      />

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `${GOLD}15` }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: GOLD, borderRadius: '0 2px 2px 0' }} />
      </div>

      {/* Step number — top left */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          transform: `scale(${stepScale})`,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${GOLD}15`,
            border: `1px solid ${GOLD}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 800,
            color: GOLD,
          }}
        >
          {step}
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: GOLD }}>{label}</div>
      </div>

      {/* Screenshot */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 100,
          right: 100,
          bottom: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: imgOpacity,
          transform: `scale(${imgScale})`,
        }}
      >
        <Img
          src={staticFile(file)}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: 16,
            border: `1px solid ${GOLD}20`,
            boxShadow: `0 40px 120px ${GOLD}12, 0 0 0 1px ${GOLD}08`,
          }}
        />
      </div>

      {/* Bottom info bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 130,
          background: `linear-gradient(to top, ${BG} 70%, transparent)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, color: TEXT, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 15, color: MUTED }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Outro ───────────────────────────────────────────────────────────
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = spring({ frame: frame - 10, fps, from: 0, to: 1, durationInFrames: 25 });
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [20, 40], [20, 0], { extrapolateRight: 'clamp' });
  const flowOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });
  const ctaOpacity = interpolate(frame, [65, 80], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const flowSteps = ['Discover', 'Learn', 'Choose', 'Pay', 'Trade'];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(228,182,76,0.08) 0%, ${BG} 70%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(228,182,76,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(228,182,76,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Check */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `${GREEN}15`,
          border: `2px solid ${GREEN}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          color: GREEN,
          transform: `scale(${checkScale})`,
          marginBottom: 32,
        }}
      >
        ✓
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>
          Structured wealth.
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, color: GOLD, letterSpacing: '-0.02em' }}>
          Zero guesswork.
        </div>
      </div>

      {/* Flow steps */}
      <div
        style={{
          opacity: flowOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginTop: 40,
        }}
      >
        {flowSteps.map((step, i) => (
          <React.Fragment key={step}>
            <div
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                background: `${GOLD}10`,
                border: `1px solid ${GOLD}25`,
                fontSize: 14,
                fontWeight: 700,
                color: GOLD,
                letterSpacing: '0.05em',
              }}
            >
              {step}
            </div>
            {i < flowSteps.length - 1 && (
              <div style={{ fontSize: 16, color: `${GOLD}50` }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          marginTop: 48,
          padding: '16px 40px',
          background: GOLD,
          color: BG,
          fontSize: 16,
          fontWeight: 800,
          borderRadius: 12,
          letterSpacing: '0.06em',
        }}
      >
        phimindflow.com
      </div>
    </AbsoluteFill>
  );
};

// ─── Main ────────────────────────────────────────────────────────────
export const PhimindflowPaymentFlow: React.FC = () => {
  const slidesStart = INTRO_DURATION;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <Intro />
      </Sequence>

      {SLIDES.map((slide, i) => (
        <Sequence key={slide.file} from={slidesStart + i * SLIDE_DURATION} durationInFrames={SLIDE_DURATION}>
          <Slide {...slide} index={i} total={SLIDES.length} />
        </Sequence>
      ))}

      <Sequence from={slidesStart + SLIDES.length * SLIDE_DURATION} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
