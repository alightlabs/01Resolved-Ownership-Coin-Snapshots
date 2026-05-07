import { fmtUsd } from "@/lib/dune";
import type {
  TreasuryOverview,
  AssetBreakdown,
} from "@/lib/resolved";

interface Row {
  label: string;
  value: string;
  highlight?: boolean;
  badge?: string;
}

function StatRow({ label, value, highlight, badge }: Row) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1e1e1e] last:border-0">
      <span className="text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-[#555]">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`font-sans text-[13px] font-semibold tabular-nums ${
            highlight ? "text-[#D4B596]" : "text-white"
          }`}
        >
          {value}
        </span>
        {badge && (
          <span className="text-[9px] font-sans font-semibold tracking-widest uppercase bg-[#1a3a2a] text-[#31BA7C] px-1.5 py-0.5">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

interface Props {
  overview: TreasuryOverview | null;
  assets: AssetBreakdown | null;
  totalRevenue: string | null;
}

export default function TreasurySection({ overview, assets, totalRevenue }: Props) {
  if (!overview && !assets) {
    return (
      <div className="border border-dashed border-[#E2DDD6] p-8 text-center text-[13px] text-[#999] font-sans">
        Treasury data loading — check API key
      </div>
    );
  }

  // Spot price + NAV calculations
  const spotPrice = overview?.baseMintCurrentPrice
    ? parseFloat(overview.baseMintCurrentPrice)
    : null;
  const navPerToken = overview?.netAssetValue
    ? parseFloat(overview.netAssetValue)
    : null;
  const spotNavMultiple =
    spotPrice && navPerToken && navPerToken > 0
      ? (spotPrice / navPerToken).toFixed(2) + "x"
      : "—";
  const spotPremium =
    spotPrice && navPerToken && navPerToken > 0
      ? ((spotPrice / navPerToken - 1) * 100).toFixed(1) + "%"
      : "—";

  // DAO Main wallet
  const mainCategory = assets?.categories.find(c => c.name === "Main");
  const mainWalletValue = mainCategory ? fmtUsd(mainCategory.value) : "—";

  // LP positions
  const lpCategory = assets?.categories.find(c => c.name === "LPPositions");
  const lpValue = lpCategory ? fmtUsd(lpCategory.value) : "—";

  const runway = overview?.monthOfRunway
    ? `~${parseFloat(overview.monthOfRunway).toFixed(1)} months`
    : "—";

  const rows: Row[] = [
    {
      label: "Total Treasury Value",
      value: fmtUsd(overview?.totalBalance),
      badge: "ONCHAIN",
    },
    { label: "DAO Main Wallet", value: mainWalletValue, badge: "ONCHAIN" },
    ...(lpCategory ? [{ label: "LP Positions", value: lpValue, badge: "ONCHAIN" as const }] : []),
    {
      label: "Monthly Spend Limit",
      value: overview?.spendingLimit ? fmtUsd(overview.spendingLimit) : "—",
      badge: "DISCLOSED",
    },
    { label: "Remaining Runway", value: runway, badge: "MODEL" },
    {
      label: "NAV per Token",
      value: navPerToken ? `$${navPerToken.toFixed(4)}` : "—",
      highlight: true,
      badge: "MODEL",
    },
    {
      label: "Spot Price",
      value: spotPrice ? `$${spotPrice.toFixed(4)}` : "—",
      badge: "ONCHAIN",
    },
    { label: "Spot / NAV Multiple", value: spotNavMultiple },
    { label: "Spot Premium to NAV", value: spotPremium },
    ...(totalRevenue
      ? [{ label: "All-Time DAO Revenue", value: fmtUsd(totalRevenue) }]
      : []),
  ];

  function Badge({ type }: { type?: string }) {
    if (!type) return null;
    const styles: Record<string, string> = {
      ONCHAIN:   "bg-[#1a3a2a] text-[#31BA7C]",
      MODEL:     "bg-[#1a1a2e] text-[#7070cc]",
      DISCLOSED: "bg-[#2a1a10] text-[#D4B596]",
    };
    return (
      <span className={`text-[9px] font-sans font-semibold tracking-widest uppercase px-1.5 py-0.5 ${styles[type] ?? ""}`}>
        {type}
      </span>
    );
  }

  return (
    <div className="dark-panel">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e1e] flex items-center justify-between">
        <span className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-[#555]">
          Treasury Intelligence
        </span>
        <div className="flex items-center gap-1.5">
          <span className="live-dot" />
          <span className="text-[9px] text-[#31BA7C] font-sans font-medium tracking-wide">LIVE</span>
        </div>
      </div>

      {/* Rows */}
      <div className="px-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 border-b border-[#1e1e1e] last:border-0">
            <span className="text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-[#555]">
              {row.label}
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-sans text-[13px] font-semibold tabular-nums ${row.highlight ? "text-[#D4B596]" : "text-white"}`}>
                {row.value}
              </span>
              <Badge type={row.badge} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
