"use client";

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";
import { fmtUsd, fmtNum } from "@/lib/dune";

const BRONZE = "#D4B596";
const BLUE   = "#4a90d9";
const MUTED  = "#E8E3DA";

const ttStyle = {
  backgroundColor: "#000", border: "1px solid #222",
  fontSize: 11, fontFamily: "'Open Sauce One', sans-serif",
  color: "#fff", padding: "6px 10px",
};
const axisStyle = {
  fontSize: 10, fontFamily: "'Open Sauce One', sans-serif", fill: "#999",
};

function fmtTick(d: string) {
  try { return format(parseISO(d.replace(" UTC", "")), "MMM d"); }
  catch { return d; }
}

interface TvlRow  { day?: string; total_usd?: number; total_deposits_usd?: number; token_symbol?: string; }
interface VolRow  { day?: string; daily_volume?: number; total_volume?: number; twenty_four_volume?: number; cum_trades?: number; num_traders?: number; num_trades?: number; }
interface FeesRow { day?: string; cum_dex_fees?: number; cum_borrows_fees?: number; dex_fees?: number; }
interface PoolRow { tvl?: number; pool?: string; }
interface LiqRow  { block_time?: string; }

interface StatItem { label: string; value: string; }

interface Props {
  tvlRows:     TvlRow[]  | null;
  volumeRows:  VolRow[]  | null;
  feesRows:    FeesRow[] | null;
  poolRows:    PoolRow[] | null;
  liqRows:     LiqRow[]  | null;
}

export default function TractionSection({ tvlRows, volumeRows, feesRows, poolRows, liqRows }: Props) {
  // ── Derive KPIs ──────────────────────────────────────────────
  // TVL — one row per day per token; take first row's aggregate fields
  const tvlAggregate = tvlRows?.find(r => r.total_usd != null && r.total_usd > 0);
  const tvl       = fmtUsd(tvlAggregate?.total_usd);
  const deposits  = fmtUsd(tvlAggregate?.total_deposits_usd);

  // Volume — last row has running totals
  const lastVol = volumeRows?.at(-1);
  const alltimeVol = fmtUsd(lastVol?.total_volume);
  const vol24h     = fmtUsd(lastVol?.twenty_four_volume);
  const cumTrades  = fmtNum(lastVol?.cum_trades);

  // Pools + liquidations
  const poolCount  = poolRows ? String(poolRows.length) : "—";
  const liqCount   = liqRows  ? String(liqRows.length)  : "—";

  const stats: StatItem[] = [
    { label: "Total Volume (all-time)", value: alltimeVol },
    { label: "TVL",                     value: tvl },
    { label: "Total Deposits",          value: deposits },
    { label: "24h Volume",             value: vol24h },
    { label: "Total Trades (all-time)", value: cumTrades },
    { label: "Active Pools",           value: poolCount },
    { label: "Liquidations",           value: liqCount },
  ];

  // ── TVL chart data — deduplicate by day, take aggregate ──────
  const seenDays = new Set<string>();
  const tvlChartData = (tvlRows ?? [])
    .filter(r => {
      const d = r.day ?? "";
      if (seenDays.has(d) || !r.total_usd) return false;
      seenDays.add(d);
      return true;
    })
    .map(r => ({ date: (r.day ?? "").replace(" UTC","").slice(0, 10), tvl: r.total_usd ?? 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // ── Volume chart data ─────────────────────────────────────────
  const volChartData = (volumeRows ?? [])
    .filter(r => r.day && r.daily_volume != null)
    .map(r => ({
      date: (r.day ?? "").replace(" UTC","").slice(0, 10),
      volume: r.daily_volume ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section id="traction" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Protocol Traction
        </h2>
        <span className="label-caps">Section 05 / Growth</span>
      </div>
      <p className="label-caps text-[#31BA7C] mb-6">Beta live · Solana mainnet</p>

      {/* Stat table */}
      <div className="border border-[#E2DDD6] mb-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center justify-between px-4 py-3 ${i < stats.length - 1 ? "border-b border-[#E2DDD6]" : ""}`}
          >
            <span className="font-sans text-[13px] text-[#6B6660]">{s.label}</span>
            <span className="font-sans text-[14px] font-semibold text-black tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Growth charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* TVL over time */}
        <div className="border border-[#E2DDD6] p-5 bg-[#FAF7F2]">
          <p className="font-sans text-[11px] font-semibold text-black uppercase tracking-wide mb-1">TVL Over Time</p>
          <p className="label-caps mb-4">Total value locked · daily</p>
          {tvlChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={tvlChartData}>
                <defs>
                  <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={BRONZE} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={BRONZE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={MUTED} strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtTick} tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tickFormatter={v => fmtUsd(v)} tick={axisStyle} tickLine={false} axisLine={false} width={58} />
                <Tooltip contentStyle={ttStyle} formatter={(v) => [fmtUsd(Number(v)), "TVL"]} labelFormatter={l => fmtTick(String(l))} />
                <Area type="monotone" dataKey="tvl" stroke={BRONZE} strokeWidth={1.5} fill="url(#tvlGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-[12px] text-[#999] font-sans">Loading…</div>
          )}
        </div>

        {/* Daily volume */}
        <div className="border border-[#E2DDD6] p-5 bg-[#FAF7F2]">
          <p className="font-sans text-[11px] font-semibold text-black uppercase tracking-wide mb-1">Daily DEX Volume</p>
          <p className="label-caps mb-4">Protocol trading activity</p>
          {volChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={volChartData}>
                <CartesianGrid stroke={MUTED} strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtTick} tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tickFormatter={v => fmtUsd(v)} tick={axisStyle} tickLine={false} axisLine={false} width={58} />
                <Tooltip contentStyle={ttStyle} formatter={(v) => [fmtUsd(Number(v)), "Volume"]} labelFormatter={l => fmtTick(String(l))} />
                <Bar dataKey="volume" fill={BLUE} opacity={0.8} radius={[1,1,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-[12px] text-[#999] font-sans">Loading…</div>
          )}
        </div>
      </div>
    </section>
  );
}
