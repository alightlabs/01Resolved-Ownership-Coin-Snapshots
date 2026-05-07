import omnipair from "@/projects/omnipair";
import { getDuneResults, fmtUsd, fmtNum } from "@/lib/dune";
import {
  getTreasuryOverview,
  getTreasuryChart,
  getAssetBreakdown,
} from "@/lib/resolved";
import type {
  TvlRow,
  VolumeRow,
  FeesRow,
  PoolRow,
  LiquidationRow,
} from "@/lib/types";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LiveStateCard from "@/components/LiveStateCard";
import ProtocolSummary from "@/components/ProtocolSummary";
import GrowthMetrics from "@/components/GrowthMetrics";
import TopPoolsTable from "@/components/TopPoolsTable";
import TreasurySection from "@/components/TreasurySection";
import LiquidationTable from "@/components/LiquidationTable";
import Footer from "@/components/Footer";

export const revalidate = 7200; // ISR: refresh every 2 hours

export default async function Home() {
  const project = omnipair;
  const { dune, resolved } = project;

  // ─── Fetch all data in parallel ─────────────────────────────
  const [
    tvlResult,
    volumeResult,
    borrowsResult,
    feesResult,
    poolsResult,
    liquidationsResult,
    treasuryOverview,
    treasuryChart,
    assetBreakdown,
  ] = await Promise.all([
    dune ? getDuneResults<TvlRow>(dune.queries.tvl!) : null,
    dune ? getDuneResults<VolumeRow>(dune.queries.volume!) : null,
    dune ? getDuneResults<VolumeRow>(dune.queries.borrows!) : null,
    dune ? getDuneResults<FeesRow>(dune.queries.fees!) : null,
    dune ? getDuneResults<PoolRow>(dune.queries.topPools!) : null,
    dune ? getDuneResults<LiquidationRow>(dune.queries.liquidations!) : null,
    resolved ? getTreasuryOverview(resolved.slug) : null,
    resolved ? getTreasuryChart(resolved.slug) : null,
    resolved ? getAssetBreakdown(resolved.slug) : null,
  ]);

  const tvlRows = tvlResult?.result?.rows ?? null;
  const volumeRows = volumeResult?.result?.rows ?? null;
  const feesRows = feesResult?.result?.rows ?? null;
  const poolRows = poolsResult?.result?.rows ?? null;
  const liquidationRows = liquidationsResult?.result?.rows ?? null;

  // ─── Derive KPIs from raw rows ───────────────────────────────
  // TVL query — find the most-recent total row
  const lastTvl = tvlRows?.findLast?.((r) => r.token === "All" || !r.token);
  const tvlKpi = fmtUsd(lastTvl?.tvl ?? lastTvl?.total_tvl ?? null);
  const depositsKpi = fmtUsd(lastTvl?.total_deposits ?? null);

  // Volume query — find the "All" summary row for cumulative values
  const allVolRow = volumeRows?.find?.((r) => r.token === "All" || !r.token);
  const lastVolRow = volumeRows?.[volumeRows.length - 1];
  const alltimeVolKpi = fmtUsd(allVolRow?.cum_volume ?? lastVolRow?.cum_volume ?? null);
  const vol24hKpi = fmtUsd(lastVolRow?.volume ?? lastVolRow?.daily_volume ?? null);

  // Borrows
  const borrowRows = borrowsResult?.result?.rows ?? null;
  const lastBorrow = borrowRows?.findLast?.((r) => r.token === "All" || !r.token);
  const borrowsKpi = fmtUsd(lastBorrow?.total_borrows ?? lastBorrow?.borrows ?? null);

  // Fees
  const lastFeeRow = feesRows?.[feesRows.length - 1];
  const totalDexFeesKpi = fmtUsd(lastFeeRow?.cum_dex_fees ?? lastFeeRow?.total_dex_fees ?? null);
  const totalLendingFeesKpi = fmtUsd(lastFeeRow?.cum_lending_fees ?? lastFeeRow?.total_lending_fees ?? null);

  const hasDune = !!dune && !!process.env.DUNE_API_KEY;
  const hasResolved = !!resolved && !!process.env.RESOLVED_API_KEY;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F0E8]">
      <Header project={project} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6">
        {/* ── Hero: two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16">
          <HeroSection project={project} />

          {/* Live State card — sticky on desktop */}
          <aside className="hidden lg:block pt-16">
            <div className="sticky top-20">
              <LiveStateCard
                treasury={treasuryOverview}
                duneKpis={{
                  tvl: tvlKpi,
                  totalDeposits: depositsKpi,
                  totalBorrows: borrowsKpi,
                  alltimeVolume: alltimeVolKpi,
                  volume24h: vol24hKpi,
                  totalDexFees: totalDexFeesKpi,
                  totalLendingFees: totalLendingFeesKpi,
                }}
                hasDune={hasDune}
                hasResolved={hasResolved}
              />
            </div>
          </aside>
        </div>

        {/* Live State card — mobile (below hero) */}
        <div className="lg:hidden mb-10">
          <LiveStateCard
            treasury={treasuryOverview}
            duneKpis={{
              tvl: tvlKpi,
              totalDeposits: depositsKpi,
              totalBorrows: borrowsKpi,
              alltimeVolume: alltimeVolKpi,
              volume24h: vol24hKpi,
              totalDexFees: totalDexFeesKpi,
              totalLendingFees: totalLendingFeesKpi,
            }}
            hasDune={hasDune}
            hasResolved={hasResolved}
          />
        </div>

        {/* ── Protocol Summary ── */}
        <ProtocolSummary project={project} />

        {/* ── Growth Metrics (Dune) ── */}
        {dune && (
          <GrowthMetrics
            tvlRows={tvlRows as TvlRow[] | null}
            volumeRows={volumeRows as VolumeRow[] | null}
            feesRows={feesRows as FeesRow[] | null}
          />
        )}

        {/* ── Top Pools table ── */}
        {dune && (
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

        {/* ── Treasury Intelligence (01Resolved) ── */}
        {resolved && (
          <TreasurySection
            overview={treasuryOverview}
            chart={treasuryChart}
            assets={assetBreakdown}
          />
        )}

        {/* ── Liquidation Events ── */}
        {dune && (
          <section className="py-14 border-t border-[#E2DDD6]">
            <p className="label-caps mb-2">Risk</p>
            <h2
              className="font-serif text-black mb-6"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
            >
              Liquidation Events
            </h2>
            <LiquidationTable rows={liquidationRows as LiquidationRow[] | null} />
          </section>
        )}
      </main>

      <Footer project={project} />
    </div>
  );
}
