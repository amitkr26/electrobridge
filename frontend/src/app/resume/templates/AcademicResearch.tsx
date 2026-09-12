import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function AcademicResearch({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor } = style;
  const sections = getOrderedSections(style);
  return (
    <div className="w-full h-full p-8 sm:p-10 text-slate-900 bg-white text-xs leading-relaxed font-sans">
      <header className="border-b-2 pb-4 mb-5 text-center" style={{ borderColor: accentColor }}>
        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-wide">{data.fullName || "Candidate Name"}</h1>
        <p className="text-xs font-semibold text-slate-700 mt-1">{data.headline || "Junior Research Fellow | Microelectronics & VLSI"}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 mt-2 text-[11px]">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.location && <span>• {data.location}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
        </div>
      </header>
      {sections.map((key) => (
        <SectionBlock key={key} sectionKey={key} data={data} style={style} />
      ))}
    </div>
  );
}
