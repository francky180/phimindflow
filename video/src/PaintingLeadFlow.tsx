import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const BG = '#0a0a0e';
const GOLD = '#e4b64c';
const GREEN = '#00e5a0';
const RED = '#ff6060';
const WHITE = '#ffffff';
const MUTED = '#9a9aa6';
const CARD = '#14141a';
const BORDER = '#2a2a34';

const FPS = 30;

// Scene durations (in frames)
const SCENES = {
  title: 120,          // 4s
  entry: 360,          // 12s
  capture: 360,        // 12s
  hub: 360,            // 12s
  nurture: 540,        // 18s
  booking: 540,        // 18s
  outcome: 420,        // 14s
  pipeline: 420,       // 14s
  close: 360,          // 12s
};

export const PAINTING_FLOW_DURATION =
  SCENES.title + SCENES.entry + SCENES.capture + SCENES.hub + SCENES.nurture +
  SCENES.booking + SCENES.outcome + SCENES.pipeline + SCENES.close;

// ---------- primitives ----------

const Card: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; sub?: string; accent?: string;
  delay?: number; frame: number;
}> = ({ x, y, w, h, title, sub, accent = GOLD, delay = 0, frame }) => {
  const local = frame - delay;
  const o = interpolate(local, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ty = interpolate(local, [0, 14], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: y + ty, width: w, height: h,
      background: CARD, border: `1.5px solid ${accent}55`,
      borderRadius: 12, padding: '14px 20px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      opacity: o, boxShadow: `0 0 24px ${accent}18`,
    }}>
      <div style={{ color: WHITE, fontSize: 22, fontWeight: 700, letterSpacing: 0.2 }}>{title}</div>
      {sub && <div style={{ color: MUTED, fontSize: 15, marginTop: 4, lineHeight: 1.35 }}>{sub}</div>}
    </div>
  );
};

const Arrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  delay: number; frame: number; color?: string;
}> = ({ x1, y1, x2, y2, delay, frame, color = GOLD }) => {
  const local = frame - delay;
  const progress = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cx = x1 + (x2 - x1) * progress;
  const cy = y1 + (y2 - y1) * progress;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const dist = Math.sqrt(dx * dx + dy * dy);
  return (
    <>
      <div style={{
        position: 'absolute', left: x1, top: y1,
        width: dist * progress, height: 2, background: color,
        transform: `rotate(${angle}deg)`, transformOrigin: '0 50%',
        opacity: 0.7,
      }} />
      {progress > 0.95 && (
        <div style={{
          position: 'absolute', left: cx - 7, top: cy - 7,
          width: 14, height: 14,
          borderTop: `2.5px solid ${color}`,
          borderRight: `2.5px solid ${color}`,
          transform: `rotate(${angle - 45}deg)`,
          opacity: 0.9,
        }} />
      )}
    </>
  );
};

const Pill: React.FC<{
  x: number; y: number; label: string; accent?: string; delay: number; frame: number;
}> = ({ x, y, label, accent = GOLD, delay, frame }) => {
  const local = frame - delay;
  const o = interpolate(local, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: y, padding: '10px 20px',
      borderRadius: 999, background: `${accent}14`, border: `1.5px solid ${accent}66`,
      color: WHITE, fontSize: 20, fontWeight: 600, opacity: o, whiteSpace: 'nowrap',
    }}>{label}</div>
  );
};

const Caption: React.FC<{ text: string; frame: number; start: number; duration: number }> = ({
  text, frame, start, duration,
}) => {
  const local = frame - start;
  const fadeIn = interpolate(local, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(local, [duration - 16, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const o = Math.min(fadeIn, fadeOut);
  return (
    <div style={{
      position: 'absolute', left: 120, right: 120, bottom: 80,
      background: '#0a0a0ecc',
      border: `1px solid ${BORDER}`,
      borderRadius: 10,
      padding: '20px 32px',
      color: WHITE, fontSize: 26, lineHeight: 1.45, opacity: o,
      textAlign: 'center', fontWeight: 400, letterSpacing: 0.1,
      backdropFilter: 'blur(8px)',
    }}>{text}</div>
  );
};

const SceneHeader: React.FC<{ label: string; frame: number }> = ({ label, frame }) => {
  const o = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', top: 50, left: 120,
      color: GOLD, fontSize: 18, fontWeight: 700, letterSpacing: 3,
      textTransform: 'uppercase', opacity: o,
    }}>{label}</div>
  );
};

