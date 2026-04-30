import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const BG = '#0a0a0e';
const BG_ELEV = '#0f0f14';
const CARD = '#14141a';
const CARD_HOVER = '#1a1a22';
const BORDER = '#24242e';
const BORDER_STRONG = '#34343f';
const WHITE = '#ffffff';
const MUTED = '#9a9aa6';
const FAINT = '#5a5a66';
const ACCENT = '#00e5a0';
const ACCENT_SOFT = 'rgba(0, 229, 160, 0.14)';
const GOLD = '#e4b64c';
const RED = '#ff5566';
const AMBER = '#ffb04a';

const FPS = 30;

const SCENES = {
  title: 120,      // 4s
  intro: 300,      // 10s
  landing: 420,    // 14s
  dashboard: 480,  // 16s
  library: 480,    // 16s
  detail: 420,     // 14s
  editor: 480,     // 16s
  backtest: 540,   // 18s
  marketplace: 420, // 14s
  alerts: 360,     // 12s
  account: 360,    // 12s
  demoMoments: 420, // 14s
  close: 240,      // 8s
};

export const STRAT_TOUR_DURATION =
  SCENES.title + SCENES.intro + SCENES.landing + SCENES.dashboard + SCENES.library +
  SCENES.detail + SCENES.editor + SCENES.backtest + SCENES.marketplace + SCENES.alerts +
  SCENES.account + SCENES.demoMoments + SCENES.close;

// ─── primitives ────────────────────────────────────────────────────

const Caption: React.FC<{ text: string; duration: number }> = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [duration - 16, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const o = Math.min(fadeIn, fadeOut);
  return (
    <div style={{
      position: 'absolute', left: 120, right: 120, bottom: 70,
      background: 'rgba(10, 10, 14, 0.86)',
      border: `1px solid ${BORDER}`,
      borderRadius: 10,
      padding: '20px 32px',
      color: WHITE, fontSize: 26, lineHeight: 1.45, opacity: o,
      textAlign: 'center', fontWeight: 400,
      backdropFilter: 'blur(8px)',
    }}>{text}</div>
  );
};

const SceneHeader: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', top: 50, left: 120,
      color: ACCENT, fontSize: 18, fontWeight: 700, letterSpacing: 3,
      textTransform: 'uppercase', opacity: o,
    }}>{label}</div>
  );
};

const Title: React.FC<{ text: string; top?: number }> = ({ text, top = 130 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', top, left: 0, right: 0, textAlign: 'center',
      color: WHITE, fontSize: 48, fontWeight: 800, letterSpacing: -1, opacity: o,
    }}>{text}</div>
  );
};

const Card: React.FC<{
  x: number; y: number; w: number; h: number;
  title?: string; sub?: string;
  delay?: number; accent?: string;
  children?: React.ReactNode; padding?: number;
}> = ({ x, y, w, h, title, sub, delay = 0, accent = BORDER, children, padding = 18 }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const o = interpolate(local, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ty = interpolate(local, [0, 14], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: y + ty, width: w, height: h,
      background: CARD, border: `1.5px solid ${accent}`,
      borderRadius: 12, padding, opacity: o,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      {title && <div style={{ color: WHITE, fontSize: 16, fontWeight: 700 }}>{title}</div>}
      {sub && <div style={{ color: MUTED, fontSize: 13, lineHeight: 1.4 }}>{sub}</div>}
      {children}
    </div>
  );
};

const StatTile: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; value: string; delay: number; accent?: string;
}> = ({ x, y, w, h, label, value, delay, accent = ACCENT }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const o = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      background: CARD, border: `1.5px solid ${BORDER}`,
      borderRadius: 10, padding: '16px 18px', opacity: o,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ color: MUTED, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ color: accent, fontSize: 28, fontWeight: 800, fontFamily: 'ui-monospace,monospace', letterSpacing: -0.5 }}>{value}</div>
    </div>
  );
};

const Pill: React.FC<{ x: number; y: number; label: string; delay: number; accent?: string; bg?: string }> = ({ x, y, label, delay, accent = MUTED, bg = CARD }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: y, padding: '4px 12px',
      borderRadius: 999, background: bg, border: `1px solid ${BORDER}`,
      color: accent, fontSize: 13, fontWeight: 600, opacity: o, whiteSpace: 'nowrap',
    }}>{label}</div>
  );
};

const AppChrome: React.FC<{ activeNav: string; pageTitle: string }> = ({ activeNav, pageTitle }) => {
  const frame = useCurrentFrame();
  const nav = ['Dashboard', 'Strategies', 'Editor', 'Backtesting', 'Marketplace', 'Alerts', 'Account'];
  return (
    <>
      {/* Sidebar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: 240, height: 1080,
        background: BG_ELEV, borderRight: `1px solid ${BORDER}`,
        padding: '20px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, padding: '6px 10px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: `linear-gradient(135deg, ${ACCENT}, #00b47e)`, color: '#0a0a0e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>SO</div>
          <div>
            <div style={{ color: WHITE, fontWeight: 700, fontSize: 14 }}>StratOptimizer</div>
            <div style={{ color: MUTED, fontSize: 10, letterSpacing: 2 }}>AI</div>
          </div>
        </div>
        {nav.map((n, i) => {
          const active = n === activeNav;
          const o = interpolate(frame, [i * 4, i * 4 + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={n} style={{
              padding: '10px 12px', marginBottom: 2, borderRadius: 6,
              background: active ? CARD : 'transparent',
              color: active ? WHITE : MUTED,
              fontSize: 13, fontWeight: 500,
              boxShadow: active ? `inset 2px 0 0 ${ACCENT}` : 'none',
              opacity: o,
            }}>{n}</div>
          );
        })}
      </div>
      {/* Topbar */}
      <div style={{
        position: 'absolute', left: 240, top: 0, right: 0, height: 72,
        borderBottom: `1px solid ${BORDER}`, background: BG,
        display: 'flex', alignItems: 'center', padding: '0 32px',
      }}>
        <div style={{ color: WHITE, fontSize: 20, fontWeight: 700 }}>{pageTitle}</div>
      </div>
    </>
  );
};

