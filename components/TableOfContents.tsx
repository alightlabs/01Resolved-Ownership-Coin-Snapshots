"use client";

const sections = [
  { id: "hero",       num: "01", label: "Omnipair" },
  { id: "snapshot",  num: "02", label: "Token Snapshot" },
  { id: "summary",   num: "03", label: "Executive Summary" },
  { id: "product",   num: "04", label: "Product" },
  { id: "traction",  num: "05", label: "Protocol Traction" },
  { id: "financial", num: "06", label: "Financial Core" },
  { id: "governance",num: "07", label: "Governance" },
];

export default function TableOfContents({ active }: { active?: string }) {
  return (
    <nav className="sticky top-20 pt-14">
      <p className="label-caps mb-4">Contents</p>
      <ul className="space-y-1">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`flex items-baseline gap-2.5 py-1 text-[12px] font-sans transition-colors group ${
                active === s.id
                  ? "text-black font-medium"
                  : "text-[#999] hover:text-black"
              }`}
            >
              <span className="text-[10px] tabular-nums text-[#C4BFB8] group-hover:text-[#999] transition-colors">
                {s.num}
              </span>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
