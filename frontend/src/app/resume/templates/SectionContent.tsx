import React from "react";
import { ResumeData, ResumeStyleConfig, SectionKey } from "../types";

const DEFAULT_LABELS: Record<SectionKey, string> = {
  summary: "Professional Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  publications: "Publications",
  languages: "Languages",
  volunteer: "Volunteer Experience",
  awards: "Awards & Achievements",
  interests: "Interests",
};

export function getSectionLabel(style: ResumeStyleConfig, key: SectionKey): string {
  return style.sectionLabels?.[key] || DEFAULT_LABELS[key];
}

/** Returns visible sections in the configured order. */
export function getOrderedSections(style: ResumeStyleConfig): SectionKey[] {
  return (style.sectionOrder || (Object.keys(style.visibleSections) as SectionKey[])).filter(
    (k) => style.visibleSections[k]
  );
}

/** Maps marginSize config to Tailwind padding classes. */
export function getMarginClass(style: ResumeStyleConfig): string {
  switch (style.marginSize) {
    case "compact": return "p-4";
    case "relaxed": return "p-8";
    case "normal":
    default: return "p-6";
  }
}

/** Maps sectionSpacing config to Tailwind margin-bottom classes for sections. */
export function getSectionSpacingClass(style: ResumeStyleConfig): string {
  switch (style.sectionSpacing) {
    case "compact": return "mb-3";
    case "relaxed": return "mb-7";
    case "normal":
    default: return "mb-5";
  }
}

/** Formats a date string according to the configured dateFormat. */
export function formatDate(dateStr: string | undefined | null, format: ResumeStyleConfig["dateFormat"]): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  // Already simple year or "YYYY" format — return as-is
  if (/^\d{4}$/.test(trimmed)) {
    if (format === "YYYY") return trimmed;
    // For other formats, we can't split a bare year further
    return trimmed;
  }
  // Try to extract month and year from common patterns like "Jan 2024", "01/2024", "January 2024"
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const fullMonthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const shortMonthMap: Record<string, number> = {};
  monthNames.forEach((m, i) => shortMonthMap[m] = i);
  fullMonthNames.forEach((m, i) => shortMonthMap[m] = i);
  const numMonthMap: Record<string, number> = {};
  for (let i = 1; i <= 12; i++) numMonthMap[String(i).padStart(2, "0")] = i - 1;
  numMonthMap["1"] = 0; numMonthMap["2"] = 1; numMonthMap["3"] = 2; numMonthMap["4"] = 3;
  numMonthMap["5"] = 4; numMonthMap["6"] = 5; numMonthMap["7"] = 6; numMonthMap["8"] = 7;
  numMonthMap["9"] = 8; numMonthMap["10"] = 9; numMonthMap["11"] = 10; numMonthMap["12"] = 11;

  let monthIdx: number | null = null;
  let year: string | null = null;

  // Pattern: "Jan 2024" or "January 2024"
  const abbrMatch = trimmed.match(/^(\w+)\s+(\d{4})/);
  if (abbrMatch) {
    const m = abbrMatch[1].toLowerCase();
    monthIdx = shortMonthMap[m] ?? null;
    year = abbrMatch[2];
  }
  // Pattern: "01/2024" or "1/2024"
  if (monthIdx === null) {
    const numMatch = trimmed.match(/^(\d{1,2})\s*[/\-]\s*(\d{4})/);
    if (numMatch) {
      monthIdx = numMonthMap[numMatch[1]] ?? null;
      year = numMatch[2];
    }
  }
  // Pattern: "2024-01" (ISO-ish)
  if (monthIdx === null) {
    const isoMatch = trimmed.match(/^(\d{4})\s*[/\-]\s*(\d{1,2})/);
    if (isoMatch) {
      year = isoMatch[1];
      monthIdx = numMonthMap[isoMatch[2]] ?? null;
    }
  }
  // Pattern: range like "Jan 2023 - Present" or "01/2023 - 06/2024"
  // We only format the first date in the range
  if (trimmed.includes("-") || trimmed.includes("–")) {
    const parts = trimmed.split(/[-–]/);
    if (parts.length >= 2) {
      return formatDate(parts[0].trim(), format) + " – " + formatDate(parts.slice(1).join("-").trim(), format);
    }
  }

  if (monthIdx === null || year === null) {
    // Cannot parse — return as-is
    return trimmed;
  }

  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const paddedMonth = String(monthIdx + 1).padStart(2, "0");

  switch (format) {
    case "MMM YYYY": return `${shortMonths[monthIdx]} ${year}`;
    case "MM/YYYY": return `${paddedMonth}/${year}`;
    case "YYYY": return year;
    default: return `${shortMonths[monthIdx]} ${year}`;
  }
}

interface SectionBlockProps {
  sectionKey: SectionKey;
  data: ResumeData;
  style: ResumeStyleConfig;
  /** Render function for the section header title */
  renderTitle?: (label: string) => React.ReactNode;
  /** Render function for the entire section element. Overrides default <section> wrapper. */
  renderSection?: (header: React.ReactNode, content: React.ReactNode) => React.ReactNode;
  /** Extra className for the <section> wrapper (ignored when renderSection is provided) */
  className?: string;
  /** Extra className for the <h2> header */
  headerClassName?: string;
}

