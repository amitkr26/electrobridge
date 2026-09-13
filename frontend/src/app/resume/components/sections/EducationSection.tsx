"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { ResumeData, EduItem } from "../../types";

interface EducationSectionProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

function emptyEdu(): EduItem {
  return { id: crypto.randomUUID(), school: "", degree: "", field: "", year: "", cgpa: "" };
}

export default function EducationSection({ data, onChange }: EducationSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const updateItem = (index: number, field: keyof EduItem, value: string) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, education: updated });
  };

  const addItem = () => {
    const updated = [...data.education, emptyEdu()];
    onChange({ ...data, education: updated });
    setExpandedIndex(updated.length - 1);
  };

  const removeItem = (index: number) => {
    const updated = data.education.filter((_, i) => i !== index);
    onChange({ ...data, education: updated });
    setExpandedIndex(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-slate-900">Education</h3>
        {data.education.length > 0 && (
          <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">
            {data.education.length}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {data.education.length === 0 && (
          <div className="text-center py-6 text-slate-400">
            <p className="text-sm">No education added yet</p>
            <p className="text-xs mt-1">Click the button below to add your first education</p>
          </div>
        )}
        {data.education.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div key={item.id ?? index} className="border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GripVertical size={14} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 shrink-0" />
                  <span className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-slate-900 truncate block">
                      {item.degree || "Untitled Degree"}
                    </span>
                    <span className="text-xs text-slate-500 truncate block">
                      {item.school}{item.year ? ` · ${item.year}` : ""}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                  className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-3 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>School</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.school}
                        onChange={(e) => updateItem(index, "school", e.target.value)}
                        placeholder="IIT Bombay"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Degree</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.degree}
                        onChange={(e) => updateItem(index, "degree", e.target.value)}
                        placeholder="B.Tech"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.year}
                        onChange={(e) => updateItem(index, "year", e.target.value)}
                        placeholder="2018 - 2022"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>CGPA</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.cgpa ?? ""}
                        onChange={(e) => updateItem(index, "cgpa", e.target.value)}
                        placeholder="8.5 / 10"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={addItem}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
      >
        <Plus size={14} />
        Add Education
      </button>
    </div>
  );
}
