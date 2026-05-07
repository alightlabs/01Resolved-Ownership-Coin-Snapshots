import Link from "next/link";
import type { ProjectConfig } from "@/lib/types";

export default function Footer({ project }: { project: ProjectConfig }) {
  return (
    <footer className="border-t border-[#E2DDD6] mt-20 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* 01Resolved attribution */}
        <div>
          <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-black mb-1">
            01RESOLVED
          </p>
          <p className="font-sans text-[11px] text-[#6B6660]">
            Treasury Intelligence · Ownership Coin Research
          </p>
        </div>

        {/* Project links */}
        <div className="flex items-center gap-5">
          {project.links.docs && (
            <Link href={project.links.docs} target="_blank"
              className="text-[11px] font-sans text-[#6B6660] hover:text-black uppercase tracking-wide transition-colors">
              Docs
            </Link>
          )}
          {project.links.app && (
            <Link href={project.links.app} target="_blank"
              className="text-[11px] font-sans text-[#6B6660] hover:text-black uppercase tracking-wide transition-colors">
              App
            </Link>
          )}
          {project.links.twitter && (
            <Link href={project.links.twitter} target="_blank"
              className="text-[11px] font-sans text-[#6B6660] hover:text-black uppercase tracking-wide transition-colors">
              X / Twitter
            </Link>
          )}
          {project.links.resolved && (
            <Link href={project.links.resolved} target="_blank"
              className="text-[11px] font-sans text-[#6B6660] hover:text-black uppercase tracking-wide transition-colors">
              01Resolved
            </Link>
          )}
        </div>

        {/* Disclaimer */}
        <p className="font-sans text-[10px] text-[#999] max-w-xs leading-relaxed">
          Data sourced from Dune Analytics and 01Resolved. Not financial advice.
        </p>
      </div>
    </footer>
  );
}
