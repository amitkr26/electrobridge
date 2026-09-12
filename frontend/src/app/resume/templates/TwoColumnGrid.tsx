import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function TwoColumnGrid({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor } = style;
  const allSections = getOrderedSections(style);
  const leftSections = allSections.filter((k) => k === "experience" || k === "summary");
  const rightSections = allSections.filter((k) => k !== "experience" && k !== "summary");

  return (
    <div className="w-full h-full p-8 sm:p-10 text-slate-900 bg-white text-xs leading-snug">
      <header className="border-b-2 pb-4 mb-5 flex justify-between items-end" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: accentColor }}>{data.fullName || "Candidate Name"}</h1>
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mt-0.5">{data.headline || "Semiconductor & Hardware Engineer"}</p>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          <div>{data.email} | {data.phone}</div>
          <div>{data.location} | {data.linkedin || data.github}</div>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          {leftSections.map((key) => (
            <SectionBlock key={key} sectionKey={key} data={data} style={style} />
          ))}
        </div>
        <div className="space-y-4">
          {rightSections.map((key) => (
            <SectionBlock key={key} sectionKey={key} data={data} style={style} />
          ))}
        </div>
      </div>
    </div>
  );
}
