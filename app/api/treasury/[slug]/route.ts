import { NextRequest, NextResponse } from "next/server";
import {
  getTreasuryOverview,
  getTreasuryChart,
  getAssetBreakdown,
  getProposals,
  getTotalRevenue,
  getTotalExpense,
} from "@/lib/resolved";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [overview, chart, assets, proposals, revenue, expense] =
    await Promise.all([
      getTreasuryOverview(slug),
      getTreasuryChart(slug, "day"),
      getAssetBreakdown(slug),
      getProposals(slug, 5),
      getTotalRevenue(slug),
      getTotalExpense(slug),
    ]);

  return NextResponse.json(
    { overview, chart, assets, proposals, revenue, expense },
    {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=1800" },
    }
  );
}
