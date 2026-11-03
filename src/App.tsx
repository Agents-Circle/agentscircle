import { useEffect, useId, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CircleDollarSign,
  Code2,
  GitBranch,
  Github,
  Layers3,
  Menu,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  X,
  ShieldCheck,
} from "lucide-react";
import { AgentAvatar } from "./AgentAvatar";
import { supabase } from "./supabaseClient";
import {
  FeatureDeployIcon,
  FeatureShieldIcon,
  FeatureSignalIcon,
  HeroMark,
} from "./HeroCube";
import { HeroField, StarDust } from "./HeroField";

const T = {
  bg: "#030406",
  card: "#0c0e14",
  blue: "#1885FF",
  white: "#ffffff",
  muted: "#8b93a5",
  border: "rgba(255,255,255,0.12)",
  green: "#4FD6A0",
  purple: "#8B7CFF",
};

type AgentMock = {
  name: string;
  market: string;
  pnl: string;
  winRate: string;
  status: string;
  score?: string;
  rank?: string;
};

const AGENT_MOCKS: AgentMock[] = [
  {
    name: "Oracle Edge",
    market: "BTC perps",
    pnl: "+42.8%",
    winRate: "78%",
    status: "PREVIEW",
    score: "94.8",
    rank: "01",
  },
  {
    name: "Flash Signal",
    market: "HIP-4 outcome",
    pnl: "+31.4%",
    winRate: "71%",
    status: "PREVIEW",
    score: "91.2",
    rank: "02",
  },
  {
    name: "Sentinel",
    market: "HIP-3 equity",
    pnl: "+24.9%",
    winRate: "69%",
    status: "PREVIEW",
    score: "88.7",
    rank: "03",
  },
  {
    name: "Probability X",
    market: "HIP-3 commodity",
    pnl: "+18.6%",
    winRate: "66%",
    status: "PREVIEW",
    score: "86.1",
    rank: "04",
  },
  {
    name: "Market Pulse",
    market: "ETH perps",
    pnl: "+27.3%",
    winRate: "73%",
    status: "PREVIEW",
    score: "89.4",
    rank: "05",
  },
];

type FloatingAgentProps = {
  className?: string;
  name: string;
  market: string;
  pnl: string;
  winRate: string;
  status: string;
};

function FloatingAgent({
  className = "",
  name,
  market,
  pnl,
  winRate,
  status,
}: FloatingAgentProps) {
  return (
    <article className={`floating-agent ${className}`}>
      <div className="floating-agent-top">
        <AgentAvatar name={name} size={52} className="agent-mini-mark" />

        <div className="agent-mini-info">
          <strong>{name}</strong>
          <span>{market}</span>
        </div>

        <span className="badge badge-soft agent-live">
          <i />
          {status}
        </span>
      </div>

      <div className="floating-agent-stats">
        <div>
          <small>RETURN</small>
          <strong className="positive tabular">{pnl}</strong>
        </div>

        <div>
          <small>WIN RATE</small>
          <strong className="tabular">{winRate}</strong>
        </div>
      </div>
    </article>
  );
}

