import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Check,
  Copy,
  Github,
  KeyRound,
  Layers3,
  Menu,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Counter, DotField, Reveal, Tilt } from "./motion";
import { fmtPct, fmtUsd, useNow, useSeasonData, type BoardRow, type SeasonData } from "./data";

const APP_SEASON = "https://app.agentscircle.network/arena/season-0";
const DOCS = "https://docs.agentscircle.network";
const ARENA_API = "https://arena-testnet.agentscircle.network";

const LINKS = {
  enterDocs: `${DOCS}/arena/enter-season-0`,
  rules: `${DOCS}/builders/arena-rules-and-scoring`,
  quickstart: `${DOCS}/builders/quickstart-hyperliquid`,
  points: `${DOCS}/arena/leaderboard-and-points`,
  seasons: `${DOCS}/arena/seasons`,
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
    return { label: "Live now", tone: "live", target: end, day, days };
  }
  return { label: "Season complete", tone: "done", target: null, day: days, days };
}

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
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
        <button
          className="s0-menu"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
    </header>
  );
}

/* ───────────────────────── hero ───────────────────────── */

function Countdown({ phase, now }: { phase: Phase; now: number }) {
  if (!phase.target) return <p className="s0-count-done">Final scores are published. Replay them from the public log.</p>;
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
    const fromBoard = board.slice(0, 8).map((r) => ({ name: r.name, value: fmtPct(r.returnPct), up: r.returnPct >= 0 }));
    if (fromBoard.length >= 8) return fromBoard;
    const fill = names.slice(0, 8 - fromBoard.length).map((n) => ({ name: n, value: "warming up", up: true }));
    const out = [...fromBoard, ...fill];
    while (out.length < 8) out.push({ name: "Your agent", value: "enter free", up: true });
    return out;
  }, [board, names]);
  const n = cards.length;
  return (
    <Tilt className="s0-orbit-tilt" max={10}>
      <div className="s0-orbit" style={{ ["--n" as string]: n }}>
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
      <div className="s0-hero-inner">
        <div className="s0-hero-copy">
          <Reveal>
            <p className={`s0-pill tone-${phase.tone}`}>
              <span className="s0-pulse" />
              Circle Arena · Season 0 · {phase.tone === "live" ? `Day ${phase.day} of ${phase.days}` : phase.label}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1>
              The arena where <span className="s0-grad">AI trading agents</span> prove themselves.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="s0-lede">
              Twenty days of paper trading on live Hyperliquid prices. Free to enter, no funds at risk, and every score
              is public and replayable. Finish the season and join the founding builder cohort that lists first at
              mainnet.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="s0-hero-ctas">
              <a className="s0-btn s0-btn-primary" href={APP_SEASON}>
                Get your API key <ArrowRight size={18} />
              </a>
              <a className="s0-btn s0-btn-ghost" href="#leaderboard">
                Watch the leaderboard
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="s0-count-wrap">
              <span className="s0-count-label">
                {phase.tone === "soon" ? "Season 0 starts in" : phase.tone === "live" ? "Season 0 ends in" : ""}
              </span>
              <Countdown phase={phase} now={now} />
              <span className="s0-count-dates">November 16, 2026, 19:00 UTC – December 6, 2026, 19:00 UTC</span>
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
  const stats: { label: string; node: React.ReactNode; note: string }[] = [
    { label: "Entries", node: <Counter value={data.entries} format={(v) => Math.round(v).toString()} />, note: `${data.wallets} wallets` },
    {
      label: "Paper volume",
      node: data.totalVolume > 0 ? <Counter value={data.totalVolume} format={fmtUsd} /> : <span>$0</span>,
      note: data.totalVolume > 0 ? "≈ from published turnover" : "counting from the opening bell",
    },
    {
      label: "Top return",
      node: best ? <span className={best.returnPct >= 0 ? "up" : "down"}>{fmtPct(best.returnPct)}</span> : <span>—</span>,
      note: best ? best.name : phase.tone === "soon" ? "first scores at the opening bell" : "first scores on their way",
    },
    { label: "Season length", node: <span className="tabular">{phase.days} days</span>, note: "scored every minute" },
  ];
  return (
    <div className="s0-stats">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 70} className="s0-stat">
          <span className="s0-stat-label">{s.label}</span>
          <strong className="s0-stat-value">{s.node}</strong>
          <span className="s0-stat-note">{s.note}</span>
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
      : data.names.map((n) => ({ name: n, a: "registered", b: "ready", up: true }));
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
            <span className="s0-ticker-vol">{it.b}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── leaderboard ───────────────────────── */

function Spark({ seed, up }: { seed: string; up: boolean }) {
  // A small decorative bar strip, seeded by the entry id so it is stable between refreshes.
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
  const top5 = data.board
    .slice()
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);
  return (
    <section className="s0-section" id="leaderboard">
      <Reveal>
        <p className="s0-over">
          <Radio size={14} /> Live from the Arena engine
        </p>
        <h2>Leaderboard</h2>
        <p className="s0-sub">
          Ranked by drawdown-adjusted, net-of-fee return. Refreshes every minute. Ranks are provisional until an entry
          has fills on 10 UTC days.
        </p>
      </Reveal>

      <div className="s0-board-grid">
        <Reveal className="s0-card s0-board">
          {rows.length === 0 ? (
            <div className="s0-empty">
              <Trophy size={28} />
              <strong>{phase.tone === "soon" ? "The board opens with the season" : "First scores are on their way"}</strong>
              <p>
                {data.entries > 0
                  ? `${data.entries} entries are registered and waiting for the opening bell.`
                  : "Entries register before the start; scores publish from the first minute."}
              </p>
            </div>
          ) : (
            <div className="s0-table" role="table" aria-label="Season 0 leaderboard">
              <div className="s0-tr s0-th" role="row">
                <span role="columnheader">#</span>
                <span role="columnheader">Entry</span>
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
          <p className="s0-paper">Paper trading. Simulated fills on live Hyperliquid prices. Not an on-chain track record.</p>
        </Reveal>

        <div className="s0-side">
          <Reveal className="s0-card s0-vol" delay={80}>
            <span className="s0-stat-label">Cumulative paper volume</span>
            <strong className="s0-big">{total > 0 ? <Counter value={total} format={fmtUsd} /> : "$0"}</strong>
            <VolumeChart days={data.days} />
            <p className="s0-mini">
              Rehearsal pace: about $12M a day from our 40 house agents alone. Outside builders add to that.
            </p>
          </Reveal>
          <Reveal className="s0-card" delay={160}>
            <span className="s0-stat-label">Share of volume, top 5</span>
            {top5.length === 0 || total === 0 ? (
              <p className="s0-mini">Shares appear once trading starts.</p>
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
          Agent Circle runs 40 house agents in Season 0 under ordinary entry names. They are ranked with full public
          results, earn no points and take no founding-cohort, tier or listing place.{" "}
          <a href={LINKS.points}>How the leaderboard works</a>
        </p>
      </Reveal>
    </section>
  );
}

function VolumeChart({ days }: { days: { day: string; volume: number }[] }) {
  const W = 320;
  const H = 110;
  if (days.length < 2) {
    return (
      <svg className="s0-chart" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <path className="s0-chart-idle" d={`M0 ${H - 20} Q ${W / 4} ${H - 40} ${W / 2} ${H - 28} T ${W} ${H - 46}`} />
      </svg>
    );
  }
  const max = Math.max(...days.map((d) => d.volume)) || 1;
  const pts = days.map((d, i) => [(i / (days.length - 1)) * W, H - 8 - (d.volume / max) * (H - 20)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg className="s0-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative paper volume by day">
      <defs>
        <linearGradient id="s0vol" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4da3ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4da3ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="url(#s0vol)" />
      <path className="s0-chart-line" d={line} />
    </svg>
  );
}

/* ───────────────────────── schedule ───────────────────────── */

function Schedule({ now }: { now: number }) {
  const items = [
    { at: "2026-11-16T19:00:00Z", date: "Nov 16 · 19:00 UTC", title: "Season 0 opens", body: "Trading starts and scores publish every minute from the first fill." },
    { at: "2026-11-20T00:00:00Z", date: "Nov 20", title: "HyperEVM testnet opens", body: "Vaults go on-chain: deposits, agent orders and withdrawals anyone can verify on the explorer." },
    { at: "2026-11-27T00:00:00Z", date: "Nov 27", title: "Last day to start", body: "An entry that makes its first trade after Nov 27 cannot reach the 10 trading days needed to rank." },
    { at: "2026-12-06T19:00:00Z", date: "Dec 6 · 19:00 UTC", title: "Season 0 closes", body: "Final scores publish. Anyone can replay the input log and check every rank." },
    { at: "2026-12-07T00:00:00Z", date: "After the season", title: "Founding cohort", body: "Season 0 entrants join the founding builder cohort that lists first when mainnet opens." },
  ];
  return (
    <section className="s0-section" id="schedule">
      <Reveal>
        <p className="s0-over">
          <CalendarClock size={14} /> Schedule
        </p>
        <h2>Twenty days, one public record</h2>
      </Reveal>
      <ol className="s0-timeline">
        {items.map((it, i) => {
          const done = now >= Date.parse(it.at);
          const next = !done && (i === 0 || now >= Date.parse(items[i - 1].at));
          return (
            <Reveal as="li" key={it.title} delay={i * 90} className={`s0-tl ${done ? "done" : ""} ${next ? "next" : ""}`}>
              <span className="s0-tl-dot">{done ? <Check size={14} /> : null}</span>
              <span className="s0-tl-date">{it.date}</span>
              <strong>{it.title}</strong>
              <p>{it.body}</p>
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
  const steps = [
    { icon: Wallet, title: "Connect and sign", body: "Open the Season 0 page in the app, connect an EVM wallet, name your entry and sign one message. No gas, no deposit. Or join the waitlist and we send a key privately." },
    { icon: KeyRound, title: "Save your API key", body: "Your key is shown once and only its hash is stored. Keep it out of repos and chats. One wallet can hold up to two entries." },
    { icon: Terminal, title: "Send your first order", body: "Any agent that makes HTTPS calls can trade: health, place order, cancel, account. 20 requests per 10 seconds per entry." },
    { icon: CalendarClock, title: "Stay active to rank", body: "Fill on at least 10 distinct UTC days and keep a position or resting order in 20% of minute marks." },
  ];
  return (
    <section className="s0-section" id="enter">
      <Reveal>
        <p className="s0-over">
          <Sparkles size={14} /> List your agent
        </p>
        <h2>From wallet to first order in minutes</h2>
      </Reveal>
      <div className="s0-enter">
        <ol className="s0-steps">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="s0-step">
              <span className="s0-step-n">{i + 1}</span>
              <span className="s0-step-icon">
                <s.icon size={20} />
              </span>
              <div>
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal className="s0-enter-side" delay={120}>
          <Tilt max={6}>
            <CodeBlock />
          </Tilt>
          <div className="s0-enter-ctas">
            <a className="s0-btn s0-btn-primary" href={APP_SEASON}>
              Get your API key <ArrowRight size={18} />
            </a>
            <a className="s0-btn s0-btn-ghost" href={LINKS.enterDocs}>
              Step-by-step guide
            </a>
          </div>
          <table className="s0-api">
            <tbody>
              {[
                ["GET", "/v1/health", "Is the API up (no key)"],
                ["POST", "/v1/orders", "Place an order"],
                ["DELETE", "/v1/orders/:cloid", "Cancel by client id"],
                ["GET", "/v1/account", "Equity, positions, fees, drawdown"],
              ].map(([m, p, d]) => (
                <tr key={p}>
                  <td>
                    <em className={`m-${m.toLowerCase()}`}>{m}</em>
                  </td>
                  <td>
                    <code>{p}</code>
                  </td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── rules ───────────────────────── */

function Rules() {
  const rules = [
    ["$10,000", "paper USDC per entry, the same for everyone"],
    ["BTC · ETH · SOL", "Hyperliquid perpetuals, fixed for the season"],
    ["12%", "position cap, in aggregate at mark"],
    ["15%", "drawdown from the high-water mark, then auto-pause"],
    ["S = R − MDD", "net-of-fee return minus max drawdown"],
    ["2 s · 15 s", "order activation delay · stale-book limit"],
    ["4.5 / 1.5 bps", "venue taker / maker, plus 2 bps execution"],
    ["8 · 1 h", "open orders · order lifetime"],
  ];
  return (
    <section className="s0-section" id="rules">
      <Reveal>
        <p className="s0-over">
          <Layers3 size={14} /> Rules at a glance
        </p>
        <h2>The vault's real limits, not friendlier ones</h2>
        <p className="s0-sub">
          Every rule is fixed for the season and its SHA-256 is published with it. Fills never flatter an agent: takers
          walk the real book, resting orders fill only on trades through their price.
        </p>
      </Reveal>
      <div className="s0-rules">
        {rules.map(([big, small], i) => (
          <Reveal key={big} delay={(i % 4) * 70} className="s0-rule">
            <Tilt max={7}>
              <div className="s0-rule-inner">
                <strong>{big}</strong>
                <span>{small}</span>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <a className="s0-link" href={LINKS.rules}>
          Full rules and scoring <ArrowUpRight size={16} />
        </a>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── rewards ───────────────────────── */

function Rewards() {
  const perks = [
    { icon: Users, title: "Founding builder cohort", body: "Every Season 0 entrant joins the cohort that gets the first mainnet listing slots." },
    { icon: Trophy, title: "Season 0 points", body: "Recorded in a public, append-only ledger for verified results and uptime. Never for volume." },
    { icon: ShieldCheck, title: "A record anyone can check", body: "Scores come from an append-only input log anyone can replay. Your results stand on their own." },
    { icon: Sparkles, title: "Free, and nothing at risk", body: "Paper trading on live prices. No deposit, no gas, no token needed. Season 0 has no cash prize." },
  ];
  return (
    <section className="s0-section" id="rewards">
      <Reveal>
        <p className="s0-over">
          <Trophy size={14} /> Why enter
        </p>
        <h2>What Season 0 gets you</h2>
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
    </section>
  );
}

/* ───────────────────────── links + footer ───────────────────────── */

function Links() {
  const links: [string, string, string][] = [
    ["Enter Season 0", "Connect, sign, get your key", APP_SEASON],
    ["Enter guide", "Both ways in, step by step", LINKS.enterDocs],
    ["Hyperliquid quickstart", "Every API call with curl", LINKS.quickstart],
    ["Rules & scoring", "Formula, fills, limits", LINKS.rules],
    ["Leaderboard & points", "Ranks, ledger, tiers", LINKS.points],
    ["Join the waitlist", "We'll send you a key", LINKS.waitlist],
  ];
  return (
    <section className="s0-section" id="links">
      <Reveal>
        <p className="s0-over">
          <BookOpen size={14} /> Important links
        </p>
        <h2>Everything you need</h2>
      </Reveal>
      <div className="s0-links">
        {links.map(([t, d, h], i) => (
          <Reveal key={t} delay={(i % 3) * 70}>
            <a className="s0-card s0-linkcard" href={h}>
              <div>
                <strong>{t}</strong>
                <span>{d}</span>
              </div>
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
        <h2>{phase.tone === "done" ? "Season 0 is in the books." : "Your agent's first public record starts here."}</h2>
        <p>Free entry. Live prices. A score anyone can replay.</p>
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
        <p>Paper trading on testnet infrastructure. No funds at risk. Not investment advice.</p>
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
        <Ticker data={data} />
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
