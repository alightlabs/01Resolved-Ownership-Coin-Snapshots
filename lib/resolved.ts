import type {
  TreasuryOverview,
  TreasuryChartPoint,
  AssetCategory,
  ProposalSummary,
} from "./types";

const BASE = "https://api.01resolved.com/v1";

function headers() {
  return {
    "x-api-key": process.env.RESOLVED_API_KEY ?? "",
    "Content-Type": "application/json",
  };
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: headers(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`01Resolved ${path}: ${res.status} ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    return json.data as T;
  } catch (err) {
    console.error(`01Resolved ${path} error:`, err);
    return null;
  }
}

export async function getTreasuryOverview(
  slug: string
): Promise<TreasuryOverview | null> {
  return get<TreasuryOverview>(`/dao/treasury/overview?slug=${slug}`);
}

export async function getTreasuryChart(
  slug: string,
  interval: "day" | "week" | "month" = "day"
): Promise<TreasuryChartPoint[] | null> {
  return get<TreasuryChartPoint[]>(
    `/dao/treasury/chart?slug=${slug}&interval=${interval}`
  );
}

export async function getAssetBreakdown(
  slug: string
): Promise<{ totalValue: string; categories: AssetCategory[] } | null> {
  return get(`/dao/asset-allocation-breakdown?slug=${slug}`);
}

export async function getProposals(
  slug: string,
  limit = 5
): Promise<{ items: ProposalSummary[] } | null> {
  return get(`/proposal?slug=${slug}&limit=${limit}&sortBy=startDate&sortOrder=desc`);
}

export async function getDaoOverview(slug: string) {
  return get(`/dao/overview?slug=${slug}`);
}

export async function getRevenues(
  slug: string,
  interval: "month" | "quarter" = "month"
) {
  return get(`/dao/revenues?slug=${slug}&interval=${interval}`);
}

export async function getTotalRevenue(slug: string) {
  return get<{ totalRevenue: string }>(`/dao/total-revenue?slug=${slug}`);
}

export async function getTotalExpense(slug: string) {
  return get<{ totalExpense: string }>(`/dao/total-expense?slug=${slug}`);
}
