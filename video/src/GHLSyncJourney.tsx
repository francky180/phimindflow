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
  { file: 'avocadata-account.png', label: 'Connect', title: 'Avocadata → GHL connected', subtitle: 'PIT + Location ID verified' },
  { file: 'ghl-scopes-checkboxes.png', label: 'Scopes', title: '142 API scopes enabled', subtitle: 'Full read + write access' },
  { file: 'ghl-scopes-confirmed.png', label: 'Saved', title: 'Token updated + confirmed', subtitle: 'Security verified' },
  { file: 'ghl-tags-view.png', label: 'Tags', title: '13 lifecycle tags ready', subtitle: 'asf-lead → asf-customer' },
  { file: 'ghl-calendar-view.png', label: 'Calendar', title: 'Strategy call calendar live', subtitle: '30min · auto-confirm' },
  { file: 'avocadata-saved-lists.png', label: 'Lists', title: '3 lead lists · 1,415 contacts', subtitle: 'agency · REI AGENTS · life' },
  { file: 'avocadata-sync-ghl.png', label: 'Sync', title: 'One-click sync to GHL', subtitle: 'Native integration' },
  { file: 'ghl-contacts-synced.png', label: 'Landed', title: '798+ contacts in GHL', subtitle: 'Name · email · phone · tagged' },
];

const STEP_DURATION = 54;
export const GHL_SYNC_DURATION = STEP_DURATION * STEPS.length + 48;

const GOLD = '#e4b64c';
const GREEN = '#00e5a0';
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
  const scale = interpolate(frame, [0, STEP_DURATION], [1.01, 1.05]);
  const titleSlide = interpolate(frame, [0, 13], [28, 0], { extrapolateRight: 'clamp' });

  const isSync = label === 'Sync' || label === 'Landed';
  const accentColor = isSync ? GREEN : GOLD;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% -10%, ${accentColor}28, transparent)`,
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
            border: `1px solid ${accentColor}50`,
            boxShadow: `0 40px 140px ${accentColor}25, 0 0 0 1px rgba(255,255,255,0.04)`,
            transform: `scale(${scale})`,
          }}
        >
          <Img
            src={staticFile(`ghl-sync/${file}`)}
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
            background: 'rgba(10,10,14,0.92)',
            backdropFilter: 'blur(14px)',
            padding: '18px 48px',
            borderRadius: 16,
            border: `1px solid ${accentColor}50`,
            minWidth: 640,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.26em',
              color: accentColor,
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
        background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${GREEN}20, ${BG})`,
      }}
    >
      <div style={{ textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div
          style={{
            fontSize: 16,
            letterSpacing: '0.28em',
            color: GREEN,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          AVOCADATA → GOHIGHLEVEL
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          1,415 leads.
          <br />
          <span style={{ color: GOLD }}>One click.</span>
        </div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', marginTop: 22 }}>
          Connected · Synced · Tagged · Ready to close
        </div>
        <div style={{ fontSize: 14, color: GOLD, marginTop: 16, letterSpacing: '0.2em' }}>
          BUILT BY FRANC + CLAUDE OPUS 4.6
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GHLSyncJourney: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {STEPS.map((s, i) => (
        <Sequence key={s.file} from={i * STEP_DURATION} durationInFrames={STEP_DURATION}>
          <Step {...s} index={i} />
        </Sequence>
      ))}
      <Sequence from={STEPS.length * STEP_DURATION} durationInFrames={48}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
