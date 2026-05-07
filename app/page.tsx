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
import ProtocolSummary from "@/components/ProtocolSummary";
import TractionTable from "@/components/TractionTable";
import TreasurySection from "@/components/TreasurySection";
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

  const tvlRows    = tvlResult?.result?.rows    ?? null;
  const volumeRows = volumeResult?.result?.rows  ?? null;
  const feesRows   = feesResult?.result?.rows    ?? null;
  const poolRows   = poolsResult?.result?.rows   ?? null;
  const totalRevenue = totalRevenueData?.totalRevenue ?? null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F0E8]">
      <Header project={project} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6">

        {/* ── Hero: logo, name, token bar, tagline, tags, 4-KPI boxes ── */}
        <HeroSection
          project={project}
          treasury={treasuryOverview}
          projectOverview={projectOverview}
        />

        {/* ── Protocol Summary ── */}
        <ProtocolSummary project={project} />

        {/* ── Traction + Treasury: two-column ── */}
        <section className="py-14 border-t border-[#E2DDD6]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

            <div className="space-y-10">
              {dune && (
                <TractionTable
                  tvlRows={tvlRows as TvlRow[] | null}
                  volumeRows={volumeRows as VolumeRow[] | null}
                  feesRows={feesRows as FeesRow[] | null}
                  poolRows={poolRows as PoolRow[] | null}
                />
              )}
            </div>

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

        {/* ── Governance / Decision Markets ── */}
        {resolved && (
          <GovernanceSection proposals={proposals} />
        )}

      </main>

      <Footer project={project} />
    </div>
  );
}
