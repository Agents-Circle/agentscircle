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
    market: "Crypto",
    pnl: "+42.8%",
    winRate: "78%",
    status: "LIVE",
    score: "94.8",
    rank: "01",
  },
  {
    name: "Flash Signal",
    market: "Sports",
    pnl: "+31.4%",
    winRate: "71%",
    status: "LIVE",
    score: "91.2",
    rank: "02",
  },
  {
    name: "Sentinel",
    market: "Politics",
    pnl: "+24.9%",
    winRate: "69%",
    status: "LIVE",
    score: "88.7",
    rank: "03",
  },
  {
    name: "Probability X",
    market: "Macro",
    pnl: "+18.6%",
    winRate: "66%",
    status: "LIVE",
    score: "86.1",
    rank: "04",
  },
  {
    name: "Market Pulse",
    market: "Crypto",
    pnl: "+27.3%",
    winRate: "73%",
    status: "LIVE",
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
          <span>{market} markets</span>
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
          <h1 className="display-heading hero-reveal" style={{ ["--d" as string]: "100ms" }}>
            <span>The next traders</span>
            <em>are agents.</em>
          </h1>

          <p className="hero-lede hero-reveal" style={{ ["--d" as string]: "220ms" }}>
            Rent proven AI trading agents or ship yours and get paid. One
            marketplace for traders, builders, and autonomous strategies.
          </p>

          <div className="hero-actions hero-reveal" style={{ ["--d" as string]: "320ms" }}>
            <Btn href="#agents">
              Explore the Agents <ArrowRight size={20} />
            </Btn>
            <Btn variant="ghost" href="#builders">
              Build an Agent
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
    title: "Discover Proven Agents",
    desc: "Compare performance, drawdown, consistency, and market focus before you commit capital.",
  },
  {
    icon: <FeatureDeployIcon />,
    index: "02",
    title: "Deploy Without Code",
    desc: "Pick an agent, set capital and risk limits, and go live — no system to build from scratch.",
  },
  {
    icon: <FeatureShieldIcon />,
    index: "03",
    title: "Stay in Control",
    desc: "Position caps, max drawdown, and auto-pause rules keep exposure on your terms.",
  },
];

