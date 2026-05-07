const items = [
  {
    index: "01",
    title: "Token-Backed Treasury",
    desc:  "100% of OMFG circulating supply is backed by verifiable DAO treasury assets. NAV floor is calculated daily from on-chain positions across all wallets.",
    basis: "01Resolved API · /dao/treasury/overview",
  },
  {
    index: "02",
    title: "Permissionless Pool Deployment",
    desc:  "Any wallet can deploy a GAMM pool for any Solana token pair without governance approval, whitelist entry, or oracle configuration.",
    basis: "Omnipair protocol docs · v1 architecture",
  },
  {
    index: "03",
    title: "Oracle-Free Pricing",
    desc:  "All pools use on-chain EMA pricing derived from trade history. No external oracle dependency eliminates the primary vector for price manipulation.",
    basis: "Smart contract audit · Colosseum-backed",
  },
  {
    index: "04",
    title: "Futarchy Governance",
    desc:  "Every protocol decision is ratified through MetaDAO conditional markets. Proposals pass only when the market predicts a positive TWAP outcome.",
    basis: "MetaDAO · on-chain proposal records",
  },
  {
    index: "05",
    title: "Unified Liquidity Model",
    desc:  "A single LP position simultaneously earns swap fees and lending interest. No fragmentation between spot and margin pools.",
    basis: "GAMM whitepaper · Omnipair docs",
  },
  {
    index: "06",
    title: "Colosseum-Backed Audit",
    desc:  "63 liquidations processed without incident across the first 90 days of mainnet operation. Security review funded through OMFG-003.",
    basis: "OMFG-003 governance record · on-chain",
  },
];

export default function OwnershipGrid() {
  return (
    <section id="ownership" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Ownership & Verification
        </h2>
        <span className="label-caps">Section 06 / Basis</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.index} className="border border-[#E2DDD6] p-5 flex flex-col gap-3">
            <span
              className="font-serif text-[#E2DDD6] leading-none select-none"
              style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
            >
              {item.index}
            </span>
            <h3 className="font-sans text-[14px] font-semibold text-black leading-snug">
              {item.title}
            </h3>
            <p className="font-sans text-[12px] text-[#6B6660] leading-relaxed flex-1">
              {item.desc}
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-[#E2DDD6]">
              <span className="text-[8px] font-sans font-semibold tracking-widest uppercase border border-[#31BA7C] text-[#31BA7C] px-1.5 py-0.5">
                VERIFIED
              </span>
              <span className="font-mono text-[10px] text-[#999]">{item.basis}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
