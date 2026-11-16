import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * Live Season 0 data, read straight from the public tables the Arena engine writes.
 *
 * Nothing on the Season 0 page is a mock. Before the first scores are published the page
 * shows registrations and a countdown; after that, the engine's own numbers.
 *
 * Volume is not published directly. The engine publishes `turnover_ratio`, which is
 * annualised: notional × year / (average equity × elapsed). We turn it back into dollars
 * with the $10,000 starting equity and the time the entry has been trading. That is an
 * approximation (average equity drifts from $10,000), so the page labels it with "≈".
 */

export const SEASON_SLUG = "season-0";
export const STARTING_EQUITY = 10_000;
const YEAR_MS = 365 * 24 * 3600 * 1000;

export type SeasonRow = {
  id: number;
  slug: string;
  name: string | null;
  status: string;
  starts_at: string;
  ends_at: string;
  rules_hash: string | null;
};

export type BoardRow = {
  entryId: string;
  name: string;
  returnPct: number;
  drawdownPct: number;
  score: number;
  volume: number;
  fees: number;
  eligible: boolean;
  rank: number | null;
};

export type DayPoint = { day: string; volume: number };

export type SeasonData = {
  season: SeasonRow | null;
  entries: number;
  wallets: number;
  names: string[];
  board: BoardRow[];
  days: DayPoint[];
  totalVolume: number;
  updatedAt: number | null;
  error: string | null;
  loading: boolean;
};

const EMPTY: SeasonData = {
  season: null,
  entries: 0,
  wallets: 0,
  names: [],
  board: [],
  days: [],
  totalVolume: 0,
  updatedAt: null,
  error: null,
  loading: true,
};

function volumeOf(turnover: number, fromMs: number, toMs: number): number {
  const elapsed = Math.max(0, toMs - fromMs);
  if (!Number.isFinite(turnover) || elapsed === 0) return 0;
  return (turnover * STARTING_EQUITY * elapsed) / YEAR_MS;
}

async function load(): Promise<SeasonData> {
  const s = await supabase
    .from("seasons")
    .select("id, slug, name, status, starts_at, ends_at, rules_hash")
    .eq("slug", SEASON_SLUG)
    .maybeSingle();
  if (s.error) throw new Error(s.error.message);
  const season = s.data as SeasonRow | null;
  if (!season) return { ...EMPTY, loading: false };

  const e = await supabase
    .from("entries")
    .select("id, display_name, builder_wallet, created_at")
    .eq("season_id", season.id)
    .eq("status", "active");
  if (e.error) throw new Error(e.error.message);
  const entries = (e.data ?? []) as {
    id: string;
    display_name: string;
    builder_wallet: string;
    created_at: string;
  }[];
  const startMs = Date.parse(season.starts_at);
  const fromMs = new Map(
    entries.map((x) => [x.id, Math.max(startMs, Date.parse(x.created_at))])
  );
  const nameOf = new Map(entries.map((x) => [x.id, x.display_name]));

  const sc = await supabase
    .from("scores")
    .select("entry_id, day, net_return_bps, max_drawdown_bps, score, turnover_ratio, fees_paid, computed_at, rank, eligible")
    .in("entry_id", entries.map((x) => x.id))
    .order("day", { ascending: true })
    .limit(5000);
  if (sc.error) throw new Error(sc.error.message);

  type Score = {
    entry_id: string;
    day: string;
    net_return_bps: number;
    max_drawdown_bps: number;
    score: string | number;
    turnover_ratio: string | number;
    fees_paid: string | number;
    computed_at: string;
    rank: number | null;
    eligible: boolean;
  };
  const rows = (sc.data ?? []) as Score[];

  // Latest row per entry, and the cumulative volume at the end of each day.
  const latest = new Map<string, Score>();
  const byDay = new Map<string, Map<string, number>>();
  for (const r of rows) {
    latest.set(r.entry_id, r);
    const v = volumeOf(Number(r.turnover_ratio), fromMs.get(r.entry_id) ?? startMs, Date.parse(r.computed_at));
    if (!byDay.has(r.day)) byDay.set(r.day, new Map());
    byDay.get(r.day)!.set(r.entry_id, v);
  }

  const board: BoardRow[] = [...latest.values()].map((r) => ({
    entryId: r.entry_id,
    name: nameOf.get(r.entry_id) ?? "Entry",
    returnPct: r.net_return_bps / 100,
    drawdownPct: r.max_drawdown_bps / 100,
    score: Number(r.score),
    volume: volumeOf(Number(r.turnover_ratio), fromMs.get(r.entry_id) ?? startMs, Date.parse(r.computed_at)),
    fees: Number(r.fees_paid),
    eligible: r.eligible,
    rank: r.rank,
  }));
  board.sort((a, b) => b.score - a.score || a.drawdownPct - b.drawdownPct);

  // Carry each entry's last known cumulative volume forward so the series never dips.
  const days: DayPoint[] = [];
  const carry = new Map<string, number>();
  for (const day of [...byDay.keys()].sort()) {
    for (const [id, v] of byDay.get(day)!) carry.set(id, v);
    days.push({ day, volume: [...carry.values()].reduce((a, b) => a + b, 0) });
  }

  return {
    season,
    entries: entries.length,
    wallets: new Set(entries.map((x) => x.builder_wallet.toLowerCase())).size,
    names: entries.map((x) => x.display_name),
    board,
    days,
    totalVolume: board.reduce((a, b) => a + b.volume, 0),
    updatedAt: rows.length ? Math.max(...rows.map((r) => Date.parse(r.computed_at))) : null,
    error: null,
    loading: false,
  };
}

/** Season 0 data, refreshed every minute (the engine republishes scores every minute). */
export function useSeasonData(): SeasonData {
  const [data, setData] = useState<SeasonData>(EMPTY);
  useEffect(() => {
    let alive = true;
    const run = () =>
      load()
        .then((d) => alive && setData(d))
        .catch((err: unknown) =>
          alive && setData((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : "Could not load" }))
        );
    run();
    const t = window.setInterval(run, 60_000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);
  return data;
}

/** Ticks once a second, for countdowns. */
export function useNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

export function fmtUsd(v: number): string {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

export function fmtPct(v: number, digits = 2): string {
  const s = v.toFixed(digits);
  return v > 0 ? `+${s}%` : `${s}%`;
}
