import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function Executive({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor } = style;
  const sections = getOrderedSections(style);
  return (
    <div className="w-full h-full bg-white text-slate-900 text-xs leading-relaxed font-sans">
      <header className="bg-slate-900 text-white p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight uppercase">{data.fullName || "Candidate Name"}</h1>
        <p className="text-sm font-semibold mt-1 tracking-wide" style={{ color: accentColor }}>{data.headline || "Principal Silicon Architect | Engineering Leader"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300 mt-3 pt-3 border-t border-slate-700">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.location && <span>• {data.location}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
        </div>
      </header>
      <div className="p-8 sm:p-10 space-y-6">
        {sections.map((key) => (
          <SectionBlock key={key} sectionKey={key} data={data} style={style} />
        ))}
      </div>
    </div>
  );
}
