import type { ProjectConfig } from "@/lib/types";

const omnipair: ProjectConfig = {
  name: "Omnipair",
  slug: "omnipair",
  logoUrl: "https://imagedelivery.net/HYEnlujCFMCgj6yA728xIw/e6195b65-06cb-46c9-1ad6-932a77a2a800/public",
  tokenSymbol: "OMFG",
  icoDate: "July 2024",
  tagline: "Permissionless spot trading and margin lending for any Solana token pair.",
  description:
    "Omnipair combines an AMM-based DEX with integrated collateral lending into a single protocol. Liquidity providers earn trading fees while token holders can deposit collateral to borrow USDC — all within the same pool.",
  tags: ["Solana", "DEX", "Lending", "AMM", "Collateral"],

  links: {
    app: "https://omnipair.fi",
    docs: "https://docs.omnipair.fi",
    twitter: "https://x.com/omnipairfi",
    resolved: "https://www.01resolved.com/omnipair/overview",
  },

  dune: {
    dashboardUrl: "https://dune.com/omnipair/omnipair-core",
    queries: {
      tvl: 6978858,
      volume: 6987010,
      borrows: 6992250,
      fees: 6991928,
      topPools: 6992963,
      liquidations: 7334396,
      byPair: 6986951,
    },
  },

  resolved: {
    slug: "omnipair",
  },

  summary:
    "Omnipair is a dual-function DeFi protocol on Solana that merges decentralized exchange functionality with a permissionless lending market. Each pool acts as both an AMM for token swaps and a vault where token holders can post collateral to borrow USDC. Protocol revenue is generated through DEX trading fees (split between LPs and the protocol) and lending interest. The treasury holds cash reserves alongside LP positions and custodial accounts, tracked transparently via 01Resolved.",

  features: [
    {
      title: "Unified AMM + Lending",
      description:
        "Every pool serves dual purpose — trade tokens at market prices while simultaneously enabling collateral-backed borrowing against the same assets.",
    },
    {
      title: "Multi-Token Collateral",
      description:
        "Borrow USDC against a wide range of Solana tokens including OMFG, META, stORE, AVICI, BORG, JupUSD, and more.",
    },
    {
      title: "Transparent Treasury",
      description:
        "Protocol finances are fully tracked on-chain and reported through 01Resolved — including reserves, NAV, runway, and every treasury movement.",
    },
    {
      title: "Real-Time Liquidations",
      description:
        "Under-collateralized positions are liquidated automatically, maintaining protocol solvency and protecting lender capital.",
    },
  ],
};

export default omnipair;