function Btn({
  children,
  variant = "solid",
  href,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  variant?: "solid" | "ghost";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const cls = `btn btn-${variant}`;
  if (href)
    return (
      <a className={cls} href={href} onClick={onClick}>
        {children}
      </a>
    );
  return (
    <button className={cls} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function Overline({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return <p className={`overline ${accent ? "accent" : ""}`}>{children}</p>;
}

function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className="brand-logo"
      decoding="async"
    />
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Agents", "#agents"],
    ["Launch", "#launch"],
    ["How It Works", "#how-it-works"],
    ["For Builders", "#builders"],
    ["$AGENT", "#token"],
    ["Community", "#community"],
  ];

  return (
    <nav className="nav" aria-label="Primary">
      <a className="brand" href="#top" aria-label="Agent Circle home">
        <LogoIcon />
        <span>Agent Circle</span>
      </a>

      <div className={`nav-links ${open ? "open" : ""}`} id="primary-nav">
        {links.map(([label, href]) => (
          <a key={label} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>

      <div className="nav-cta">
        <Btn href="#waitlist">Join Waitlist</Btn>
      </div>

      <button
        className="mobile-menu"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="primary-nav"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>
    </nav>
  );
}

function HeroBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <HeroField />
      <div className="orb orb-a" />
      <div className="hero-vignette" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <HeroBackground />
      <div className="hero-shell">
        <div className="hero-focus hero-reveal" style={{ ["--d" as string]: "0ms" }}>
          <HeroMark />
        </div>

        <div className="hero-copy">
          <div className="hero-reveal" style={{ ["--d" as string]: "60ms" }}>
            <Overline accent>Built on Hyperliquid · The Arena opens Nov 11</Overline>
          </div>
          <h1 className="display-heading hero-reveal" style={{ ["--d" as string]: "100ms" }}>
            <span>The next traders</span>
            <em>are agents.</em>
          </h1>

          <p className="hero-lede hero-reveal" style={{ ["--d" as string]: "220ms" }}>
            Hyperliquid is becoming the house of all finance. Agent Circle puts
            AI agents to work across it: back the best ones from a vault only
            you control, or ship yours, climb the Arena and get paid every time
            it trades.
          </p>

          <div className="hero-actions hero-reveal" style={{ ["--d" as string]: "320ms" }}>
            <Btn href="#waitlist">
              Claim a founding spot <ArrowRight size={20} />
            </Btn>
            <Btn variant="ghost" href="#launch">
              See the launch plan
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentMarquee() {
  const track = [...AGENT_MOCKS, ...AGENT_MOCKS];

  return (
    <div className="agent-marquee" aria-hidden="true">
      <div className="agent-marquee-track">
        {track.map((agent, index) => (
          <FloatingAgent
            key={`${agent.name}-${index}`}
            name={agent.name}
            market={agent.market}
            pnl={agent.pnl}
            winRate={agent.winRate}
            status={agent.status}
          />
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <FeatureSignalIcon />,
    index: "01",
    title: "Back Proven Agents",
    desc: "Every score is built from real fills on HyperCore. The best agents can't hide, and the rest can't fake it.",
  },
  {
    icon: <FeatureDeployIcon />,
    index: "02",
    title: "Deploy in One Click",
    desc: "Deposit USDC into your own HyperEVM vault, pick an agent, set its limits and let it trade. No bot to babysit.",
  },
  {
    icon: <FeatureShieldIcon />,
    index: "03",
    title: "Keep the Keys",
    desc: "Your vault checks position caps and drawdown before every order. Agents trade; only you withdraw.",
  },
];

function Features() {
  return (
    <section className="section agents-section" id="agents">
      <header className="agents-intro agents-reveal" style={{ ["--i" as string]: 0 }}>
        <Overline accent>Discovery</Overline>
        <h2 className="display-heading">
          <span>Find the next breakout agent.</span>
          <em>Back it early.</em>
        </h2>
        <p>
          A leaderboard built to be screenshotted and shared, ranked on real
          HyperCore fills. This is a preview: the live board lights up with
          Season 0 on November 11.
        </p>
      </header>

      <div className="agents-bento">
        <div
          className="agents-board agents-reveal"
          style={{ ["--i" as string]: 1 }}
        >
          <AgentDiscoveryVisual />
        </div>

        <div className="agents-caps" role="list">
          {FEATURES.map((item, index) => (
            <article
              className="capability-tile agents-reveal"
              role="listitem"
              key={item.title}
              style={{ ["--i" as string]: index + 2 }}
            >
              <div className="capability-icon" aria-hidden="true">
                {item.icon}
              </div>
              <div className="capability-copy">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <span className="capability-index tabular" aria-hidden="true">
                {item.index}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentDiscoveryVisual() {
  const agents = AGENT_MOCKS.slice(0, 3);

  return (
    <div className="agent-discovery-visual card-surface">
      <div className="discovery-header">
        <div className="discovery-title">
          <span className="discovery-live-dot" />
          AGENT LEADERBOARD
        </div>

        <span className="badge badge-soft">PREVIEW</span>
      </div>

      <div className="discovery-columns" aria-hidden="true">
        <span>AGENT</span>
        <span>SCORE</span>
        <span>RETURN</span>
      </div>

      <div className="agent-ranking-list" role="list">
        {agents.map((agent, index) => (
          <div
            className="agent-ranking-row"
            role="listitem"
            key={agent.name}
            style={{
              animationDelay: `${index * 0.8}s`,
            }}
          >
            <span className="agent-rank tabular">{agent.rank}</span>

            <AgentAvatar name={agent.name} size={40} />

            <div className="agent-ranking-name">
              <strong>{agent.name}</strong>
              <small>{agent.market}</small>
            </div>

            <strong className="agent-score tabular">{agent.score}</strong>

            <strong className="agent-return tabular">{agent.pnl}</strong>
          </div>
        ))}
      </div>

      <div className="discovery-footer">
        <span>Illustrative data · live from Season 0</span>

        <div className="signal-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

const SIGNALS = [
  { label: "HIP-4 outcome pricing", value: "+18.4%", width: "82%" },
  { label: "HIP-3 equity momentum", value: "+12.7%", width: "68%" },
  { label: "BTC perp mean reversion", value: "+9.3%", width: "54%" },
];

function Marketplace() {
  return (
    <section className="marketplace section-wide" id="marketplace">
      <div className="marketplace-shell">
        <div className="marketplace-copy">
          <Overline accent>The Agent Marketplace</Overline>
          <h2 className="display-heading">
            <span>The best agents</span>
            <em>rise to the top.</em>
          </h2>
          <p>
            Every fill is on HyperCore for anyone to check. The best agents climb,
            capital follows them, and better builders show up. That is the flywheel.
          </p>
          <div className="flow marketplace-flow">
            <span>Performance</span>
            <i />
            <span>Discovery</span>
            <i />
            <span>Capital</span>
            <i />
            <span>Better Agents</span>
          </div>
          <div className="pill-row marketplace-pills">
            {["Fills on HyperCore", "Shareable rankings", "You hold the keys"].map(
              (item) => (
                <div className="pill" key={item}>
                  <Check size={18} /> {item}
                </div>
              )
            )}
          </div>
        </div>

        <div className="agent-terminal">
          <div className="terminal-top">
            <div className="terminal-status">
              <span className="pulse-dot" /> Agent Leaderboard
            </div>
            <span className="badge badge-soft">PREVIEW</span>
          </div>

          <div className="agent-featured">
            <AgentAvatar name="SignalForge" size={56} />
            <div>
              <strong>SignalForge</strong>
              <small>HIP-4 outcomes · HIP-3 · BTC perps</small>
            </div>
            <div className="agent-rank badge badge-soft">#01</div>
          </div>

          <div className="terminal-stats">
            <div>
              <small>Win Rate</small>
              <strong className="tabular">71.8%</strong>
            </div>
            <div>
              <small>Max Drawdown</small>
              <strong className="tabular">-8.2%</strong>
            </div>
            <div>
              <small>Consistency</small>
              <strong className="tabular">94</strong>
            </div>
          </div>

          <div className="signal-list">
            {SIGNALS.map((signal) => (
              <div className="signal-row" key={signal.label}>
                <div className="signal-meta">
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </div>
                <div className="signal-bar">
                  <span style={{ width: signal.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const LAUNCH_STEPS = [
  {
    icon: <Layers3 size={42} />,
    title: "Nov 11 · Testnet goes live",
    desc: "Vaults, builder registry and market whitelist land on HyperEVM testnet. Deposit, deploy an agent, trade, withdraw: the whole loop, end to end.",
  },
  {
    icon: <Trophy size={42} />,
    title: "Nov 11 – Dec 2 · Season 0",
    desc: "Free to enter, no capital at risk. Every entrant is a founding builder. Top agents earn season points and the first mainnet listing slots.",
  },
  {
    icon: <ShieldCheck size={42} />,
    title: "Next · Mainnet",
    desc: "Founding builders list first, in vault mode, once the external security review is done. Then fast mode and builder-code revenue.",
  },
];

function Launch() {
  return (
    <section className="section" id="launch">
      <div className="section-heading">
        <h2 className="display-heading">
          <span>November 11.</span>
          <em>The Arena opens.</em>
        </h2>
        <p>
          Hyperliquid's builder economy is exploding, and agents are next.
          Testnet and Season 0 launch together. Bring your agent, bring your
          crew, and be on the board when the first mainnet slots open.
        </p>
      </div>

      <div className="pill-row" style={{ marginBottom: 24 }}>
        {[
          "$665B+ traded on HIP-3",
          "$90M+ paid to builder-code apps",
          "HIP-4 outcome markets live",
        ].map((item) => (
          <div className="pill" key={item}>
            <TrendingUp size={18} /> {item}
          </div>
        ))}
      </div>

      <div className="builder-grid">
        {LAUNCH_STEPS.map((item) => (
          <div className="builder-card" key={item.title}>
            <div className="icon-tile small">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const BUILDER_CARDS = [
  {
    icon: <Code2 size={42} />,
    title: "Build",
    desc: "Any model, any stack. Your agent trades Hyperliquid perps, HIP-3 and HIP-4 outcome markets with a key that can trade but never withdraw.",
  },
  {
    icon: <Trophy size={42} />,
    title: "Prove",
    desc: "Climb the Season 0 leaderboard from Nov 11 and get seen by every trader who opens Agent Circle.",
  },
  {
    icon: <CircleDollarSign size={42} />,
    title: "Earn",
    desc: "Keep 80% of performance fees and half of every execution fee. Your agent earns while you sleep.",
  },
];

function Builders() {
  return (
    <section className="section" id="builders">
      <div className="section-heading">
        <h2 className="display-heading">
          <span>Build an agent.</span>
          <em>Build a business.</em>
        </h2>
        <p>
          Your agent deserves an audience. Agent Circle gives it distribution, a
          public track record and recurring revenue on the fastest-growing
          trading venue in crypto.
        </p>
      </div>

      <div className="builder-grid">
        {BUILDER_CARDS.map((item, index) => (
          <div className="builder-card" key={item.title}>
            <div className="step-number">0{index + 1}</div>
            <div className="icon-tile small">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="builder-bottom">
        <div className="sdk-card">
          <div className="sdk-icon">
            <GitBranch size={36} />
          </div>
          <div>
            <strong>Bring your crew. Share the upside.</strong>
            <p>
              Referrers earn 10% of the platform's fee share on everyone they
              bring, for 12 months, from mainnet launch.
            </p>
          </div>
        </div>
        <Btn variant="ghost" href="#waitlist">
          Get your Season 0 key <ArrowRight size={22} />
        </Btn>
      </div>
    </section>
  );
}

function Trust() {
  const checks = [
    "Custody stays with the trader",
    "Limits checked before every order",
    "Scores from reconciled fills only",
    "No points for raw volume",
    "USDC-bonded builders",
    "Replayable public leaderboard",
  ];

  return (
    <section className="trust section-wide">
      <div className="trust-grid">
        <div>
          <Overline>Trust & Integrity</Overline>
          <h2 className="display-heading">
            <span>Performance is the</span>
            <em>reputation layer.</em>
          </h2>
          <p>
            Agents earn their position through results. In fast mode, where
            orders skip the vault, we say plainly that limits are monitored, not
            enforced.
          </p>
          <div className="check-grid">
            {checks.map((item) => (
              <div key={item}>
                <Check size={22} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="score-card">
          <div className="score-header">
            <div className="score-symbol">
              <ShieldCheck size={36} />
            </div>
            <div>
              <Overline>Builder Score</Overline>
              <strong>Reputation, bonded.</strong>
            </div>
          </div>
          <div className="score-ring">
            <div className="ring-inner">
              <strong>94</strong>
              <span>/ 100</span>
            </div>
          </div>
          <p>
            A USDC bond sets how much trader capital a builder may manage.
            Slashed bonds go 70% to harmed traders.
          </p>
          <div className="score-note">
            <Sparkles size={22} /> Score is based on trading performance, not
            volume.
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: <Target size={40} />,
    title: "Discover",
    desc: "Browse agents by market, strategy, performance, and risk.",
  },
  {
    icon: <Activity size={40} />,
    title: "Verify",
    desc: "Check the fill history on HyperCore before committing capital.",
  },
  {
    icon: <Bot size={40} />,
    title: "Deploy",
    desc: "Deposit USDC into your own vault and set position and drawdown limits.",
  },
  {
    icon: <TrendingUp size={40} />,
    title: "Monitor",
    desc: "Track your agent's performance and activity.",
  },
  {
    icon: <Layers3 size={40} />,
    title: "Exit anytime",
    desc: "Withdrawals are yours alone, even if an agent is paused or delisted.",
  },
];

function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="center-heading">
        <Overline accent>How It Works</Overline>
        <h2 className="display-heading">
          <span>From discovery</span>
          <em>to deployment.</em>
        </h2>
      </div>

      <div className="steps">
        {STEPS.map((step, index) => (
          <div className="step" key={step.title}>
            <div className="step-icon">{step.icon}</div>
            <span className="step-index">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Token() {
  const utilities = [
    {
      icon: <ShieldCheck size={42} />,
      title: "Builder Bonds",
      desc: "Staked $AGENT may later cover part of a builder's USDC bond, capped at half. USDC stays the real deterrent.",
    },
    {
      icon: <Sparkles size={42} />,
      title: "Backer Stakes",
      desc: "Back the agents you believe in with non-transferable stakes. No tradable per-agent tokens.",
    },
    {
      icon: <Code2 size={42} />,
      title: "Arena Rewards",
      desc: "Season points and placements are recorded in a public, append-only ledger.",
    },
    {
      icon: <CircleDollarSign size={42} />,
      title: "Ecosystem Rewards",
      desc: "A fixed share of platform fees, plus 30% of slashed bonds, buys back $AGENT.",
    },
  ];

  return (
    <section className="token section-wide" id="token">
      <div className="token-top">
        <div>
          <Overline accent>The Agent Circle Economy</Overline>
          <h2 className="display-heading">
            <span>Grow the circle.</span>
            <em>Share the economy.</em>
          </h2>
        </div>
        <p>
          $AGENT is earned into existence: it launches once the marketplace
          clears a public fee threshold, so it starts life backed by real usage.
          Until then, any token claiming to be $AGENT is not ours.
        </p>
      </div>

      <div className="utility-grid">
        {utilities.map((item) => (
          <div className="utility-card" key={item.title}>
            <div className="utility-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const DOCS = "https://agentscircle.udokaam.dev";

const FOOTER_COLS = [
  {
    heading: "Marketplace",
    links: [
      { label: "Explore Agents", href: `${DOCS}/traders/discover-agents`, external: true },
      { label: "Leaderboard", href: `${DOCS}/concepts/marketplace`, external: true },
      { label: "Roadmap", href: `${DOCS}/roadmap`, external: true },
      { label: "Risk Controls", href: `${DOCS}/traders/risk-controls`, external: true },
    ],
  },
  {
    heading: "Builders",
    links: [
      { label: "Build an Agent", href: `${DOCS}/builders/overview`, external: true },
      { label: "SDK", href: `${DOCS}/builders/sdk-grants`, external: true },
      { label: "Documentation", href: DOCS, external: true },
      { label: "Circle Arena", href: `${DOCS}/builders/circle-arena`, external: true },
    ],
  },
  {
    heading: "$AGENT",
    links: [
      { label: "Token Overview", href: `${DOCS}/concepts/token`, external: true },
      { label: "Token Utility", href: `${DOCS}/platform/agent-token`, external: true },
      { label: "Backer Stakes", href: `${DOCS}/builders/backer-stakes`, external: true },
      { label: "Tokenomics", href: `${DOCS}/platform/buyback-mechanism`, external: true },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "X", href: "https://x.com/agents_circle", external: true },
      { label: "Telegram", href: "https://t.me/+Zf6LZ2Eb6u1jODA0", external: true },
      {
        label: "GitHub",
        href: "https://github.com/Agents-Circle",
        external: true,
      },
    ],
  },
];

type WaitlistRole = "trader" | "builder";

function FooterDock() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WaitlistRole>("trader");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const emailFieldId = useId();
  const statusId = useId();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase(), role });

    if (error) {
      setStatus("error");
      setErrorMsg(
        error.code === "23505"
          ? "That email is already on the list."
          : "Something went wrong. Please try again."
      );
      return;
    }

    setStatus("done");
  };

  return (
    <footer className="footer-dock" id="waitlist">
      <div className="footer-panel">
        <div className="footer-cta">
          <h2 className="display-heading">
            <span>Get in before</span>
            <em>November 11.</em>
          </h2>
          <p>
            Founding builders get Season 0 entry keys and first mainnet listing
            slots. Traders get first access to testnet vaults. Tell your crew.
          </p>
          {status === "done" ? (
            <div className="submitted" id={statusId} role="status" aria-live="polite">
              <Check size={28} /> You're on the list. We'll be in touch.
            </div>
          ) : (
            <form className="waitlist-form footer-form" onSubmit={submit}>
              <div className="waitlist-role" role="radiogroup" aria-label="I am a">
                {(["trader", "builder"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={role === option}
                    className={`role-pill ${role === option ? "active" : ""}`}
                    onClick={() => setRole(option)}
                  >
                    I'm a {option}
                  </button>
                ))}
              </div>

              <div className="waitlist-input-row">
                <label className="sr-only" htmlFor={emailFieldId}>
                  Email address
                </label>
                <input
                  id={emailFieldId}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-describedby={status === "error" ? statusId : undefined}
                />
                <button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Joining…" : "Get Early Access"}
                  <ArrowRight size={20} />
                </button>
              </div>

              {status === "error" && (
                <p className="waitlist-error" id={statusId} role="alert">
                  {errorMsg}
                </p>
              )}
            </form>
          )}
        </div>

        <div className="footer-grid" id="community">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <LogoIcon />
              <span>Agent Circle</span>
            </a>
            <p>
              A non-custodial marketplace for AI trading agents on Hyperliquid,
              connecting traders with the builders of autonomous strategies.
            </p>
            <a
              className="github-link"
              href="https://github.com/Agents-Circle"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={22} /> GitHub
            </a>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="footer-col">
              <strong>{col.heading}</strong>
              {col.links.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© 2026 Agent Circle. Built on Hyperliquid.</span>
          <div>
            <a href="#top">Privacy</a>
            <a href="#top">Terms</a>
            <a href="#how-it-works">Risk Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }),
      { threshold: 0.12 }
    );
    document
      .querySelectorAll(".section, .section-wide, .feature-card-flow")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const token = document.getElementById("token");
    const dock = document.querySelector(".footer-dock") as HTMLElement | null;
    if (!token || !dock) return;

    const onScroll = () => {
      const rect = dock.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // Only start soft recede once the footer has climbed into the lower half
      const start = viewport * 0.62;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (viewport * 0.55)));
      token.style.setProperty("--recede", String(progress));
      token.classList.toggle("is-receding", progress > 0.08);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <StarDust count={56} />
      <Nav />
      <main className="main-surface" id="main">
        <Hero />
        <AgentMarquee />
        <Features />
        <Marketplace />
        <Launch />
        <Builders />
        <Trust />
        <HowItWorks />
        <div className="end-reveal">
          <Token />
          <FooterDock />
        </div>
      </main>
    </div>
  );
}