// ─── scenes ────────────────────────────────────────────────────────

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 22 } });
  const o = Math.min(
    interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(frame, [SCENES.title - 18, SCENES.title], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  return (
    <AbsoluteFill style={{ backgroundColor: BG, alignItems: 'center', justifyContent: 'center', opacity: o }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${ACCENT_SOFT}, transparent 70%)` }} />
      <div style={{ color: ACCENT, fontSize: 20, letterSpacing: 6, fontWeight: 700, transform: `translateY(${(1 - s) * -20}px)` }}>
        THE PLATFORM TOUR
      </div>
      <div style={{ color: WHITE, fontSize: 108, fontWeight: 800, marginTop: 26, letterSpacing: -2, transform: `translateY(${(1 - s) * 30}px)` }}>
        StratOptimizer <span style={{ color: ACCENT }}>AI</span>
      </div>
      <div style={{ color: MUTED, fontSize: 28, marginTop: 36, letterSpacing: 0.3 }}>
        An AI-powered trading strategy platform — page by page.
      </div>
    </AbsoluteFill>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="What It Is" />
      <Title text="One platform. Four jobs." top={130} />

      {/* Central flow diagram */}
      <div style={{ position: 'absolute', top: 320, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 320px)', gap: 24 }}>
          {[
            { title: 'Pick a framework', sub: '9 battle-tested strategies', delay: 20 },
            { title: 'Customize to you', sub: 'Editor tunes the logic', delay: 80 },
            { title: 'Backtest it', sub: 'See real historical results', delay: 140 },
            { title: 'Deploy or sell', sub: 'Export Pine · list in market', delay: 200 },
          ].map((p, i) => {
            const o = interpolate(frame, [p.delay, p.delay + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const ty = interpolate(frame, [p.delay, p.delay + 14], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                background: CARD, border: `1.5px solid ${ACCENT}40`, borderRadius: 12,
                padding: '26px 24px', opacity: o, transform: `translateY(${ty}px)`,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ color: ACCENT, fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ color: WHITE, fontSize: 24, fontWeight: 700, letterSpacing: -0.3 }}>{p.title}</div>
                <div style={{ color: MUTED, fontSize: 15, lineHeight: 1.5 }}>{p.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Caption duration={SCENES.intro}
        text="StratOptimizer is a trading strategy platform. Traders pick from nine proven frameworks, tune them in a modular editor, test against historical data, and deploy the winners — or sell them in the marketplace." />
    </AbsoluteFill>
  );
};

const LandingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const heroOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="01 · Landing Page" />

      {/* Browser chrome mockup */}
      <div style={{
        position: 'absolute', left: 140, top: 120, right: 140, height: 840,
        background: BG_ELEV, border: `1px solid ${BORDER_STRONG}`, borderRadius: 14,
        overflow: 'hidden', opacity: heroOpacity,
      }}>
        <div style={{ background: CARD, padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: RED }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: AMBER }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: ACCENT }} />
          <div style={{ flex: 1, textAlign: 'center', color: MUTED, fontSize: 13, fontFamily: 'ui-monospace,monospace' }}>stratoptimizer.vercel.app</div>
        </div>
        <div style={{ padding: '50px 60px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', padding: '6px 16px', border: `1px solid ${BORDER}`,
            borderRadius: 999, background: CARD, color: ACCENT, fontSize: 13, fontWeight: 600,
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 32,
          }}>AI-powered strategy optimization</div>
          <div style={{ color: WHITE, fontSize: 80, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
            Your unfair advantage<br />
            <span style={{ color: ACCENT }}>in the market.</span>
          </div>
          <div style={{ color: MUTED, fontSize: 19, lineHeight: 1.6, marginTop: 32, maxWidth: 720, margin: '32px auto 0' }}>
            Build, backtest, and deploy winning trading strategies powered by AI.
            Stop guessing. Start trading with data, precision, and confidence.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 48 }}>
            <div style={{ background: ACCENT, color: '#0a0a0e', padding: '16px 28px', borderRadius: 8, fontWeight: 700, fontSize: 16 }}>Enter the platform →</div>
            <div style={{ background: CARD, color: WHITE, padding: '16px 28px', borderRadius: 8, fontWeight: 600, fontSize: 16, border: `1px solid ${BORDER_STRONG}` }}>Browse 9 frameworks</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginTop: 72, paddingTop: 36, borderTop: `1px solid ${BORDER}` }}>
            {[
              { n: '9', l: 'battle-tested frameworks' },
              { n: '1.92+', l: 'avg profit factor' },
              { n: 'Pine v5', l: 'one-click export' },
              { n: 'AI', l: 'strategy ranking' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ color: ACCENT, fontSize: 28, fontWeight: 800, fontFamily: 'ui-monospace,monospace' }}>{t.n}</div>
                <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Caption duration={SCENES.landing}
        text="The landing page pitches the product to new visitors. Premium dark aesthetic, electric-green accent, clear headline, and two calls-to-action: enter the platform or browse the frameworks." />
    </AbsoluteFill>
  );
};

const DashboardScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AppChrome activeNav="Dashboard" pageTitle="Dashboard" />

      {/* Stats grid */}
      <StatTile x={272} y={108} w={200} h={104} label="Active Strategies" value="7" delay={40} />
      <StatTile x={488} y={108} w={200} h={104} label="Win Rate (30d)" value="61.4%" delay={54} />
      <StatTile x={704} y={108} w={200} h={104} label="Avg R/R" value="2.3R" delay={68} />
      <StatTile x={920} y={108} w={200} h={104} label="Backtests" value="41" delay={82} />
      <StatTile x={1136} y={108} w={200} h={104} label="Alerts Today" value="8" delay={96} />
      <StatTile x={1352} y={108} w={200} h={104} label="Best Template" value="ICT" delay={110} />

      {/* Best template highlight */}
      <Card x={272} y={232} w={1080} h={220} title="Best-performing template" sub="ICT Unicorn · breaker + FVG confluence model" delay={130} accent={`${ACCENT}55`}>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Pill x={0} y={0} label="Forex" delay={140} />
          <Pill x={80} y={0} label="15m" delay={148} />
          <Pill x={140} y={0} label="ICT" delay={156} accent={ACCENT} bg={ACCENT_SOFT} />
        </div>
        <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
          {[
            { l: 'WIN', v: '71%' },
            { l: 'PROFIT FACTOR', v: '2.85' },
            { l: 'R/R', v: '3.0' },
            { l: 'SHARPE', v: '2.40' },
            { l: 'DRAWDOWN', v: '6.8%', red: true },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ color: MUTED, fontSize: 10, letterSpacing: 1, fontWeight: 600 }}>{s.l}</div>
              <div style={{ color: s.red ? RED : ACCENT, fontSize: 22, fontWeight: 700, fontFamily: 'ui-monospace,monospace', marginTop: 4 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom row: alerts + membership */}
      <Card x={272} y={472} w={520} h={300} title="Active alerts" sub="Last 24 hours" delay={180}>
        <div style={{ marginTop: 14 }}>
          {['NQ · Long', 'EURUSD · Short', 'GBPUSD · Long', 'XAUUSD · Short'].map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderBottom: i < 3 ? `1px solid ${BORDER}` : 'none',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: i === 3 ? RED : ACCENT }} />
              <div style={{ flex: 1, color: WHITE, fontSize: 14, fontFamily: 'ui-monospace,monospace', fontWeight: 600 }}>{a}</div>
              <div style={{ color: ACCENT, fontSize: 13, fontFamily: 'ui-monospace,monospace', fontWeight: 700 }}>{[82, 76, 89, 64][i]}%</div>
            </div>
          ))}
        </div>
      </Card>

      <Card x={812} y={472} w={540} h={300} title="AI insight of the day" delay={220}>
        <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: ACCENT_SOFT, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, letterSpacing: 0.5, flexShrink: 0 }}>AI</div>
          <div style={{ color: '#d6d6de', fontSize: 14, lineHeight: 1.6 }}>
            Your <span style={{ color: WHITE, fontWeight: 600 }}>ICT Unicorn</span> strategy shows the strongest risk-adjusted return.
            Consider tightening confirmation filters on <span style={{ color: WHITE, fontWeight: 600 }}>No Wick Strategy</span> — the model suggests 14% lower drawdown is available.
          </div>
        </div>
      </Card>

      <Card x={1372} y={472} w={260} h={300} title="Membership" delay={260}>
        <div style={{ marginTop: 14 }}>
          <div style={{ color: ACCENT, fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>Pro</div>
          <div style={{ color: MUTED, fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>
            Unlimited backtests · AI optimization · Pine Script export.
          </div>
        </div>
      </Card>

      <Caption duration={SCENES.dashboard}
        text="The Dashboard is the command center. Six stat tiles at the top show win rate, active strategies, and today's alerts. Below: the best-performing template, live alerts, AI insight, and plan card — everything at a glance." />
    </AbsoluteFill>
  );
};

const LibraryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const frameworks = [
    'Enhanced ORB', 'TJR Asian Sweep', 'ICT Unicorn',
    '5M Asia Gold', 'Gold Time Strategy', 'NY Open Retest',
    'No Wick Strategy', 'Session Sweep', 'Momentum Break',
  ];
  const markets = ['Futures', 'Forex', 'Forex', 'Forex', 'Forex', 'Indices', 'Crypto', 'Forex', 'Stocks'];
  const tfs = ['5m', '15m', '15m', '5m', '15m', '5m', '1h', '30m', '30m'];
  const wins = [58, 64, 71, 61, 56, 59, 52, 66, 55];
  const pfs = [1.92, 2.40, 2.85, 1.70, 1.65, 1.75, 1.90, 2.30, 1.50];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AppChrome activeNav="Strategies" pageTitle="Strategy Library" />

      {/* Filter bar */}
      <div style={{ position: 'absolute', left: 272, top: 108, right: 48, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ color: MUTED, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>MARKET</div>
          {['All', 'Forex', 'Crypto', 'Futures', 'Stocks'].map((m, i) => (
            <div key={m} style={{
              padding: '5px 12px', borderRadius: 6,
              border: `1px solid ${i === 1 ? `${ACCENT}55` : BORDER}`,
              background: i === 1 ? ACCENT_SOFT : 'transparent',
              color: i === 1 ? ACCENT : MUTED,
              fontSize: 12, fontWeight: 500,
              opacity: interpolate(frame, [i * 3, i * 3 + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>{m}</div>
          ))}
        </div>
      </div>

      {/* 9 framework cards in 3x3 grid */}
      <div style={{ position: 'absolute', left: 272, top: 200, right: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {frameworks.map((name, i) => {
          const delay = 40 + i * 15;
          const o = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const ty = interpolate(frame, [delay, delay + 14], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 10,
              padding: 22, opacity: o, transform: `translateY(${ty}px)`, minHeight: 220,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <div style={{ padding: '3px 10px', borderRadius: 999, border: `1px solid ${BORDER}`, color: MUTED, fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{markets[i]}</div>
                <div style={{ padding: '3px 10px', borderRadius: 999, border: `1px solid ${BORDER}`, color: MUTED, fontSize: 10, fontWeight: 600, fontFamily: 'ui-monospace,monospace' }}>{tfs[i]}</div>
              </div>
              <div style={{ color: WHITE, fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{name}</div>
              <div style={{ color: MUTED, fontSize: 13, lineHeight: 1.4, flex: 1 }}>
                {['Opening-range breakout with liquidity confirmation.', 'Liquidity grab off Asian session extremes.',
                  'Breaker + FVG confluence model.', 'Gold scalping during Asia consolidation.',
                  'Time-based XAUUSD sessions.', 'NY session retest of pre-market range.',
                  'Strong-body continuation on clean closes.', 'Multi-session liquidity sweep framework.',
                  'Volume-confirmed breaks with trend filter.'][i]}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <div><div style={{ color: MUTED, fontSize: 9, letterSpacing: 1, fontWeight: 600 }}>WIN</div><div style={{ color: ACCENT, fontSize: 14, fontFamily: 'ui-monospace,monospace', fontWeight: 700, marginTop: 2 }}>{wins[i]}%</div></div>
                <div><div style={{ color: MUTED, fontSize: 9, letterSpacing: 1, fontWeight: 600 }}>PF</div><div style={{ color: ACCENT, fontSize: 14, fontFamily: 'ui-monospace,monospace', fontWeight: 700, marginTop: 2 }}>{pfs[i].toFixed(2)}</div></div>
                <div style={{ background: ACCENT, color: '#0a0a0e', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>View →</div>
              </div>
            </div>
          );
        })}
      </div>

      <Caption duration={SCENES.library}
        text="The Strategy Library shows all nine frameworks in a 3-by-3 grid. Filter by market, timeframe, difficulty, or style to narrow in on what fits your trading. Every card shows win rate, profit factor, and a one-line tagline." />
    </AbsoluteFill>
  );
};

const DetailScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AppChrome activeNav="Strategies" pageTitle="ICT Unicorn" />

      {/* Metrics bar */}
      <Card x={272} y={108} w={1360} h={128} delay={30}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Pill x={0} y={0} label="Forex" delay={40} />
          <Pill x={70} y={0} label="15m" delay={50} />
          <Pill x={120} y={0} label="ICT" delay={60} accent={ACCENT} bg={ACCENT_SOFT} />
          <Pill x={180} y={0} label="Advanced" delay={70} accent={RED} bg="rgba(255, 85, 102, 0.1)" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginTop: 20 }}>
          {[
            { l: 'WIN', v: '71%' }, { l: 'R/R', v: '3.0' }, { l: 'PF', v: '2.85' },
            { l: 'TRADES', v: '102' }, { l: 'DD', v: '6.8%', red: true }, { l: 'SHARPE', v: '2.40' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ color: MUTED, fontSize: 10, letterSpacing: 1, fontWeight: 600 }}>{s.l}</div>
              <div style={{ color: s.red ? RED : ACCENT, fontSize: 20, fontWeight: 700, fontFamily: 'ui-monospace,monospace', marginTop: 3 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* How It Works */}
      <Card x={272} y={256} w={890} h={400} title="How it works" delay={80}>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            'Identify a breaker block on 15m (swing low taken, then close above old swing high).',
            "Mark the fair value gap inside the breaker.",
            'Wait for price to return to that FVG.',
            'Enter on a lower timeframe CHoCH inside the FVG.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                background: ACCENT_SOFT, color: ACCENT, padding: '4px 10px', borderRadius: 4,
                fontSize: 13, fontWeight: 700, fontFamily: 'ui-monospace,monospace', flexShrink: 0,
              }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ color: '#d6d6de', fontSize: 15, lineHeight: 1.6 }}>{step}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insights */}
      <Card x={1182} y={256} w={450} h={400} title="AI optimization insights" sub="From 10M+ trade samples" delay={130} accent={`${ACCENT}50`}>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            'Premium setups live on DXY-correlated pairs.',
            'Combining with daily bias filter lifts win rate to 79%.',
            'Avoid low-volatility holidays — slippage kills R.',
          ].map((i, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ color: ACCENT, fontSize: 14, marginTop: 2 }}>◆</div>
              <div style={{ color: '#d6d6de', fontSize: 13, lineHeight: 1.5 }}>{i}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Logic grid */}
      <Card x={272} y={680} w={434} h={220} title="Entry" sub="15m breaker + 15m FVG + 5m CHoCH confirmation." delay={180} />
      <Card x={720} y={680} w={434} h={220} title="Stop Loss" sub="Below the breaker's low swing point." delay={200} />
      <Card x={1168} y={680} w={464} h={220} title="Take Profit" sub="Previous 4h liquidity pool — draw on liquidity." delay={220} />

      <Caption duration={SCENES.detail}
        text="Every strategy gets a detail page. Numbered how-it-works steps, entry rules, stop-loss and take-profit logic, plus AI insights suggesting improvements. It's a complete trading playbook — not vague theory." />
    </AbsoluteFill>
  );
};

const EditorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sections = ['Setup', 'Entry Logic', 'Confirmations', 'Risk Logic', 'Exit Logic', 'Filters', 'Alerts'];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AppChrome activeNav="Editor" pageTitle="Strategy Editor" />

      {/* Main editor column */}
      <div style={{ position: 'absolute', left: 272, top: 108, width: 880, bottom: 40, overflow: 'hidden' }}>
        {sections.map((s, i) => {
          const delay = 20 + i * 20;
          const o = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const highlight = Math.floor(((frame - 250) / 40) % sections.length) === i && frame > 250;
          return (
            <div key={i} style={{
              background: CARD,
              border: `1.5px solid ${highlight ? ACCENT : BORDER}`,
              borderRadius: 10, padding: 18, marginBottom: 10, opacity: o,
              transition: 'border-color 0.3s',
            }}>
              <div style={{ color: WHITE, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s}</div>
              <div style={{ color: MUTED, fontSize: 13 }}>
                {['Define the environment.', 'Rules that open the position.', 'Layered filters to reduce false entries.',
                  'Position sizing + loss containment.', 'How profits are taken.', 'Day-of-week + news blackout.',
                  'How you get notified.'][i]}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[0, 1, 2].map((ci) => (
                  <div key={ci} style={{
                    background: BG_ELEV, border: `1px solid ${BORDER}`,
                    padding: '6px 12px', borderRadius: 6,
                    color: MUTED, fontSize: 11, fontFamily: 'ui-monospace,monospace',
                  }}>
                    {[['Name', 'Market', 'Timeframe'],
                      ['Trigger', 'Filter', 'Confidence'],
                      ['HTF bias', 'Volatility', 'News'],
                      ['Risk %', 'Max trades', 'SL type'],
                      ['TP type', 'R/R target', 'Partial exit'],
                      ['Day filter', 'CPI block', 'Min range'],
                      ['In-app', 'Email', 'Webhook']][i][ci]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side: live preview */}
      <Card x={1172} y={108} w={460} h={400} title="Live preview" sub="Updates as you edit" delay={200}>
        <div style={{ marginTop: 12 }}>
          {[
            ['Framework', 'TJR Asian Sweep'],
            ['Market · TF', 'EURUSD · 15m'],
            ['Session', 'London Open'],
            ['Risk/trade', '0.5%'],
            ['Target R/R', '2.5R'],
            ['Max trades/day', '3'],
            ['Alerts', 'App + Email'],
          ].map(([l, v], i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '9px 0', borderBottom: i < 6 ? `1px solid ${BORDER}` : 'none',
              fontSize: 13,
            }}>
              <span style={{ color: MUTED }}>{l}</span>
              <span style={{ color: WHITE, fontWeight: 600, fontFamily: 'ui-monospace,monospace' }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card x={1172} y={528} w={460} h={260} title="Export" sub="One click to Pine Script" delay={260} accent={`${ACCENT}50`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
          <div style={{ background: ACCENT, color: '#0a0a0e', padding: 12, borderRadius: 6, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>Generate Pine Script v5</div>
          <div style={{ background: 'transparent', color: WHITE, padding: 12, borderRadius: 6, border: `1px solid ${BORDER_STRONG}`, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>Export JSON</div>
          <div style={{ background: 'transparent', color: MUTED, padding: 12, borderRadius: 6, border: `1px solid ${BORDER}`, textAlign: 'center', fontSize: 13, fontWeight: 500 }}>Copy config</div>
        </div>
      </Card>

      <Caption duration={SCENES.editor}
        text="The Editor has seven modular sections — setup, entry, confirmations, risk, exit, filters, alerts. About thirty-five controls total: dropdowns, toggles, range sliders. The live preview panel shows your config, and one click generates Pine Script." />
    </AbsoluteFill>
  );
};

const BacktestScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AppChrome activeNav="Backtesting" pageTitle="Backtesting" />

      {/* Result banner */}
      <div style={{
        position: 'absolute', left: 272, top: 108, right: 48, height: 120,
        background: CARD, border: `1.5px solid ${ACCENT}50`, borderRadius: 10,
        padding: '22px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div>
          <div style={{ color: WHITE, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>ICT Unicorn · <span style={{ fontFamily: 'ui-monospace,monospace' }}>GBPUSD</span></div>
          <div style={{ color: MUTED, fontSize: 13 }}>15m · 2025-10-01 → 2026-04-20 · 102 trades</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, fontWeight: 600 }}>NET RETURN</div>
          <div style={{ color: ACCENT, fontSize: 44, fontWeight: 800, fontFamily: 'ui-monospace,monospace' }}>+72.1%</div>
        </div>
      </div>

      {/* 9 metric cards */}
      <div style={{ position: 'absolute', left: 272, top: 248, right: 48, display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 10 }}>
        {[
          ['Total trades', '102'], ['Win rate', '71.6%', true], ['Profit factor', '2.85', true],
          ['Max drawdown', '6.8%', false, true], ['Sharpe', '2.40', true], ['Avg win', '3.9R'],
          ['Avg loss', '−1.2R', false, true], ['Best streak', '14W', true], ['Worst streak', '2L', false, true],
        ].map((m, i) => {
          const [l, v, accent, red] = m;
          return (
            <div key={i} style={{
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 12,
              opacity: interpolate(frame, [60 + i * 6, 60 + i * 6 + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <div style={{ color: MUTED, fontSize: 9, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>{l}</div>
              <div style={{
                color: red ? RED : accent ? ACCENT : WHITE,
                fontSize: 16, fontWeight: 700, fontFamily: 'ui-monospace,monospace', marginTop: 4,
              }}>{v}</div>
            </div>
          );
        })}
      </div>

      {/* Equity curve mock */}
      <Card x={272} y={380} w={900} h={300} title="Equity curve" sub="Account growth over test period" delay={160}>
        <svg viewBox="0 0 860 200" style={{ width: '100%', height: 200, marginTop: 10 }}>
          <defs>
            <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.45} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>
          {(() => {
            const pts = 80;
            const points = Array.from({ length: pts }, (_, i) => {
              const x = (i / (pts - 1)) * 860;
              const progress = interpolate(frame, [180, 400], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const visible = i / (pts - 1) <= progress ? 1 : 0;
              const baseY = 200 - (i / (pts - 1)) * 150 - 20;
              const noise = Math.sin(i / 3) * 6 + Math.cos(i / 7) * 8;
              return { x, y: (baseY + noise) * visible + (1 - visible) * 200 };
            });
            const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            const area = `${path} L 860 200 L 0 200 Z`;
            return (
              <>
                <path d={area} fill="url(#eq)" />
                <path d={path} stroke={ACCENT} strokeWidth={2.5} fill="none" />
              </>
            );
          })()}
        </svg>
      </Card>

      {/* AI insights mini panel */}
      <Card x={1182} y={380} w={450} h={300} title="AI optimization insights" delay={200} accent={`${ACCENT}50`}>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            ['◆ High impact', 'Add volatility filter', 'Lifts profit factor from 2.85 → 2.31.'],
            ['◆ Medium impact', 'Tighten confirmation window', '−22% trades, +0.4R expectancy.'],
            ['◆ Risk note', 'Drawdown clusters in CPI weeks', 'Pause on CPI → Sharpe 2.15.'],
          ].map(([badge, title, body], i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ color: ACCENT, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{badge}</div>
              <div style={{ color: WHITE, fontSize: 13, fontWeight: 700, marginTop: 4 }}>{title}</div>
              <div style={{ color: MUTED, fontSize: 12, lineHeight: 1.4, marginTop: 2 }}>{body}</div>
            </div>
          ))}
        </div>
      </Card>

      <Caption duration={SCENES.backtest}
        text="Backtesting is the money-maker scene. Pick strategy + symbol + date range, hit run. You get nine metrics, an animated green equity curve showing account growth, and four AI suggestions for how to improve the strategy." />
    </AbsoluteFill>
  );
};

const MarketplaceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    { name: 'Precision Sweep (TJR)', creator: 'Daxon Miles', tier: 'Pro', price: 97, win: 71 },
    { name: 'Gold Scalper Pro', creator: 'Amara Reyes', tier: 'Pro', price: 49, win: 62 },
    { name: 'Premium Liquidity Suite', creator: 'Orin Vale', tier: 'Premium', price: 249, win: 68 },
    { name: 'Simple ORB Starter', creator: 'StratOptimizer', tier: 'Free', price: null, win: 54 },
    { name: 'Crypto Momentum Pack', creator: 'Ziva Okafor', tier: 'Pro', price: 79, win: 57 },
    { name: 'London Killshot', creator: 'Nuri Saeed', tier: 'Premium', price: 149, win: 74 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AppChrome activeNav="Marketplace" pageTitle="Strategy Marketplace" />

      <div style={{ position: 'absolute', left: 272, top: 108, right: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {items.map((it, i) => {
          const delay = 30 + i * 18;
          const o = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const ty = interpolate(frame, [delay, delay + 14], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const tierColor = it.tier === 'Free' ? MUTED : it.tier === 'Premium' ? GOLD : ACCENT;
          const tierBg = it.tier === 'Free' ? CARD : it.tier === 'Premium' ? 'rgba(228, 182, 76, 0.1)' : ACCENT_SOFT;
          return (
            <div key={i} style={{
              background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 10,
              padding: 20, opacity: o, transform: `translateY(${ty}px)`,
              display: 'flex', flexDirection: 'column', gap: 10, minHeight: 240,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 17,
                  background: `linear-gradient(135deg, ${ACCENT_SOFT}, rgba(228, 182, 76, 0.09))`,
                  border: `1px solid ${BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: WHITE, fontSize: 11, fontWeight: 700,
                }}>{it.creator.split(' ').map((x) => x[0]).join('')}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: WHITE, fontSize: 12, fontWeight: 600 }}>{it.creator}</div>
                  <div style={{ color: MUTED, fontSize: 10 }}>@{it.creator.toLowerCase().replace(/\s/g, '')}</div>
                </div>
                <div style={{
                  padding: '3px 10px', borderRadius: 999,
                  background: tierBg, color: tierColor,
                  border: `1px solid ${tierColor}55`,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                }}>{it.tier}</div>
              </div>
              <div style={{ color: WHITE, fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>{it.name}</div>
              <div style={{ flex: 1 }} />
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 14, borderTop: `1px solid ${BORDER}`,
              }}>
                <div>
                  <div style={{ color: GOLD, fontSize: 12, fontWeight: 700 }}>★ {(4.3 + (i * 0.1)).toFixed(1)}</div>
                  <div style={{ color: MUTED, fontSize: 10 }}>WIN {it.win}%</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ color: WHITE, fontSize: 16, fontWeight: 800, fontFamily: 'ui-monospace,monospace' }}>
                    {it.price ? `$${it.price}` : <span style={{ color: ACCENT, fontSize: 12, letterSpacing: 1 }}>FREE</span>}
                  </div>
                  <div style={{ background: ACCENT, color: '#0a0a0e', padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Unlock →</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Caption duration={SCENES.marketplace}
        text="The Marketplace lets traders buy strategies from other creators — or sell their own. Free, Pro, and Premium tiers. Native Whop checkout. Every listing shows the creator, tier, price, star rating, and performance stats." />
    </AbsoluteFill>
  );
};

const AlertsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const alerts = [
    { status: 'Filled', strat: 'Enhanced ORB', asset: 'NQ', dir: 'Long', conf: 82 },
    { status: 'Triggered', strat: 'TJR Asian Sweep', asset: 'EURUSD', dir: 'Short', conf: 76 },
    { status: 'Filled', strat: 'ICT Unicorn', asset: 'GBPUSD', dir: 'Long', conf: 89 },
    { status: 'Expired', strat: '5M Asia Gold', asset: 'XAUUSD', dir: 'Short', conf: 64 },
    { status: 'Pending', strat: 'NY Open Retest', asset: 'ES', dir: 'Long', conf: 71 },
    { status: 'Filled', strat: 'Session Sweep', asset: 'USDJPY', dir: 'Short', conf: 78 },
  ];
  const statusColor: Record<string, string> = { Filled: ACCENT, Triggered: AMBER, Pending: MUTED, Expired: RED };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AppChrome activeNav="Alerts" pageTitle="Alerts & Signals" />

      {/* Summary cards */}
      <div style={{ position: 'absolute', left: 272, top: 108, right: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[['Filled', '3'], ['Triggered', '1'], ['Pending', '1'], ['Expired', '1']].map(([l, v], i) => (
          <div key={i} style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px',
            opacity: interpolate(frame, [i * 8, i * 8 + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{ color: MUTED, fontSize: 11, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>{l}</div>
            <div style={{ color: ACCENT, fontSize: 28, fontWeight: 800, fontFamily: 'ui-monospace,monospace', marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Alert rows */}
      <Card x={272} y={250} w={1100} h={540} title="Recent alerts" sub="Last 24 hours" delay={50}>
        <div style={{ marginTop: 14 }}>
          {alerts.map((a, i) => {
            const o = interpolate(frame, [70 + i * 15, 70 + i * 15 + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 100px 70px 200px',
                alignItems: 'center', gap: 14, padding: '14px 0',
                borderBottom: i < alerts.length - 1 ? `1px solid ${BORDER}` : 'none',
                opacity: o,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 4, width: 'fit-content',
                  color: statusColor[a.status], background: `${statusColor[a.status]}20`,
                }}>{a.status}</div>
                <div style={{ color: WHITE, fontSize: 13 }}>{a.strat}</div>
                <div style={{ color: WHITE, fontSize: 13, fontFamily: 'ui-monospace,monospace', fontWeight: 700 }}>{a.asset}</div>
                <div style={{
                  padding: '3px 10px', borderRadius: 999,
                  background: a.dir === 'Long' ? ACCENT_SOFT : 'rgba(255, 85, 102, 0.12)',
                  color: a.dir === 'Long' ? ACCENT : RED,
                  border: `1px solid ${a.dir === 'Long' ? ACCENT : RED}55`,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                  width: 'fit-content',
                }}>{a.dir}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 4, background: BORDER, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${a.conf}%`, height: '100%', background: ACCENT }} />
                  </div>
                  <div style={{ color: ACCENT, fontSize: 12, fontFamily: 'ui-monospace,monospace', fontWeight: 700, minWidth: 40, textAlign: 'right' }}>{a.conf}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card x={1392} y={250} w={240} h={540} title="Notifications" delay={100}>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['In-app', true], ['Email', true], ['SMS', false], ['Webhook', false]].map(([l, on], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: WHITE, fontSize: 13 }}>{l as string}</span>
              <div style={{ width: 36, height: 20, borderRadius: 10, background: on ? ACCENT : BORDER, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 2, left: on ? 18 : 2,
                  width: 16, height: 16, borderRadius: 8,
                  background: on ? '#0a0a0e' : WHITE,
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Caption duration={SCENES.alerts}
        text="Alerts fires in real time when your strategy conditions trigger. Status chips show Filled, Triggered, Pending, or Expired. Each alert shows direction and confidence. Toggle email, SMS, or webhook notifications from the right panel." />
    </AbsoluteFill>
  );
};

const AccountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const plans = [
    { name: 'Free', price: 0, feats: ['3 core frameworks', '5 backtests/mo', 'Browse marketplace', '1 saved strategy'], current: false },
    { name: 'Pro', price: 49, feats: ['All 9 frameworks', 'Unlimited backtests', 'AI optimization', 'Pine Script export', 'Real-time alerts'], current: true },
    { name: 'Premium', price: 149, feats: ['Everything in Pro', 'Sell in marketplace', 'SMS + webhook alerts', 'Priority AI queue', 'White-label exports'], current: false },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AppChrome activeNav="Account" pageTitle="Account" />

      {/* Profile */}
      <Card x={272} y={108} w={1360} h={160} delay={20}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 4 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36,
            background: `linear-gradient(135deg, ${ACCENT}, #00b47e)`, color: '#0a0a0e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 22,
          }}>FD</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: WHITE, fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>Francky Delissaint</div>
            <div style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>@fitflybusiness</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
              <div style={{ padding: '3px 10px', borderRadius: 999, background: ACCENT_SOFT, color: ACCENT, border: `1px solid ${ACCENT}55`, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Pro</div>
              <div style={{ color: MUTED, fontSize: 12 }}>Member since 2025-10-14</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, paddingLeft: 20, borderLeft: `1px solid ${BORDER}` }}>
            {[['12', 'Saved'], ['3', 'Purchased'], ['41', 'Backtests']].map(([v, l], i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ color: ACCENT, fontSize: 22, fontWeight: 800, fontFamily: 'ui-monospace,monospace' }}>{v}</div>
                <div style={{ color: MUTED, fontSize: 10, letterSpacing: 1, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 3 plans */}
      <div style={{ position: 'absolute', left: 272, top: 290, right: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {plans.map((p, i) => {
          const delay = 60 + i * 20;
          const o = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              background: CARD,
              border: `1.5px solid ${p.current ? ACCENT : BORDER}`,
              borderRadius: 12, padding: 22,
              opacity: o,
              boxShadow: p.current ? `0 0 40px rgba(0, 229, 160, 0.08)` : 'none',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: MUTED, fontSize: 12, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}>{p.name}</div>
                {p.current && <div style={{ padding: '3px 8px', borderRadius: 4, background: ACCENT_SOFT, color: ACCENT, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Current</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ color: WHITE, fontSize: 36, fontWeight: 800, fontFamily: 'ui-monospace,monospace', letterSpacing: -1 }}>${p.price}</span>
                {p.price > 0 && <span style={{ color: MUTED, fontSize: 12 }}>/mo</span>}
              </div>
              <div style={{ paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {p.feats.map((f, fi) => (
                  <div key={fi} style={{ color: '#d6d6de', fontSize: 12, display: 'flex', gap: 8 }}>
                    <span style={{ color: ACCENT, fontWeight: 700 }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{
                background: p.current ? 'transparent' : i === 1 ? ACCENT : CARD,
                color: p.current ? MUTED : i === 1 ? '#0a0a0e' : WHITE,
                border: p.current ? `1px solid ${BORDER}` : i === 1 ? 'none' : `1px solid ${BORDER_STRONG}`,
                padding: 10, borderRadius: 6, textAlign: 'center',
                fontSize: 12, fontWeight: 700,
              }}>{p.current ? 'Current plan' : i > 1 ? `Upgrade to ${p.name}` : `Downgrade`}</div>
            </div>
          );
        })}
      </div>

      <Caption duration={SCENES.account}
        text="The Account page has your profile, stats, and a three-plan comparison. The Current badge shows which tier you're on. Upgrade, downgrade, or manage notification preferences and profile info — all from one screen." />
    </AbsoluteFill>
  );
};

const DemoMomentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${ACCENT_SOFT}, transparent 70%)` }} />
      <SceneHeader label="The 3 Demo Moments That Sell It" />
      <Title text="Three clicks that close the deal" top={130} />

      <div style={{ position: 'absolute', top: 300, left: 120, right: 120, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {[
          { n: '01', title: 'Filter on /strategies', sub: 'Pick Forex + 15m → watch the grid filter in real time. They see their style matched instantly.', delay: 30 },
          { n: '02', title: 'Open /backtesting', sub: 'Point at the green equity curve. "Each of these would have grown a $10K account to $17K over 7 months."', delay: 110 },
          { n: '03', title: 'Open any Strategy Detail', sub: 'Scroll to the numbered How-It-Works steps. "This is not vague theory. It is a literal trading playbook."', delay: 190 },
        ].map((m, i) => {
          const o = interpolate(frame, [m.delay, m.delay + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const tx = interpolate(frame, [m.delay, m.delay + 18], [-20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              background: CARD, border: `1.5px solid ${ACCENT}40`, borderRadius: 14,
              padding: '26px 32px', opacity: o, transform: `translateX(${tx}px)`,
              display: 'flex', gap: 30, alignItems: 'center',
            }}>
              <div style={{
                color: ACCENT, fontSize: 52, fontWeight: 900,
                fontFamily: 'ui-monospace,monospace', letterSpacing: -2,
                minWidth: 100,
              }}>{m.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: WHITE, fontSize: 26, fontWeight: 700, letterSpacing: -0.3, marginBottom: 8 }}>{m.title}</div>
                <div style={{ color: '#d6d6de', fontSize: 16, lineHeight: 1.6 }}>{m.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Caption duration={SCENES.demoMoments}
        text="If you are showing this to a prospect, these three clicks are all you need. Filter the library. Show the equity curve. Open the how-it-works steps. That is where most trading pitches stop being theory and start feeling real." />
    </AbsoluteFill>
  );
};

const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: BG, alignItems: 'center', justifyContent: 'center', opacity: o }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${ACCENT_SOFT}, transparent 70%)` }} />
      <div style={{ color: ACCENT, fontSize: 18, letterSpacing: 4, fontWeight: 700 }}>LIVE NOW</div>
      <div style={{ color: WHITE, fontSize: 100, fontWeight: 800, marginTop: 24, letterSpacing: -2 }}>
        stratoptimizer<span style={{ color: ACCENT }}>.vercel.app</span>
      </div>
      <div style={{ color: MUTED, fontSize: 24, marginTop: 36, textAlign: 'center', maxWidth: 900 }}>
        Nine frameworks. Eight platform pages. Zero hype. Built for serious traders.
      </div>
      <div style={{ marginTop: 60, display: 'flex', gap: 16 }}>
        <div style={{ background: ACCENT, color: '#0a0a0e', padding: '18px 36px', borderRadius: 8, fontWeight: 700, fontSize: 18 }}>Enter the platform →</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── root composition ─────────────────────────────────────────────

export const StratOptimizerTour: React.FC = () => {
  const { width, height } = useVideoConfig();
  let start = 0;
  const begin = (scene: keyof typeof SCENES) => {
    const s = start;
    start += SCENES[scene];
    return s;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: BG, width, height }}>
      <Sequence from={begin('title')}       durationInFrames={SCENES.title}>       <TitleScene /></Sequence>
      <Sequence from={begin('intro')}       durationInFrames={SCENES.intro}>       <IntroScene /></Sequence>
      <Sequence from={begin('landing')}     durationInFrames={SCENES.landing}>     <LandingScene /></Sequence>
      <Sequence from={begin('dashboard')}   durationInFrames={SCENES.dashboard}>   <DashboardScene /></Sequence>
      <Sequence from={begin('library')}     durationInFrames={SCENES.library}>     <LibraryScene /></Sequence>
      <Sequence from={begin('detail')}      durationInFrames={SCENES.detail}>      <DetailScene /></Sequence>
      <Sequence from={begin('editor')}      durationInFrames={SCENES.editor}>      <EditorScene /></Sequence>
      <Sequence from={begin('backtest')}    durationInFrames={SCENES.backtest}>    <BacktestScene /></Sequence>
      <Sequence from={begin('marketplace')} durationInFrames={SCENES.marketplace}> <MarketplaceScene /></Sequence>
      <Sequence from={begin('alerts')}      durationInFrames={SCENES.alerts}>      <AlertsScene /></Sequence>
      <Sequence from={begin('account')}     durationInFrames={SCENES.account}>     <AccountScene /></Sequence>
      <Sequence from={begin('demoMoments')} durationInFrames={SCENES.demoMoments}> <DemoMomentsScene /></Sequence>
      <Sequence from={begin('close')}       durationInFrames={SCENES.close}>       <CloseScene /></Sequence>
    </AbsoluteFill>
  );
};
