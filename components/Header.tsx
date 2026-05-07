import Link from "next/link";
import type { ProjectConfig } from "@/lib/types";

export default function Header({ project }: { project: ProjectConfig }) {
  return (
    <header className="border-b border-[#E2DDD6] bg-[#F5F0E8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        {/* Left: 01R breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] font-sans tracking-widest uppercase">
          <Link
            href="https://www.01resolved.com"
            target="_blank"
            className="font-semibold text-black hover:opacity-70 transition-opacity"
          >
            01RESOLVED
          </Link>
          <span className="text-[#C4BFB8]">/</span>
          <span className="text-[#6B6660]">RESEARCH</span>
          <span className="text-[#C4BFB8]">·</span>
          <span className="text-black font-medium">
            {project.name.toUpperCase()}
          </span>
        </div>

        {/* Right: links */}
        <nav className="flex items-center gap-5">
          {project.links.docs && (
            <Link
              href={project.links.docs}
              target="_blank"
              className="text-[11px] font-sans text-[#6B6660] hover:text-black transition-colors tracking-wide uppercase"
            >
              Docs
            </Link>
          )}
          {project.links.app && (
            <Link
              href={project.links.app}
              target="_blank"
              className="text-[11px] font-sans text-[#6B6660] hover:text-black transition-colors tracking-wide uppercase"
            >
              App
            </Link>
          )}
          {project.links.resolved && (
            <Link
              href={project.links.resolved}
              target="_blank"
              className="text-[11px] font-sans bg-black text-white px-3 py-1.5 hover:bg-[#111] transition-colors tracking-wide uppercase"
            >
              View on 01R
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
