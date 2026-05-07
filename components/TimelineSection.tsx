interface Milestone {
  date:   string;
  label:  string;
  detail: string;
  chain?: boolean;
}

const PAST: Milestone[] = [
  { date: "Jul 2024",  label: "ICO on 01Resolved",           detail: "$11M raised from 322 investors via launchpad. First MetaDAO-governed protocol raise.", chain: true },
  { date: "Oct 2024",  label: "OMFG-001 passes",            detail: "Allowance raised to $50K/mo. First governance action with +12.4% TWAP margin.", chain: true },
  { date: "Nov 2024",  label: "OMFG-002 & 003 pass",        detail: "Security audit funded (+29.3% margin). $50K/mo confirmed operational budget.", chain: true },
  { date: "Feb 2026",  label: "Solana mainnet launch",       detail: "Beta live. GAMM pools deployed, first liquidations processed without incident.", chain: true },
  { date: "Mar 2026",  label: "V0.8 migration",             detail: "OMFG-004 passes with +8.3% margin. Ecosystem investment round completed.", chain: true },
  { date: "Apr 2026",  label: "ATH daily trades",           detail: "~2,400 swaps recorded on April 15, 2026 — 8 weeks post-launch, no incentive program.", chain: true },
];

const FUTURE: Milestone[] = [
  { date: "Q3 2026",  label: "Fee accrual activation",      detail: "OMFG-005 (OTC raise) outcome determines fee switch timeline and DAO revenue start." },
  { date: "Q3 2026",  label: "Strategic OTC raise",         detail: "Pending vote — OMFG-005 proposes a private token sale to fund protocol growth." },
  { date: "Q4 2026",  label: "V1.0 full release",           detail: "Production release with full margin product, improved liquidation engine, and SDK." },
  { date: "2027",     label: "Cross-chain expansion",       detail: "Stated intent to deploy GAMM architecture on EVM-compatible chains." },
  { date: "2027+",    label: "Revenue-sharing governance",  detail: "DAO vote on protocol fee distribution model to token holders." },
];

function PastItem({ m }: { m: Milestone }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-[#31BA7C] shrink-0 mt-1" />
        <div className="w-px flex-1 bg-[#E2DDD6] mt-1" />
      </div>
      <div className="pb-5">
        <p className="label-caps text-[#31BA7C] mb-0.5">{m.date}</p>
        <p className="font-sans text-[13px] font-semibold text-black leading-snug mb-1">{m.label}</p>
        <p className="font-sans text-[12px] text-[#6B6660] leading-relaxed">{m.detail}</p>
        {m.chain && (
          <span className="inline-flex items-center gap-1 mt-1.5 text-[8px] font-sans font-semibold tracking-widest uppercase border border-[#31BA7C] text-[#31BA7C] px-1.5 py-0.5">
            ONCHAIN
          </span>
        )}
      </div>
    </div>
  );
}

function FutureItem({ m }: { m: Milestone }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full border-2 border-[#D4B596] shrink-0 mt-1" />
        <div className="w-px flex-1 bg-[#E2DDD6] mt-1" />
      </div>
      <div className="pb-5">
        <p className="label-caps text-[#D4B596] mb-0.5">{m.date}</p>
        <p className="font-sans text-[13px] font-semibold text-black leading-snug mb-1">{m.label}</p>
        <p className="font-sans text-[12px] text-[#6B6660] leading-relaxed">{m.detail}</p>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  return (
    <section id="timeline" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Timeline & Roadmap
        </h2>
        <span className="label-caps">Section 11 / History</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Verified Past */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span className="label-caps">Verified Past</span>
            <span className="text-[8px] font-sans font-semibold tracking-widest uppercase border border-[#31BA7C] text-[#31BA7C] px-1.5 py-0.5">
              ONCHAIN
            </span>
          </div>
          {PAST.map(m => <PastItem key={m.label} m={m} />)}
        </div>

        {/* Right: Stated Future */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span className="label-caps">Stated Future</span>
            <span className="text-[8px] font-sans font-semibold tracking-widest uppercase border border-[#D4B596] text-[#D4B596] px-1.5 py-0.5">
              OPERATOR-STATED
            </span>
          </div>
          {FUTURE.map(m => <FutureItem key={m.label} m={m} />)}
        </div>
      </div>
    </section>
  );
}
