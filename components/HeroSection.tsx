import Link from "next/link";
import type { ProjectConfig } from "@/lib/types";
import type { TreasuryOverview, ProjectOverview } from "@/lib/resolved";

function fmt(n: number | null | undefined, decimals = 2) {
  if (n == null || isNaN(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(decimals)}`;
}

interface KpiBox {
  label: string;
  value: string;
  sub1?: string;
  sub2?: string;
}

interface Props {
  project: ProjectConfig;
  treasury: TreasuryOverview | null;
  projectOverview: ProjectOverview | null;
}

export default function HeroSection({ project, treasury, projectOverview }: Props) {
  const spot = projectOverview?.tokenPrice ? parseFloat(projectOverview.tokenPrice) : null;
  const ico  = projectOverview?.icoPrice ?? null;
  const circ = projectOverview?.circulatingSupply ? parseFloat(projectOverview.circulatingSupply) : null;
  const change24h = projectOverview?.tokenPriceUSDChange24h ? parseFloat(projectOverview.tokenPriceUSDChange24h) : null;

  const marketCap = spot && circ ? spot * circ : null;
  const nav = treasury?.netAssetValue ? parseFloat(treasury.netAssetValue) : null;
  const spotNavMultiple = spot && nav && nav > 0 ? (spot / nav).toFixed(2) : null;
  const spotPremium = spot && nav && nav > 0 ? ((spot / nav - 1) * 100).toFixed(1) : null;
  const treasuryBal = treasury?.totalBalance ? parseFloat(treasury.totalBalance) : null;
  const runway = treasury?.monthOfRunway ? parseFloat(treasury.monthOfRunway).toFixed(1) : null;
  const spendLimit = treasury?.spendingLimit ? parseFloat(treasury.spendingLimit) : null;
  const vsIco = spot && ico ? (((spot - ico) / ico) * 100).toFixed(1) : null;

  const kpis: KpiBox[] = [
    {
      label: "Spot Price",
      value: spot ? `$${spot.toFixed(4)}` : "—",
      sub1: vsIco ? `${Number(vsIco) >= 0 ? "+" : ""}${vsIco}% vs ICO price of $${ico?.toFixed(4)}` : undefined,
      sub2: change24h != null ? `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}% 24h` : undefined,
    },
    {
      label: "Market Cap",
      value: fmt(marketCap),
      sub1: circ ? `${(circ / 1_000_000).toFixed(2)}M circulating` : undefined,
    },
    {
      label: "NAV / Token",
      value: nav ? `$${nav.toFixed(4)}` : "—",
      sub1: spotNavMultiple ? `Spot at ${spotNavMultiple}x NAV` : undefined,
      sub2: spotPremium ? `+${spotPremium}% premium` : undefined,
    },
    {
      label: "Treasury",
      value: fmt(treasuryBal),
      sub1: runway ? `${runway} months runway` : undefined,
      sub2: spendLimit ? `$${(spendLimit / 1000).toFixed(0)}K/mo spend` : undefined,
    },
  ];

  return (
    <section className="pt-12 pb-0">
      {/* Label */}
      <p className="label-caps mb-6">01Resolved Research / Ownership Coin</p>

      {/* Logo + Name */}
      <div className="flex items-center gap-4 mb-3">
        {project.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.logoUrl}
            alt={project.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        )}
        <h1
          className="font-serif font-normal text-black leading-none"
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.02em" }}
        >
          {project.name}
        </h1>
      </div>

      {/* Token info bar */}
      {(project.tokenSymbol || project.icoDate || circ) && (
        <p className="font-sans text-[12px] text-[#999] mb-5 tracking-wide">
          {project.tokenSymbol && <span className="text-black font-medium">${project.tokenSymbol}</span>}
          {circ && <span> · {(circ / 1_000_000).toFixed(2)}M circulating supply</span>}
          {project.icoDate && <span> · ICO {project.icoDate}</span>}
        </p>
      )}

      {/* Tagline */}
      <p
        className="font-serif italic text-[#444] mb-6 leading-snug"
        style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
      >
        {project.tagline}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {project.links.app && (
          <Link href={project.links.app} target="_blank"
            className="inline-flex items-center px-5 py-2.5 bg-black text-white text-[11px] font-sans font-medium tracking-widest uppercase hover:bg-[#222] transition-colors">
            Open App
          </Link>
        )}
        {project.links.docs && (
          <Link href={project.links.docs} target="_blank"
            className="inline-flex items-center px-5 py-2.5 border border-[#C4BFB8] text-black text-[11px] font-sans font-medium tracking-widest uppercase hover:border-black transition-colors">
            Documentation
          </Link>
        )}
        {project.links.resolved && (
          <Link href={project.links.resolved} target="_blank"
            className="inline-flex items-center px-5 py-2.5 border border-[#C4BFB8] text-black text-[11px] font-sans font-medium tracking-widest uppercase hover:border-black transition-colors">
            View on 01Resolved
          </Link>
        )}
      </div>

      {/* 4-KPI boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-[#E2DDD6] mb-10">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`p-5 ${i < kpis.length - 1 ? "border-r border-[#E2DDD6]" : ""}`}
          >
            <p className="label-caps mb-2">{kpi.label}</p>
            <p className="font-sans text-2xl font-semibold text-black tabular-nums mb-1">
              {kpi.value}
            </p>
            {kpi.sub1 && (
              <p className="font-sans text-[11px] text-[#6B6660] leading-snug">{kpi.sub1}</p>
            )}
            {kpi.sub2 && (
              <p className={`font-sans text-[11px] leading-snug ${
                kpi.label === "Spot Price" && change24h != null
                  ? change24h >= 0 ? "text-[#31BA7C]" : "text-[#FF6477]"
                  : "text-[#6B6660]"
              }`}>{kpi.sub2}</p>
            )}
          </div>
        ))}
      </div>

      {/* Coverage note */}
      <div className="border border-[#E2DDD6] p-4 bg-[#FAF7F2] mb-2">
        <p className="font-sans text-[11px] text-[#6B6660] leading-relaxed">
          <strong className="text-black font-medium">Coverage note —</strong>{" "}
          Some financial workflow activity may be private by design. Metrics are labeled by observability:{" "}
          <em>Onchain verified</em>, <em>Company disclosed</em>, <em>Analyst model</em>, or <em>Operator-stated</em>.
        </p>
      </div>
    </section>
  );
}
