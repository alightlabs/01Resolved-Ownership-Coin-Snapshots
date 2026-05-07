import Link from "next/link";
import type { ProjectConfig } from "@/lib/types";
import type { ProjectOverview } from "@/lib/resolved";

interface Props {
  project:  ProjectConfig;
  overview: ProjectOverview | null;
}

export default function HeroSection({ project, overview }: Props) {
  const circ = overview?.circulatingSupply
    ? `${(parseFloat(overview.circulatingSupply) / 1_000_000).toFixed(2)}M`
    : null;

  return (
    <section id="hero" className="pt-12 pb-4 scroll-mt-20">
      <p className="label-caps mb-6">01Resolved Research / Ownership Coin</p>

      {/* Logo + Name */}
      <div className="flex items-center gap-4 mb-3">
        {project.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.logoUrl} alt={project.name}
            className="w-14 h-14 rounded-full object-cover shrink-0" />
        )}
        <h1
          className="font-serif font-normal text-black leading-none"
          style={{ fontSize: "clamp(3rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
        >
          {project.name}
        </h1>
      </div>

      {/* Token info bar */}
      <p className="font-sans text-[12px] text-[#999] mb-5 tracking-wide">
        {project.tokenSymbol && <span className="text-black font-medium">${project.tokenSymbol}</span>}
        {circ && <span> · {circ} circulating supply</span>}
        {project.icoDate && <span> · ICO {project.icoDate}</span>}
      </p>

      {/* Tagline */}
      <p className="font-serif italic text-[#444] mb-5 leading-snug"
        style={{ fontSize: "clamp(1rem, 1.8vw, 1.35rem)" }}>
        {project.tagline}
      </p>

      {/* Description */}
      <p className="font-sans text-[14px] leading-relaxed text-[#444] max-w-prose mb-6">
        {overview?.projectSubDescription ?? project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-7">
        {project.tags.map(tag => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {project.links.app && (
          <Link href={project.links.app} target="_blank"
            className="inline-flex items-center px-5 py-2.5 bg-black text-white text-[11px] font-sans font-medium tracking-widest uppercase hover:bg-[#222] transition-colors">
            Open App
          </Link>
        )}
        {project.links.docs && (
          <Link href={project.links.docs} target="_blank"
            className="inline-flex items-center px-5 py-2.5 border border-[#C4BFB8] text-black text-[11px] font-sans font-medium tracking-widest uppercase hover:border-black transition-colors">
            Documentation
          </Link>
        )}
        {project.links.resolved && (
          <Link href={project.links.resolved} target="_blank"
            className="inline-flex items-center px-5 py-2.5 border border-[#C4BFB8] text-black text-[11px] font-sans font-medium tracking-widest uppercase hover:border-black transition-colors">
            View on 01Resolved
          </Link>
        )}
      </div>

      {/* Coverage note */}
      <div className="border-l-2 border-[#D4B596] pl-4 py-1">
        <p className="font-sans text-[12px] text-[#6B6660] leading-relaxed">
          <strong className="text-black font-medium">Coverage note —</strong>{" "}
          Some financial workflow activity may be private by design. Metrics are labeled by observability:{" "}
          <em>Onchain verified</em>, <em>Company disclosed</em>, <em>Analyst model</em>, or <em>Operator-stated</em>.
        </p>
      </div>
    </section>
  );
}
