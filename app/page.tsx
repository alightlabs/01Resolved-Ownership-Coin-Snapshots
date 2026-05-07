import omnipair from "@/projects/omnipair";
import { getDuneResults } from "@/lib/dune";
import {
  getTreasuryOverview,
  getAssetBreakdown,
  getProposals,
  getProjectOverview,
  getTotalRevenue,
  getMovements,
  getProposalAnalytics,
} from "@/lib/resolved";
import type { PoolRow } from "@/lib/types";

import Header           from "@/components/Header";
import TableOfContents  from "@/components/TableOfContents";
import LiveStateCard    from "@/components/LiveStateCard";
import HeroSection      from "@/components/HeroSection";
import TokenSnapshot    from "@/components/TokenSnapshot";
import StatusLedger     from "@/components/StatusLedger";
import ExecutiveSummary from "@/components/ExecutiveSummary";
import ProductSection   from "@/components/ProductSection";
import OwnershipGrid    from "@/components/OwnershipGrid";
import MarketWorkbench  from "@/components/MarketWorkbench";
import CompetitiveSection from "@/components/CompetitiveSection";
import FinancialCore    from "@/components/FinancialCore";
import GovernanceSection from "@/components/GovernanceSection";
import TimelineSection  from "@/components/TimelineSection";
import RiskFactors      from "@/components/RiskFactors";
import Footer           from "@/components/Footer";

export const revalidate = 7200;

interface TvlRow  { day?: string; total_usd?: number; total_deposits_usd?: number; token_symbol?: string; }
interface VolRow  { day?: string; daily_volume?: number; total_volume?: number; twenty_four_volume?: number; cum_trades?: number; num_traders?: number; num_trades?: number; }
interface FeesRow { day?: string; cum_dex_fees?: number; cum_borrows_fees?: number; dex_fees?: number; }
interface LiqRow  { block_time?: string; tx_id?: string; pair?: string; collateral?: string; }

export default async function Home() {
  const project = omnipair;
  const { dune, resolved } = project;

  const [
    tvlResult,
    volumeResult,
    feesResult,
    poolsResult,
    liqResult,
    treasuryOverview,
    assetBreakdown,
    proposals,
    projectOverview,
    totalRevenueData,
    movements,
    proposalAnalytics,
  ] = await Promise.all([
    dune     ? getDuneResults<TvlRow>(dune.queries.tvl!)          : null,
    dune     ? getDuneResults<VolRow>(dune.queries.volume!)        : null,
    dune     ? getDuneResults<FeesRow>(dune.queries.fees!)         : null,
    dune     ? getDuneResults<PoolRow>(dune.queries.topPools!)     : null,
    dune     ? getDuneResults<LiqRow>(dune.queries.liquidations!)  : null,
    resolved ? getTreasuryOverview(resolved.slug)                  : null,
    resolved ? getAssetBreakdown(resolved.slug)                    : null,
    resolved ? getProposals(resolved.slug, 10)                     : null,
    resolved ? getProjectOverview(resolved.slug)                   : null,
    resolved ? getTotalRevenue(resolved.slug)                      : null,
    resolved ? getMovements(resolved.slug, 8)                      : null,
    resolved ? getProposalAnalytics(resolved.slug)                 : null,
  ]);

  const tvlRows    = tvlResult?.result?.rows    ?? null;
  const volumeRows = volumeResult?.result?.rows  ?? null;
  const feesRows   = feesResult?.result?.rows    ?? null;
  const poolRows   = poolsResult?.result?.rows   ?? null;
  const liqRows    = liqResult?.result?.rows     ?? null;
  const totalRevenue = totalRevenueData?.totalRevenue ?? null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F0E8]">
      <Header project={project} />

      <div className="max-w-7xl mx-auto w-full px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_300px] gap-8 lg:gap-10">

          {/* Left: TOC — sticky at grid-item level, top-16 clears the 48px header */}
          <div className="hidden lg:block sticky top-16 self-start pt-14">
            <TableOfContents />
          </div>

          {/* Center: content */}
          <main className="min-w-0">
            <HeroSection project={project} overview={projectOverview} />
            <TokenSnapshot project={project} overview={projectOverview} />

            {resolved && (
              <StatusLedger
                project={projectOverview}
                treasury={treasuryOverview}
                proposals={proposals}
              />
            )}

            <ExecutiveSummary />
            <ProductSection />
            <OwnershipGrid />
            <MarketWorkbench />
            <CompetitiveSection />

            <FinancialCore
              tvlRows={tvlRows as TvlRow[] | null}
              volumeRows={volumeRows as VolRow[] | null}
              feesRows={feesRows as FeesRow[] | null}
              poolRows={poolRows as PoolRow[] | null}
              liqRows={liqRows as LiqRow[] | null}
              overview={treasuryOverview}
              assets={assetBreakdown}
              movements={movements}
              totalRevenue={totalRevenue}
            />

            {resolved && (
              <GovernanceSection
                proposals={proposals}
                analytics={proposalAnalytics}
              />
            )}

            <TimelineSection />
            <RiskFactors />
          </main>

          {/* Right: Live State — sticky at grid-item level, top-16 clears the 48px header */}
          <div className="hidden lg:block sticky top-16 self-start pt-14">
            <div>
              <LiveStateCard
                treasury={treasuryOverview}
                project={projectOverview}
                proposals={proposals}
              />
            </div>
          </div>

        </div>
      </div>

      <Footer project={project} />
    </div>
  );
}
