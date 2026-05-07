"use client";

import { useState } from "react";

function Dots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i < value ? "bg-black" : "bg-[#E2DDD6]"}`}
        />
      ))}
    </div>
  );
}

const TABS = ["Direct Competitors", "Infrastructure", "Narratives"] as const;
type Tab = typeof TABS[number];

interface Row {
  name:        string;
  bet:         string;
  permissionless: number;
  oracleFree:  number;
  longTail:    number;
  onChainGov:  number;
  unifiedPool: number;
}

const DIRECT: Row[] = [
  { name: "Omnipair",  bet: "Unified AMM + margin lending, oracle-free, any pair", permissionless: 5, oracleFree: 5, longTail: 5, onChainGov: 5, unifiedPool: 5 },
  { name: "Raydium",   bet: "CLMM liquidity on Serum/OpenBook orderbooks",         permissionless: 3, oracleFree: 2, longTail: 2, onChainGov: 1, unifiedPool: 1 },
  { name: "Orca",      bet: "Concentrated liquidity, curated pool experience",      permissionless: 2, oracleFree: 2, longTail: 1, onChainGov: 1, unifiedPool: 1 },
  { name: "MarginFi",  bet: "Isolated margin lending with oracle-based pricing",    permissionless: 2, oracleFree: 1, longTail: 2, onChainGov: 2, unifiedPool: 1 },
  { name: "Kamino",    bet: "Automated CLMM strategies + lending vaults",           permissionless: 2, oracleFree: 1, longTail: 1, onChainGov: 2, unifiedPool: 2 },
];

const INFRA: Row[] = [
  { name: "Omnipair",  bet: "EMA on-chain pricing — no external dependency",       permissionless: 5, oracleFree: 5, longTail: 5, onChainGov: 5, unifiedPool: 5 },
  { name: "Pyth",      bet: "Pull oracle — real-time price feeds for Solana",      permissionless: 4, oracleFree: 0, longTail: 2, onChainGov: 2, unifiedPool: 1 },
  { name: "Switchboard", bet: "Decentralised oracle with custom data feeds",       permissionless: 4, oracleFree: 0, longTail: 3, onChainGov: 3, unifiedPool: 1 },
  { name: "MetaDAO",   bet: "Futarchy governance layer for any Solana protocol",   permissionless: 5, oracleFree: 4, longTail: 4, onChainGov: 5, unifiedPool: 3 },
];

const NARR: Row[] = [
  { name: "Omnipair",       bet: "Oracle-free permissionless AMM + margin",        permissionless: 5, oracleFree: 5, longTail: 5, onChainGov: 5, unifiedPool: 5 },
  { name: "Uniswap v4",     bet: "Hook-based custom pool logic on EVM",            permissionless: 4, oracleFree: 2, longTail: 3, onChainGov: 2, unifiedPool: 2 },
  { name: "Drift Protocol", bet: "Perps + spot hybrid with vAMM on Solana",       permissionless: 3, oracleFree: 2, longTail: 2, onChainGov: 3, unifiedPool: 3 },
  { name: "Jupiter",        bet: "Aggregation layer — best route, not new liquidity", permissionless: 5, oracleFree: 3, longTail: 4, onChainGov: 3, unifiedPool: 1 },
];

const DATA: Record<Tab, Row[]> = {
  "Direct Competitors": DIRECT,
  "Infrastructure": INFRA,
  "Narratives": NARR,
};

const ATTRS = [
  { key: "permissionless", label: "Permissionless" },
  { key: "oracleFree",     label: "Oracle-Free" },
  { key: "longTail",       label: "Long-Tail" },
  { key: "onChainGov",     label: "On-Chain Gov" },
  { key: "unifiedPool",    label: "Unified Pool" },
] as const;

export default function CompetitiveSection() {
  const [tab, setTab] = useState<Tab>("Direct Competitors");
  const rows = DATA[tab];

  return (
    <section id="competitive" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Competitive Angle
        </h2>
        <span className="label-caps">Section 08 / Landscape</span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[#E2DDD6] mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[11px] font-sans font-medium uppercase tracking-wide border-b-2 transition-colors ${
              tab === t
                ? "border-black text-black"
                : "border-transparent text-[#999] hover:text-black"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-[#E2DDD6] overflow-x-auto">
        {/* Header */}
        <div className="grid border-b border-[#E2DDD6] bg-[#FAF7F2]"
          style={{ gridTemplateColumns: "200px 1fr repeat(5, 100px)" }}>
          <div className="px-4 py-2.5"><span className="label-caps">Project</span></div>
          <div className="px-4 py-2.5"><span className="label-caps">Architectural Bet</span></div>
          {ATTRS.map(a => (
            <div key={a.key} className="px-3 py-2.5 border-l border-[#E2DDD6]">
              <span className="label-caps">{a.label}</span>
            </div>
          ))}
        </div>
        {/* Rows */}
        {rows.map((row, i) => (
          <div
            key={row.name}
            className={`grid ${i < rows.length - 1 ? "border-b border-[#E2DDD6]" : ""} ${
              row.name === "Omnipair" ? "bg-[#FAF7F2]" : "hover:bg-[#FDFCFA]"
            }`}
            style={{ gridTemplateColumns: "200px 1fr repeat(5, 100px)" }}
          >
            <div className="px-4 py-3 flex items-center">
              <span className={`font-sans text-[13px] font-semibold ${row.name === "Omnipair" ? "text-black" : "text-[#444]"}`}>
                {row.name}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <span className="font-sans text-[12px] text-[#6B6660] leading-snug">{row.bet}</span>
            </div>
            {ATTRS.map(a => (
              <div key={a.key} className="px-3 py-3 flex items-center border-l border-[#E2DDD6]">
                <Dots value={row[a.key]} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="font-sans text-[11px] text-[#999] mt-3">
        Analyst assessment · 5-dot scale · ●●●●● = full capability
      </p>
    </section>
  );
}
