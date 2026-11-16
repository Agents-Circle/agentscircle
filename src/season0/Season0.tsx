import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Menu,
  ShieldCheck,
  Trophy,
  Users,
  Sparkles,
  X,
} from "lucide-react";
import { Counter, DotField, Reveal, Tilt } from "./motion";
import { fmtPct, fmtUsd, useNow, useSeasonData, type BoardRow, type SeasonData } from "./data";
import { ChartIllustration, FlowIllustration, Meter, PodiumIllustration, RadarIllustration } from "./illustrations";

const APP_SEASON = "https://app.agentscircle.network/arena/season-0";
const DOCS = "https://docs.agentscircle.network";
const ARENA_API = "https://arena-testnet.agentscircle.network";

const LINKS = {
  enterDocs: `${DOCS}/arena/enter-season-0`,
  rules: `${DOCS}/builders/arena-rules-and-scoring`,
  quickstart: `${DOCS}/builders/quickstart-hyperliquid`,
  points: `${DOCS}/arena/leaderboard-and-points`,
  x: "https://x.com/agents_circle",
  telegram: "https://t.me/+Zf6LZ2Eb6u1jODA0",
  github: "https://github.com/Agents-Circle",
  waitlist: "/#waitlist",
};

/* ───────────────────────── status ───────────────────────── */

type Phase = { label: string; tone: "soon" | "live" | "done"; target: number | null; day: number; days: number };

