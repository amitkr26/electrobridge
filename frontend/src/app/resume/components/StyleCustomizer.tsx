import React from "react";
import { ResumeStyleConfig, SectionKey } from "../types";
import { Palette, Type, Layout, ArrowUp, ArrowDown, Tag, Calendar, FileText, ChevronsUpDown } from "lucide-react";

interface StyleCustomizerProps {
  style: ResumeStyleConfig;
  onChange: (updated: ResumeStyleConfig) => void;
}

const COLOR_PRESETS = [
  { label: "Royal Blue", hex: "#2563EB" },
  { label: "Indigo", hex: "#4F46E5" },
  { label: "Cyan", hex: "#0891B2" },
  { label: "Emerald", hex: "#059669" },
  { label: "Amber", hex: "#D97706" },
  { label: "Crimson", hex: "#DC2626" },
  { label: "Purple", hex: "#7C3AED" },
  { label: "Slate", hex: "#334155" },
];

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

const moveSection = (arr: SectionKey[], from: number, to: number) => {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

export function StyleCustomizer({ style, onChange }: StyleCustomizerProps) {
  const setAccentColor = (color: string) => {
    onChange({ ...style, accentColor: color });
  };

  const setFontFamily = (font: string) => {
    onChange({ ...style, fontFamily: font });
  };

  const setMarginSize = (margin: "compact" | "normal" | "relaxed") => {
    onChange({ ...style, marginSize: margin });
  };

  const setSectionSpacing = (spacing: "compact" | "normal" | "relaxed") => {
    onChange({ ...style, sectionSpacing: spacing });
  };

  const toggleSection = (sectionKey: keyof ResumeStyleConfig["visibleSections"]) => {
    onChange({
      ...style,
      visibleSections: {
        ...style.visibleSections,
        [sectionKey]: !style.visibleSections[sectionKey],
      },
    });
  };

  const moveSectionUp = (idx: number) => {
    if (idx === 0) return;
    onChange({ ...style, sectionOrder: moveSection(style.sectionOrder, idx, idx - 1) });
  };

  const moveSectionDown = (idx: number) => {
    if (idx >= style.sectionOrder.length - 1) return;
    onChange({ ...style, sectionOrder: moveSection(style.sectionOrder, idx, idx + 1) });
  };

  const setSectionLabel = (key: SectionKey, label: string) => {
    onChange({ ...style, sectionLabels: { ...style.sectionLabels, [key]: label } });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-5 shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Palette className="w-4 h-4 text-blue-600" />
        <h3 className="font-bold text-sm text-slate-900">Styling &amp; Formatting</h3>
      </div>

      {/* 1. Accent Color */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Accent Color
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.hex}
              onClick={() => setAccentColor(p.hex)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                style.accentColor === p.hex
                  ? "scale-125 border-slate-900 shadow-sm"
                  : "border-white hover:scale-110"
              }`}
              style={{ backgroundColor: p.hex }}
              title={p.label}
              aria-label={`Select ${p.label}`}
            />
          ))}
          <input
            type="color"
            value={style.accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 p-0.5"
            title="Custom Hex Color"
            aria-label="Custom color picker"
          />
        </div>
      </div>

      {/* 2. Typography */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-slate-400" /> Typography
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { id: "font-sans", label: "Modern Sans" },
            { id: "font-serif", label: "Classic Serif" },
            { id: "font-mono", label: "Technical Mono" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFontFamily(f.id)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                style.fontFamily === f.id
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Margins & Spacing */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-slate-400" /> Page Density
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { id: "compact", label: "Compact" },
            { id: "normal", label: "Standard" },
            { id: "relaxed", label: "Spacious" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMarginSize(m.id as any)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                style.marginSize === m.id
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3b. Section Spacing */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" /> Section Spacing
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { id: "compact", label: "Tight" },
            { id: "normal", label: "Balanced" },
            { id: "relaxed", label: "Airy" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSectionSpacing(s.id as any)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                style.sectionSpacing === s.id
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Page Size */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" /> Page Size
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {(["A4", "Letter"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...style, pageSize: s })}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                style.pageSize === s
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {s === "A4" ? "A4 (210×297mm)" : "Letter (8.5×11in)"}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Date Format */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date Format
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: "MMM YYYY" as const, label: "Jan 2024" },
            { id: "MM/YYYY" as const, label: "01/2024" },
            { id: "YYYY" as const, label: "2024" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => onChange({ ...style, dateFormat: d.id })}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                style.dateFormat === d.id
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Section Order + Labels */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" /> Section Order &amp; Labels
        </label>
        <p className="text-[10px] text-slate-400">Drag to reorder. Click label to rename.</p>
        <div className="space-y-1">
          {style.sectionOrder.map((key, idx) => (
            <div key={key} className="flex items-center gap-1.5 text-xs bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-200">
              <div className="flex flex-col">
                <button onClick={() => moveSectionUp(idx)} disabled={idx === 0} className="text-slate-400 hover:text-blue-600 disabled:opacity-20" aria-label="Move up">
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button onClick={() => moveSectionDown(idx)} disabled={idx === style.sectionOrder.length - 1} className="text-slate-400 hover:text-blue-600 disabled:opacity-20" aria-label="Move down">
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={style.visibleSections[key]}
                  onChange={() => toggleSection(key)}
                  className="w-3 h-3 text-blue-600 rounded border-slate-300"
                />
                <input
                  type="text"
                  value={style.sectionLabels[key] || DEFAULT_LABELS[key]}
                  onChange={(e) => setSectionLabel(key, e.target.value)}
                  className="flex-1 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-xs font-medium text-slate-700 px-1"
                  aria-label={`Label for ${key}`}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
