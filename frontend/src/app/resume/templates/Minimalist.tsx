import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function Minimalist({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor } = style;
  const sections = getOrderedSections(style);
  return (
    <div className="w-full h-full p-10 sm:p-12 text-slate-800 bg-white">
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{data.fullName || "Candidate Name"}</h1>
        <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: accentColor }}>{data.headline || "Electronics & VLSI Engineer"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-3 font-light">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.location && <span>• {data.location}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
          {data.github && <span>• {data.github}</span>}
        </div>
      </header>
      {sections.map((key) => (
        <SectionBlock
          key={key}
          sectionKey={key}
          data={data}
          style={style}
          headerClassName="text-slate-400"
        />
      ))}
    </div>
  );
}
