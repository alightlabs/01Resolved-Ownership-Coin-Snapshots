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
    ONCHAIN:   "bg-[#1a3a2a] text-[#31BA7C]",
    MODEL:     "bg-[#1a1a2e] text-[#7070cc]",
    DISCLOSED: "bg-[#2a1a10] text-[#D4B596]",
  };
  return <span className={`text-[9px] font-sans font-semibold tracking-widest uppercase px-1.5 py-0.5 ${s[type]}`}>{type}</span>;
}

interface Props {
  treasury:   TreasuryOverview | null;
  project:    ProjectOverview  | null;
  proposals:  Proposal[]       | null;
}

export default function LiveStateCard({ treasury, project, proposals }: Props) {
  const spot      = project?.tokenPrice       ? parseFloat(project.tokenPrice)             : null;
  const change24h = project?.tokenPriceUSDChange24h ? parseFloat(project.tokenPriceUSDChange24h) : null;
  const circ      = project?.circulatingSupply ? parseFloat(project.circulatingSupply)      : null;
  const marketCap = spot && circ ? spot * circ : null;
  const nav       = treasury?.netAssetValue   ? parseFloat(treasury.netAssetValue)          : null;
  const runway    = treasury?.monthOfRunway   ? parseFloat(treasury.monthOfRunway)           : null;

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
      sub: "100% of total supply",
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
      label: "Proposals Passed",
      value: `${passed} / ${total}`,
      badge: "ONCHAIN" as const,
    }] : []),
  ];

  const pairs: [Cell, Cell | null][] = [];
  for (let i = 0; i < cells.length; i += 2) {
    pairs.push([cells[i], cells[i + 1] ?? null]);
  }

  return (
    <div className="dark-panel w-full">
      <div className="px-4 py-3 border-b border-[#1e1e1e] flex items-center justify-between">
        <div>
          <span className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-[#555]">Live State</span>
          <span className="text-[9px] text-[#444] font-sans ml-2">pub vs now</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="live-dot" />
          <span className="text-[9px] text-[#31BA7C] font-sans font-medium tracking-wide">LIVE</span>
        </div>
      </div>

      {pairs.map((pair, i) => (
        <div key={i} className="grid grid-cols-2 border-b border-[#1e1e1e] last:border-0">
          {[pair[0], pair[1]].map((cell, j) =>
            cell ? (
              <div key={cell.label} className={`p-3 ${j === 0 ? "border-r border-[#1e1e1e]" : ""}`}>
                <p className="text-[9px] font-sans font-medium tracking-[0.14em] uppercase text-[#555] mb-1">{cell.label}</p>
                <p className={`font-sans text-base font-semibold text-white tabular-nums leading-tight ${
                  cell.label === "Spot Price" && change24h != null && change24h < 0 ? "text-[#FF6477]" : ""
                }`}>
                  {cell.value}
                </p>
                {(cell.sub || cell.badge) && (
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {cell.sub && (
                      <span className={`text-[10px] font-sans leading-tight ${
                        cell.label === "Spot Price" && change24h != null
                          ? change24h >= 0 ? "text-[#31BA7C]" : "text-[#FF6477]"
                          : "text-[#555]"
                      }`}>{cell.sub}</span>
                    )}
                    {cell.badge && <Badge type={cell.badge} />}
                  </div>
                )}
              </div>
            ) : <div key={j} className="p-3" />
          )}
        </div>
      ))}
    </div>
  );
}
