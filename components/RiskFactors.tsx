interface Risk {
  tag:   string;
  title: string;
  body:  string;
  level: "MATERIAL" | "MODERATE" | "MONITOR";
}

const RISKS: Risk[] = [
  {
    tag:   "Economic",
    title: "Treasury Runway",
    body:  "At $50K/mo burn, the treasury supports approximately 8.7 months of operations. If fee accrual does not activate or OMFG-005 fails, a secondary capital raise will be required within 2026. This is the most time-sensitive financial risk.",
    level: "MATERIAL",
  },
  {
    tag:   "Economic",
    title: "Pre-Revenue at Scale",
    body:  "The 10% protocol fee is live and accruing to the DAO. At current volume it represents <$10/day. Parity requires approximately 100× growth in daily volume before runway risk is resolved by operations alone.",
    level: "MATERIAL",
  },
  {
    tag:   "Technical",
    title: "EMA Oracle Manipulation",
    body:  "EMA pricing derived from on-chain trade history eliminates external oracle dependency but creates susceptibility to wash trading attacks in low-liquidity pools. The liquidation engine's robustness depends on pool depth.",
    level: "MODERATE",
  },
  {
    tag:   "Market",
    title: "Spot/NAV Premium Compression",
    body:  "At 300%+ premium to NAV, the token trades on narrative rather than treasury backing. A sustained correction in sentiment or Solana ecosystem liquidity could compress this multiple rapidly without change to underlying fundamentals.",
    level: "MODERATE",
  },
  {
    tag:   "Governance",
    title: "Futarchy Participation Risk",
    body:  "MetaDAO futarchy requires active market participation to produce reliable signals. Low trade volume on conditional markets reduces governance quality. OMFG proposals have averaged 78 unique traders — a small and potentially concentrated cohort.",
    level: "MODERATE",
  },
  {
    tag:   "Regulatory",
    title: "Permissionless Listing Exposure",
    body:  "The ability to list any SPL token without governance creates potential regulatory exposure if sanctioned or securities-classified tokens are traded on the protocol. Immutability that is a product strength may limit remediation options.",
    level: "MONITOR",
  },
];

const levelCls: Record<Risk["level"], string> = {
  MATERIAL: "border-[#FF6477] text-[#FF6477]",
  MODERATE: "border-[#D4B596] text-[#D4B596]",
  MONITOR:  "border-[#999] text-[#999]",
};

export default function RiskFactors() {
  return (
    <section id="risks" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Risk Factors
        </h2>
        <span className="label-caps">Section 12 / Considerations</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {RISKS.map(risk => (
          <div key={risk.title} className="border border-[#E2DDD6] p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-caps">{risk.tag}</span>
              <span className={`text-[8px] font-sans font-semibold tracking-widest uppercase border px-1.5 py-0.5 ${levelCls[risk.level]}`}>
                {risk.level}
              </span>
            </div>
            <h3 className="font-sans text-[14px] font-semibold text-black leading-snug">
              {risk.title}
            </h3>
            <p className="font-sans text-[12px] text-[#6B6660] leading-relaxed flex-1">
              {risk.body}
            </p>
          </div>
        ))}
      </div>

      <p className="font-sans text-[11px] text-[#999] mt-4 leading-relaxed">
        Risk classification: <strong className="text-black">MATERIAL</strong> — requires active monitoring and may affect investment decision.{" "}
        <strong className="text-black">MODERATE</strong> — meaningful but manageable within known parameters.{" "}
        <strong className="text-black">MONITOR</strong> — low immediate probability; watch for state change.
      </p>
    </section>
  );
}
