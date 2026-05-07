"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero",        num: "01", label: "Omnipair" },
  { id: "snapshot",   num: "02", label: "Token Snapshot" },
  { id: "ledger",     num: "03", label: "Status Ledger" },
  { id: "summary",    num: "04", label: "Executive Summary" },
  { id: "product",    num: "05", label: "Product" },
  { id: "ownership",  num: "06", label: "Ownership & Verification" },
  { id: "market",     num: "07", label: "Market Segment" },
  { id: "competitive",num: "08", label: "Competitive Angle" },
  { id: "financial",  num: "09", label: "Financial Core" },
  { id: "governance", num: "10", label: "Governance" },
  { id: "timeline",   num: "11", label: "Timeline" },
  { id: "risks",      num: "12", label: "Risk Factors" },
];

export default function TableOfContents() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const els = sections
      .map(s => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-20 pt-14">
      <p className="label-caps mb-4">Contents</p>
      <ul className="space-y-0.5">
        {sections.map(s => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`flex items-baseline gap-2.5 py-1 text-[11px] font-sans transition-colors group ${
                active === s.id
                  ? "text-black font-semibold"
                  : "text-[#999] hover:text-[#444]"
              }`}
            >
              <span className={`text-[9px] tabular-nums transition-colors shrink-0 ${
                active === s.id ? "text-[#D4B596]" : "text-[#C4BFB8] group-hover:text-[#999]"
              }`}>
                {s.num}
              </span>
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-4 border-t border-[#E2DDD6] space-y-1">
        {[["About", "#hero"], ["Sources", "#ledger"], ["Methodology", "#risks"]].map(([label, href]) => (
          <a key={label} href={href}
            className="block text-[10px] font-sans text-[#C4BFB8] hover:text-[#999] transition-colors tracking-wide">
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
