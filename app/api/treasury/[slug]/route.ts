import { NextRequest, NextResponse } from "next/server";
import {
  getTreasuryOverview,
  getAssetBreakdown,
  getProposals,
  getTotalRevenue,
  getTotalExpense,
  getProjectOverview,
} from "@/lib/resolved";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [overview, assets, proposals, revenue, expense, project] =
    await Promise.all([
      getTreasuryOverview(slug),
      getAssetBreakdown(slug),
      getProposals(slug, 5),
      getTotalRevenue(slug),
      getTotalExpense(slug),
      getProjectOverview(slug),
    ]);

  return NextResponse.json(
    { overview, assets, proposals, revenue, expense, project },
    {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=1800" },
    }
  );
}
