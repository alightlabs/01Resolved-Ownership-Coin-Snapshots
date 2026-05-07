import type { ProjectConfig } from "@/lib/types";

export default function ProtocolSummary({ project }: { project: ProjectConfig }) {
  return (
    <section className="py-14 border-t border-[#E2DDD6]">
      <p className="label-caps mb-5">Protocol Summary</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Summary text */}
        <div className="lg:col-span-2">
          <p className="font-sans text-[15px] leading-[1.75] text-[#333]">
            {project.summary}
          </p>
        </div>

        {/* Feature highlights */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-6">
            {project.features.map((f) => (
              <div key={f.title}>
                <h3 className="font-sans text-[12px] font-semibold text-black uppercase tracking-wide mb-1">
                  {f.title}
                </h3>
                <p className="font-sans text-[13px] text-[#6B6660] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
