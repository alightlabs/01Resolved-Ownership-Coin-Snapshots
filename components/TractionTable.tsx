import { fmtUsd, fmtNum } from "@/lib/dune";
import type { VolumeRow, TvlRow, FeesRow, PoolRow } from "@/lib/types";

interface TractionStat {
  label: string;
  value: string;
  sub?: string;
}

interface Props {
  tvlRows: TvlRow[] | null;
  volumeRows: VolumeRow[] | null;
  feesRows: FeesRow[] | null;
  poolRows: PoolRow[] | null;
}

export default function TractionTable({ tvlRows, volumeRows, feesRows, poolRows }: Props) {
  // Derive KPIs
  const lastVol = volumeRows?.at(-1);
  const allVol  = volumeRows?.find(r => r.token === "All" || !r.token);
  const lastTvl = tvlRows?.find(r => r.token === "All" || !r.token) ?? tvlRows?.at(-1);
  const lastFee = feesRows?.at(-1);

  const totalVolume  = fmtUsd(allVol?.cum_volume  ?? lastVol?.cum_volume ?? null);
  const tvl          = fmtUsd(lastTvl?.tvl ?? lastTvl?.total_tvl ?? null);
  const vol24h       = fmtUsd(lastVol?.volume ?? lastVol?.daily_volume ?? null);
  const totalTrades  = fmtNum(lastVol?.cum_volume ?? null); // fallback
  const totalDexFees = fmtUsd(lastFee?.cum_dex_fees ?? lastFee?.total_dex_fees ?? null);
  const totalLendFees= fmtUsd(lastFee?.cum_lending_fees ?? lastFee?.total_lending_fees ?? null);
  const poolCount    = poolRows ? String(poolRows.length) : "—";

  const stats: TractionStat[] = [
    { label: "Total Volume (all-time)", value: totalVolume },
    { label: "TVL",                    value: tvl },
    { label: "24h Volume",             value: vol24h },
    { label: "Total DEX Fees",         value: totalDexFees },
    { label: "Total Lending Fees",     value: totalLendFees },
    { label: "Active Pools",           value: poolCount },
  ];

  return (
    <div>
      <p className="label-caps mb-4">Protocol Traction</p>

      {/* Stat rows */}
      <div className="border border-[#E2DDD6]">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center justify-between px-4 py-3 ${
              i < stats.length - 1 ? "border-b border-[#E2DDD6]" : ""
            }`}
          >
            <span className="font-sans text-[13px] text-[#6B6660]">{s.label}</span>
            <span className="font-sans text-[13px] font-semibold text-black tabular-nums">
              {s.value}
              {s.sub && (
                <span className="font-normal text-[#999] ml-1.5 text-[11px]">{s.sub}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
