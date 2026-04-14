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
  { file: '01-hero.png', label: 'Landing', title: 'Fix, Build & Elevate', subtitle: 'Premium credit restoration' },
  { file: '02-what-we-remove.png', label: 'Targets', title: 'What We Can Remove', subtitle: '10 items, 3 bureaus' },
  { file: '03-how-it-works.png', label: 'Process', title: 'Analyze · Dispute · Rebuild', subtitle: 'A structured 3-step system' },
  { file: '04-services.png', label: 'Services', title: 'Built for structure', subtitle: 'Not guesswork' },
  { file: '05-testimonials.png', label: 'Results', title: 'Real clients, real lifts', subtitle: 'Verified score movement' },
  { file: '06-founder.png', label: 'Story', title: 'Meet Florlinda', subtitle: 'Founder & CEO' },
  { file: '07-faq.png', label: 'FAQ', title: 'Questions answered', subtitle: 'No confusion' },
  { file: '08-contact.png', label: 'Contact', title: 'Free assessment form', subtitle: 'Reach out direct' },
  { file: '09-footer.png', label: 'Footer', title: 'Clear + compliant', subtitle: 'Disclaimer + links' },
  { file: '10-pricing-3-tiers.png', label: 'Pricing', title: 'Three ways in', subtitle: '$17.99 · $97 · $499' },
  { file: '11-pricing-trust.png', label: 'Trust', title: 'Simple + transparent', subtitle: 'No contracts' },
  { file: '12-analyze-empty.png', label: 'Analyze', title: 'Upload your report', subtitle: 'PDF · TXT · HTML' },
  { file: '13-analyze-parsing.png', label: 'Parse', title: 'AI reads your report', subtitle: 'Real-time analysis' },
  { file: '14-analyze-results.png', label: 'Results', title: 'Every item classified', subtitle: 'Collections + negatives + disputable' },
  { file: '15-personalize-empty.png', label: 'Personalize', title: 'Tell us your goal', subtitle: 'Custom inputs drive custom output' },
  { file: '16-personalize-filled.png', label: 'Inputs', title: 'Goal · timeline · budget', subtitle: 'Your plan, your plan' },
  { file: '17-custom-plan.png', label: 'Your Plan', title: 'Here is your path', subtitle: 'Custom target + action steps' },
  { file: '18-custom-plan-steps.png', label: 'Steps', title: '5 numbered moves', subtitle: 'No guessing' },
  { file: '19-custom-plan-ctas.png', label: 'CTAs', title: 'Smart $97 or Full $499', subtitle: 'Pick your path' },
  { file: '20-welcome-ebook.png', label: 'Ebook', title: 'Ebook delivered', subtitle: 'Self-guided path' },
  { file: '21-welcome-smart.png', label: 'Smart', title: 'System unlocked', subtitle: 'Hands-on path' },
  { file: '22-welcome-full.png', label: 'Full', title: 'Full Repair enrolled', subtitle: 'Done-for-you path' },
];

const STEP_DURATION = 48;
export const FLORIFYE_JOURNEY_DURATION = STEP_DURATION * STEPS.length + 42;

const GOLD = '#e4b64c';
const BG = '#0a0a0e';

const Step: React.FC<{ file: string; label: string; title: string; subtitle: string; index: number }> = ({
  file, label, title, subtitle, index,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 9], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [STEP_DURATION - 9, STEP_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const scale = interpolate(frame, [0, STEP_DURATION], [1.015, 1.055]);
  const titleSlide = interpolate(frame, [0, 12], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% -10%, rgba(228,182,76,0.16), transparent)`,
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
            borderRadius: 22,
            overflow: 'hidden',
            border: `1px solid rgba(228,182,76,0.35)`,
            boxShadow: `0 40px 140px rgba(228,182,76,0.18), 0 0 0 1px rgba(255,255,255,0.04)`,
            transform: `scale(${scale})`,
          }}
        >
          <Img
            src={staticFile(`florifye/${file}`)}
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
          paddingBottom: 48,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            transform: `translateY(${titleSlide}px)`,
            textAlign: 'center',
            background: 'rgba(10,10,14,0.9)',
            backdropFilter: 'blur(14px)',
            padding: '18px 44px',
            borderRadius: 16,
            border: '1px solid rgba(228,182,76,0.4)',
            minWidth: 640,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.26em',
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
              color: 'rgba(255,255,255,0.72)',
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
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(228,182,76,0.14), ${BG})`,
      }}
    >
      <div style={{ textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div
          style={{
            fontSize: 20,
            letterSpacing: '0.28em',
            color: GOLD,
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          FLORIFYE
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          Fix, Build & Elevate
          <br />
          <span style={{ color: GOLD }}>Your Credit.</span>
        </div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', marginTop: 24 }}>
          $17.99 Ebook · $97 Smart System · $499 Full Repair
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FlorifyeJourney: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {STEPS.map((s, i) => (
        <Sequence key={s.file} from={i * STEP_DURATION} durationInFrames={STEP_DURATION}>
          <Step {...s} index={i} />
        </Sequence>
      ))}
      <Sequence from={STEPS.length * STEP_DURATION} durationInFrames={42}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
