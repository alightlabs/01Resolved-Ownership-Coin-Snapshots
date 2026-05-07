import omnipair from "@/projects/omnipair";
import { getDuneResults, fmtUsd } from "@/lib/dune";
import {
  getTreasuryOverview,
  getAssetBreakdown,
  getProposals,
  getProjectOverview,
  getTotalRevenue,
} from "@/lib/resolved";
import type { TvlRow, VolumeRow, FeesRow, PoolRow } from "@/lib/types";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LiveStateCard from "@/components/LiveStateCard";
import ProtocolSummary from "@/components/ProtocolSummary";
import TractionTable from "@/components/TractionTable";
import TreasurySection from "@/components/TreasurySection";
import TopPoolsTable from "@/components/TopPoolsTable";
import GovernanceSection from "@/components/GovernanceSection";
import Footer from "@/components/Footer";

export const revalidate = 7200;

export default async function Home() {
  const project = omnipair;
  const { dune, resolved } = project;

  const [
    tvlResult,
    volumeResult,
    feesResult,
    poolsResult,
    treasuryOverview,
    assetBreakdown,
    proposals,
    projectOverview,
    totalRevenueData,
  ] = await Promise.all([
    dune ? getDuneResults<TvlRow>(dune.queries.tvl!) : null,
    dune ? getDuneResults<VolumeRow>(dune.queries.volume!) : null,
    dune ? getDuneResults<FeesRow>(dune.queries.fees!) : null,
    dune ? getDuneResults<PoolRow>(dune.queries.topPools!) : null,
    resolved ? getTreasuryOverview(resolved.slug) : null,
    resolved ? getAssetBreakdown(resolved.slug) : null,
    resolved ? getProposals(resolved.slug, 5) : null,
    resolved ? getProjectOverview(resolved.slug) : null,
    resolved ? getTotalRevenue(resolved.slug) : null,
  ]);

  const tvlRows    = tvlResult?.result?.rows ?? null;
  const volumeRows = volumeResult?.result?.rows ?? null;
  const feesRows   = feesResult?.result?.rows ?? null;
  const poolRows   = poolsResult?.result?.rows ?? null;

  // Derive Dune KPIs for Live State card
  const lastTvlRow = tvlRows?.find(r => r.token === "All" || !r.token) ?? tvlRows?.at(-1);
  const allVolRow  = volumeRows?.find(r => r.token === "All" || !r.token);
  const lastVolRow = volumeRows?.at(-1);

  const tvlKpi          = fmtUsd(lastTvlRow?.tvl ?? lastTvlRow?.total_tvl ?? null);
  const alltimeVolKpi   = fmtUsd(allVolRow?.cum_volume ?? lastVolRow?.cum_volume ?? null);

  const totalRevenue = totalRevenueData?.totalRevenue ?? null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F0E8]">
      <Header project={project} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6">

        {/* ── Hero: two-column ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16">
          <HeroSection project={project} />
          <aside className="hidden lg:block pt-16">
            <div className="sticky top-20">
              <LiveStateCard
                treasury={treasuryOverview}
                project={projectOverview}
                duneKpis={{ tvl: tvlKpi, alltimeVolume: alltimeVolKpi }}
              />
            </div>
          </aside>
        </div>

        {/* Live State — mobile */}
        <div className="lg:hidden mb-10">
          <LiveStateCard
            treasury={treasuryOverview}
            project={projectOverview}
            duneKpis={{ tvl: tvlKpi, alltimeVolume: alltimeVolKpi }}
          />
        </div>

        {/* ── Protocol Summary ── */}
        <ProtocolSummary project={project} />

        {/* ── Traction + Treasury: two-column ── */}
        <section className="py-14 border-t border-[#E2DDD6]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
            {/* Left: traction stats */}
            <div>
              {dune && (
                <TractionTable
                  tvlRows={tvlRows as TvlRow[] | null}
                  volumeRows={volumeRows as VolumeRow[] | null}
                  feesRows={feesRows as FeesRow[] | null}
                  poolRows={poolRows as PoolRow[] | null}
                />
              )}
            </div>

            {/* Right: treasury intelligence */}
            <div>
              {resolved && (
                <TreasurySection
                  overview={treasuryOverview}
                  assets={assetBreakdown}
                  totalRevenue={totalRevenue}
                />
              )}
            </div>
          </div>
        </section>

        {/* ── Top Pools ── */}
        {dune && poolRows && poolRows.length > 0 && (
          <section className="py-14 border-t border-[#E2DDD6]">
            <p className="label-caps mb-2">Protocol Aggregation</p>
            <h2
              className="font-serif text-black mb-6"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
            >
              Top Pools
            </h2>
            <TopPoolsTable rows={poolRows as PoolRow[] | null} />
          </section>
        )}

        {/* ── Governance ── */}
        {resolved && (
          <GovernanceSection proposals={proposals} />
        )}

      </main>

      <Footer project={project} />
    </div>
  );
}
