import type { Proposal } from "@/lib/resolved";
import { format, parseISO } from "date-fns";

function statusLabel(p: Proposal) {
  if (p.status === "live" || p.status === "lived") return { text: "LIVE", cls: "text-[#31BA7C] bg-[#1a3a2a]" };
  if (p.result === "approved") return { text: "PASSED", cls: "text-[#31BA7C] bg-[#1a3a2a]" };
  if (p.result === "rejected") return { text: "FAILED", cls: "text-[#FF6477] bg-[#2a1018]" };
  return { text: "RESOLVED", cls: "text-[#999] bg-[#1a1a1a]" };
}

function fmtDate(d: string) {
  try { return format(parseISO(d), "MMM d, yyyy"); }
  catch { return d; }
}

function tilt(pct: string) {
  const n = parseFloat(pct);
  if (isNaN(n)) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export default function GovernanceSection({ proposals }: { proposals: Proposal[] | null }) {
  if (!proposals || proposals.length === 0) {
    return (
      <div className="border border-dashed border-[#E2DDD6] p-8 text-center text-[13px] text-[#999] font-sans">
        No governance data
      </div>
    );
  }

  return (
    <section className="py-14 border-t border-[#E2DDD6]">
      <p className="label-caps mb-2">Governance</p>
      <h2
        className="font-serif text-black mb-8"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
      >
        Decision Markets
      </h2>

      <div className="border border-[#E2DDD6] divide-y divide-[#E2DDD6]">
        {proposals.map((p) => {
          const { text, cls } = statusLabel(p);
          const margin = parseFloat(p.twapThresholdMargin ?? "0");
          const positive = margin >= 0;

          return (
            <div key={p.id} className="px-5 py-4 flex items-start justify-between gap-6 hover:bg-[#FAF7F2] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[9px] font-sans font-semibold tracking-widest uppercase px-1.5 py-0.5 ${cls}`}>
                    {text}
                  </span>
                  <span className="label-caps">{fmtDate(p.endDate)}</span>
                </div>
                <p className="font-sans text-[14px] font-medium text-black leading-snug">{p.title}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="label-caps">{p.totalUniqueTraders} traders</span>
                  <span className="label-caps">{p.totalTrade} trades</span>
                </div>
              </div>

              {/* TWAP margin */}
              <div className="text-right shrink-0">
                <p className="label-caps mb-0.5">TWAP margin</p>
                <p className={`font-sans text-[15px] font-semibold tabular-nums ${positive ? "pos" : "neg"}`}>
                  {positive ? "+" : ""}{margin.toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
