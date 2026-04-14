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
  { file: '01-homepage-hero.png', label: 'Landing', title: 'One request. Full delivery.', subtitle: 'ai-system-factory.vercel.app' },
  { file: '02-pricing-cards.png', label: 'Pricing', title: '$1,500 one-time · $250/mo', subtitle: 'Pick your path' },
  { file: '03-checkout-hero.png', label: 'Checkout', title: 'Secure checkout page', subtitle: 'Lead captured before payment' },
  { file: '04-checkout-plans.png', label: 'Plans', title: 'System Setup vs Operating Partner', subtitle: 'Click to select' },
  { file: '05-checkout-monthly-selected.png', label: 'Select', title: 'Operating Partner selected', subtitle: '$250/mo — most popular' },
  { file: '06-checkout-form-filled.png', label: 'Form', title: 'Name · email · phone captured', subtitle: 'Pushed to GHL as asf-lead' },
  { file: '07-checkout-cta-button.png', label: 'Pay', title: 'Continue to Stripe', subtitle: 'Secure redirect' },
  { file: '08-welcome-delivered.png', label: 'Delivered', title: 'Welcome to the factory', subtitle: 'Instant delivery' },
];

const STEP_DURATION = 54;
export const ASF_CHECKOUT_DURATION = STEP_DURATION * STEPS.length + 42;

const GOLD = '#e4b64c';
const BG = '#0a0a0e';

const Step: React.FC<{ file: string; label: string; title: string; subtitle: string; index: number }> = ({
  file, label, title, subtitle, index,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [STEP_DURATION - 10, STEP_DURATION], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const scale = interpolate(frame, [0, STEP_DURATION], [1.015, 1.055]);
  const titleSlide = interpolate(frame, [0, 12], [28, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 70% 40% at 50% -10%, ${GOLD}22, transparent)` }}
      />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 1280, height: 800, borderRadius: 20, overflow: 'hidden',
            border: `1px solid ${GOLD}40`,
            boxShadow: `0 40px 140px ${GOLD}20`,
            transform: `scale(${scale})`,
          }}
        >
          <Img
            src={staticFile(`asf-checkout/${file}`)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'flex-end', paddingBottom: 48,
        }}
      >
        <div
          style={{
            transform: `translateY(${titleSlide}px)`, textAlign: 'center',
            background: 'rgba(10,10,14,0.92)', backdropFilter: 'blur(14px)',
            padding: '18px 48px', borderRadius: 16,
            border: `1px solid ${GOLD}45`, minWidth: 640,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: '0.26em', color: GOLD, fontWeight: 700, marginBottom: 6 }}>
            {String(index + 1).padStart(2, '0')} / {STEPS.length} · {label.toUpperCase()}
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.72)' }}>
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
        backgroundColor: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity,
        background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${GOLD}18, ${BG})`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, letterSpacing: '0.28em', color: GOLD, fontWeight: 700, marginBottom: 14 }}>
          AI SYSTEM FACTORY
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Lead captured.
          <br />
          <span style={{ color: GOLD }}>Payment secured.</span>
        </div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.65)', marginTop: 22 }}>
          Next.js → GHL → Stripe → Delivery · one flow
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ASFCheckout: React.FC = () => (
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
