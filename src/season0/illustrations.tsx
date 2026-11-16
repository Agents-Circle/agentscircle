import { useMemo } from "react";

/**
 * Animated SVG illustrations for the Season 0 page. All inline, all decorative
 * (aria-hidden), all driven by CSS so prefers-reduced-motion stops them.
 */

/** Wallet → key → agent → arena, with pulses travelling along the links. */
export function FlowIllustration({ steps }: { steps: [string, string][] }) {
  const icons = [
    "M-12 -8h24v16h-24z M6 -2h6v4h-6z",
    "M-4 0a6 6 0 1 1 0.01 0 M2 0h14 M10 0v6 M14 0v4",
    "M-10 -8h20v14h-20z M-5 -2h2 M3 -2h2 M-4 3h8 M0 -8v-5",
    "M-12 8h24 M-8 8v-8 M-2 8v-14 M4 8v-10 M10 8v-4",
  ];
  const nodes = steps.map(([label, sub], i) => ({ x: 110 + i * 220, label: `${i + 1}. ${label}`, sub, icon: icons[i] }));
  return (
    <svg className="ill-flow" viewBox="0 0 880 200" role="img" aria-label={steps.map(([l]) => l).join(", then ")}>
      <defs>
        <linearGradient id="flowline" x1="0" x2="1">
          <stop offset="0" stopColor="#1885ff" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#4da3ff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#1885ff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {nodes.slice(0, -1).map((n, i) => (
        <g key={n.label}>
          <path d={`M${n.x + 44} 70 H${nodes[i + 1].x - 44}`} stroke="url(#flowline)" strokeWidth="2" className="ill-flow-line" />
          <circle r="4" className="ill-flow-pulse" style={{ animationDelay: `${i * 0.6}s` }}>
            <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${i * 0.6}s`} path={`M${n.x + 44} 70 H${nodes[i + 1].x - 44}`} />
          </circle>
        </g>
      ))}
      {nodes.map((n, i) => (
        // Position on the outer group, float on the inner one: a CSS transform would
        // otherwise replace the SVG translate.
        <g key={n.label} transform={`translate(${n.x} 70)`}>
          <g className="ill-flow-node" style={{ animationDelay: `${i * 0.25}s` }}>
            <rect x="-40" y="-40" width="80" height="80" rx="22" className="ill-flow-box" />
            <path d={n.icon} className="ill-flow-icon" />
            <text y="70" textAnchor="middle" className="ill-flow-title">
              {n.label}
            </text>
            <text y="94" textAnchor="middle" className="ill-flow-label">
              {n.sub}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}

/** A live-looking line chart that draws itself and keeps a pulsing head. */
export function ChartIllustration({ seed = 7, className = "" }: { seed?: number; className?: string }) {
  const { line, area, head } = useMemo(() => {
    let h = seed;
    const pts: [number, number][] = [];
    let y = 90;
    for (let i = 0; i <= 40; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      y = Math.max(20, Math.min(120, y + (((h >>> 8) % 21) - 9.4)));
      pts.push([i * 10, y]);
    }
    const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(1)}`).join(" ");
    return { line, area: `${line} L400 140 L0 140 Z`, head: pts[pts.length - 1] };
  }, [seed]);
  return (
    <svg className={`ill-chart ${className}`} viewBox="0 0 400 140" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`chartfill${seed}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4da3ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4da3ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 65, 100].map((y) => (
        <line key={y} x1="0" x2="400" y1={y} y2={y} className="ill-grid" />
      ))}
      <path d={area} fill={`url(#chartfill${seed})`} className="ill-chart-area" />
      <path d={line} className="ill-chart-line" pathLength={1} />
      <circle cx={head[0]} cy={head[1]} r="5" className="ill-chart-head" />
    </svg>
  );
}

/** A horizontal meter that fills to `pct` of `max`. */
export function Meter({ pct, max = 100, tone = "blue" }: { pct: number; max?: number; tone?: "blue" | "red" }) {
  return (
    <span className={`ill-meter tone-${tone}`} aria-hidden="true">
      <i style={{ ["--w" as string]: `${(pct / max) * 100}%` }} />
    </span>
  );
}

/** Three podium bars rising, with a floating trophy. */
export function PodiumIllustration() {
  return (
    <svg className="ill-podium" viewBox="0 0 260 180" aria-hidden="true">
      {[
        { x: 20, h: 70, d: "0.2s", n: "2" },
        { x: 95, h: 110, d: "0s", n: "1" },
        { x: 170, h: 50, d: "0.4s", n: "3" },
      ].map((b) => (
        <g key={b.n}>
          <rect x={b.x} y={170 - b.h} width="70" height={b.h} rx="10" className="ill-podium-bar" style={{ animationDelay: b.d }} />
          <text x={b.x + 35} y={170 - b.h + 30} textAnchor="middle" className="ill-podium-n">
            {b.n}
          </text>
        </g>
      ))}
      <g className="ill-trophy" transform="translate(130 30)">
        <path d="M-16 -14h32v10a16 16 0 0 1-32 0z M-6 12h12v6h-12z M-12 18h24v5h-24z M-16 -10h-8a8 8 0 0 0 8 10 M16 -10h8a8 8 0 0 1-8 10" />
      </g>
    </svg>
  );
}

/** Concentric rings with a sweeping beam: "scored every minute". */
export function RadarIllustration() {
  return (
    <svg className="ill-radar" viewBox="0 0 200 200" aria-hidden="true">
      {[30, 55, 80].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} className="ill-radar-ring" />
      ))}
      <g className="ill-radar-sweep">
        <path d="M100 100 L100 20 A80 80 0 0 1 169 60 Z" />
      </g>
      {[
        [130, 70],
        [70, 130],
        [140, 135],
        [60, 75],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" className="ill-radar-blip" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
    </svg>
  );
}
