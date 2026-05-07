import type { ProjectConfig } from "@/lib/types";
import type { ProjectOverview } from "@/lib/resolved";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
}

interface Props {
  project: ProjectConfig;
  overview: ProjectOverview | null;
}

export default function TokenSnapshot({ project, overview }: Props) {
  const spot = overview?.tokenPrice ? parseFloat(overview.tokenPrice) : null;
  const ico  = overview?.icoPrice ?? null;
  const vsIco = spot && ico ? (((spot - ico) / ico) * 100).toFixed(0) : null;
  const supply = overview?.totalSupply
    ? `${(parseFloat(overview.totalSupply) / 1_000_000).toFixed(1)}M`
    : "—";

  const cols = [
    { label: "Ticker",          value: project.tokenSymbol ?? "—",           sub: "SPL · Solana" },
    { label: "ICO Price",       value: ico ? `$${ico.toFixed(4)}` : "—",     sub: "01Resolved launchpad" },
    { label: "Current Price",   value: spot ? `$${spot.toFixed(4)}` : "—",  sub: vsIco ? `+${vsIco}% vs ICO` : undefined },
    { label: "Total Supply",    value: supply,                                sub: "fully diluted" },
    { label: "Liquidity Venue", value: "Omnipair AMM",                       sub: "primary depth pool" },
  ];

  return (
    <section id="snapshot" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Token Snapshot
        </h2>
        <span className="label-caps">Section 02 / Minimum Numeric Context</span>
      </div>

      {/* Table */}
      <div className="border border-[#E2DDD6] mt-6">
        <div className="grid grid-cols-5">
          {cols.map((col, i) => (
            <div
              key={col.label}
              className={`p-4 ${i < cols.length - 1 ? "border-r border-[#E2DDD6]" : ""}`}
            >
              <p className="label-caps mb-2">{col.label}</p>
              <p className="font-sans text-[15px] font-semibold text-black">{col.value}</p>
              {col.sub && <p className="font-sans text-[11px] text-[#999] mt-0.5">{col.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Contract bar */}
      <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-[#999]">
        <span className="label-caps text-[#C4BFB8]">Contract</span>
        <span className="text-[#6B6660]">omfgRBnxHsNJh6YeGbGAmWenNkenzsXyBXm3WDhmeta</span>
        <span className="mx-1 text-[#C4BFB8]">·</span>
        <span>12.00M total supply</span>
        <span className="mx-1 text-[#C4BFB8]">·</span>
        <span>100% circulating</span>
      </div>
    </section>
  );
}
