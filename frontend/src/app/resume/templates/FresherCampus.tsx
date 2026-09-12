import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function FresherCampus({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor } = style;
  const sections = getOrderedSections(style);
  return (
    <div className="w-full h-full p-8 sm:p-10 text-slate-900 bg-white text-xs leading-relaxed font-sans">
      <header className="border-b-2 pb-4 mb-5 text-center" style={{ borderColor: accentColor }}>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{data.fullName || "Candidate Name"}</h1>
        <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">{data.headline || "B.Tech Electronics & Communication | Aspiring VLSI Engineer"}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 mt-2 text-[11px]">
          {data.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {data.phone}</span>}
          {data.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {data.location}</span>}
          {data.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-slate-400" /> {data.linkedin}</span>}
          {data.github && <span className="flex items-center gap-1"><Github className="w-3 h-3 text-slate-400" /> {data.github}</span>}
        </div>
      </header>
      {sections.map((key) => (
        <SectionBlock key={key} sectionKey={key} data={data} style={style} />
      ))}
    </div>
  );
}