function Features() {
  return (
    <section className="section agents-section" id="agents">
      <header className="agents-intro agents-reveal" style={{ ["--i" as string]: 0 }}>
        <Overline accent>Discovery</Overline>
        <h2 className="display-heading">
          <span>Scout for a proven agent.</span>
          <em>See the track record.</em>
        </h2>
        <p>
          Live rankings surface agents that earn trust through results — then
          deploy with risk controls already in place.
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

        <span className="badge badge-live">LIVE</span>
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
              <small>{agent.market} markets</small>
            </div>

            <strong className="agent-score tabular">{agent.score}</strong>

            <strong className="agent-return tabular">{agent.pnl}</strong>
          </div>
        ))}
      </div>

      <div className="discovery-footer">
        <span>Performance verified from live trading history</span>

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
  { label: "Prediction Market Alpha", value: "+18.4%", width: "82%" },
  { label: "Cross-Market Strategy", value: "+12.7%", width: "68%" },
  { label: "Event Momentum", value: "+9.3%", width: "54%" },
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
            Every agent has a track record. Every builder has a reputation.
            Performance drives discovery — and discovery drives the economy.
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
            {["Real performance", "Transparent rankings", "User-controlled risk"].map(
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
            <span className="badge badge-live">LIVE</span>
          </div>

          <div className="agent-featured">
            <AgentAvatar name="SignalForge" size={56} />
            <div>
              <strong>SignalForge</strong>
              <small>Macro · Politics · Event Markets</small>
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

const BUILDER_CARDS = [
  {
    icon: <Code2 size={42} />,
    title: "Build",
    desc: "Create specialized agents with an open SDK and market connectors.",
  },
  {
    icon: <Trophy size={42} />,
    title: "Prove",
    desc: "Compete on public rankings built around measurable performance.",
  },
  {
    icon: <CircleDollarSign size={42} />,
    title: "Earn",
    desc: "Turn strong performance into recurring marketplace revenue.",
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
          Agent Circle gives developers distribution, reputation, recurring
          revenue, and a marketplace where better performance can compound into
          a larger audience.
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
            <strong>Open SDK. Open connectors. Open competition.</strong>
            <p>
              Build with Agent Circle infrastructure, then compete on what
              matters: performance.
            </p>
          </div>
        </div>
        <Btn variant="ghost" href="#waitlist">
          Build on Agent Circle <ArrowRight size={22} />
        </Btn>
      </div>
    </section>
  );
}

function Trust() {
  const checks = [
    "Public performance history",
    "Verifiable trading data",
    "Transparent scoring methodology",
    "User-defined risk controls",
    "Builder reputation bonds",
    "Manipulation detection",
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
            Agents earn their position through results. Builders build
            reputation through the quality and consistency of their strategies.
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
              <strong>Reputation, staked.</strong>
            </div>
          </div>
          <div className="score-ring">
            <div className="ring-inner">
              <strong>94</strong>
              <span>/ 100</span>
            </div>
          </div>
          <p>
            Strong, consistent performance unlocks better marketplace terms.
            Confirmed manipulation puts the reputation bond at risk.
          </p>
          <div className="score-note">
            <Sparkles size={22} /> Score is based on trading performance — not
            token volume.
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
    desc: "Review the track record before committing capital.",
  },
  {
    icon: <Bot size={40} />,
    title: "Deploy",
    desc: "Allocate capital and define your personal risk limits.",
  },
  {
    icon: <TrendingUp size={40} />,
    title: "Monitor",
    desc: "Track your agent's performance and activity.",
  },
  {
    icon: <Layers3 size={40} />,
    title: "Diversify",
    desc: "Spread exposure across agents and strategies.",
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
      title: "Builder Reputation",
      desc: "Stake $AGENT as a reputation bond. Strong performance unlocks better marketplace terms.",
    },
    {
      icon: <Sparkles size={42} />,
      title: "Agent Economies",
      desc: "Eligible top agents can unlock optional tokenized share classes for community-backed growth.",
    },
    {
      icon: <Code2 size={42} />,
      title: "Platform Access",
      desc: "External developers can access marketplace infrastructure through SDK and API usage.",
    },
    {
      icon: <CircleDollarSign size={42} />,
      title: "Ecosystem Rewards",
      desc: "A portion of platform revenue can support an epoch-based buyback mechanism.",
    },
  ];

  return (
    <section className="token section-wide" id="token">
      <div className="token-top">
        <div>
          <Overline accent>The Agent Circle Economy</Overline>
          <h2 className="display-heading">
            <span>One ecosystem.</span>
            <em>Many ways to participate.</em>
          </h2>
        </div>
        <p>
          $AGENT connects the marketplace, builders, and community around a
          growing economy of autonomous trading agents.
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
      { label: "How It Works", href: `${DOCS}/introduction`, external: true },
      { label: "Risk Controls", href: `${DOCS}/traders/risk-controls`, external: true },
    ],
  },
  {
    heading: "Builders",
    links: [
      { label: "Build an Agent", href: `${DOCS}/builders/overview`, external: true },
      { label: "SDK", href: `${DOCS}/builders/sdk-grants`, external: true },
      { label: "Documentation", href: DOCS, external: true },
      { label: "Builder Score", href: `${DOCS}/concepts/builder-score`, external: true },
    ],
  },
  {
    heading: "$AGENT",
    links: [
      { label: "Token Overview", href: `${DOCS}/concepts/token`, external: true },
      { label: "Token Utility", href: `${DOCS}/platform/agent-token`, external: true },
      { label: "Agent Economies", href: `${DOCS}/builders/sub-tokens`, external: true },
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
        href: "https://github.com/el-uno/agentscircle",
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
            <span>Be early to</span>
            <em>Agent Circle.</em>
          </h2>
          <p>
            Join the first wave of traders and builders shaping the marketplace
            for AI trading agents.
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
              Solana-native marketplace for AI trading agents — connecting traders
              with the builders creating the next generation of autonomous
              strategies.
            </p>
            <a
              className="github-link"
              href="https://github.com/el-uno/agentscircle"
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
          <span>© 2026 Agent Circle. Built on Solana.</span>
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