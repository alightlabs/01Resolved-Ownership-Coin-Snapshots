import { fmtUsd } from "@/lib/dune";
import type { TreasuryOverview, ProjectOverview, Proposal } from "@/lib/resolved";

interface Cell {
  label: string;
  value: string;
  sub?: string;
  badge?: "ONCHAIN" | "MODEL" | "DISCLOSED";
}

function Badge({ type }: { type?: Cell["badge"] }) {
  if (!type) return null;
  const s: Record<string, string> = {
    ONCHAIN:   "border border-[#31BA7C] text-[#31BA7C]",
    MODEL:     "border border-[#7070cc] text-[#7070cc]",
    DISCLOSED: "border border-[#D4B596] text-[#D4B596]",
  };
  return (
    <span className={`text-[8px] font-sans font-semibold tracking-widest uppercase px-1.5 py-0.5 ${s[type]}`}>
      {type}
    </span>
  );
}

interface Props {
  treasury:   TreasuryOverview | null;
  project:    ProjectOverview  | null;
  proposals:  Proposal[]       | null;
}

export default function LiveStateCard({ treasury, project, proposals }: Props) {
  const spot      = project?.tokenPrice           ? parseFloat(project.tokenPrice)             : null;
  const change24h = project?.tokenPriceUSDChange24h ? parseFloat(project.tokenPriceUSDChange24h) : null;
  const circ      = project?.circulatingSupply    ? parseFloat(project.circulatingSupply)      : null;
  const marketCap = spot && circ ? spot * circ : null;
  const nav       = treasury?.netAssetValue       ? parseFloat(treasury.netAssetValue)         : null;
  const runway    = treasury?.monthOfRunway       ? parseFloat(treasury.monthOfRunway)          : null;

  const passed = proposals?.filter(p => p.result === "approved").length ?? 0;
  const total  = proposals?.length ?? 0;

  const cells: Cell[] = [
    {
      label: "Spot Price",
      value: spot ? `$${spot.toFixed(4)}` : "—",
      sub: change24h != null ? `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}% 24h` : undefined,
      badge: "ONCHAIN",
    },
    {
      label: "Market Cap",
      value: fmtUsd(marketCap),
      badge: "ONCHAIN",
    },
    {
      label: "Circulating",
      value: circ ? `${(circ / 1_000_000).toFixed(1)}M` : "—",
      sub: "tokens",
      badge: "ONCHAIN",
    },
    {
      label: "Treasury",
      value: fmtUsd(treasury?.totalBalance),
      badge: "ONCHAIN",
    },
    {
      label: "NAV Floor",
      value: nav ? `$${nav.toFixed(4)}` : "—",
      sub: spot && nav ? `${((spot / nav) * 100 - 100).toFixed(0)}% above NAV` : undefined,
      badge: "MODEL",
    },
    {
      label: "Runway",
      value: runway ? `~${runway.toFixed(0)} mo` : "—",
      sub: "at trailing burn",
      badge: "MODEL",
    },
    ...(total > 0 ? [{
      label: "Proposals",
      value: `${passed} / ${total} passed`,
      badge: "ONCHAIN" as const,
    }] : []),
  ];

  return (
    <div className="w-full border border-[#E2DDD6] bg-[#F5F0E8]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E2DDD6] flex items-center justify-between">
        <span className="label-caps">Live State</span>
        <div className="flex items-center gap-1.5">
          <span className="live-dot" />
          <span className="text-[9px] text-[#31BA7C] font-sans font-medium tracking-wide">LIVE</span>
        </div>
      </div>

      {/* Data rows */}
      {cells.map((cell) => (
        <div key={cell.label} className="px-4 py-3 border-b border-[#E2DDD6] last:border-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-[#6B6660] mt-0.5 shrink-0">
              {cell.label}
            </span>
            <div className="text-right">
              <p className={`font-sans text-[14px] font-semibold tabular-nums leading-tight ${
                cell.label === "Spot Price" && change24h != null && change24h < 0
                  ? "text-[#FF6477]"
                  : "text-black"
              }`}>
                {cell.value}
              </p>
              {(cell.sub || cell.badge) && (
                <div className="flex items-center justify-end gap-1.5 mt-1 flex-wrap">
                  {cell.sub && (
                    <span className={`text-[10px] font-sans leading-tight ${
                      cell.label === "Spot Price" && change24h != null
                        ? change24h >= 0 ? "text-[#31BA7C]" : "text-[#FF6477]"
                        : "text-[#6B6660]"
                    }`}>
                      {cell.sub}
                    </span>
                  )}
                  {cell.badge && <Badge type={cell.badge} />}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
