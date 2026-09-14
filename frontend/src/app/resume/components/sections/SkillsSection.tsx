"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { ResumeData } from "../../types";

interface SkillsSectionProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

export default function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || data.skills.includes(trimmed)) {
      setNewSkill("");
      return;
    }
    onChange({ ...data, skills: [...data.skills, trimmed] });
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-slate-900">Skills</h3>
        {data.skills.length > 0 && (
          <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">
            {data.skills.length}
          </span>
        )}
      </div>

      {data.skills.length === 0 && (
        <div className="text-center py-4 text-slate-400">
          <p className="text-sm">No skills added yet</p>
          <p className="text-xs mt-1">Type a skill and press Enter to add it.</p>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="text-blue-400 hover:text-red-500 transition ml-0.5"
                aria-label="Remove skill"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          className={inputClass}
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. SystemVerilog, UVM, FPGA..."
        />
        <button
          onClick={addSkill}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  );
}