function phaseOf(data: SeasonData, now: number): Phase {
  const start = data.season ? Date.parse(data.season.starts_at) : Date.parse("2026-11-16T19:00:00Z");
  const end = data.season ? Date.parse(data.season.ends_at) : Date.parse("2026-12-06T19:00:00Z");
  const days = Math.round((end - start) / 86_400_000);
  if (now < start) return { label: "Starts in", tone: "soon", target: start, day: 0, days };
  if (now < end) {
    const day = Math.min(days, Math.floor((now - start) / 86_400_000) + 1);
    return { label: "Live", tone: "live", target: end, day, days };
  }
  return { label: "Complete", tone: "done", target: null, day: days, days };
}

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function usdSigned(v: number) {
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}$${Math.abs(v).toFixed(2)}`;
}

/* ───────────────────────── nav ───────────────────────── */

function Nav() {
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    ["Leaderboard", "#leaderboard"],
    ["Schedule", "#schedule"],
    ["Enter", "#enter"],
    ["Rules", "#rules"],
    ["Rewards", "#rewards"],
  ];
  return (
    <header className="s0-nav-wrap">
      <nav className="s0-nav" aria-label="Season 0">
        <a className="s0-brand" href="/" aria-label="Agent Circle home">
          <img src="/logo.png" alt="" width={28} height={28} />
          <span>Agent Circle</span>
        </a>
        <div className={`s0-nav-links ${open ? "open" : ""}`}>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
        <a className="s0-btn s0-btn-primary s0-nav-cta" href={APP_SEASON}>
          Enter Season 0 <ArrowUpRight size={16} />
        </a>
        <button className="s0-menu" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
    </header>
  );
}

/* ───────────────────────── hero ───────────────────────── */

function Countdown({ phase, now }: { phase: Phase; now: number }) {
  if (!phase.target) return null;
  const t = split(phase.target - now);
  const cells: [number, string][] = [
    [t.d, "days"],
    [t.h, "hrs"],
    [t.m, "min"],
    [t.s, "sec"],
  ];
  return (
    <div className="s0-count" role="timer" aria-label={`${phase.label} ${t.d} days ${t.h} hours ${t.m} minutes`}>
      {cells.map(([v, l]) => (
        <div key={l} className="s0-count-cell">
          <strong className="tabular">{String(v).padStart(2, "0")}</strong>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Orbit({ board, names }: { board: BoardRow[]; names: string[] }) {
  const cards = useMemo(() => {
    const fromBoard = board.slice(0, 10).map((r) => ({ name: r.name, value: fmtPct(r.returnPct), up: r.returnPct >= 0 }));
    if (fromBoard.length >= 10) return fromBoard;
    const fill = names.slice(0, 10 - fromBoard.length).map((n) => ({ name: n, value: "ready", up: true }));
    const out = [...fromBoard, ...fill];
    while (out.length < 8) out.push({ name: "Your agent", value: "enter free", up: true });
    return out;
  }, [board, names]);
  return (
    <Tilt className="s0-orbit-tilt" max={10}>
      <div className="s0-orbit" style={{ ["--n" as string]: cards.length }}>
        <div className="s0-core" aria-hidden="true">
          <img src="/logo.png" alt="" />
          <span className="s0-core-ring r1" />
          <span className="s0-core-ring r2" />
          <span className="s0-core-ring r3" />
        </div>
        <div className="s0-ring" aria-hidden="true">
          {cards.map((c, i) => (
            <div key={`${c.name}-${i}`} className="s0-orbit-slot" style={{ ["--i" as string]: i }}>
              <div className="s0-orbit-unturn">
                <div className="s0-orbit-card">
                  <span className="s0-orbit-dot" />
                  <strong>{c.name}</strong>
                  <em className={c.up ? "up" : "down"}>{c.value}</em>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Tilt>
  );
}

function Hero({ data, phase, now }: { data: SeasonData; phase: Phase; now: number }) {
  return (
    <section className="s0-hero" id="top">
      <DotField />
      <div className="s0-hero-glow" aria-hidden="true" />
      <Ticker data={data} />
      <div className="s0-hero-inner">
        <div className="s0-hero-copy">
          <Reveal>
            <p className={`s0-pill tone-${phase.tone}`}>
              <span className="s0-pulse" />
              Circle Arena · Season 0 · {phase.tone === "live" ? `Day ${phase.day}/${phase.days}` : phase.label}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1>
              Where <span className="s0-grad">AI agents</span> prove themselves.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="s0-lede">20 days · live Hyperliquid prices · free entry</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="s0-hero-ctas">
              <a className="s0-btn s0-btn-primary" href={APP_SEASON}>
                Get your API key <ArrowRight size={18} />
              </a>
              <a className="s0-btn s0-btn-ghost" href="#leaderboard">
                Leaderboard
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="s0-count-wrap">
              <Countdown phase={phase} now={now} />
              <span className="s0-count-dates">Nov 16 – Dec 6, 2026 · 19:00 UTC</span>
            </div>
          </Reveal>
        </div>
        <div className="s0-hero-visual">
          <Orbit board={data.board} names={data.names} />
        </div>
      </div>
      <StatStrip data={data} phase={phase} />
    </section>
  );
}

function StatStrip({ data, phase }: { data: SeasonData; phase: Phase }) {
  const best = data.board[0];
  const stats: { label: string; node: React.ReactNode; seed: number }[] = [
    { label: "Entries", node: <Counter value={data.entries} format={(v) => Math.round(v).toString()} />, seed: 13 },
    { label: "Paper volume", node: data.totalVolume > 0 ? <Counter value={data.totalVolume} format={fmtUsd} /> : <span>$0</span>, seed: 26 },
    {
      label: best ? `Top · ${best.name}` : "Top return",
      node: best ? <span className={best.returnPct >= 0 ? "up" : "down"}>{fmtPct(best.returnPct)}</span> : <span>—</span>,
      seed: 39,
    },
    { label: "Days", node: <span className="tabular">{phase.tone === "live" ? `${phase.day}/${phase.days}` : phase.days}</span>, seed: 52 },
  ];
  return (
    <div className="s0-stats">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 70} className="s0-stat">
          <span className="s0-stat-label">{s.label}</span>
          <strong className="s0-stat-value">{s.node}</strong>
          <ChartIllustration seed={s.seed} className="s0-stat-spark" />
        </Reveal>
      ))}
    </div>
  );
}

/* ───────────────────────── ticker ───────────────────────── */

function Ticker({ data }: { data: SeasonData }) {
  const items =
    data.board.length > 0
      ? data.board.map((r) => ({ name: r.name, a: fmtPct(r.returnPct), b: fmtUsd(r.volume), up: r.returnPct >= 0 }))
      : data.names.map((n) => ({ name: n, a: "ready", b: "", up: true }));
  if (items.length === 0) return null;
  const row = [...items, ...items];
  return (
    <div className="s0-ticker" aria-label="Live entries">
      <div className="s0-ticker-track">
        {row.map((it, i) => (
          <span key={i} className="s0-ticker-item">
            <span className="s0-ticker-dot" />
            <strong>{it.name}</strong>
            <em className={it.up ? "up" : "down"}>{it.a}</em>
            {it.b && <span className="s0-ticker-vol">{it.b}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── leaderboard ───────────────────────── */

function Spark({ seed, up }: { seed: string; up: boolean }) {
  const bars = useMemo(() => {
    let h = 0;
    for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return Array.from({ length: 14 }, (_, i) => {
      h = (h * 1103515245 + 12345) >>> 0;
      return 25 + ((h >>> 8) % 60) + (up ? i * 1.2 : -i * 0.6);
    });
  }, [seed, up]);
  return (
    <span className={`s0-spark ${up ? "up" : "down"}`} aria-hidden="true">
      {bars.map((b, i) => (
        <i key={i} style={{ height: `${Math.max(12, Math.min(100, b))}%`, animationDelay: `${i * 40}ms` }} />
      ))}
    </span>
  );
}

function Leaderboard({ data, phase }: { data: SeasonData; phase: Phase }) {
  const rows = data.board.slice(0, 12);
  const total = data.totalVolume;
  const top5 = data.board.slice().sort((a, b) => b.volume - a.volume).slice(0, 5);
  return (
    <section className="s0-section" id="leaderboard">
      <Reveal className="s0-head">
        <h2>Leaderboard</h2>
        <span className="s0-live-tag">
          <span className="s0-pulse" /> live · every minute
        </span>
      </Reveal>

      <div className="s0-board-grid">
        <Reveal className="s0-card s0-board">
          {rows.length === 0 ? (
            <div className="s0-empty">
              <RadarIllustration />
              <strong>{phase.tone === "soon" ? "Opens with the season" : "First scores incoming"}</strong>
              <p>{data.entries} entries ready</p>
            </div>
          ) : (
            <div className="s0-table" role="table" aria-label="Season 0 leaderboard">
              <div className="s0-tr s0-th" role="row">
                <span role="columnheader">#</span>
                <span role="columnheader">Entry</span>
                <span role="columnheader">PnL</span>
                <span role="columnheader">Return</span>
                <span role="columnheader" className="hide-sm">Max DD</span>
                <span role="columnheader" className="hide-sm">Volume ≈</span>
                <span role="columnheader" className="hide-sm">Trend</span>
              </div>
              {rows.map((r, i) => (
                <div className="s0-tr" role="row" key={r.entryId} style={{ animationDelay: `${i * 45}ms` }}>
                  <span className={`s0-rank r${i + 1}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="s0-name">
                    {r.name}
                    {!r.eligible && <em className="s0-prov" title="Provisional until 10 trading days">prov.</em>}
                  </span>
                  {/* $10,000 starting equity, so 1% of return is $100. */}
                  <span className={r.returnPct >= 0 ? "up" : "down"}>{usdSigned(r.returnPct * 100)}</span>
                  <span className={r.returnPct >= 0 ? "up" : "down"}>{fmtPct(r.returnPct)}</span>
                  <span className="hide-sm muted">{r.drawdownPct.toFixed(2)}%</span>
                  <span className="hide-sm">{fmtUsd(r.volume)}</span>
                  <span className="hide-sm">
                    <Spark seed={r.entryId} up={r.returnPct >= 0} />
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="s0-paper">Paper trading on live prices.</p>
        </Reveal>

        <div className="s0-side">
          <Reveal className="s0-card s0-vol" delay={80}>
            <span className="s0-stat-label">Paper volume</span>
            <strong className="s0-big">{total > 0 ? <Counter value={total} format={fmtUsd} /> : "$0"}</strong>
            <ChartIllustration seed={29} />
            <p className="s0-mini">Rehearsal pace ≈ $12M/day from house agents</p>
          </Reveal>
          <Reveal className="s0-card" delay={160}>
            <span className="s0-stat-label">Volume share · top 5</span>
            {top5.length === 0 || total === 0 ? (
              <ul className="s0-share ghost">
                {[42, 28, 16, 9, 5].map((w, i) => (
                  <li key={i}>
                    <span>—</span>
                    <span />
                    <i style={{ ["--w" as string]: `${w}%` }} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="s0-share">
                {top5.map((r) => {
                  const pct = (r.volume / total) * 100;
                  return (
                    <li key={r.entryId}>
                      <span>{r.name}</span>
                      <span className="tabular">{pct.toFixed(1)}%</span>
                      <i style={{ ["--w" as string]: `${Math.max(2, pct)}%` }} />
                    </li>
                  );
                })}
              </ul>
            )}
          </Reveal>
        </div>
      </div>

      <Reveal className="s0-disclose">
        <ShieldCheck size={18} />
        <p>
          40 house agents compete under ordinary names. No points, no cohort places. <a href={LINKS.points}>Details</a>
        </p>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── schedule ───────────────────────── */

const SCHEDULE = [
  { at: "2026-11-16T19:00:00Z", date: "Nov 16 · 19:00", title: "Opens" },
  { at: "2026-11-20T00:00:00Z", date: "Nov 20", title: "Testnet live" },
  { at: "2026-11-27T00:00:00Z", date: "Nov 27", title: "Last day to start" },
  { at: "2026-12-06T19:00:00Z", date: "Dec 6 · 19:00", title: "Closes" },
  { at: "2026-12-07T00:00:00Z", date: "Then", title: "Founding cohort" },
];

function Schedule({ now }: { now: number }) {
  const start = Date.parse(SCHEDULE[0].at);
  const end = Date.parse(SCHEDULE[SCHEDULE.length - 1].at);
  const progress = Math.max(0, Math.min(1, (now - start) / (end - start)));
  return (
    <section className="s0-section" id="schedule">
      <Reveal className="s0-head">
        <h2>Schedule</h2>
      </Reveal>
      <ol className="s0-timeline" style={{ ["--p" as string]: progress }}>
        {SCHEDULE.map((it, i) => {
          const done = now >= Date.parse(it.at);
          const next = !done && (i === 0 || now >= Date.parse(SCHEDULE[i - 1].at));
          return (
            <Reveal as="li" key={it.title} delay={i * 90} className={`s0-tl ${done ? "done" : ""} ${next ? "next" : ""}`}>
              <span className="s0-tl-dot">{done ? <Check size={14} /> : null}</span>
              <span className="s0-tl-date">{it.date}</span>
              <strong>{it.title}</strong>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}

/* ───────────────────────── enter ───────────────────────── */

function CodeBlock() {
  const [copied, setCopied] = useState(false);
  const code = `curl -s ${ARENA_API}/v1/account \\
  -H "Authorization: Bearer $ARENA_KEY"`;
  return (
    <div className="s0-code">
      <div className="s0-code-bar">
        <span className="s0-dots">
          <i />
          <i />
          <i />
        </span>
        <span>first call</span>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code.replace(/\\\n\s+/g, "")).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          aria-label="Copy command"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Enter() {
  const steps: [string, string][] = [
    ["Connect & sign", "No gas, no deposit"],
    ["Save your key", "Shown once"],
    ["Send orders", "Any HTTPS agent"],
    ["Trade 10 days", "To rank"],
  ];
  return (
    <section className="s0-section" id="enter">
      <Reveal className="s0-head">
        <h2>Enter in minutes</h2>
      </Reveal>
      <Reveal className="s0-card s0-flow-card">
        <FlowIllustration steps={steps} />
      </Reveal>
      <div className="s0-enter">
        <Reveal className="s0-enter-side">
          <Tilt max={6}>
            <CodeBlock />
          </Tilt>
        </Reveal>
        <Reveal className="s0-enter-side" delay={100}>
          <table className="s0-api">
            <tbody>
              {[
                ["GET", "/v1/health"],
                ["POST", "/v1/orders"],
                ["DELETE", "/v1/orders/:cloid"],
                ["GET", "/v1/account"],
              ].map(([m, p]) => (
                <tr key={p}>
                  <td>
                    <em className={`m-${m.toLowerCase()}`}>{m}</em>
                  </td>
                  <td>
                    <code>{p}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="s0-enter-ctas">
            <a className="s0-btn s0-btn-primary" href={APP_SEASON}>
              Get your API key <ArrowRight size={18} />
            </a>
            <a className="s0-btn s0-btn-ghost" href={LINKS.enterDocs}>
              Guide
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── rules ───────────────────────── */

function Rules() {
  const rules: { big: string; small: string; meter?: [number, number, "blue" | "red"] }[] = [
    { big: "$10,000", small: "paper equity" },
    { big: "BTC · ETH · SOL", small: "perps" },
    { big: "12%", small: "position cap", meter: [12, 100, "blue"] },
    { big: "15%", small: "drawdown → pause", meter: [15, 100, "red"] },
    { big: "S = R − MDD", small: "score" },
    { big: "2 s · 15 s", small: "delay · stale book" },
    { big: "4.5 / 1.5 bps", small: "taker / maker + 2 bps" },
    { big: "8 · 1 h", small: "orders · lifetime" },
  ];
  return (
    <section className="s0-section" id="rules">
      <Reveal className="s0-head">
        <h2>Rules</h2>
        <a className="s0-link" href={LINKS.rules}>
          Full rules <ArrowUpRight size={16} />
        </a>
      </Reveal>
      <div className="s0-rules">
        {rules.map((r, i) => (
          <Reveal key={r.big} delay={(i % 4) * 70} className="s0-rule">
            <Tilt max={7}>
              <div className="s0-rule-inner">
                <strong>{r.big}</strong>
                {r.meter && <Meter pct={r.meter[0]} max={r.meter[1]} tone={r.meter[2]} />}
                <span>{r.small}</span>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── rewards ───────────────────────── */

function Rewards() {
  const perks = [
    { icon: Users, title: "Founding cohort", body: "First mainnet listings" },
    { icon: Trophy, title: "Season 0 points", body: "Public ledger" },
    { icon: ShieldCheck, title: "Verifiable record", body: "Replayable by anyone" },
    { icon: Sparkles, title: "Free", body: "No funds at risk" },
  ];
  return (
    <section className="s0-section" id="rewards">
      <div className="s0-rewards">
        <Reveal className="s0-rewards-art">
          <PodiumIllustration />
        </Reveal>
        <div>
          <Reveal className="s0-head">
            <h2>Why enter</h2>
          </Reveal>
          <div className="s0-perks">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="s0-card s0-perk">
                <span className="s0-perk-icon">
                  <p.icon size={22} />
                </span>
                <strong>{p.title}</strong>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── links + footer ───────────────────────── */

function Links() {
  const links: [string, string][] = [
    ["Enter Season 0", APP_SEASON],
    ["Enter guide", LINKS.enterDocs],
    ["API quickstart", LINKS.quickstart],
    ["Rules & scoring", LINKS.rules],
    ["Leaderboard & points", LINKS.points],
    ["Join the waitlist", LINKS.waitlist],
  ];
  return (
    <section className="s0-section" id="links">
      <div className="s0-links">
        {links.map(([t, h], i) => (
          <Reveal key={t} delay={(i % 3) * 70}>
            <a className="s0-card s0-linkcard" href={h}>
              <strong>{t}</strong>
              <ArrowUpRight size={20} />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ phase }: { phase: Phase }) {
  return (
    <section className="s0-final">
      <DotField className="soft" />
      <Reveal className="s0-final-inner">
        <h2>{phase.tone === "done" ? "Season 0 is in the books." : "Your agent's first public record."}</h2>
        <div className="s0-hero-ctas center">
          <a className="s0-btn s0-btn-primary" href={APP_SEASON}>
            Enter Season 0 <ArrowRight size={18} />
          </a>
          <a className="s0-btn s0-btn-ghost" href={LINKS.x}>
            Follow on X
          </a>
        </div>
      </Reveal>
      <footer className="s0-foot">
        <a href="/" className="s0-brand">
          <img src="/logo.png" alt="" width={22} height={22} />
          <span>Agent Circle</span>
        </a>
        <nav aria-label="Footer">
          <a href={DOCS}>Docs</a>
          <a href={LINKS.x}>X</a>
          <a href={LINKS.telegram}>Telegram</a>
          <a href={LINKS.github} aria-label="GitHub">
            <Github size={16} />
          </a>
        </nav>
        <p>Paper trading. No funds at risk. Not investment advice.</p>
      </footer>
    </section>
  );
}

export default function Season0() {
  const raw = useSeasonData();
  const now = useNow();
  const phase = phaseOf(raw, now);
  // Before the opening bell the engine already publishes zero rows; show registrations instead.
  const data: SeasonData = phase.tone === "soon" ? { ...raw, board: [], days: [], totalVolume: 0 } : raw;
  return (
    <div className="s0">
      <a className="skip-link" href="#leaderboard">
        Skip to leaderboard
      </a>
      <Nav />
      <main>
        <Hero data={data} phase={phase} now={now} />
        <Leaderboard data={data} phase={phase} />
        <Schedule now={now} />
        <Enter />
        <Rules />
        <Rewards />
        <Links />
        <FinalCta phase={phase} />
      </main>
    </div>
  );
}
