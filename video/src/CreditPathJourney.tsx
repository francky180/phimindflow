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
  { file: '01-homepage-hero.png', label: 'Landing', title: 'Your path to better credit', subtitle: 'CreditPath · Black & gold' },
  { file: '02-homepage-how-it-works.png', label: 'Process', title: 'How it works', subtitle: 'Four simple steps' },
  { file: '03-homepage-services.png', label: 'Services', title: 'Pick your path', subtitle: 'DIY or Done-For-You' },
  { file: '04-analyze-upload-empty.png', label: 'Analyze', title: 'Upload your credit report', subtitle: 'PDF · TXT · HTML' },
  { file: '05-analyze-parsing.png', label: 'Parse', title: 'AI analyzes your report', subtitle: 'Real-time parsing' },
  { file: '06-analyze-results.png', label: 'Results', title: 'Every item, classified', subtitle: 'Scores · negatives · disputable' },
  { file: '07-analyze-collections.png', label: 'Collections', title: 'Priority hit list', subtitle: 'Highest-impact disputes first' },
  { file: '08-analyze-negative-accounts.png', label: 'Details', title: 'Late payments + charge-offs', subtitle: 'Every reason flagged' },
  { file: '09-personalize-form-empty.png', label: 'Personalize', title: 'Tell us your goal', subtitle: 'Custom inputs drive custom output' },
  { file: '10-personalize-form-filled.png', label: 'Inputs', title: 'Goal · timeline · budget', subtitle: 'Your plan is your plan' },
  { file: '11-custom-plan-generated.png', label: 'Your Plan', title: 'Hey Francky, here’s your path', subtitle: 'Custom score target + steps' },
  { file: '12-custom-plan-action-steps.png', label: 'Action Steps', title: '5 numbered steps', subtitle: 'No guesswork' },
  { file: '13-custom-plan-pricing.png', label: 'Pricing', title: 'DIY $47 · DFY $497', subtitle: 'No subscriptions' },
  { file: '14-service-pricing.png', label: 'Offers', title: 'Fix it yourself. Or we do it.', subtitle: 'Pick your path' },
  { file: '15-service-dfy-card.png', label: 'DFY', title: 'Done For You Recovery', subtitle: '$497 · 90-day guarantee' },
  { file: '16-welcome-dfy.png', label: 'Welcome', title: 'Payment confirmed', subtitle: 'Welcome to Recovery' },
  { file: '17-welcome-next-steps.png', label: 'Next Steps', title: '5 steps to score lift', subtitle: 'You know exactly what’s next' },
  { file: '18-welcome-diy.png', label: 'Blueprint', title: 'DIY delivery', subtitle: 'Welcome to Blueprint' },
];

const STEP_DURATION = 54; // frames @ 30fps = 1.8s each
export const CREDITPATH_JOURNEY_DURATION = STEP_DURATION * STEPS.length + 36; // + outro

const GOLD = '#e4b64c';
const BG = '#0a0a0e';

const Step: React.FC<{ file: string; label: string; title: string; subtitle: string; index: number }> = ({
  file, label, title, subtitle, index,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [STEP_DURATION - 10, STEP_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const scale = interpolate(frame, [0, STEP_DURATION], [1.015, 1.055]);
  const titleSlide = interpolate(frame, [0, 14], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% -10%, rgba(228,182,76,0.14), transparent)`,
        }}
      />
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 1280,
            height: 800,
            borderRadius: 20,
            overflow: 'hidden',
            border: `1px solid rgba(228,182,76,0.3)`,
            boxShadow: `0 40px 140px rgba(228,182,76,0.15), 0 0 0 1px rgba(255,255,255,0.04)`,
            transform: `scale(${scale})`,
          }}
        >
          <Img
            src={staticFile(`creditpath/${file}`)}
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
          paddingBottom: 50,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            transform: `translateY(${titleSlide}px)`,
            textAlign: 'center',
            background: 'rgba(10,10,14,0.88)',
            backdropFilter: 'blur(14px)',
            padding: '18px 44px',
            borderRadius: 16,
            border: '1px solid rgba(228,182,76,0.35)',
            minWidth: 640,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.24em',
              color: GOLD,
              fontWeight: 700,
              marginBottom: 6,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {String(index + 1).padStart(2, '0')} / {STEPS.length} · {label.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: 4,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.7)',
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
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(228,182,76,0.12), ${BG})`,
      }}
    >
      <div style={{ textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div
          style={{
            fontSize: 18,
            letterSpacing: '0.24em',
            color: GOLD,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          CREDITPATH
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Fix it yourself.
          <br />
          <span style={{ color: GOLD }}>Or we do it for you.</span>
        </div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', marginTop: 22 }}>
          $47 Blueprint · $497 Done For You
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CreditPathJourney: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {STEPS.map((s, i) => (
        <Sequence key={s.file} from={i * STEP_DURATION} durationInFrames={STEP_DURATION}>
          <Step {...s} index={i} />
        </Sequence>
      ))}
      <Sequence from={STEPS.length * STEP_DURATION} durationInFrames={36}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
