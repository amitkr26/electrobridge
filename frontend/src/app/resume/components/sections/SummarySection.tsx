"use client";

import { Sparkles } from "lucide-react";
import type { ResumeData } from "../../types";

interface SummarySectionProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onRequestAI: () => void;
  isAILoading: boolean;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

export default function SummarySection({ data, onChange, onRequestAI, isAILoading }: SummarySectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
        <button
          onClick={onRequestAI}
          disabled={isAILoading}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
        >
          <Sparkles size={14} />
          {isAILoading ? "Polishing..." : "AI Polish"}
        </button>
      </div>

      <div>
        <label className={labelClass}>Summary</label>
        <textarea
          className={inputClass}
          rows={4}
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="Write a concise 2-4 sentence summary..."
        />
        <p className="text-xs text-slate-400 mt-1">
          Tip: Mention your domain expertise, years of experience, and key technical strengths.
        </p>
      </div>
    </div>
  );
}
