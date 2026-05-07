"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";
import { fmtUsd, fmtNum } from "@/lib/dune";
import type { TreasuryOverview, AssetBreakdown, Movement } from "@/lib/resolved";

// ── Shared ────────────────────────────────────────────────────────────────────
const BRONZE = "#D4B596";
const BLUE   = "#4a90d9";
const MUTED  = "#E8E3DA";
const ttStyle = {
  backgroundColor: "#FAF7F2", border: "1px solid #E2DDD6",
  fontSize: 11, fontFamily: "'Open Sauce One', sans-serif",
  color: "#000", padding: "6px 10px",
};
const axisStyle = { fontSize: 10, fontFamily: "'Open Sauce One', sans-serif", fill: "#999" };
function fmtTick(d: string) {
  try { return format(parseISO(d.replace(" UTC", "")), "MMM d"); } catch { return d; }
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface TvlRow  { day?: string; total_usd?: number; }
interface VolRow  { day?: string; daily_volume?: number; total_volume?: number; twenty_four_volume?: number; cum_trades?: number; num_traders?: number; }
interface FeesRow { day?: string; cum_dex_fees?: number; dex_fees?: number; }
interface PoolRow { tvl?: number; pool?: string; }
interface LiqRow  { block_time?: string; }

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ type }: { type?: string }) {
  if (!type) return null;
  const s: Record<string, string> = {
    ONCHAIN:   "border-[#31BA7C] text-[#31BA7C]",
    MODEL:     "border-[#7070cc] text-[#7070cc]",
    DISCLOSED: "border-[#D4B596] text-[#D4B596]",
  };
  return (
    <span className={`text-[8px] font-sans font-semibold tracking-widest uppercase border px-1.5 py-0.5 ${s[type] ?? ""}`}>
      {type}
    </span>
  );
}

