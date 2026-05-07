import type { Proposal } from "@/lib/resolved";
import type { ProposalAnalytics } from "@/lib/resolved";
import { format, parseISO } from "date-fns";

function fmtDate(d: string) {
  try { return format(parseISO(d), "MMM d, yyyy"); } catch { return d; }
}

function StatusBadge({ p }: { p: Proposal }) {
  const isLive = p.status === "live" || p.status === "lived";
  if (isLive)               return <span className="text-[9px] font-sans font-semibold tracking-widest uppercase border border-[#31BA7C] text-[#31BA7C] px-1.5 py-0.5">LIVE</span>;
  if (p.result === "approved") return <span className="text-[9px] font-sans font-semibold tracking-widest uppercase border border-[#31BA7C] text-[#31BA7C] px-1.5 py-0.5">PASSED</span>;
  if (p.result === "rejected") return <span className="text-[9px] font-sans font-semibold tracking-widest uppercase border border-[#FF6477] text-[#FF6477] px-1.5 py-0.5">FAILED</span>;
  return <span className="text-[9px] font-sans font-semibold tracking-widest uppercase border border-[#C4BFB8] text-[#999] px-1.5 py-0.5">RESOLVED</span>;
}

function SpreadMeter({ margin }: { margin: number }) {
  const pct     = Math.min(Math.abs(margin), 100);
  const positive = margin >= 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1 bg-[#E2DDD6] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${positive ? "bg-[#31BA7C]" : "bg-[#FF6477]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-sans text-[11px] font-semibold tabular-nums ${positive ? "text-[#31BA7C]" : "text-[#FF6477]"}`}>
        {positive ? "+" : ""}{margin.toFixed(1)}%
      </span>
    </div>
  );
}

interface Props {
  proposals:  Proposal[]          | null;
  analytics?: ProposalAnalytics   | null;
}

export default function GovernanceSection({ proposals, analytics }: Props) {
  if (!proposals || proposals.length === 0) {
    return (
      <section id="governance" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
        <div className="border border-dashed border-[#E2DDD6] p-8 text-center text-[13px] text-[#999] font-sans">
          No governance data
        </div>
      </section>
    );
  }

  const total  = analytics?.totalProposals  ?? proposals.length;
  const passed = analytics?.passedProposals ?? proposals.filter(p => p.result === "approved").length;
  const failed = analytics?.failedProposals ?? proposals.filter(p => p.result === "rejected").length;
  const active = proposals.filter(p => p.status === "live" || p.status === "lived").length;

  const statCells = [
    { label: "Proposed", value: total },
    { label: "Passed",   value: passed,  color: "text-[#31BA7C]" },
    { label: "Failed",   value: failed,  color: "text-[#FF6477]" },
    { label: "Active",   value: active,  color: active > 0 ? "text-[#D4B596]" : undefined },
  ];

  return (
    <section id="governance" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Governance
        </h2>
        <span className="label-caps">Section 10 / Decision Markets</span>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 border border-[#E2DDD6] mb-6">
        {statCells.map((s, i) => (
          <div key={s.label} className={`px-5 py-4 ${i < statCells.length - 1 ? "border-r border-[#E2DDD6]" : ""}`}>
            <p className="label-caps mb-1">{s.label}</p>
            <p className={`font-sans text-[24px] font-semibold tabular-nums leading-none ${s.color ?? "text-black"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Proposal ledger */}
      <div className="border border-[#E2DDD6] divide-y divide-[#E2DDD6]">
        {/* Header */}
        <div className="grid px-5 py-2.5 bg-[#FAF7F2]"
          style={{ gridTemplateColumns: "60px 1fr 120px 100px 140px" }}>
          {["ID", "Title", "Date", "Result", "TWAP Spread"].map(h => (
            <span key={h} className="label-caps">{h}</span>
          ))}
        </div>

        {proposals.map(p => {
          const margin = parseFloat(p.twapThresholdMargin ?? "0");
          return (
            <div
              key={p.id}
              className="grid items-center px-5 py-4 hover:bg-[#FDFCFA] transition-colors"
              style={{ gridTemplateColumns: "60px 1fr 120px 100px 140px" }}
            >
              <span className="font-mono text-[11px] text-[#999]">#{p.id}</span>
              <div>
                <p className="font-sans text-[13px] font-medium text-black leading-snug">{p.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="label-caps">{p.totalUniqueTraders} traders</span>
                  <span className="label-caps">{p.totalTrade} trades</span>
                </div>
              </div>
              <span className="label-caps">{fmtDate(p.endDate)}</span>
              <StatusBadge p={p} />
              <SpreadMeter margin={margin} />
            </div>
          );
        })}
      </div>

      <p className="font-sans text-[11px] text-[#999] mt-3 leading-relaxed">
        TWAP spread = margin above/below the conditional-market pass threshold. Positive = approved by market prediction.
      </p>
    </section>
  );
}