// ---------- scenes ----------

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 22 } });
  const o = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const oOut = interpolate(frame, [SCENES.title - 18, SCENES.title], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(o, oOut);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, alignItems: 'center', justifyContent: 'center', opacity }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${GOLD}1a, transparent)` }} />
      <div style={{ color: GOLD, fontSize: 20, letterSpacing: 6, fontWeight: 700, transform: `translateY(${(1 - s) * -20}px)` }}>
        PHIMINDFLOW SYSTEMS
      </div>
      <div style={{ color: WHITE, fontSize: 88, fontWeight: 800, marginTop: 20, letterSpacing: -1, transform: `translateY(${(1 - s) * 30}px)` }}>
        How A Painting Lead
      </div>
      <div style={{ color: WHITE, fontSize: 88, fontWeight: 800, letterSpacing: -1, transform: `translateY(${(1 - s) * 30}px)` }}>
        Becomes A <span style={{ color: GOLD }}>Paid Job</span>
      </div>
      <div style={{ color: MUTED, fontSize: 28, marginTop: 40, letterSpacing: 0.3 }}>
        The full automated flow, step by step
      </div>
    </AbsoluteFill>
  );
};

const EntryScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="01 · Entry Points" frame={frame} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', color: WHITE, fontSize: 40, fontWeight: 700 }}>
        Where every lead starts
      </div>

      {/* Ad sources row */}
      <Pill x={280}  y={260} label="Meta Ads"        delay={20}  frame={frame} />
      <Pill x={490}  y={260} label="Google Ads"      delay={35}  frame={frame} />
      <Pill x={730}  y={260} label="TikTok Ads"      delay={50}  frame={frame} />
      <Pill x={970}  y={260} label="Organic / Referral" delay={65} frame={frame} accent={GREEN} />

      {/* Entry point cards */}
      <Card x={260} y={500} w={340} h={140} title="Landing Page" sub="Estimate form on your site" delay={95} frame={frame} />
      <Card x={680} y={500} w={340} h={140} title="Click-to-Call" sub="Tap the ad, phone rings" delay={115} frame={frame} />
      <Card x={1100} y={500} w={340} h={140} title="Direct Call" sub="To your business number" delay={135} frame={frame} />

      {/* Arrows from pills to entry cards */}
      <Arrow x1={380} y1={310} x2={430} y2={500} delay={80}  frame={frame} />
      <Arrow x1={570} y1={310} x2={580} y2={500} delay={100} frame={frame} />
      <Arrow x1={810} y1={310} x2={850} y2={500} delay={120} frame={frame} />
      <Arrow x1={1070} y1={310} x2={1270} y2={500} delay={140} frame={frame} color={GREEN} />

      <Caption frame={frame} start={0} duration={SCENES.entry}
        text="Every lead enters your business in one of three ways — they fill out a form on your landing page, they tap click-to-call in an ad, or they call your business directly. We track all three." />
    </AbsoluteFill>
  );
};

const CaptureScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="02 · The Call That Would've Been Lost" frame={frame} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', color: WHITE, fontSize: 40, fontWeight: 700 }}>
        A missed call is no longer a lost lead
      </div>

      {/* Inbound call box */}
      <Card x={760} y={280} w={400} h={110} title="Inbound Call" sub="Twilio / your business line" delay={10} frame={frame} />

      {/* Split answered vs missed */}
      <Card x={440} y={490} w={340} h={110} title="Answered" sub="Routed to AI receptionist" accent={GREEN} delay={60} frame={frame} />
      <Card x={1140} y={490} w={340} h={110} title="Missed" sub="You're on a ladder" accent={RED} delay={80} frame={frame} />

      <Arrow x1={920} y1={390} x2={610} y2={490} delay={45} frame={frame} color={GREEN} />
      <Arrow x1={1000} y1={390} x2={1310} y2={490} delay={65} frame={frame} color={RED} />

      {/* AI Reception + Text-back */}
      <Card x={320} y={690} w={380} h={130} title="AI Receptionist" sub="Qualifies · books · creates contact" accent={GREEN} delay={150} frame={frame} />

      <div style={{
        position: 'absolute', left: 1080, top: 690, width: 420, padding: '16px 22px',
        background: CARD, border: `1.5px solid ${GOLD}aa`, borderRadius: 12,
        opacity: interpolate(frame, [170, 185], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        color: WHITE, fontSize: 17, lineHeight: 1.4, fontFamily: 'ui-sans-serif',
      }}>
        <div style={{ color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>AUTO-SMS · 0 SEC</div>
        "Sorry we missed your call. Are you looking for a painting estimate? Reply YES and we'll reach out within the hour."
      </div>

      <Arrow x1={610} y1={600} x2={510} y2={690} delay={130} frame={frame} color={GREEN} />
      <Arrow x1={1310} y1={600} x2={1290} y2={690} delay={155} frame={frame} color={GOLD} />

      <Caption frame={frame} start={0} duration={SCENES.capture}
        text="If they call while you're on a job, an automatic text fires within seconds asking if they want an estimate. On answered calls, an AI receptionist can qualify the lead and book the appointment for you." />
    </AbsoluteFill>
  );
};

const HubScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 10) * 0.015;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="03 · Everything Lands In One Place" frame={frame} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', color: WHITE, fontSize: 40, fontWeight: 700 }}>
        GHL Contact Created
      </div>

      {/* Source pills entering the hub */}
      <Pill x={200}  y={380} label="Form submit"       delay={10} frame={frame} />
      <Pill x={200}  y={460} label="AI receptionist"   delay={30} frame={frame} accent={GREEN} />
      <Pill x={200}  y={540} label="Missed-call reply" delay={50} frame={frame} />

      {/* Central hub */}
      <div style={{
        position: 'absolute', left: 720, top: 340, width: 520, height: 260,
        background: CARD, border: `2px solid ${GOLD}`, borderRadius: 16,
        padding: 24, opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `scale(${pulse})`, boxShadow: `0 0 60px ${GOLD}30`,
      }}>
        <div style={{ color: GOLD, fontSize: 14, letterSpacing: 2, fontWeight: 700 }}>CRM HUB</div>
        <div style={{ color: WHITE, fontSize: 34, fontWeight: 800, marginTop: 8 }}>Contact Record</div>
        <div style={{ color: MUTED, fontSize: 18, marginTop: 16, lineHeight: 1.6 }}>
          <div>tags: <span style={{ color: GOLD }}>painting-lead</span> · <span style={{ color: GOLD }}>source-fb</span></div>
          <div>pipeline stage: <span style={{ color: GREEN }}>New Lead</span></div>
          <div>custom fields: service · sqft · address</div>
        </div>
      </div>

      <Arrow x1={380} y1={400} x2={720} y2={420} delay={70}  frame={frame} />
      <Arrow x1={400} y1={480} x2={720} y2={470} delay={90}  frame={frame} color={GREEN} />
      <Arrow x1={410} y1={560} x2={720} y2={520} delay={110} frame={frame} />

      {/* Why this matters */}
      <div style={{
        position: 'absolute', left: 1300, top: 400, width: 380,
        opacity: interpolate(frame, [140, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ color: GOLD, fontSize: 14, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>WHY IT MATTERS</div>
        <div style={{ color: WHITE, fontSize: 20, lineHeight: 1.5 }}>
          Every lead is tagged with where they came from — so you know which ads are actually making you money.
        </div>
      </div>

      <Caption frame={frame} start={0} duration={SCENES.hub}
        text="No matter how they came in, every lead lands in your CRM with a source tag. This is how you prove which ad campaigns are working and where to spend more." />
    </AbsoluteFill>
  );
};

const NurtureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    { t: '0 MIN',  title: 'SMS #1',     body: '"Thanks for requesting a painting estimate. Want to schedule a quick quote call?"', delay: 30,  accent: GOLD },
    { t: '5 MIN',  title: 'SMS #2',     body: '"Still looking to get that painting estimate this week?"', delay: 130, accent: GOLD },
    { t: 'DAY 2',  title: 'Email',      body: 'Personal-feeling email — single CTA: reply to this.', delay: 230, accent: GOLD },
    { t: 'DAY 3',  title: 'SMS #3',     body: '"Last check-in — still want a free painting estimate?"', delay: 330, accent: GOLD },
    { t: 'DAY 4+', title: 'Cold nurture', body: 'Moves to monthly touch sequence. No lead ever forgotten.', delay: 430, accent: GREEN },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="04 · The Nurture Sequence" frame={frame} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', color: WHITE, fontSize: 40, fontWeight: 700 }}>
        4 gentle nudges over 4 days
      </div>

      {/* Vertical timeline */}
      <div style={{ position: 'absolute', left: 280, top: 260, bottom: 200, width: 3, background: `${GOLD}40` }} />

      {steps.map((s, i) => {
        const local = frame - s.delay;
        const o = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const dx = interpolate(local, [0, 18], [-12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const y = 260 + i * 110;
        return (
          <div key={i} style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
            {/* Dot on timeline */}
            <div style={{ position: 'absolute', left: 272, top: y + 28, width: 18, height: 18, borderRadius: 9, background: s.accent, boxShadow: `0 0 16px ${s.accent}88` }} />
            {/* Time label */}
            <div style={{ position: 'absolute', left: 130, top: y + 30, width: 120, textAlign: 'right', color: s.accent, fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>{s.t}</div>
            {/* Content card */}
            <div style={{
              position: 'absolute', left: 330 + dx, top: y, width: 1120, padding: '18px 26px',
              background: CARD, border: `1.5px solid ${s.accent}55`, borderRadius: 10,
            }}>
              <div style={{ color: WHITE, fontSize: 22, fontWeight: 700 }}>{s.title}</div>
              <div style={{ color: MUTED, fontSize: 18, marginTop: 4, lineHeight: 1.4 }}>{s.body}</div>
            </div>
          </div>
        );
      })}

      <Caption frame={frame} start={0} duration={SCENES.nurture}
        text="The system sends up to four gentle nudges — text, text, email, text — spaced over four days. Most replies land on the second message. You don't lift a finger; the lead never goes cold." />
    </AbsoluteFill>
  );
};

const BookingScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="05 · They Reply Yes" frame={frame} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', color: WHITE, fontSize: 40, fontWeight: 700 }}>
        Booking + reminders = fewer no-shows
      </div>

      {/* Reply YES bubble */}
      <div style={{
        position: 'absolute', left: 120, top: 300, padding: '20px 28px',
        background: `${GREEN}14`, border: `2px solid ${GREEN}`, borderRadius: 16,
        color: WHITE, fontSize: 26, fontWeight: 700,
        opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        "YES"
        <div style={{ color: GREEN, fontSize: 14, fontWeight: 600, letterSpacing: 2, marginTop: 4 }}>CUSTOMER REPLY</div>
      </div>

      <Arrow x1={380} y1={340} x2={600} y2={340} delay={50} frame={frame} color={GREEN} />

      {/* Booking pipeline */}
      <Card x={620} y={280} w={380} h={120} title="Send booking link" sub="Native GHL calendar, no Calendly" delay={70} frame={frame} accent={GREEN} />
      <Card x={1080} y={280} w={380} h={120} title="They pick a slot" sub="Instant confirmation SMS" delay={150} frame={frame} accent={GREEN} />
      <Arrow x1={1000} y1={340} x2={1080} y2={340} delay={130} frame={frame} color={GREEN} />

      {/* Reminders column */}
      <Card x={440} y={490} w={380} h={120} title="T-24h reminder" sub={'"Your estimate call is tomorrow at 3pm. Reply R to reschedule."'} delay={230} frame={frame} accent={GOLD} />
      <Card x={860} y={490} w={380} h={120} title="T-2h reminder" sub={'"Talking soon — 3pm."'} delay={310} frame={frame} accent={GOLD} />
      <Card x={1280} y={490} w={380} h={120} title="Pipeline: Scheduled" sub="Auto-moved, no manual work" delay={390} frame={frame} />

      <Arrow x1={1270} y1={400} x2={630} y2={490} delay={210} frame={frame} color={GOLD} />
      <Arrow x1={820} y1={550} x2={860} y2={550} delay={290} frame={frame} color={GOLD} />
      <Arrow x1={1240} y1={550} x2={1280} y2={550} delay={370} frame={frame} />

      {/* Stat callout */}
      <div style={{
        position: 'absolute', left: 580, top: 720, width: 720, padding: '22px 30px',
        background: `${GREEN}10`, border: `1.5px solid ${GREEN}66`, borderRadius: 12,
        color: WHITE, fontSize: 22, textAlign: 'center',
        opacity: interpolate(frame, [440, 470], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <span style={{ color: GREEN, fontWeight: 800 }}>~35%</span> no-show reduction with 24h + 2h SMS reminders
      </div>

      <Caption frame={frame} start={0} duration={SCENES.booking}
        text="The moment they reply 'yes,' a booking link goes out. They pick a time. They get an instant confirmation, a 24-hour reminder, and a 2-hour reminder. Industry-standard no-show rates drop by about a third." />
    </AbsoluteFill>
  );
};

const OutcomeScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="06 · After The Estimate" frame={frame} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', color: WHITE, fontSize: 40, fontWeight: 700 }}>
        One tap — system handles the rest
      </div>

      {/* Estimate visit node */}
      <Card x={760} y={270} w={400} h={120} title="Estimate Visit" sub="Human owner does the walk-through" delay={20} frame={frame} />

      {/* Owner marks outcome */}
      <Card x={760} y={440} w={400} h={120} title="Mark Won / Lost" sub="In GHL mobile app, one tap" delay={90} frame={frame} accent={GOLD} />
      <Arrow x1={960} y1={390} x2={960} y2={440} delay={75} frame={frame} />

      {/* Split */}
      <Card x={340} y={640} w={460} h={180} title="Won sequence" sub="Thank-you SMS · Day 7 review request · Referral ask · Revenue logged to dashboard" accent={GREEN} delay={160} frame={frame} />
      <Card x={1140} y={640} w={460} h={180} title="Lost sequence" sub='"Anything we could have done better?" · 90-day reactivation sequence · Feedback flows back into copy' accent={RED} delay={220} frame={frame} />

      <Arrow x1={860} y1={560} x2={570} y2={640} delay={140} frame={frame} color={GREEN} />
      <Arrow x1={1060} y1={560} x2={1370} y2={640} delay={200} frame={frame} color={RED} />

      <Caption frame={frame} start={0} duration={SCENES.outcome}
        text="After the estimate, the owner taps Won or Lost in their phone. Won triggers thank-you, review request, and referral ask. Lost triggers a feedback ask and a 90-day reactivation. Nothing falls through the cracks." />
    </AbsoluteFill>
  );
};

const PipelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stages = [
    { label: 'New Lead',          color: GOLD },
    { label: 'Contacted',         color: GOLD },
    { label: 'Estimate Scheduled',color: GOLD },
    { label: 'Estimate Completed',color: GOLD },
    { label: 'Won',               color: GREEN },
    { label: 'Lost',              color: RED },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <SceneHeader label="07 · Your Whole Business, One Screen" frame={frame} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', color: WHITE, fontSize: 40, fontWeight: 700 }}>
        The pipeline + Monday digest
      </div>

      {/* Pipeline horizontal strip */}
      {stages.map((s, i) => {
        const local = frame - (30 + i * 25);
        const o = interpolate(local, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const total = stages.length;
        const w = (1920 - 240 - (total - 1) * 18) / total;
        return (
          <div key={i} style={{
            position: 'absolute', left: 120 + i * (w + 18), top: 280, width: w, height: 110,
            background: CARD, border: `1.5px solid ${s.color}66`, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: WHITE, fontSize: 20, fontWeight: 700, textAlign: 'center', padding: '0 12px',
            opacity: o,
          }}>
            <div>
              <div style={{ color: s.color, fontSize: 13, letterSpacing: 2, marginBottom: 6 }}>STAGE {i + 1}</div>
              {s.label}
            </div>
          </div>
        );
      })}

      {/* Monday digest email mock */}
      <div style={{
        position: 'absolute', left: 460, top: 460, width: 1000,
        background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: 30,
        opacity: interpolate(frame, [220, 250], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ color: GOLD, fontSize: 14, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>MONDAY DIGEST · 8AM</div>
        <div style={{ color: WHITE, fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Last week at your business</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { n: '47', l: 'new leads' },
            { n: '22', l: 'booked estimates' },
            { n: '11', l: 'jobs won' },
            { n: '$18.4k', l: 'revenue logged' },
          ].map((k, i) => (
            <div key={i}>
              <div style={{ color: GOLD, fontSize: 42, fontWeight: 800 }}>{k.n}</div>
              <div style={{ color: MUTED, fontSize: 16, marginTop: 4 }}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      <Caption frame={frame} start={0} duration={SCENES.pipeline}
        text="Every lead moves through six stages automatically. Every Monday morning at 8am, a digest hits the owner's inbox with leads, bookings, wins, and revenue. You never wonder if the ads are working." />
    </AbsoluteFill>
  );
};

const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stats = [
    { big: '78%', small: 'of customers buy from whoever responds first' },
    { big: '30-50%', small: 'missed-call recovery with text-back' },
    { big: '~35%', small: 'fewer no-shows with 24h + 2h reminders' },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${GOLD}1a, transparent)` }} />
      <SceneHeader label="The numbers behind the system" frame={frame} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', color: WHITE, fontSize: 48, fontWeight: 800 }}>
        Why this works
      </div>

      {stats.map((s, i) => {
        const local = frame - (40 + i * 55);
        const o = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const ty = interpolate(local, [0, 18], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{
            position: 'absolute', left: 180, top: 310 + i * 130, right: 180,
            opacity: o, transform: `translateY(${ty}px)`,
            display: 'flex', alignItems: 'center', gap: 40,
            padding: '24px 36px',
            background: CARD, border: `1.5px solid ${GOLD}66`, borderRadius: 14,
          }}>
            <div style={{ color: GOLD, fontSize: 72, fontWeight: 900, minWidth: 240 }}>{s.big}</div>
            <div style={{ color: WHITE, fontSize: 26, lineHeight: 1.4 }}>{s.small}</div>
          </div>
        );
      })}

      <Caption frame={frame} start={0} duration={SCENES.close}
        text="This is how you stop losing leads. Speed, consistency, and a system that never sleeps — running in the background while you're on the ladder or with family." />
    </AbsoluteFill>
  );
};