// ── Tab 1: Protocol Traction ──────────────────────────────────────────────────
function TractionTab({ tvlRows, volumeRows, poolRows, liqRows }: {
  tvlRows: TvlRow[] | null; volumeRows: VolRow[] | null;
  poolRows: PoolRow[] | null; liqRows: LiqRow[] | null;
}) {
  const lastVol      = volumeRows?.at(-1);
  const tvlAggregate = tvlRows?.find(r => r.total_usd && r.total_usd > 0);

  const kpis = [
    { label: "Total Volume",  value: fmtUsd(lastVol?.total_volume),        sub: "all-time" },
    { label: "TVL",           value: fmtUsd(tvlAggregate?.total_usd),       sub: "current" },
    { label: "24h Volume",    value: fmtUsd(lastVol?.twenty_four_volume),   sub: "rolling" },
    { label: "Total Trades",  value: fmtNum(lastVol?.cum_trades),           sub: "all-time" },
    { label: "Active Pools",  value: poolRows ? String(poolRows.length) : "—", sub: "live" },
    { label: "Liquidations",  value: liqRows  ? String(liqRows.length) : "—",  sub: "processed" },
  ];

  const seenDays = new Set<string>();
  const tvlChartData = (tvlRows ?? [])
    .filter(r => { const d = r.day ?? ""; if (seenDays.has(d) || !r.total_usd) return false; seenDays.add(d); return true; })
    .map(r => ({ date: (r.day ?? "").replace(" UTC","").slice(0, 10), tvl: r.total_usd ?? 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const volChartData = (volumeRows ?? [])
    .filter(r => r.day && r.daily_volume != null)
    .map(r => ({ date: (r.day ?? "").replace(" UTC","").slice(0, 10), volume: r.daily_volume ?? 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-[#E2DDD6] border border-[#E2DDD6] mb-6">
        {kpis.map((k, i) => (
          <div key={k.label} className={`p-4 ${i < 3 ? "" : ""}`}>
            <p className="label-caps mb-1">{k.label}</p>
            <p className="font-sans text-[18px] font-semibold tabular-nums text-black leading-tight">{k.value}</p>
            <p className="font-sans text-[11px] text-[#999] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border border-[#E2DDD6] p-5 bg-[#FAF7F2]">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-black mb-1">TVL Over Time</p>
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
            <div className="h-40 flex items-center justify-center text-[12px] text-[#999] font-sans">No data</div>
          )}
        </div>

        <div className="border border-[#E2DDD6] p-5 bg-[#FAF7F2]">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-black mb-1">Daily DEX Volume</p>
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
            <div className="h-40 flex items-center justify-center text-[12px] text-[#999] font-sans">No data</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tab 2: Treasury & NAV ─────────────────────────────────────────────────────
const PIE_COLORS = [BRONZE, "#4a90d9", "#31BA7C", "#7070cc", "#999"];

function TreasuryTab({ overview, assets }: {
  overview: TreasuryOverview | null; assets: AssetBreakdown | null;
}) {
  const spot    = overview?.baseMintCurrentPrice ? parseFloat(overview.baseMintCurrentPrice) : null;
  const nav     = overview?.netAssetValue        ? parseFloat(overview.netAssetValue)        : null;
  const runway  = overview?.monthOfRunway        ? parseFloat(overview.monthOfRunway)        : null;
  const spend   = overview?.spendingLimit        ? parseFloat(overview.spendingLimit)        : null;
  const premium = spot && nav && nav > 0 ? ((spot / nav - 1) * 100).toFixed(1) : null;

  const pieData = (assets?.categories ?? []).map(cat => ({
    name:  cat.name === "LPPositions" ? "LP Positions" : cat.name,
    value: parseFloat(cat.value) || 0,
  })).filter(d => d.value > 0);

  const rows = [
    { label: "Total Treasury",      value: fmtUsd(overview?.totalBalance), badge: "ONCHAIN" },
    { label: "NAV per Token",       value: nav ? `$${nav.toFixed(4)}` : "—", badge: "MODEL", highlight: true },
    { label: "Spot Price",          value: spot ? `$${spot.toFixed(4)}` : "—", badge: "ONCHAIN" },
    { label: "Spot / NAV Multiple", value: spot && nav && nav > 0 ? `${(spot / nav).toFixed(2)}×` : "—" },
    { label: "Spot Premium",        value: premium ? `+${premium}%` : "—" },
    { label: "Monthly Budget",      value: spend ? fmtUsd(spend) : "—", badge: "DISCLOSED" },
    { label: "Remaining Runway",    value: runway ? `~${runway.toFixed(1)} months` : "—", badge: "MODEL" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
      <div className="divide-y divide-[#E2DDD6] border border-[#E2DDD6]">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3">
            <span className="label-caps">{row.label}</span>
            <div className="flex items-center gap-2">
              <span className={`font-sans text-[14px] font-semibold tabular-nums ${"highlight" in row && row.highlight ? "text-[#D4B596]" : "text-black"}`}>
                {row.value}
              </span>
              {"badge" in row && row.badge && <Badge type={row.badge} />}
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="label-caps mb-3">Asset Composition</p>
        {pieData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" stroke="none">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v) => [fmtUsd(Number(v)), ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="font-sans text-[12px] text-[#444]">{d.name}</span>
                  </div>
                  <span className="font-sans text-[12px] font-semibold tabular-nums text-black">{fmtUsd(d.value)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-40 flex items-center justify-center border border-dashed border-[#E2DDD6] text-[12px] text-[#999] font-sans">
            No asset data
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab 3: Revenue & Economics ────────────────────────────────────────────────
function RevenueTab({ movements, totalRevenue }: {
  movements: Movement[] | null; totalRevenue: string | null;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <div>
        <p className="label-caps mb-3">Recent Treasury Activity</p>
        {!movements || movements.length === 0 ? (
          <div className="border border-dashed border-[#E2DDD6] p-8 text-center text-[12px] text-[#999] font-sans">
            No movement data
          </div>
        ) : (
          <div className="border border-[#E2DDD6] divide-y divide-[#E2DDD6]">
            {movements.slice(0, 8).map(m => {
              const val = typeof m.totalValue === "number" ? fmtUsd(m.totalValue) : "—";
              const ts  = m.timestamp
                ? (() => { try { return format(parseISO(m.timestamp), "MMM d"); } catch { return ""; } })()
                : "";
              return (
                <div key={m.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-sans text-[12px] font-medium text-black">
                      {m.categoryName ?? m.classifiedStatus ?? "Movement"}
                    </span>
                    <span className="font-sans text-[12px] font-semibold tabular-nums text-black">{val}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="label-caps">{m.fromName || "—"} → {m.toName || "—"}</span>
                    <span className="label-caps">{ts}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <p className="label-caps mb-3">Revenue Summary</p>
        <div className="border border-[#E2DDD6] p-5">
          <p className="label-caps mb-1">All-Time DAO Revenue</p>
          <p className="font-serif text-black leading-none mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
            {fmtUsd(totalRevenue)}
          </p>
          <div className="border-t border-[#E2DDD6] pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="label-caps">Monthly Fees (est.)</span>
              <span className="font-sans text-[13px] font-semibold text-black">~$200</span>
            </div>
            <div className="flex justify-between">
              <span className="label-caps">Monthly Burn</span>
              <span className="font-sans text-[13px] font-semibold text-black">$50,000</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E2DDD6]">
              <span className="label-caps text-[#FF6477]">Net Monthly</span>
              <span className="font-sans text-[13px] font-semibold text-[#FF6477]">−$49,800</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const TABS = ["Protocol Traction", "Treasury & NAV", "Revenue & Economics"] as const;
type Tab = typeof TABS[number];

interface Props {
  tvlRows:      TvlRow[]         | null;
  volumeRows:   VolRow[]         | null;
  feesRows:     FeesRow[]        | null;
  poolRows:     PoolRow[]        | null;
  liqRows:      LiqRow[]         | null;
  overview:     TreasuryOverview | null;
  assets:       AssetBreakdown   | null;
  movements:    Movement[]       | null;
  totalRevenue: string           | null;
}

export default function FinancialCore(props: Props) {
  const [tab, setTab] = useState<Tab>("Protocol Traction");

  return (
    <section id="financial" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Financial Core
        </h2>
        <span className="label-caps">Section 09 / Treasury Intelligence</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2DDD6] mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[11px] font-sans font-medium uppercase tracking-wide border-b-2 transition-colors ${
              tab === t
                ? "border-black text-black"
                : "border-transparent text-[#999] hover:text-black"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Protocol Traction" && (
        <TractionTab
          tvlRows={props.tvlRows}
          volumeRows={props.volumeRows}
          poolRows={props.poolRows}
          liqRows={props.liqRows}
        />
      )}
      {tab === "Treasury & NAV" && (
        <TreasuryTab overview={props.overview} assets={props.assets} />
      )}
      {tab === "Revenue & Economics" && (
        <RevenueTab movements={props.movements} totalRevenue={props.totalRevenue} />
      )}
    </section>
  );
}
