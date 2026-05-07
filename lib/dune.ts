import type { DuneResult } from "./types";

const BASE = "https://api.dune.com/api/v1";

function headers() {
  return {
    "x-dune-api-key": process.env.DUNE_API_KEY ?? "",
  };
}

/** Fetch cached results for a query — no credits consumed. */
export async function getDuneResults<T = Record<string, unknown>>(
  queryId: number,
  limit = 1000
): Promise<DuneResult<T> | null> {
  try {
    const res = await fetch(
      `${BASE}/query/${queryId}/results?limit=${limit}`,
      {
        headers: headers(),
        next: { revalidate: 7200 }, // match Dune's 2h refresh
      }
    );
    if (!res.ok) {
      console.error(`Dune ${queryId}: ${res.status} ${res.statusText}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`Dune ${queryId} fetch error:`, err);
    return null;
  }
}

/** Pull rows from multiple query IDs in parallel. */
export async function getMultipleDuneResults(
  queries: Record<string, number | undefined>
): Promise<Record<string, unknown[] | null>> {
  const entries = Object.entries(queries).filter(
    (e): e is [string, number] => typeof e[1] === "number"
  );

  const results = await Promise.all(
    entries.map(async ([key, id]) => {
      const data = await getDuneResults(id);
      return [key, data?.result?.rows ?? null] as const;
    })
  );

  return Object.fromEntries(results);
}

// ─── Convenience parsers ───────────────────────────────────────────────────

/** Extract the latest single-value row (for KPI counters). */
export function latestRow<T>(rows: T[] | null | undefined): T | null {
  if (!rows || rows.length === 0) return null;
  return rows[rows.length - 1];
}

export function firstRow<T>(rows: T[] | null | undefined): T | null {
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

/** Format USD values compactly: $1.04M, $684K, $136 */
export function fmtUsd(value: number | string | null | undefined): string {
  if (value == null) return "—";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function fmtNum(value: number | string | null | undefined): string {
  if (value == null) return "—";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
