import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";

// ─────────────────────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────────────────────
const BG = "#05060A";
const BG_MID = "#0A0B14";
const PANEL = "#0E1018";
const BORDER = "#1A1D29";
const TEXT = "#F5F7FA";
const MUTED = "#8A8FA3";
const DIM = "#565A6E";
const CYAN = "#00D4FF";
const PURPLE = "#7C5CFF";
const GREEN = "#22C55E";
const AMBER = "#F59E0B";
const PINK = "#EC4899";
const FONT =
  '"Inter", "SF Pro Display", -apple-system, system-ui, sans-serif';

// ─────────────────────────────────────────────────────────────
// Pacing
// ─────────────────────────────────────────────────────────────
const FPS = 30;
const INTRO_F = 180; // 6s
const CATEGORY_F = 90; // 3s
const BOOK_F = 105; // 3.5s
const OUTRO_F = 180; // 6s

// ─────────────────────────────────────────────────────────────
// Library data — 100 books, 1 killer principle each
// ─────────────────────────────────────────────────────────────
type Book = { n: number; title: string; author: string; principle: string };
type Cat = { name: string; color: string; books: Book[] };

const LIBRARY: Cat[] = [
  {
    name: "Core Foundation",
    color: AMBER,
    books: [
      {
        n: 1,
        title: "The Bible",
        author: "Various",
        principle:
          "Ethics, discipline, and purpose are the foundation of every durable decision.",
      },
    ],
  },
  {
    name: "Thinking & Mental Models",
    color: CYAN,
    books: [
      {
        n: 2,
        title: "Thinking, Fast and Slow",
        author: "Kahneman",
        principle:
          "System 1 is fast, emotional, automatic. System 2 is slow, deliberate, rational. Know which one is driving.",
      },
      {
        n: 3,
        title: "Super Thinking",
        author: "Weinberg & McCann",
        principle:
          "Mental models compound. The more you stack, the clearer reality becomes.",
      },
      {
        n: 4,
        title: "The Art of Thinking Clearly",
        author: "Dobelli",
        principle:
          "Avoiding stupidity beats pursuing brilliance. Cut the 99 biases first.",
      },
      {
        n: 5,
        title: "Seeking Wisdom",
        author: "Bevelin",
        principle:
          "Multidisciplinary thinking — borrow from physics, biology, and psychology to judge any situation.",
      },
      {
        n: 6,
        title: "Mental Models",
        author: "Farnam Street",
        principle:
          "The map is not the territory. Keep updating your models against reality.",
      },
      {
        n: 7,
        title: "Algorithms to Live By",
        author: "Christian & Griffiths",
        principle:
          "Explore early, exploit late. Optimal stopping: pass on the first 37%, then take the best.",
      },
      {
        n: 8,
        title: "The Intelligence Trap",
        author: "Robson",
        principle:
          "Smart people fall harder when they defend beliefs instead of testing them.",
      },
    ],
  },
  {
    name: "Money & Wealth",
    color: GREEN,
    books: [
      {
        n: 9,
        title: "Rich Dad Poor Dad",
        author: "Kiyosaki",
        principle:
          "Assets put money in your pocket. Liabilities take it out. Buy assets.",
      },
      {
        n: 10,
        title: "The Millionaire Fastlane",
        author: "DeMarco",
        principle:
          "Slow lane is a trap. Build systems that scale detached from your time.",
      },
      {
        n: 11,
        title: "Your Money or Your Life",
        author: "Robin & Dominguez",
        principle:
          "Every purchase costs hours of your life. Price things in life-energy, not dollars.",
      },
      {
        n: 12,
        title: "The Psychology of Money",
        author: "Housel",
        principle:
          "Doing well with money has little to do with intelligence and a lot to do with behavior.",
      },
      {
        n: 13,
        title: "Think and Grow Rich",
        author: "Hill",
        principle:
          "A definite purpose, backed by burning desire, is the start of all wealth.",
      },
      {
        n: 14,
        title: "The Intelligent Investor",
        author: "Graham",
        principle:
          "Mr. Market is manic. Buy businesses with a margin of safety, not stock tickers.",
      },
      {
        n: 15,
        title: "I Will Teach You to Be Rich",
        author: "Sethi",
        principle:
          "Automate the boring money decisions. Spend freely on what you love, ruthlessly cut the rest.",
      },
    ],
  },
  {
    name: "Psychology & Human Nature",
    color: PURPLE,
    books: [
      {
        n: 16,
        title: "The 48 Laws of Power",
        author: "Greene",
        principle:
          "Never outshine the master. Guard your reputation. Plan to the end.",
      },
      {
        n: 17,
        title: "The Laws of Human Nature",
        author: "Greene",
        principle:
          "People's actions are rarely about you. Decode the real motive beneath the stated one.",
      },
      {
        n: 18,
        title: "The Art of Seduction",
        author: "Greene",
        principle:
          "Create absence, ambiguity, and anticipation. Presence without tension is boring.",
      },
      {
        n: 19,
        title: "Influence",
        author: "Cialdini",
        principle:
          "Reciprocity, commitment, social proof, authority, liking, scarcity. These six unlock almost every yes.",
      },
      {
        n: 20,
        title: "Pre-Suasion",
        author: "Cialdini",
        principle:
          "What you say before the pitch determines the answer. Prime attention first.",
      },
      {
        n: 21,
        title: "Emotional Intelligence",
        author: "Goleman",
        principle:
          "IQ gets you hired. EQ determines how high you climb.",
      },
      {
        n: 22,
        title: "Games People Play",
        author: "Berne",
        principle:
          "Most conflicts are hidden scripts. Name the game to stop playing it.",
      },
    ],
  },
  {
    name: "Business, Sales & Marketing",
    color: CYAN,
    books: [
      {
        n: 23,
        title: "$100M Offers",
        author: "Hormozi",
        principle:
          "Value = (Dream Outcome × Likelihood) / (Time × Effort). Make the ratio so good it feels stupid to refuse.",
      },
      {
        n: 24,
        title: "$100M Leads",
        author: "Hormozi",
        principle:
          "Four lead channels: warm, content, paid, outbound. Master one before touching the next.",
      },
      {
        n: 25,
        title: "DotCom Secrets",
        author: "Brunson",
        principle:
          "Every business is a funnel. The question is whether yours is accidental or engineered.",
      },
      {
        n: 26,
        title: "Expert Secrets",
        author: "Brunson",
        principle:
          "Build a movement, not a product. Customers follow leaders with a cause.",
      },
      {
        n: 27,
        title: "Traffic Secrets",
        author: "Brunson",
        principle:
          "Your dream customer already hangs out somewhere. Find the congregation, walk in with value.",
      },
      {
        n: 28,
        title: "Breakthrough Advertising",
        author: "Schwartz",
        principle:
          "Match the message to the audience's state of awareness. Write to where they are, not where you wish they were.",
      },
      {
        n: 29,
        title: "Ogilvy on Advertising",
        author: "Ogilvy",
        principle:
          "The headline is 80% of the ad. If it doesn't stop them, nothing else matters.",
      },
      {
        n: 30,
        title: "Scientific Advertising",
        author: "Hopkins",
        principle:
          "Every word must earn its space. Test, measure, then scale what works.",
      },
    ],
  },
  {
    name: "Entrepreneurship & Strategy",
    color: PURPLE,
    books: [
      {
        n: 31,
        title: "Zero to One",
        author: "Thiel",
        principle:
          "Competition is for losers. Build a monopoly by solving a problem nobody else can.",
      },
      {
        n: 32,
        title: "The Lean Startup",
        author: "Ries",
        principle:
          "Build, measure, learn. Ship the minimum version that teaches you something real.",
      },
      {
        n: 33,
        title: "Blue Ocean Strategy",
        author: "Kim & Mauborgne",
        principle:
          "Don't fight in a red ocean. Create a new market where competition is irrelevant.",
      },
      {
        n: 34,
        title: "Good to Great",
        author: "Collins",
        principle:
          "Level 5 leaders: fierce resolve plus personal humility. Get the right people on the bus first.",
      },
      {
        n: 35,
        title: "Built to Last",
        author: "Collins",
        principle:
          "Great companies have a core ideology that never changes — and everything else must be willing to change.",
      },
    ],
  },
  {
    name: "Strategy, War & Power",
    color: PINK,
    books: [
      {
        n: 36,
        title: "The Art of War",
        author: "Sun Tzu",
        principle:
          "Supreme excellence is winning without fighting. Know yourself, know your enemy, never lose.",
      },
      {
        n: 37,
        title: "The 33 Strategies of War",
        author: "Greene",
        principle:
          "Fight only on your terms. Choose your battles, your ground, and your timing.",
      },
      {
        n: 38,
        title: "On War",
        author: "Clausewitz",
        principle:
          "War is the continuation of politics by other means. Every conflict has a political purpose.",
      },
      {
        n: 39,
        title: "The Prince",
        author: "Machiavelli",
        principle:
          "It is better to be feared than loved — if you cannot be both. Power requires realism.",
      },
    ],
  },
  {
    name: "Discipline, Habits & Performance",
    color: GREEN,
    books: [
      {
        n: 40,
        title: "Atomic Habits",
        author: "Clear",
        principle:
          "You don't rise to the level of your goals. You fall to the level of your systems.",
      },
      {
        n: 41,
        title: "Deep Work",
        author: "Newport",
        principle:
          "Deep work is becoming rare and valuable. Protect it like a financial asset.",
      },
      {
        n: 42,
        title: "Can't Hurt Me",
        author: "Goggins",
        principle:
          "The 40% rule: when you think you're done, you're only 40% done. Callous the mind.",
      },
      {
        n: 43,
        title: "The Power of Habit",
        author: "Duhigg",
        principle:
          "Cue → routine → reward. Change the routine, keep the cue and reward, to rewire any habit.",
      },
    ],
  },
  {
    name: "Philosophy & Life Wisdom",
    color: AMBER,
    books: [
      {
        n: 44,
        title: "Meditations",
        author: "Marcus Aurelius",
        principle:
          "You have power over your mind, not outside events. Realize this, and you find strength.",
      },
      {
        n: 45,
        title: "Letters from a Stoic",
        author: "Seneca",
        principle:
          "We suffer more in imagination than in reality. Most fears never happen.",
      },
      {
        n: 46,
        title: "The Republic",
        author: "Plato",
        principle:
          "Justice is each part doing its job. A good life is a well-ordered soul.",
      },
      {
        n: 47,
        title: "Beyond Good and Evil",
        author: "Nietzsche",
        principle:
          "He who has a why to live can bear almost any how. Create your own values.",
      },
    ],
  },
  {
    name: "History & Power Systems",
    color: CYAN,
    books: [
      {
        n: 48,
        title: "Sapiens",
        author: "Harari",
        principle:
          "Humans dominate because we believe in shared fictions — money, nations, companies, gods.",
      },
      {
        n: 49,
        title: "Homo Deus",
        author: "Harari",
        principle:
          "The next upgrade is from humans to gods. Data is the new soul.",
      },
      {
        n: 50,
        title: "The Silk Roads",
        author: "Frankopan",
        principle:
          "Power follows trade routes. Whoever controls the flow controls the era.",
      },
    ],
  },
  {
    name: "AI, Systems & Future",
    color: PURPLE,
    books: [
      {
        n: 51,
        title: "Life 3.0",
        author: "Tegmark",
        principle:
          "Intelligence is substrate-independent. Whatever thinks, thinks — regardless of carbon or silicon.",
      },
      {
        n: 52,
        title: "Superintelligence",
        author: "Bostrom",
        principle:
          "The control problem is the first problem. Capability without alignment is catastrophe.",
      },
      {
        n: 53,
        title: "The Alignment Problem",
        author: "Christian",
        principle:
          "The models learn what you measure, not what you meant. Specify carefully.",
      },
    ],
  },
  {
    name: "Probability & Decisions",
    color: AMBER,
    books: [
      {
        n: 54,
        title: "Fooled by Randomness",
        author: "Taleb",
        principle:
          "Most success is luck disguised as skill. Evaluate the process, not the outcome.",
      },
      {
        n: 55,
        title: "The Black Swan",
        author: "Taleb",
        principle:
          "The biggest events are unpredictable. Design for the tails, not the averages.",
      },
      {
        n: 56,
        title: "Antifragile",
        author: "Taleb",
        principle:
          "Some things gain from disorder. Build systems that grow stronger from volatility.",
      },
    ],
  },
  {
    name: "Influence & Communication",
    color: PINK,
    books: [
      {
        n: 57,
        title: "How to Win Friends",
        author: "Carnegie",
        principle:
          "Make the other person feel important — and do it sincerely. That's the whole game.",
      },
      {
        n: 58,
        title: "Never Split the Difference",
        author: "Voss",
        principle:
          "Tactical empathy. Label their fears. Get 'that's right' — not 'you're right'.",
      },
      {
        n: 59,
        title: "Pitch Anything",
        author: "Klaff",
        principle:
          "Frame control wins every negotiation. Whoever sets the frame sets the outcome.",
      },
    ],
  },
  {
    name: "Leadership, Mindset & Mastery",
    color: GREEN,
    books: [
      {
        n: 60,
        title: "Start With Why",
        author: "Sinek",
        principle:
          "People don't buy what you do. They buy why you do it.",
      },
      {
        n: 61,
        title: "Leaders Eat Last",
        author: "Sinek",
        principle:
          "Real leaders sacrifice for their people. Safety in the circle breeds loyalty outside it.",
      },
      {
        n: 62,
        title: "The Hard Thing About Hard Things",
        author: "Horowitz",
        principle:
          "There's no recipe for the hard things. You just have to face them.",
      },
      {
        n: 63,
        title: "Shoe Dog",
        author: "Knight",
        principle:
          "Don't stop. Don't even think about stopping until you get there.",
      },
      {
        n: 64,
        title: "Principles",
        author: "Dalio",
        principle:
          "Pain + reflection = progress. Radical transparency beats ego protection every time.",
      },
      {
        n: 65,
        title: "Almanack of Naval",
        author: "Jorgenson",
        principle:
          "Seek wealth, not money or status. Own equity in things that scale without your time.",
      },
      {
        n: 66,
        title: "The E-Myth Revisited",
        author: "Gerber",
        principle:
          "Work on your business, not in it. Systemize the work so the business runs without you.",
      },
      {
        n: 67,
        title: "The ONE Thing",
        author: "Keller",
        principle:
          "What's the one thing I can do such that by doing it everything else becomes easier or unnecessary?",
      },
      {
        n: 68,
        title: "Essentialism",
        author: "McKeown",
        principle:
          "Less but better. If it's not a hell yes, it's a no.",
      },
      {
        n: 69,
        title: "The 4-Hour Workweek",
        author: "Ferriss",
        principle:
          "DEAL: Define, Eliminate, Automate, Liberate. Build freedom, not income.",
      },
      {
        n: 70,
        title: "Tools of Titans",
        author: "Ferriss",
        principle:
          "Success leaves clues. Study the routines of the top 0.1% and steal ruthlessly.",
      },
      {
        n: 71,
        title: "The 10X Rule",
        author: "Cardone",
        principle:
          "Set targets 10x bigger than you think reasonable. Take 10x the action to reach them.",
      },
      {
        n: 72,
        title: "Crushing It!",
        author: "Vaynerchuk",
        principle:
          "Put out content every day on every platform. Quantity compounds into quality.",
      },
      {
        n: 73,
        title: "Jab Jab Jab Right Hook",
        author: "Vaynerchuk",
        principle:
          "Give value three times before you ask. The right hook only lands after the jabs.",
      },
      {
        n: 74,
        title: "Building a StoryBrand",
        author: "Miller",
        principle:
          "The customer is the hero. You are the guide who hands them the plan.",
      },
      {
        n: 75,
        title: "Made to Stick",
        author: "Heath",
        principle:
          "SUCCESs: Simple, Unexpected, Concrete, Credible, Emotional, Story. Ideas that stick share these six.",
      },
      {
        n: 76,
        title: "Contagious",
        author: "Berger",
        principle:
          "STEPPS: Social currency, triggers, emotion, public, practical value, stories. Why things go viral.",
      },
      {
        n: 77,
        title: "This Is Marketing",
        author: "Godin",
        principle:
          "Marketing is the generous act of helping someone solve a problem — their problem.",
      },
      {
        n: 78,
        title: "Purple Cow",
        author: "Godin",
        principle:
          "Very good is invisible. Remarkable gets talked about. Be a purple cow or nothing.",
      },
      {
        n: 79,
        title: "Linchpin",
        author: "Godin",
        principle:
          "Be the one they can't replace. Art, leadership, and connection are the new job description.",
      },
      {
        n: 80,
        title: "The War of Art",
        author: "Pressfield",
        principle:
          "Resistance is the enemy. It's strongest right before the breakthrough. Do the work anyway.",
      },
      {
        n: 81,
        title: "Turning Pro",
        author: "Pressfield",
        principle:
          "The amateur waits for inspiration. The pro shows up no matter what.",
      },
      {
        n: 82,
        title: "Mastery",
        author: "Greene",
        principle:
          "10,000 hours is just the entry fee. The path is apprentice → creative-active → master.",
      },
      {
        n: 83,
        title: "Ego is the Enemy",
        author: "Holiday",
        principle:
          "Ego blocks learning at the start, success in the middle, and recovery at the end. Kill it daily.",
      },
      {
        n: 84,
        title: "The Obstacle is the Way",
        author: "Holiday",
        principle:
          "What stands in the way becomes the way. The obstacle is training.",
      },
      {
        n: 85,
        title: "Discipline Equals Freedom",
        author: "Willink",
        principle:
          "The more disciplined you are, the freer you become. Structure creates space.",
      },
      {
        n: 86,
        title: "Extreme Ownership",
        author: "Willink & Babin",
        principle:
          "There are no bad teams, only bad leaders. Take ownership of everything in your world.",
      },
      {
        n: 87,
        title: "Grit",
        author: "Duckworth",
        principle:
          "Passion plus perseverance beats talent. Grit compounds over decades.",
      },
      {
        n: 88,
        title: "Mindset",
        author: "Dweck",
        principle:
          "Fixed mindset avoids challenge. Growth mindset eats it. Choose which voice you listen to.",
      },
      {
        n: 89,
        title: "Outliers",
        author: "Gladwell",
        principle:
          "Success is context plus practice plus luck. Nobody makes it alone.",
      },
      {
        n: 90,
        title: "Blink",
        author: "Gladwell",
        principle:
          "Trained intuition beats deliberate analysis in the domains you've mastered.",
      },
      {
        n: 91,
        title: "David and Goliath",
        author: "Gladwell",
        principle:
          "Disadvantages are often hidden advantages. Fight your fight, not theirs.",
      },
      {
        n: 92,
        title: "The Tipping Point",
        author: "Gladwell",
        principle:
          "Small changes create epidemics — if you find the right mavens, connectors, and salesmen.",
      },
      {
        n: 93,
        title: "Thinking in Bets",
        author: "Duke",
        principle:
          "Every decision is a bet. Good outcome ≠ good decision. Judge the process.",
      },
      {
        n: 94,
        title: "Range",
        author: "Epstein",
        principle:
          "Generalists often triumph in an interconnected world. Sampling beats early specialization.",
      },
      {
        n: 95,
        title: "Originals",
        author: "Grant",
        principle:
          "Originals aren't fearless — they feel the same fear and act anyway. Doubt the idea, not yourself.",
      },
      {
        n: 96,
        title: "Give and Take",
        author: "Grant",
        principle:
          "Givers dominate the top and the bottom. Smart givers protect their time — and still outperform.",
      },
      {
        n: 97,
        title: "The Courage to Be Disliked",
        author: "Kishimi",
        principle:
          "Freedom is being disliked by others. Separate your tasks from theirs.",
      },
      {
        n: 98,
        title: "Man's Search for Meaning",
        author: "Frankl",
        principle:
          "Between stimulus and response there is a space. In that space is our freedom to choose.",
      },
      {
        n: 99,
        title: "The Power of Now",
        author: "Tolle",
        principle:
          "Most suffering lives in the future or the past. The present moment is the only place life happens.",
      },
      {
        n: 100,
        title: "A Guide to the Good Life",
        author: "Irvine",
        principle:
          "Negative visualization: imagine losing what you have. It turns ordinary days into miracles.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Compute total duration
// ─────────────────────────────────────────────────────────────
export const LIBRARY_DURATION = (() => {
  let total = INTRO_F + OUTRO_F;
  for (const cat of LIBRARY) {
    total += CATEGORY_F + cat.books.length * BOOK_F;
  }
  return total;
})();

// ─────────────────────────────────────────────────────────────
// Shared backdrop
// ─────────────────────────────────────────────────────────────
const Backdrop: React.FC<{ accent?: string }> = ({ accent = CYAN }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 80) * 20;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% ${50 + drift}%, ${BG_MID} 0%, ${BG} 60%, #000 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, ${accent}22 0%, transparent 40%)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 80% 70%, ${PURPLE}11 0%, transparent 40%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Fade-in helper
// ─────────────────────────────────────────────────────────────
const Fade: React.FC<{
  children: React.ReactNode;
  delay?: number;
  dur?: number;
  y?: number;
}> = ({ children, delay = 0, dur = 18, y = 20 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const opacity = interpolate(t, [0, dur], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ty = interpolate(t, [0, dur], [y, 0], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, transform: `translateY(${ty}px)` }}>{children}</div>
  );
};

const SceneFade: React.FC<{
  children: React.ReactNode;
  dur: number;
}> = ({ children, dur }) => {
  const frame = useCurrentFrame();
  const inOp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: Math.min(inOp, outOp) }}>
      {children}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Intro scene
// ─────────────────────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 50], [0.94, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <Fade delay={0}>
          <div
            style={{
              color: CYAN,
              fontSize: 18,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            THE OPERATING LIBRARY
          </div>
        </Fade>
        <Fade delay={15}>
          <div
            style={{
              color: TEXT,
              fontSize: 128,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            100 Books
          </div>
        </Fade>
        <Fade delay={35}>
          <div
            style={{
              color: MUTED,
              fontSize: 32,
              marginTop: 28,
              fontWeight: 400,
            }}
          >
            One principle at a time
          </div>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Category divider
// ─────────────────────────────────────────────────────────────
const CategoryScene: React.FC<{ index: number; name: string; accent: string }> = ({
  index,
  name,
  accent,
}) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Fade>
          <div
            style={{
              color: accent,
              fontSize: 20,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            CATEGORY {String(index + 1).padStart(2, "0")} / {LIBRARY.length}
          </div>
        </Fade>
        <Fade delay={10}>
          <div
            style={{
              color: TEXT,
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 1400,
            }}
          >
            {name}
          </div>
        </Fade>
        <Fade delay={24}>
          <div
            style={{
              width: 160,
              height: 3,
              background: accent,
              margin: "36px auto 0",
              boxShadow: `0 0 20px ${accent}`,
            }}
          />
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Book card scene
// ─────────────────────────────────────────────────────────────
const BookScene: React.FC<{ book: Book; accent: string }> = ({
  book,
  accent,
}) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
        padding: "0 120px",
      }}
    >
      <Fade>
        <div
          style={{
            width: 1400,
            padding: "56px 72px",
            background: PANEL,
            border: `1px solid ${BORDER}`,
            borderRadius: 24,
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 80px ${accent}15`,
          }}
        >
          {/* top accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
          {/* book number chip */}
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              border: `1px solid ${accent}`,
              borderRadius: 999,
              color: accent,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            #{String(book.n).padStart(3, "0")}
          </div>
          {/* title */}
          <div
            style={{
              color: TEXT,
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              marginBottom: 8,
            }}
          >
            {book.title}
          </div>
          {/* author */}
          <div
            style={{
              color: accent,
              fontSize: 26,
              fontWeight: 500,
              marginBottom: 32,
            }}
          >
            {book.author}
          </div>
          {/* divider */}
          <div
            style={{
              height: 1,
              background: BORDER,
              marginBottom: 28,
            }}
          />
          {/* principle */}
          <div
            style={{
              color: MUTED,
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            CORE PRINCIPLE
          </div>
          <div
            style={{
              color: TEXT,
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.35,
              letterSpacing: -0.3,
            }}
          >
            {book.principle}
          </div>
        </div>
      </Fade>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Outro scene
// ─────────────────────────────────────────────────────────────
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 10);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Fade>
          <div
            style={{
              color: DIM,
              fontSize: 18,
              letterSpacing: 6,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            THE OPERATING SYSTEM
          </div>
        </Fade>
        <Fade delay={14}>
          <div
            style={{
              color: TEXT,
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            100 Books.
            <br />
            100 Principles.
            <br />
            <span style={{ color: CYAN }}>One Operator.</span>
          </div>
        </Fade>
        <Fade delay={50}>
          <div
            style={{
              color: MUTED,
              fontSize: 26,
              marginTop: 48,
              letterSpacing: 0.5,
            }}
          >
            Install the library. Apply the principles. Execute.
          </div>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// Root composition
// ─────────────────────────────────────────────────────────────
export const BookLibrary: React.FC = () => {
  // Track current accent for backdrop tinting
  const frame = useCurrentFrame();
  let offset = INTRO_F;
  let currentAccent = CYAN;
  for (const cat of LIBRARY) {
    const catEnd = offset + CATEGORY_F + cat.books.length * BOOK_F;
    if (frame >= offset && frame < catEnd) {
      currentAccent = cat.color;
      break;
    }
    offset = catEnd;
  }

  // Build sequences
  const sequences: React.ReactNode[] = [];
  let cursor = 0;

  sequences.push(
    <Sequence key="intro" from={cursor} durationInFrames={INTRO_F}>
      <SceneFade dur={INTRO_F}>
        <IntroScene />
      </SceneFade>
    </Sequence>
  );
  cursor += INTRO_F;

  LIBRARY.forEach((cat, catIdx) => {
    sequences.push(
      <Sequence
        key={`cat-${catIdx}`}
        from={cursor}
        durationInFrames={CATEGORY_F}
      >
        <SceneFade dur={CATEGORY_F}>
          <CategoryScene index={catIdx} name={cat.name} accent={cat.color} />
        </SceneFade>
      </Sequence>
    );
    cursor += CATEGORY_F;

    cat.books.forEach((book, bookIdx) => {
      sequences.push(
        <Sequence
          key={`book-${catIdx}-${bookIdx}`}
          from={cursor}
          durationInFrames={BOOK_F}
        >
          <SceneFade dur={BOOK_F}>
            <BookScene book={book} accent={cat.color} />
          </SceneFade>
        </Sequence>
      );
      cursor += BOOK_F;
    });
  });

  sequences.push(
    <Sequence key="outro" from={cursor} durationInFrames={OUTRO_F}>
      <SceneFade dur={OUTRO_F}>
        <OutroScene />
      </SceneFade>
    </Sequence>
  );

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("bg_library.wav")} volume={0.5} />
      <Backdrop accent={currentAccent} />
      {sequences}
    </AbsoluteFill>
  );
};
