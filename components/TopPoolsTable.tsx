import type { PoolRow } from "@/lib/types";
import { fmtUsd } from "@/lib/dune";

function pct(v: number | undefined) {
  if (v == null || isNaN(v)) return "—";
  return `${(v * 100).toFixed(1)}%`;
}

function usd(v: number | undefined | null) {
  if (v == null) return "—";
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return isNaN(n) ? "—" : fmtUsd(n);
}

export default function TopPoolsTable({ rows }: { rows: PoolRow[] | null }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="border border-dashed border-[#E2DDD6] p-8 text-center text-[13px] text-[#999] font-sans">
        No pool data — add Dune API key
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#E2DDD6]">
      <table className="w-full data-table text-left">
        <thead className="bg-[#FAF7F2]">
          <tr>
            <th>#</th>
            <th>Pool</th>
            <th>24hr Volume</th>
            <th>7d Volume</th>
            <th>Outstanding Borrows</th>
            <th>AMM TVL</th>
            <th>Collateral</th>
            <th>Util Rate</th>
            <th>TVL</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((row, i) => {
            const borrows = Number(row.outstanding_borrows ?? 0);
            return (
              <tr key={i} className="hover:bg-[#FAF7F2] transition-colors">
                <td className="text-[#999]">{i + 1}</td>
                <td className="font-medium text-black">{row.pool ?? row.pair ?? "—"}</td>
                <td>{usd(row.volume_24h)}</td>
                <td>{usd(row.volume_7d)}</td>
                <td className={borrows < 0 ? "neg" : ""}>
                  {usd(row.outstanding_borrows)}
                </td>
                <td className="text-[#31BA7C]">{usd(row.amm_tvl)}</td>
                <td className="text-[#31BA7C]">{usd(row.collateral)}</td>
                <td>{pct(row.utilization_rate_1)}</td>
                <td className="font-medium text-[#31BA7C]">{usd(row.tvl)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
