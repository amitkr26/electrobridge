import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function ModernSidebar({ data, style }: { data: ResumeData; style: ResumeStyleConfig }) {
  const { accentColor, visibleSections } = style;
  const allSections = getOrderedSections(style);
  const bodySections = allSections.filter((k) => k !== "skills" && k !== "certifications");
  return (
    <div className="w-full h-full flex min-h-[950px] bg-white text-slate-900 text-xs font-sans">
      <aside className="w-1/3 bg-slate-100/80 border-r border-slate-200/90 p-6 flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">{data.fullName || "Candidate Name"}</h1>
          <p className="text-[11px] font-bold mt-1 uppercase tracking-wider" style={{ color: accentColor }}>{data.headline || "VLSI & FPGA Engineer"}</p>
        </div>
        <div className="space-y-2 text-[11px] text-slate-600 border-t border-slate-200 pt-3">
          <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Contact</p>
          {data.email && <div className="flex items-center gap-1.5 break-all"><Mail className="w-3 h-3 text-slate-400 shrink-0" /><span>{data.email}</span></div>}
          {data.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400 shrink-0" /><span>{data.phone}</span></div>}
          {data.location && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-400 shrink-0" /><span>{data.location}</span></div>}
          {data.linkedin && <div className="flex items-center gap-1.5 break-all"><Linkedin className="w-3 h-3 text-slate-400 shrink-0" /><span>{data.linkedin}</span></div>}
          {data.github && <div className="flex items-center gap-1.5 break-all"><Github className="w-3 h-3 text-slate-400 shrink-0" /><span>{data.github}</span></div>}
        </div>
        {visibleSections.skills && data.skills?.length > 0 && (
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Core Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-white text-slate-800 rounded border border-slate-300 text-[10px] font-semibold">{skill}</span>
              ))}
            </div>
          </div>
        )}
        {visibleSections.certifications && data.certifications?.length > 0 && (
          <div className="border-t border-slate-200 pt-3 space-y-1.5">
            <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Certifications</p>
            {data.certifications.map((c, i) => (
              <p key={i} className="text-[11px] text-slate-700 font-medium">• {c.name} {c.year ? `(${c.year})` : ""}</p>
            ))}
          </div>
        )}
      </aside>
      <main className="w-2/3 p-6 sm:p-8 flex flex-col gap-5">
        {bodySections.map((key) => (
          <SectionBlock key={key} sectionKey={key} data={data} style={style} />
        ))}
      </main>
    </div>
  );
}
