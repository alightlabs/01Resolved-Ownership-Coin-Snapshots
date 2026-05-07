interface ProductCard {
  category: string;
  headline: string;
  body: string;
  tags: string[];
}

const cards: ProductCard[] = [
  {
    category: "What the product does",
    headline: "Permissionless spot trading + margin lending",
    body: "A single pool handles both AMM-based spot swaps and isolated margin lending for any token pair — without oracle dependency, governance votes, or asset whitelists.",
    tags: ["any token pair", "no whitelist", "permissionless"],
  },
  {
    category: "Why this design",
    headline: "No oracles, no governance bottleneck",
    body: "EMA-based pricing removes oracle dependency entirely. Any wallet can deploy a pool for any Solana pair. This architecture is purpose-built for long-tail assets that other protocols refuse to support.",
    tags: ["EMA pricing", "immutable", "long-tail assets"],
  },
  {
    category: "How it works",
    headline: "Generalized AMM (GAMM)",
    body: "Each GAMM pool simultaneously supports constant-product swaps and collateral-backed borrowing. Liquidity providers earn trading fees; borrowers post collateral and pay interest into the same pool.",
    tags: ["GAMM", "AMM + lending", "capital efficiency"],
  },
  {
    category: "Governance + entity",
    headline: "MetaDAO futarchy on Solana mainnet",
    body: "Protocol decisions route through MetaDAO's conditional-market futarchy. Token holders vote by trading — proposals pass when the market predicts a positive outcome above the TWAP threshold.",
    tags: ["MetaDAO", "futarchy", "TWAP governance"],
  },
];

export default function ProductSection() {
  return (
    <section id="product" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Product
        </h2>
        <span className="label-caps">Section 05 / Architecture</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.headline} className="border border-[#E2DDD6] p-5 flex flex-col gap-3">
            <p className="label-caps">{card.category}</p>
            <h3
              className="font-serif text-black leading-tight"
              style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)" }}
            >
              {card.headline}
            </h3>
            <p className="font-sans text-[13px] text-[#444] leading-relaxed flex-1">
              {card.body}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] text-[#6B6660] border border-[#E2DDD6] px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
