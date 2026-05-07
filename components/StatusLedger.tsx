import { fmtUsd } from "@/lib/dune";
import type { ProjectOverview, TreasuryOverview, Proposal } from "@/lib/resolved";

interface Props {
  project:   ProjectOverview  | null;
  treasury:  TreasuryOverview | null;
  proposals: Proposal[]       | null;
}

export default function StatusLedger({ project, treasury, proposals }: Props) {
  const spot      = project?.tokenPrice            ? parseFloat(project.tokenPrice)             : null;
  const change24h = project?.tokenPriceUSDChange24h ? parseFloat(project.tokenPriceUSDChange24h) : null;
  const runway    = treasury?.monthOfRunway         ? parseFloat(treasury.monthOfRunway)          : null;
  const active    = proposals?.filter(p => p.status === "live" || p.status === "lived").length ?? 0;
  const total     = proposals?.length ?? 0;

  const cells = [
    {
      label: "Spot Price",
      value: spot ? `$${spot.toFixed(4)}` : "—",
      sub:   change24h != null ? `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}% 24h` : undefined,
      up:    change24h != null ? change24h >= 0 : undefined,
      badge: "ONCHAIN" as const,
    },
    {
      label: "Treasury Balance",
      value: fmtUsd(treasury?.totalBalance),
      sub:   runway ? `~${runway.toFixed(0)} mo runway` : undefined,
      badge: "ONCHAIN" as const,
    },
    {
      label: "Governance",
      value: active > 0 ? `${active} active` : `${total} proposals`,
      sub:   active > 0 ? "vote in progress" : "all resolved",
      badge: active > 0 ? "LIVE" as const : "ONCHAIN" as const,
    },
    {
      label: "Coverage",
      value: "v1.0",
      sub:   "Updated May 2026",
      badge: "DISCLOSED" as const,
    },
  ];

  const badgeCls: Record<string, string> = {
    ONCHAIN:   "border-[#31BA7C] text-[#31BA7C]",
    LIVE:      "border-[#31BA7C] text-[#31BA7C]",
    DISCLOSED: "border-[#D4B596] text-[#D4B596]",
  };

  return (
    <section id="ledger" className="border-t border-b border-[#E2DDD6] scroll-mt-20">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {cells.map((cell, i) => (
          <div
            key={cell.label}
            className={`px-5 py-5 ${i < cells.length - 1 ? "border-r border-[#E2DDD6]" : ""}`}
          >
            <p className="label-caps mb-2">{cell.label}</p>
            <div className="flex items-baseline gap-1.5">
              <p className={`font-sans text-[22px] font-semibold tabular-nums leading-none ${
                cell.label === "Spot Price" && change24h != null && change24h < 0
                  ? "text-[#FF6477]" : "text-black"
              }`}>
                {cell.value}
              </p>
              {cell.up != null && (
                <span className={cell.up ? "text-[#31BA7C] text-[13px]" : "text-[#FF6477] text-[13px]"}>
                  {cell.up ? "↑" : "↓"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              {cell.sub && (
                <span className={`font-sans text-[11px] ${
                  cell.label === "Spot Price" && change24h != null
                    ? change24h >= 0 ? "text-[#31BA7C]" : "text-[#FF6477]"
                    : "text-[#6B6660]"
                }`}>{cell.sub}</span>
              )}
              <span className={`text-[8px] font-sans font-semibold tracking-widest uppercase border px-1.5 py-0.5 ${badgeCls[cell.badge]}`}>
                {cell.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
