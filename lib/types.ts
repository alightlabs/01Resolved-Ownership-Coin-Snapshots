// ─── Project Configuration ─────────────────────────────────────────────────

export interface ProjectLink {
  label: string;
  href: string;
}

export interface DuneQueryMap {
  /** Query returning TVL, totalDeposits fields */
  tvl?: number;
  /** Query returning dexVolume, dailyVolume, trades, traders fields */
  volume?: number;
  /** Query returning totalBorrows by token */
  borrows?: number;
  /** Query returning lendingFees, dexFees fields */
  fees?: number;
  /** Query returning top pools table rows */
  topPools?: number;
  /** Query returning liquidation events */
  liquidations?: number;
  /** Query returning volume/trades/traders by pair */
  byPair?: number;
}

export interface ProjectConfig {
  // Identity
  name: string;
  slug: string;          // matches 01Resolved slug
  tagline: string;
  description: string;
  tags: string[];

  // Links shown in hero CTAs and header
  links: {
    app?: string;
    docs?: string;
    github?: string;
    twitter?: string;
    telegram?: string;
    resolved?: string;   // full 01Resolved page URL
  };

  // Data sources — both optional so template works for any project
  dune?: {
    dashboardUrl: string;
    queries: DuneQueryMap;
  };

  resolved?: {
    slug: string;        // 01Resolved API slug
  };

  // Protocol summary (static, from docs scrape or manual)
  summary: string;

  // Feature highlights shown below summary
  features?: Array<{ title: string; description: string }>;
}

// ─── API Response Types ────────────────────────────────────────────────────

export interface DuneResult<T = Record<string, unknown>> {
  execution_id: string;
  query_id: number;
  state: string;
  submitted_at: string;
  expires_at: string;
  execution_started_at: string;
  execution_ended_at: string;
  result: {
    rows: T[];
    metadata: {
      column_names: string[];
      result_set_bytes: number;
      total_row_count: number;
    };
  };
  next_offset?: number;
}

export interface TreasuryOverview {
  totalBalance: string;
  netAssetValue: string | null;
  spendingLimit: string;
  monthOfRunway: string | null;
  baseMintCurrentPrice?: string;
}

export interface TreasuryChartPoint {
  timestamp: number;
  totalValue: string;
}

export interface AssetCategory {
  name: string;
  value: string;
  accountCount?: number;
}

export interface ProposalSummary {
  title: string;
  publicKey: string;
  state: string;
  startDate: string;
  endDate: string;
  totalTradeVolume: number;
  netPassVolumeTilt: string;
  twapMargin: number;
}

// ─── Dune Row Shapes ──────────────────────────────────────────────────────

export interface TvlRow {
  date?: string;
  day?: string;
  token?: string;
  tvl?: number;
  total_tvl?: number;
  total_deposits?: number;
  collateral?: number;
  cash_reserves?: number;
}

export interface VolumeRow {
  day?: string;
  date?: string;
  token?: string;
  volume?: number;
  daily_volume?: number;
  cum_volume?: number;
  trades?: number;
  num_trades?: number;
  traders?: number;
  num_traders?: number;
  total_borrows?: number;
  borrows?: number;
}

export interface FeesRow {
  day?: string;
  date?: string;
  dex_fees?: number;
  lending_fees?: number;
  cum_dex_fees?: number;
  cum_lending_fees?: number;
  total_dex_fees?: number;
  total_lending_fees?: number;
}

export interface PoolRow {
  pool?: string;
  pair?: string;
  volume_24h?: number;
  volume_7d?: number;
  outstanding_borrows?: number;
  amm_tvl?: number;
  collateral?: number;
  utilization_rate_0?: number;
  utilization_rate_1?: number;
  tvl?: number;
}

export interface BorrowRow {
  day?: string;
  date?: string;
  token?: string;
  borrows?: number;
  total_borrows?: number;
}

export interface LiquidationRow {
  block_time?: string;
  tx_id?: string;
  liquidator?: string;
  pair?: string;
  collateral?: string;
  amount?: number;
}
