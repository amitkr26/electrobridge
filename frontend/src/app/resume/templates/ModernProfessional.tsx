import React from "react";
import { ResumeData, ResumeStyleConfig } from "../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import { getOrderedSections, SectionBlock } from "./SectionContent";

export function ModernProfessional({
  data,
  style,
}: {
  data: ResumeData;
  style: ResumeStyleConfig;
}) {
  const { accentColor } = style;
  const sections = getOrderedSections(style);

  return (
    <div className="w-full h-full p-8 sm:p-10 text-slate-900 bg-white relative">
      {/* Top Accent Bar */}
      <div
        className="absolute top-0 inset-x-0 h-2.5"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <header className="border-b border-slate-200 pb-5 mb-5">
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: accentColor }}
        >
          {data.fullName || "Candidate Name"}
        </h1>
        <p className="text-sm font-semibold text-slate-600 mt-1 uppercase tracking-wider">
          {data.headline || "Semiconductor & VLSI Engineer"}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100">
          {data.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" /> {data.email}
            </span>
          )}
          {data.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" /> {data.phone}
            </span>
          )}
          {data.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> {data.location}
            </span>
          )}
          {data.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-400" /> {data.linkedin}
            </span>
          )}
          {data.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-400" /> {data.github}
            </span>
          )}
        </div>
      </header>

      {/* Ordered Sections */}
      {sections.map((key) => (
        <SectionBlock key={key} sectionKey={key} data={data} style={style} />
      ))}
    </div>
  );
}