/**
 * Generic section renderer. Each template can use this or render sections directly.
 * It handles visibility, label lookup, and empty-data checks.
 */
export function SectionBlock({ sectionKey, data, style, className, headerClassName = "", renderTitle, renderSection }: SectionBlockProps) {
  // ponytail: lazy default derived from styleConfig instead of hardcoded
  const resolvedClassName = className ?? getSectionSpacingClass(style);
  if (!style.visibleSections[sectionKey]) return null;
  const label = getSectionLabel(style, sectionKey);
  const { accentColor } = style;

  const header = renderTitle ? (
    <>{renderTitle(label)}</>
  ) : (
    <h2
      className={`text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b border-slate-200 ${headerClassName}`}
      style={{ color: accentColor }}
    >
      {label}
    </h2>
  );

  const content = renderSectionContent(sectionKey, data, style);
  if (!content) return null;

  if (renderSection) {
    return <>{renderSection(header, content)}</>;
  }

  return (
    <section className={resolvedClassName}>
      {header}
      {content}
    </section>
  );
}

function renderSectionContent(key: SectionKey, data: ResumeData, style: ResumeStyleConfig): React.ReactNode {
  const { accentColor } = style;

  switch (key) {
    case "summary":
      if (!data.summary) return null;
      return <p className="text-xs leading-relaxed text-slate-700">{data.summary}</p>;

    case "experience":
      if (!data.experience?.length) return null;
      return (
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i} className="text-xs break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>
                  {exp.role || "Role"} •{" "}
                  <span className="font-semibold text-slate-700">{exp.org}</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">{formatDate(exp.period, style.dateFormat)}</span>
              </div>
              {exp.detail && (
                <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{exp.detail}</p>
              )}
            </div>
          ))}
        </div>
      );

    case "education":
      if (!data.education?.length) return null;
      return (
        <div className="space-y-2.5">
          {data.education.map((edu, i) => (
            <div key={i} className="text-xs flex justify-between items-baseline break-inside-avoid">
              <div>
                <p className="font-bold text-slate-900">
                  {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                </p>
                <p className="text-slate-600 text-[11px]">{edu.school}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[11px]">{formatDate(edu.year, style.dateFormat)}</span>
                {edu.cgpa && <p className="text-slate-700 font-semibold text-[10px]">CGPA: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      );

    case "skills":
      if (!data.skills?.length) return null;
      return (
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[10.5px] font-semibold rounded-md border border-slate-200/80"
            >
              {skill}
            </span>
          ))}
        </div>
      );

    case "projects":
      if (!data.projects?.length) return null;
      return (
        <div className="space-y-3">
          {data.projects.map((proj, i) => (
            <div key={i} className="text-xs break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">{proj.name}</span>
                {proj.technologies && (
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    {proj.technologies}
                  </span>
                )}
              </div>
              {proj.detail && <p className="text-slate-600 mt-1 leading-relaxed">{proj.detail}</p>}
            </div>
          ))}
        </div>
      );

    case "certifications":
      if (!data.certifications?.length) return null;
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
          {data.certifications.map((c, i) => (
            <span key={i}>
              • {c.name} {c.year ? `(${formatDate(c.year, style.dateFormat)})` : ""}
            </span>
          ))}
        </div>
      );

    case "publications":
      if (!data.publications?.length) return null;
      return (
        <div className="space-y-1 text-xs text-slate-700">
          {data.publications.map((p, i) => (
            <div key={i} className="break-inside-avoid">
              <span className="font-semibold">{p.title}</span>
              {p.venue && <span className="text-slate-500"> — {p.venue}</span>}
              {p.year && <span className="text-slate-400"> ({formatDate(p.year, style.dateFormat)})</span>}
              {p.doi && <span className="text-slate-400 block text-[10px]">DOI: {p.doi}</span>}
            </div>
          ))}
        </div>
      );

    case "languages":
      if (!data.languages?.length) return null;
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
          {data.languages.map((l, i) => (
            <span key={i}>
              <span className="font-semibold">{l.name}</span>
              {l.proficiency && <span className="text-slate-500"> — {l.proficiency}</span>}
            </span>
          ))}
        </div>
      );

    case "volunteer":
      if (!data.volunteer?.length) return null;
      return (
        <div className="space-y-3">
          {data.volunteer.map((v, i) => (
            <div key={i} className="text-xs break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>
                  {v.role || "Role"} •{" "}
                  <span className="font-semibold text-slate-700">{v.org}</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">{formatDate(v.period, style.dateFormat)}</span>
              </div>
              {v.detail && (
                <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{v.detail}</p>
              )}
            </div>
          ))}
        </div>
      );

    case "awards":
      if (!data.awards?.length) return null;
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
          {data.awards.map((a, i) => (
            <span key={i}>
              • {a.name} {a.issuer ? `— ${a.issuer}` : ""} {a.year ? `(${formatDate(a.year, style.dateFormat)})` : ""}
            </span>
          ))}
        </div>
      );

    case "interests":
      if (!data.interests?.length) return null;
      return (
        <div className="flex flex-wrap gap-1.5">
          {data.interests.map((interest, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[10.5px] font-semibold rounded-md border border-slate-200/80"
            >
              {interest}
            </span>
          ))}
        </div>
      );

    default:
      return null;
  }
}
