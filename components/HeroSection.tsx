import Link from "next/link";
import type { ProjectConfig } from "@/lib/types";

export default function HeroSection({ project }: { project: ProjectConfig }) {
  return (
    <section className="pt-16 pb-8">
      {/* Section label */}
      <p className="label-caps mb-6">
        01Resolved Research&nbsp;/&nbsp;Ownership Coin
      </p>

      {/* Project name — EB Garamond display */}
      <h1
        className="font-serif font-normal leading-none text-black mb-4"
        style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", letterSpacing: "-0.02em" }}
      >
        {project.name}
      </h1>

      {/* Tagline — italic serif */}
      <p
        className="font-serif italic text-[#444] mb-6"
        style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}
      >
        {project.tagline}
      </p>

      {/* Description */}
      <p className="font-sans text-[15px] leading-relaxed text-[#444] max-w-xl mb-8">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {project.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        {project.links.app && (
          <Link
            href={project.links.app}
            target="_blank"
            className="inline-flex items-center px-5 py-2.5 bg-black text-white text-[12px] font-sans font-medium tracking-wide uppercase hover:bg-[#222] transition-colors"
          >
            Open App
          </Link>
        )}
        {project.links.docs && (
          <Link
            href={project.links.docs}
            target="_blank"
            className="inline-flex items-center px-5 py-2.5 border border-[#C4BFB8] text-black text-[12px] font-sans font-medium tracking-wide uppercase hover:border-black transition-colors"
          >
            Documentation
          </Link>
        )}
        {project.links.resolved && (
          <Link
            href={project.links.resolved}
            target="_blank"
            className="inline-flex items-center px-5 py-2.5 border border-[#C4BFB8] text-black text-[12px] font-sans font-medium tracking-wide uppercase hover:border-black transition-colors"
          >
            View on 01Resolved
          </Link>
        )}
      </div>

      {/* Coverage note */}
      <div className="mt-10 border border-[#E2DDD6] p-4 bg-[#FAF7F2]">
        <p className="font-sans text-[12px] text-[#6B6660] leading-relaxed">
          <strong className="text-black font-medium">Coverage note —</strong>{" "}
          Metrics are labeled by observability:{" "}
          <em>Onchain verified</em>, <em>Company disclosed</em>,{" "}
          <em>Analyst model</em>, or <em>Operator-stated</em>. Some financial
          activity may be private by design.
        </p>
      </div>
    </section>
  );
}
