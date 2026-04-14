import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const STEPS = [
  { file: '01-hero.png', title: 'One request. Full delivery.', subtitle: 'ai-system-factory.vercel.app' },
  { file: '02-value-layers.png', title: 'Three layers of value', subtitle: 'Strategy · Build · Growth' },
  { file: '03-one-brain.png', title: 'One brain. Infinite leverage.', subtitle: 'Every system wired in' },
  { file: '04-everything-included.png', title: 'Everything included', subtitle: 'No upsells. One price.' },
  { file: '05-memory.png', title: 'Memory advantage', subtitle: 'Never explain twice' },
  { file: '06-pricing.png', title: 'Pick your path', subtitle: '$250/mo or $1,500 one-time' },
  { file: '07-welcome-unlocked.png', title: 'Payment confirmed', subtitle: 'Instant delivery' },
  { file: '08-welcome-download.png', title: 'Your system, unlocked', subtitle: 'Download in one click' },
  { file: '09-access-code.png', title: 'Factory ready', subtitle: 'Start shipping' },
];

const STEP_DURATION = 60; // frames @ 30fps = 2s each
export const ASF_JOURNEY_DURATION = STEP_DURATION * STEPS.length + 30; // +1s outro

const GOLD = '#e4b64c';
const BG = '#0a0a0e';

const Step: React.FC<{ file: string; title: string; subtitle: string; index: number }> = ({
  file,
  title,
  subtitle,
  index,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame;
  const fadeIn = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(localFrame, [STEP_DURATION - 12, STEP_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const scale = interpolate(localFrame, [0, STEP_DURATION], [1.02, 1.06]);
  const titleSlide = interpolate(localFrame, [0, 15], [40, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 1200,
            height: 810,
            borderRadius: 18,
            overflow: 'hidden',
            border: `1px solid rgba(228,182,76,0.25)`,
            boxShadow: `0 30px 120px rgba(228,182,76,0.12), 0 0 0 1px rgba(255,255,255,0.04)`,
            transform: `scale(${scale})`,
          }}
        >
          <Img
            src={staticFile(`asf/${file}`)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 60,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            transform: `translateY(${titleSlide}px)`,
            textAlign: 'center',
            background: 'rgba(10,10,14,0.85)',
            backdropFilter: 'blur(12px)',
            padding: '20px 40px',
            borderRadius: 14,
            border: '1px solid rgba(228,182,76,0.3)',
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: '0.22em',
              color: GOLD,
              fontWeight: 700,
              marginBottom: 8,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            STEP {String(index + 1).padStart(2, '0')} / {STEPS.length}
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: 6,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.65)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {subtitle}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div
          style={{
            fontSize: 18,
            letterSpacing: '0.22em',
            color: GOLD,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          AI SYSTEM FACTORY
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          One request. <span style={{ color: GOLD }}>Full delivery.</span>
        </div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', marginTop: 18 }}>
          ai-system-factory.vercel.app
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ASFJourney: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {STEPS.map((s, i) => (
        <Sequence key={s.file} from={i * STEP_DURATION} durationInFrames={STEP_DURATION}>
          <Step {...s} index={i} />
        </Sequence>
      ))}
      <Sequence from={STEPS.length * STEP_DURATION} durationInFrames={30}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
