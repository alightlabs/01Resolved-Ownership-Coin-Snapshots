"use client";

import { useState } from "react";

const TAM = [
  { metric: "Solana DEX 24h Volume",       value: "~$2B",    desc: "30-day avg across all Solana DEXs" },
  { metric: "Margin Lending Outstanding",  value: "~$500M",  desc: "Estimated open borrow positions on Solana" },
  { metric: "Long-tail Token Pairs",       value: "50,000+", desc: "SPL tokens without major DEX listings" },
  { metric: "Omnipair Addressable (yr)",   value: "~$100B",  desc: "0.5% daily volume capture × 365" },
];

interface Preset { vol: number; share: number; fee: number; take: number; }
const PRESETS: Record<string, Preset> = {
  Bear: { vol: 500,  share: 0.5, fee: 0.15, take: 10 },
  Base: { vol: 2000, share: 1.5, fee: 0.20, take: 15 },
  Bull: { vol: 5000, share: 3.0, fee: 0.30, take: 20 },
};

function fmt(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

interface SliderProps {
  label: string; sub: string; min: number; max: number; step: number;
  value: number; fmt: (v: number) => string;
  onChange: (v: number) => void;
}
function Slider({ label, sub, min, max, step, value, fmt: fmtFn, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <div>
          <p className="font-sans text-[11px] font-medium text-black uppercase tracking-wide">{label}</p>
          <p className="label-caps">{sub}</p>
        </div>
        <span className="font-sans text-[15px] font-semibold tabular-nums text-black">{fmtFn(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-0.5 bg-[#E2DDD6] appearance-none cursor-pointer accent-black"
      />
      <div className="flex justify-between mt-1">
        <span className="label-caps">{fmtFn(min)}</span>
        <span className="label-caps">{fmtFn(max)}</span>
      </div>
    </div>
  );
}

export default function MarketWorkbench() {
  const [preset, setPreset] = useState<string>("Base");
  const [vol,   setVol]   = useState(PRESETS.Base.vol);
  const [share, setShare] = useState(PRESETS.Base.share);
  const [fee,   setFee]   = useState(PRESETS.Base.fee);
  const [take,  setTake]  = useState(PRESETS.Base.take);

  function applyPreset(name: string) {
    setPreset(name);
    setVol(PRESETS[name].vol);
    setShare(PRESETS[name].share);
    setFee(PRESETS[name].fee);
    setTake(PRESETS[name].take);
  }

  const annualVol = vol * 1_000_000 * (share / 100) * 365;
  const annualRev = annualVol * (fee / 100) * (take / 100);

  return (
    <section id="market" className="py-12 border-t border-[#E2DDD6] scroll-mt-20">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Market Segment
        </h2>
        <span className="label-caps">Section 07 / TAM & Scenario</span>
      </div>

      {/* TAM table */}
      <div className="border border-[#E2DDD6] mb-8">
        <div className="grid grid-cols-3 px-4 py-2 border-b border-[#E2DDD6] bg-[#FAF7F2]">
          {["Metric", "Value", "Description"].map(h => (
            <span key={h} className="label-caps">{h}</span>
          ))}
        </div>
        {TAM.map((row, i) => (
          <div
            key={row.metric}
            className={`grid grid-cols-3 px-4 py-3 ${i < TAM.length - 1 ? "border-b border-[#E2DDD6]" : ""}`}
          >
            <span className="font-sans text-[13px] text-[#444]">{row.metric}</span>
            <span className="font-sans text-[13px] font-semibold text-black tabular-nums">{row.value}</span>
            <span className="font-sans text-[12px] text-[#999]">{row.desc}</span>
          </div>
        ))}
      </div>

      {/* Scenario workbench */}
      <div className="border border-[#E2DDD6]">
        <div className="px-5 py-3 border-b border-[#E2DDD6] flex items-center justify-between">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-black">Scenario Workbench</p>
          <div className="flex gap-1">
            {Object.keys(PRESETS).map(name => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className={`px-3 py-1 text-[10px] font-sans font-semibold uppercase tracking-wide border transition-colors ${
                  preset === name
                    ? "bg-black text-white border-black"
                    : "text-[#6B6660] border-[#E2DDD6] hover:border-black hover:text-black"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
          {/* Sliders */}
          <div className="p-5 border-r border-[#E2DDD6] space-y-6">
            <Slider
              label="Daily DEX Volume" sub="total Solana market"
              min={100} max={10000} step={100} value={vol}
              fmt={v => `$${v >= 1000 ? (v / 1000).toFixed(1) + "B" : v + "M"}/day`}
              onChange={v => { setVol(v); setPreset("Custom"); }}
            />
            <Slider
              label="Protocol Market Share" sub="% of Solana volume"
              min={0.1} max={10} step={0.1} value={share}
              fmt={v => `${v.toFixed(1)}%`}
              onChange={v => { setShare(v); setPreset("Custom"); }}
            />
            <Slider
              label="Fee Rate" sub="average swap fee"
              min={0.05} max={0.50} step={0.01} value={fee}
              fmt={v => `${v.toFixed(2)}%`}
              onChange={v => { setFee(v); setPreset("Custom"); }}
            />
            <Slider
              label="DAO Revenue Take" sub="% of fees to protocol"
              min={5} max={50} step={1} value={take}
              fmt={v => `${v}%`}
              onChange={v => { setTake(v); setPreset("Custom"); }}
            />
          </div>

          {/* Output */}
          <div className="p-5 flex flex-col justify-center gap-6">
            <div>
              <p className="label-caps mb-1">Implied Annual Protocol Volume</p>
              <p className="font-serif text-black leading-none" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
                {fmt(annualVol)}
              </p>
            </div>
            <div className="border-t border-[#E2DDD6] pt-6">
              <p className="label-caps mb-1">Implied Annual DAO Revenue</p>
              <p className="font-serif text-[#D4B596] leading-none" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
                {fmt(annualRev)}
              </p>
            </div>
            <p className="font-sans text-[10px] text-[#999] leading-relaxed">
              Model: (Daily Vol × Share × 365) × Fee Rate × DAO Take.
              All inputs are analyst estimates; actual results may differ materially.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
