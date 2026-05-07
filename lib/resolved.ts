const BASE = "https://01resolved.var-meta.com/api/v1";

function headers() {
  return { "x-api-key": process.env.RESOLVED_API_KEY ?? "" };
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: headers(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`01R ${path}: ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json.data as T;
  } catch (err) {
    console.error(`01R ${path} error:`, err);
    return null;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface TreasuryOverview {
  baseMintCurrentPrice: string;
  totalBalance: string;
  netAssetValue: string | null;
  spendingLimit: string;
  monthOfRunway: string | null;
}

export interface AssetAccount {
  name: string;
  address: string;
  value: string;
}

export interface AssetToken {
  symbol: string;
  amount: string;
  value: string;
  url: string;
}

export interface AssetCategory {
  name: string;
  value: string;
  accountCount: number;
  accounts: AssetAccount[];
  tokens: AssetToken[];
}

export interface AssetBreakdown {
  totalValue: string;
  categories: AssetCategory[];
}

export interface Proposal {
  id: number;
  title: string;
  publicKey: string;
  creationDate: string;
  endDate: string;
  totalTrade: number;
  totalTradeVolume: string;
  totalUniqueTraders: number;
  result: string;
  status: string;
  netPassVolumeTilt: string;
  twapThresholdMargin: string;
  organizationSlug: string;
}

export interface ProjectOverview {
  tokenSymbol: string;
  tokenPrice: string;
  tokenPriceUSDChange24h: string;
  circulatingSupply: string;
  totalSupply: string;
  icoPrice: number;
  projectDescription: string;
  projectSubDescription: string;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────

export async function getTreasuryOverview(slug: string) {
  return get<TreasuryOverview>(`/dao/treasury/overview?slug=${slug}`);
}

export async function getAssetBreakdown(slug: string) {
  return get<AssetBreakdown>(`/dao/list-asset-allocation-breakdown?slug=${slug}`);
}

export async function getProposals(slug: string, limit = 5) {
  // API returns array directly in data
  const raw = await get<Proposal[]>(`/proposal?slug=${slug}&limit=${limit}&sortBy=startDate&sortOrder=desc`);
  return raw;
}

export async function getProjectOverview(slug: string) {
  return get<ProjectOverview>(`/project-overview?slug=${slug}`);
}

export async function getTotalRevenue(slug: string) {
  return get<{ totalRevenue: string }>(`/dao/total-revenue?slug=${slug}`);
}

export async function getTotalExpense(slug: string) {
  return get<{ totalExpense: string }>(`/dao/total-expense?slug=${slug}`);
}
