"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { VolumeRow, TvlRow, FeesRow } from "@/lib/types";
import { fmtUsd, fmtNum } from "@/lib/dune";

const BRONZE = "#D4B596";
const GREEN  = "#31BA7C";
const BLUE   = "#4a90d9";
const MUTED  = "#E2DDD6";

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#E2DDD6] bg-[#FAF7F2] p-5">
      <div className="mb-4">
        <p className="font-sans text-[11px] font-semibold text-black uppercase tracking-wide">
          {title}
        </p>
        {subtitle && (
          <p className="label-caps mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-40 flex items-center justify-center text-[13px] text-[#999] font-sans border border-dashed border-[#E2DDD6]">
      No data — add Dune API key
    </div>
  );
}

// ─── Tooltip styles ──────────────────────────────────────────
const ttStyle = {
  backgroundColor: "#000",
  border: "1px solid #222",
  borderRadius: 0,
  fontSize: 11,
  fontFamily: "'Open Sauce One', sans-serif",
  color: "#fff",
  padding: "6px 10px",
};

interface Props {
  tvlRows: TvlRow[] | null;
  volumeRows: VolumeRow[] | null;
  feesRows: FeesRow[] | null;
}

export default function GrowthMetrics({ tvlRows, volumeRows, feesRows }: Props) {
  // ─── TVL chart data ────────────────────────────────────────
  const tvlData = (tvlRows ?? [])
    .map((r) => ({
      date: r.date ?? r.day ?? "",
      tvl: Number(r.tvl ?? r.total_tvl ?? 0),
      deposits: Number(r.total_deposits ?? 0),
    }))
    .filter((d) => d.date)
    .slice(-90); // last 90 days

  // ─── Volume chart data ─────────────────────────────────────
  const volData = (volumeRows ?? [])
    .map((r) => ({
      date: r.date ?? r.day ?? "",
      volume: Number(r.volume ?? r.daily_volume ?? 0),
      cumVolume: Number(r.cum_volume ?? 0),
      trades: Number(r.trades ?? r.num_trades ?? 0),
      traders: Number(r.traders ?? r.num_traders ?? 0),
    }))
    .filter((d) => d.date)
    .slice(-90);

  // ─── Fees chart data ───────────────────────────────────────
  const feesData = (feesRows ?? [])
    .map((r) => ({
      date: r.date ?? r.day ?? "",
      dexFees: Number(r.dex_fees ?? 0),
      lendingFees: Number(r.lending_fees ?? 0),
    }))
    .filter((d) => d.date)
    .slice(-90);

  function fmtTick(dateStr: string) {
    try {
      return format(parseISO(dateStr), "MMM d");
    } catch {
      return dateStr;
    }
  }

  const axisStyle = {
    fontSize: 10,
    fontFamily: "'Open Sauce One', sans-serif",
    fill: "#999",
  };

  return (
    <section className="py-14 border-t border-[#E2DDD6]">
      <p className="label-caps mb-2">Protocol Growth</p>
      <h2
        className="font-serif text-black mb-8"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
      >
        On-chain Metrics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* TVL */}
        <ChartCard title="Omnipair TVL" subtitle="Total Value Locked over time">
          {tvlData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={tvlData}>
                <defs>
                  <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRONZE} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={BRONZE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={MUTED} strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtTick} tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tickFormatter={(v) => fmtUsd(v)} tick={axisStyle} tickLine={false} axisLine={false} width={55} />
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v) => [fmtUsd(Number(v)), "TVL"]}
                  labelFormatter={(label) => fmtTick(String(label))}
                />
                <Area type="monotone" dataKey="tvl" stroke={BRONZE} strokeWidth={1.5} fill="url(#tvlGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </ChartCard>

        {/* Daily DEX Volume */}
        <ChartCard title="Daily DEX Volume" subtitle="Daily + cumulative volume">
          {volData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={volData}>
                <CartesianGrid stroke={MUTED} strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtTick} tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis yAxisId="left" tickFormatter={(v) => fmtUsd(v)} tick={axisStyle} tickLine={false} axisLine={false} width={55} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => fmtUsd(v)} tick={axisStyle} tickLine={false} axisLine={false} width={60} />
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v, name) => [fmtUsd(Number(v)), name === "volume" ? "Daily Vol" : "Cum Vol"]}
                  labelFormatter={(label) => fmtTick(String(label))}
                />
                <Bar yAxisId="left" dataKey="volume" fill={BLUE} opacity={0.8} radius={[1, 1, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cumVolume" stroke="#aac4e8" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily Trades & Traders */}
        <ChartCard title="Daily Trades & Traders" subtitle="Activity over time">
          {volData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={volData}>
                <CartesianGrid stroke={MUTED} strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtTick} tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis yAxisId="left" tickFormatter={fmtNum} tick={axisStyle} tickLine={false} axisLine={false} width={45} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={fmtNum} tick={axisStyle} tickLine={false} axisLine={false} width={45} />
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v, name) => [fmtNum(Number(v)), name === "trades" ? "Trades" : "Traders"]}
                  labelFormatter={(label) => fmtTick(String(label))}
                />
                <Bar yAxisId="left" dataKey="trades" fill={BLUE} opacity={0.8} radius={[1,1,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="traders" stroke={GREEN} strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </ChartCard>

        {/* Daily Fees */}
        <ChartCard title="Daily Fees" subtitle="DEX fees + lending fees">
          {feesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={feesData}>
                <CartesianGrid stroke={MUTED} strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtTick} tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tickFormatter={(v) => fmtUsd(v)} tick={axisStyle} tickLine={false} axisLine={false} width={55} />
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v, name) => [fmtUsd(Number(v)), name === "dexFees" ? "DEX Fees" : "Lending Fees"]}
                  labelFormatter={(label) => fmtTick(String(label))}
                />
                <Bar dataKey="dexFees" fill={BRONZE} radius={[1,1,0,0]} stackId="a" />
                <Bar dataKey="lendingFees" fill={GREEN} opacity={0.7} radius={[1,1,0,0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </ChartCard>
      </div>
    </section>
  );
}
