import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function CompactTechnical({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor } = style;
  const sections = getOrderedSections(style);
  return (
    <div className="w-full h-full p-6 sm:p-8 text-slate-900 bg-white text-xs leading-snug">
      <header className="border-b-2 pb-3 mb-3 flex justify-between items-end" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: accentColor }}>{data.fullName || "Candidate Name"}</h1>
          <p className="text-xs font-bold text-slate-700 font-mono mt-0.5">{data.headline || "ASIC / RTL Design & Verification Engineer"}</p>
        </div>
        <div className="text-right text-[11px] text-slate-600 font-mono space-y-0.5">
          <div>{data.email} | {data.phone}</div>
          <div>{data.location} | {data.linkedin || data.github}</div>
        </div>
      </header>
      {sections.map((key) => (
        <SectionBlock
          key={key}
          sectionKey={key}
          data={data}
          style={style}
          className="mb-3.5"
          renderTitle={(label) => (
            <h2 className="text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-2" style={{ color: accentColor }}>
              {key === "skills" ? "Technical Skill Matrix" : label}
            </h2>
          )}
          renderSection={key === "skills" ? (header, content) => (
            <section className="mb-3.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              {header}
              {content}
            </section>
          ) : undefined}
        />
      ))}
    </div>
  );
}
