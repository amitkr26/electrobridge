import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function ClassicCorporate({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor } = style;
  const sections = getOrderedSections(style);
  return (
    <div className="w-full h-full p-10 sm:p-12 text-slate-900 bg-white font-serif">
      <header className="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-normal uppercase text-slate-950">{data.fullName || "Candidate Name"}</h1>
        {data.headline && <p className="text-xs font-semibold text-slate-700 italic mt-1">{data.headline}</p>}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-700 mt-2 font-sans">
          {data.location && <span>{data.location}</span>}
          {data.phone && <span>| {data.phone}</span>}
          {data.email && <span>| {data.email}</span>}
          {data.linkedin && <span>| {data.linkedin}</span>}
          {data.github && <span>| {data.github}</span>}
        </div>
      </header>
      {sections.map((key) => (
        <SectionBlock key={key} sectionKey={key} data={data} style={style} />
      ))}
    </div>
  );
}
