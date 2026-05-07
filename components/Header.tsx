"use client";

import Link from "next/link";
import type { ProjectConfig } from "@/lib/types";

function ShareButton() {
  function handleShare() {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard");
      }).catch(() => {});
    }
  }
  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-[11px] font-sans text-[#6B6660] hover:text-black transition-colors tracking-wide uppercase"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Share
    </button>
  );
}

function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-[11px] font-sans bg-black text-white px-3 py-1.5 hover:bg-[#111] transition-colors tracking-wide uppercase"
    >
      Export PDF
    </button>
  );
}

export default function Header({ project }: { project: ProjectConfig }) {
  return (
    <header className="border-b border-[#E2DDD6] bg-[#F5F0E8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between gap-4">
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] font-sans tracking-widest uppercase shrink-0">
          <Link href="https://www.01resolved.com" target="_blank"
            className="font-semibold text-black hover:opacity-70 transition-opacity">
            01RESOLVED
          </Link>
          <span className="text-[#C4BFB8]">/</span>
          <span className="text-[#6B6660]">RESEARCH</span>
          <span className="text-[#C4BFB8]">/</span>
          <span className="text-black font-medium">{project.name.toUpperCase()}</span>
        </div>

        {/* Right: actions */}
        <nav className="flex items-center gap-4 shrink-0">
          {project.links.docs && (
            <Link href={project.links.docs} target="_blank"
              className="hidden sm:block text-[11px] font-sans text-[#6B6660] hover:text-black transition-colors tracking-wide uppercase">
              Docs
            </Link>
          )}
          {project.links.app && (
            <Link href={project.links.app} target="_blank"
              className="hidden sm:block text-[11px] font-sans text-[#6B6660] hover:text-black transition-colors tracking-wide uppercase">
              App
            </Link>
          )}
          <ShareButton />
          {project.links.resolved && (
            <Link href={project.links.resolved} target="_blank"
              className="text-[11px] font-sans bg-black text-white px-3 py-1.5 hover:bg-[#111] transition-colors tracking-wide uppercase">
              View on 01R
            </Link>
          )}
          <ExportButton />
        </nav>
      </div>
    </header>
  );
}
