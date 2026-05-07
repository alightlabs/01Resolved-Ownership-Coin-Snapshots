import type { LiquidationRow } from "@/lib/types";
import { format, parseISO } from "date-fns";

function fmt(dateStr: string | undefined) {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy HH:mm");
  } catch {
    return dateStr;
  }
}

function shortAddr(addr: string | undefined) {
  if (!addr) return "—";
  return `${addr.slice(0, 5)}…${addr.slice(-5)}`;
}

export default function LiquidationTable({ rows }: { rows: LiquidationRow[] | null }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="border border-dashed border-[#E2DDD6] p-8 text-center text-[13px] text-[#999] font-sans">
        No liquidation data — add Dune API key
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#E2DDD6]">
      <table className="w-full data-table text-left">
        <thead className="bg-[#FAF7F2]">
          <tr>
            <th>Time</th>
            <th>Pair</th>
            <th>Collateral</th>
            <th>Liquidator</th>
            <th>Tx</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.slice(0, 10).map((row, i) => (
            <tr key={i} className="hover:bg-[#FAF7F2] transition-colors">
              <td className="text-[#6B6660]">{fmt(row.block_time)}</td>
              <td className="font-medium text-black">{row.pair ?? "—"}</td>
              <td>{row.collateral ?? "—"}</td>
              <td className="font-mono text-[11px] text-[#6B6660]">
                {shortAddr(row.liquidator)}
              </td>
              <td className="font-mono text-[11px]">
                {row.tx_id ? (
                  <a
                    href={`https://solscan.io/tx/${row.tx_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4a90d9] hover:underline"
                  >
                    {shortAddr(row.tx_id)}
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