// ---------- root composition ----------

export const PaintingLeadFlow: React.FC = () => {
  const { width, height } = useVideoConfig();
  let start = 0;
  const begin = (scene: keyof typeof SCENES) => {
    const s = start;
    start += SCENES[scene];
    return s;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BG, width, height }}>
      <Sequence from={begin('title')}    durationInFrames={SCENES.title}>    <TitleScene /></Sequence>
      <Sequence from={begin('entry')}    durationInFrames={SCENES.entry}>    <EntryScene /></Sequence>
      <Sequence from={begin('capture')}  durationInFrames={SCENES.capture}>  <CaptureScene /></Sequence>
      <Sequence from={begin('hub')}      durationInFrames={SCENES.hub}>      <HubScene /></Sequence>
      <Sequence from={begin('nurture')}  durationInFrames={SCENES.nurture}>  <NurtureScene /></Sequence>
      <Sequence from={begin('booking')}  durationInFrames={SCENES.booking}>  <BookingScene /></Sequence>
      <Sequence from={begin('outcome')}  durationInFrames={SCENES.outcome}>  <OutcomeScene /></Sequence>
      <Sequence from={begin('pipeline')} durationInFrames={SCENES.pipeline}> <PipelineScene /></Sequence>
      <Sequence from={begin('close')}    durationInFrames={SCENES.close}>    <CloseScene /></Sequence>
    </AbsoluteFill>
  );
};
