"use client";

import type { ResumeData } from "../../types";

interface PersonalSectionProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onOpenTemplateSelector: () => void;
  currentTemplateName: string;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

export default function PersonalSection({
  data,
  onChange,
  onOpenTemplateSelector,
  currentTemplateName,
}: PersonalSectionProps) {
  const update = (field: keyof ResumeData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
        <button
          onClick={onOpenTemplateSelector}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
        >
          {currentTemplateName}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            className={inputClass}
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className={labelClass}>Professional Headline</label>
          <input
            type="text"
            className={inputClass}
            value={data.headline}
            onChange={(e) => update("headline", e.target.value)}
            placeholder="Senior VLSI Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={inputClass}
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            className={inputClass}
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            className={inputClass}
            value={data.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="San Jose, CA"
          />
        </div>
        <div>
          <label className={labelClass}>LinkedIn</label>
          <input
            type="text"
            className={inputClass}
            value={data.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div>
          <label className={labelClass}>GitHub</label>
          <input
            type="text"
            className={inputClass}
            value={data.github}
            onChange={(e) => update("github", e.target.value)}
            placeholder="github.com/johndoe"
          />
        </div>
      </div>
    </div>
  );
}
