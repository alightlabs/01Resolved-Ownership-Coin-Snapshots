import type { TreasuryOverview } from "@/lib/types";
import { fmtUsd } from "@/lib/dune";

interface StatCell {
  label: string;
  value: string;
  sub?: string;
  badge?: "ONCHAIN" | "MODEL" | "DISCLOSED";
}

function Badge({ type }: { type: StatCell["badge"] }) {
  const styles: Record<string, string> = {
    ONCHAIN: "bg-[#1a3a2a] text-[#31BA7C]",
    MODEL: "bg-[#1a1a2a] text-[#7070cc]",
    DISCLOSED: "bg-[#2a1a10] text-[#D4B596]",
  };
  return (
    <span
      className={`inline-block text-[9px] font-sans font-semibold tracking-widest px-1.5 py-0.5 uppercase ${styles[type ?? "ONCHAIN"]}`}
    >
      {type}
    </span>
  );
}

function StatCell({ label, value, sub, badge }: StatCell) {
  return (
    <div className="p-4 border-b border-[#1a1a1a] last:border-0">
      <p className="text-[9px] font-sans font-medium tracking-[0.14em] uppercase text-[#666] mb-1">
        {label}
      </p>
      <p className="font-sans text-xl font-semibold text-white tabular-nums">
        {value}
      </p>
      {(sub || badge) && (
        <div className="flex items-center gap-2 mt-1">
          {sub && (
            <span className="text-[10px] text-[#555] font-sans">{sub}</span>
          )}
          {badge && <Badge type={badge} />}
        </div>
      )}
    </div>
  );
}

interface LiveStateCardProps {
  treasury: TreasuryOverview | null;
  duneKpis: {
    tvl?: string;
    totalDeposits?: string;
    totalBorrows?: string;
    alltimeVolume?: string;
    volume24h?: string;
    totalDexFees?: string;
    totalLendingFees?: string;
  };
  hasDune: boolean;
  hasResolved: boolean;
}

export default function LiveStateCard({
  treasury,
  duneKpis,
  hasDune,
  hasResolved,
}: LiveStateCardProps) {
  const stats: StatCell[] = [];

  if (hasDune) {
    if (duneKpis.tvl)
      stats.push({ label: "TVL", value: duneKpis.tvl, badge: "ONCHAIN" });
    if (duneKpis.totalDeposits)
      stats.push({
        label: "Total Deposits",
        value: duneKpis.totalDeposits,
        badge: "ONCHAIN",
      });
    if (duneKpis.totalBorrows)
      stats.push({
        label: "Total Borrows",
        value: duneKpis.totalBorrows,
        badge: "ONCHAIN",
      });
    if (duneKpis.alltimeVolume)
      stats.push({
        label: "All-time DEX Volume",
        value: duneKpis.alltimeVolume,
        badge: "ONCHAIN",
      });
    if (duneKpis.volume24h)
      stats.push({
        label: "24hr DEX Volume",
        value: duneKpis.volume24h,
        badge: "ONCHAIN",
      });
    if (duneKpis.totalDexFees)
      stats.push({
        label: "Total DEX Fees",
        value: duneKpis.totalDexFees,
        badge: "ONCHAIN",
      });
  }

  if (hasResolved && treasury) {
    stats.push({
      label: "Treasury",
      value: fmtUsd(treasury.totalBalance),
      badge: "ONCHAIN",
    });
    if (treasury.netAssetValue)
      stats.push({
        label: "NAV Floor",
        value: fmtUsd(treasury.netAssetValue),
        badge: "MODEL",
      });
    if (treasury.monthOfRunway)
      stats.push({
        label: "Runway",
        value: `~${Math.round(parseFloat(treasury.monthOfRunway))} mo`,
        sub: "at trailing burn",
        badge: "MODEL",
      });
  }

  // Pair stats into a 2-col grid
  const pairs: [StatCell, StatCell | null][] = [];
  for (let i = 0; i < stats.length; i += 2) {
    pairs.push([stats[i], stats[i + 1] ?? null]);
  }

  return (
    <div className="dark-panel rounded-none w-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
        <span className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-[#555]">
          Live State
        </span>
        <div className="flex items-center gap-1.5">
          <span className="live-dot" />
          <span className="text-[9px] text-[#31BA7C] font-sans font-medium tracking-wide">
            LIVE
          </span>
        </div>
      </div>

      {/* Stats grid */}
      {pairs.map((pair, i) => (
        <div key={i} className="grid grid-cols-2 border-b border-[#1a1a1a] last:border-0">
          <div className="border-r border-[#1a1a1a]">
            <StatCell {...pair[0]} />
          </div>
          <div>
            {pair[1] ? (
              <StatCell {...pair[1]} />
            ) : (
              <div className="p-4" />
            )}
          </div>
        </div>
      ))}

      {stats.length === 0 && (
        <div className="p-6 text-center text-[#444] text-sm font-sans">
          Add API keys to load live data
        </div>
      )}
    </div>
  );
}
