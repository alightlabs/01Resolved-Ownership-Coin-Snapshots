import { fmtUsd } from "@/lib/dune";
import { format, parseISO } from "date-fns";
import type { TreasuryOverview, AssetBreakdown, Movement } from "@/lib/resolved";

interface StatRow { label: string; value: string; badge?: string; highlight?: boolean; }

function Badge({ type }: { type?: string }) {
  if (!type) return null;
  const s: Record<string, string> = {
    ONCHAIN:   "bg-[#1a3a2a] text-[#31BA7C]",
    MODEL:     "bg-[#1a1a2e] text-[#7070cc]",
    DISCLOSED: "bg-[#2a1a10] text-[#D4B596]",
  };
  return <span className={`text-[9px] font-sans font-semibold tracking-widest uppercase px-1.5 py-0.5 ${s[type] ?? ""}`}>{type}</span>;
}

interface Props {
  overview: TreasuryOverview | null;
  assets:   AssetBreakdown  | null;
  movements: Movement[]     | null;
  totalRevenue: string      | null;
}

export default function FinancialCore({ overview, assets, movements, totalRevenue }: Props) {
  const spot       = overview?.baseMintCurrentPrice ? parseFloat(overview.baseMintCurrentPrice) : null;
  const nav        = overview?.netAssetValue        ? parseFloat(overview.netAssetValue)        : null;
  const runway     = overview?.monthOfRunway        ? parseFloat(overview.monthOfRunway)        : null;
  const spend      = overview?.spendingLimit        ? parseFloat(overview.spendingLimit)        : null;
  const mainCat    = assets?.categories.find(c => c.name === "Main");
  const lpCat      = assets?.categories.find(c => c.name === "LPPositions");
  const spotNav    = spot && nav && nav > 0 ? (spot / nav).toFixed(2) : null;
  const premium    = spot && nav && nav > 0 ? ((spot / nav - 1) * 100).toFixed(1) : null;

  const rows: StatRow[] = [
    { label: "Total Treasury Value",  value: fmtUsd(overview?.totalBalance),        badge: "ONCHAIN" },
    { label: "DAO Main Wallet",       value: fmtUsd(mainCat?.value),                badge: "ONCHAIN" },
    ...(lpCat ? [{ label: "LP Positions", value: fmtUsd(lpCat.value),              badge: "ONCHAIN" as const }] : []),
    { label: "Monthly Spend Limit",   value: spend ? fmtUsd(spend) : "—",           badge: "DISCLOSED" },
    { label: "Remaining Runway",      value: runway ? `~${runway.toFixed(1)} months` : "—", badge: "MODEL" },
    { label: "NAV per Token",         value: nav ? `$${nav.toFixed(4)}` : "—",      badge: "MODEL", highlight: true },
    { label: "Spot Price",            value: spot ? `$${spot.toFixed(4)}` : "—",    badge: "ONCHAIN" },
    { label: "Spot / NAV Multiple",   value: spotNav ? `${spotNav}×` : "—" },
    { label: "Spot Premium to NAV",   value: premium ? `+${premium}%` : "—" },
    { label: "All-Time DAO Revenue",  value: fmtUsd(totalRevenue) },
  ];

  return (
    <section id="financial" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Financial Core
        </h2>
        <span className="label-caps">Section 06 / Treasury Intelligence</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left: stat rows */}
        <div className="dark-panel">
          <div className="px-4 py-3 border-b border-[#1e1e1e] flex items-center justify-between">
            <span className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-[#555]">Treasury Intelligence</span>
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="text-[9px] text-[#31BA7C] font-sans font-medium tracking-wide">LIVE</span>
            </div>
          </div>
          <div className="px-4">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3 border-b border-[#1e1e1e] last:border-0">
                <span className="text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-[#555]">{row.label}</span>
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

        {/* Right: recent movements */}
        <div>
          <p className="label-caps mb-3">Recent Treasury Activity</p>
          {!movements || movements.length === 0 ? (
            <div className="border border-dashed border-[#E2DDD6] p-5 text-center text-[12px] text-[#999] font-sans">
              No movement data
            </div>
          ) : (
            <div className="border border-[#E2DDD6] divide-y divide-[#E2DDD6]">
              {movements.slice(0, 6).map((m) => {
                const val = typeof m.totalValue === "number" ? fmtUsd(m.totalValue) : "—";
                const ts  = m.timestamp ? (() => { try { return format(parseISO(m.timestamp), "MMM d"); } catch { return ""; } })() : "";
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
      </div>
    </section>
  );
}
