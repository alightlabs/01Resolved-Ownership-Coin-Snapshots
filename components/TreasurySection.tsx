"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import type { TreasuryOverview, TreasuryChartPoint, AssetCategory } from "@/lib/types";
import { fmtUsd } from "@/lib/dune";

const ttStyle = {
  backgroundColor: "#000",
  border: "1px solid #222",
  borderRadius: 0,
  fontSize: 11,
  fontFamily: "'Open Sauce One', sans-serif",
  color: "#fff",
  padding: "6px 10px",
};

const axisStyle = {
  fontSize: 10,
  fontFamily: "'Open Sauce One', sans-serif",
  fill: "#999",
};

interface Props {
  overview: TreasuryOverview | null;
  chart: TreasuryChartPoint[] | null;
  assets: { totalValue: string; categories: AssetCategory[] } | null;
}

export default function TreasurySection({ overview, chart, assets }: Props) {
  const hasData = overview || chart || assets;

  const chartData = (chart ?? []).map((p) => ({
    date: format(new Date(p.timestamp * 1000), "MMM d"),
    value: parseFloat(p.totalValue),
  }));

  const statCells = [
    { label: "Treasury Balance", value: fmtUsd(overview?.totalBalance) },
    { label: "Net Asset Value", value: fmtUsd(overview?.netAssetValue) },
    { label: "Monthly Spending Limit", value: fmtUsd(overview?.spendingLimit) },
    {
      label: "Runway",
      value: overview?.monthOfRunway
        ? `~${Math.round(parseFloat(overview.monthOfRunway))} months`
        : "—",
    },
  ];

  return (
    <section className="py-14 border-t border-[#E2DDD6]">
      <p className="label-caps mb-2">Treasury Intelligence</p>
      <h2
        className="font-serif text-black mb-8"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
      >
        Financial Core
      </h2>

      {!hasData ? (
        <div className="border border-dashed border-[#E2DDD6] p-10 text-center text-[13px] text-[#999] font-sans">
          Add your 01Resolved API key to load treasury intelligence
        </div>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-[#E2DDD6] mb-5">
            {statCells.map((s, i) => (
              <div
                key={s.label}
                className={`p-5 ${i < statCells.length - 1 ? "border-r border-[#E2DDD6]" : ""}`}
              >
                <p className="label-caps mb-2">{s.label}</p>
                <p className="font-sans text-2xl font-semibold text-black tabular-nums">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Treasury chart */}
            {chartData.length > 0 && (
              <div className="lg:col-span-2 border border-[#E2DDD6] p-5 bg-[#FAF7F2]">
                <p className="font-sans text-[11px] font-semibold text-black uppercase tracking-wide mb-4">
                  Treasury Value — 90 Day
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData.slice(-90)}>
                    <defs>
                      <linearGradient id="treasGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4B596" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D4B596" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E2DDD6" strokeDasharray="2 4" vertical={false} />
                    <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tickFormatter={(v) => fmtUsd(v)} tick={axisStyle} tickLine={false} axisLine={false} width={60} />
                    <Tooltip
                      contentStyle={ttStyle}
                      formatter={(v) => [fmtUsd(Number(v)), "Treasury"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="#D4B596" strokeWidth={1.5} fill="url(#treasGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Asset allocation */}
            {assets && (
              <div className="border border-[#E2DDD6] p-5 bg-[#FAF7F2]">
                <p className="font-sans text-[11px] font-semibold text-black uppercase tracking-wide mb-4">
                  Asset Allocation
                </p>
                <p className="label-caps mb-4">
                  Total: {fmtUsd(assets.totalValue)}
                </p>
                <div className="space-y-3">
                  {assets.categories.map((cat) => {
                    const catTotal = parseFloat(assets.totalValue) || 1;
                    const catValue = parseFloat(cat.value) || 0;
                    const pct = Math.min(100, (catValue / catTotal) * 100);
                    return (
                      <div key={cat.name}>
                        <div className="flex justify-between mb-1">
                          <span className="label-caps">{cat.name}</span>
                          <span className="label-caps text-black">
                            {fmtUsd(cat.value)}
                          </span>
                        </div>
                        <div className="h-1 bg-[#E2DDD6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#D4B596] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
