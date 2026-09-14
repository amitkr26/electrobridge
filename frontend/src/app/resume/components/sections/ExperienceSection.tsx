"use client";

import { useState } from "react";
import { Plus, GripVertical, Sparkles, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { ResumeData, ExpItem } from "../../types";

interface ExperienceSectionProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onRequestAI: (itemId: string) => void;
  isAILoading: boolean;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

function emptyExp(): ExpItem {
  return { id: crypto.randomUUID(), role: "", org: "", period: "", detail: "" };
}

export default function ExperienceSection({ data, onChange, onRequestAI, isAILoading }: ExperienceSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const updateItem = (index: number, field: keyof ExpItem, value: string) => {
    const updated = [...data.experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, experience: updated });
  };

  const addItem = () => {
    const updated = [...data.experience, emptyExp()];
    onChange({ ...data, experience: updated });
    setExpandedIndex(updated.length - 1);
  };

  const removeItem = (index: number) => {
    const updated = data.experience.filter((_, i) => i !== index);
    onChange({ ...data, experience: updated });
    setExpandedIndex(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-slate-900">Experience</h3>
        {data.experience.length > 0 && (
          <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">
            {data.experience.length}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {data.experience.length === 0 && (
          <div className="text-center py-6 text-slate-400">
            <p className="text-sm">No experience added yet</p>
            <p className="text-xs mt-1">Click the button below to add your first experience</p>
          </div>
        )}
        {data.experience.map((item, index) => {
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
                      {item.role || "Untitled Role"}
                    </span>
                    <span className="text-xs text-slate-500 truncate block">
                      {item.org}{item.period ? ` · ${item.period}` : ""}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                  className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0"
                  aria-label="Remove experience"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-3 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Job Title</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.role}
                        onChange={(e) => updateItem(index, "role", e.target.value)}
                        placeholder="Senior VLSI Engineer"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Company</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={item.org}
                        onChange={(e) => updateItem(index, "org", e.target.value)}
                        placeholder="Qualcomm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Period</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={item.period}
                      onChange={(e) => updateItem(index, "period", e.target.value)}
                      placeholder="Jan 2022 - Present"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      className={inputClass}
                      rows={4}
                      value={item.detail}
                      onChange={(e) => updateItem(index, "detail", e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                  <button
                    onClick={() => onRequestAI(item.id ?? index.toString())}
                    disabled={isAILoading}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    {isAILoading ? "Polishing..." : "AI Bullet Polish"}
                  </button>
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
        Add Experience
      </button>
    </div>
  );
}
