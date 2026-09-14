import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function SiliconTech({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor } = style;
  const sections = getOrderedSections(style);

  const SECTION_HEADERS: Record<string, string> = {
    experience: "# Experience Modules",
    projects: "# Tapeouts & Projects",
    education: "# Academic Qualifications",
    skills: "$ cat eda_skills_manifest.txt",
    summary: "# Professional Summary",
    certifications: "# Certifications",
    publications: "# Publications",
  };

  return (
    <div className="w-full h-full p-8 sm:p-10 text-slate-900 bg-white font-mono text-xs leading-relaxed">
      <header className="border-b-2 border-slate-900 pb-4 mb-5">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>siliconpath/engineers/{data.fullName ? data.fullName.toLowerCase().replace(/\s+/g, "-") : "candidate"}.sv</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-sans">{data.fullName || "Candidate Name"}</h1>
        <p className="text-xs font-bold text-blue-600 mt-0.5">{"//"} {data.headline || "ASIC Design & Verification Specialist"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 mt-2 text-[11px]">
          {data.email && <span>email: {data.email}</span>}
          {data.phone && <span>| phone: {data.phone}</span>}
          {data.location && <span>| loc: {data.location}</span>}
        </div>
      </header>
      {sections.map((key) => (
        <SectionBlock
          key={key}
          sectionKey={key}
          data={data}
          style={style}
          renderTitle={() => (
            <h2 className="text-xs font-black uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3">
              {SECTION_HEADERS[key] || key}
            </h2>
          )}
          renderSection={key === "skills" ? (header, content) => (
            <section className="bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-800">
              {header}
              {content}
            </section>
          ) : undefined}
        />
      ))}
    </div>
  );
}
