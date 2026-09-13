"use client";

import { User, FileText, Briefcase, GraduationCap, Code, FolderGit2, Award, BookOpen } from "lucide-react";
import type { ResumeData } from "../../types";

interface SectionNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  resumeData: ResumeData;
}

const sections = [
  { key: "personal", label: "Personal", icon: User },
  { key: "summary", label: "Summary", icon: FileText },
  { key: "experience", label: "Experience", icon: Briefcase, countKey: "experience" as const },
  { key: "education", label: "Education", icon: GraduationCap, countKey: "education" as const },
  { key: "skills", label: "Skills", icon: Code },
  { key: "projects", label: "Projects", icon: FolderGit2, countKey: "projects" as const },
  { key: "certifications", label: "Certifications", icon: Award, countKey: "certifications" as const },
  { key: "publications", label: "Publications", icon: BookOpen, countKey: "publications" as const },
];

function hasData(resumeData: ResumeData, key: string): boolean {
  switch (key) {
    case "personal":
      return Boolean(resumeData.fullName || resumeData.email);
    case "summary":
      return Boolean(resumeData.summary);
    case "experience":
      return resumeData.experience.length > 0;
    case "education":
      return resumeData.education.length > 0;
    case "skills":
      return resumeData.skills.length > 0;
    case "projects":
      return resumeData.projects.length > 0;
    case "certifications":
      return resumeData.certifications.length > 0;
    case "publications":
      return resumeData.publications.length > 0;
    default:
      return false;
  }
}

function getCount(resumeData: ResumeData, key?: string): number {
  if (!key) return 0;
  const val = resumeData[key as keyof ResumeData];
  return Array.isArray(val) ? val.length : 0;
}

export default function SectionNav({ activeSection, onSectionChange, resumeData }: SectionNavProps) {
  return (
    <nav className="w-[200px] min-w-[200px] bg-white border-r border-slate-200 h-full overflow-y-auto py-4">
      <div className="space-y-1 px-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.key;
          const isComplete = hasData(resumeData, section.key);
          const count = section.countKey ? getCount(resumeData, section.countKey) : 0;

          return (
            <button
              key={section.key}
              onClick={() => onSectionChange(section.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 -ml-px"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent -ml-px"
              }`}
            >
              <Icon size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />
              <span className="flex-1">{section.label}</span>
              {count > 0 && (
                <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
              {isComplete && count === 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
