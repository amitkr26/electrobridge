import React from "react";
import { Sparkles, Briefcase, FileText, Route, Building2, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  onSelectSuggestion: (query: string) => void;
}

const TASK_CARDS = [
  {
    icon: Briefcase,
    title: "Find Jobs",
    description: "Discover VLSI, RTL, verification, and semiconductor roles across India",
    color: "from-blue-600 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    query: "Find fresher VLSI and physical design job opportunities across Indian semiconductor companies.",
  },
  {
    icon: FileText,
    title: "Improve Resume",
    description: "Get AI-powered feedback to optimize your resume for semiconductor roles",
    color: "from-emerald-600 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    query: "Analyze my resume for RTL Design Engineer roles. What skills and keywords am I missing for semiconductor positions?",
  },
  {
    icon: Route,
    title: "Plan Career",
    description: "Get a personalized roadmap for your semiconductor engineering career",
    color: "from-purple-600 to-violet-600",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    query: "What is the complete roadmap and prerequisite skillset to become an RTL Design Engineer from scratch?",
  },
  {
    icon: Building2,
    title: "Research & Government",
    description: "JRF, PhD, DRDO, ISRO openings with eligibility and deadline tracking",
    color: "from-amber-600 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    query: "What are the latest JRF/SRF and PhD research openings in microelectronics and semiconductor research?",
  },
];

export function EmptyState({ onSelectSuggestion }: EmptyStateProps) {
  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 px-4 flex flex-col items-center text-center space-y-6">
      {/* Hero Icon & Title */}
      <div className="space-y-3 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Career Copilot
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
            AI-powered guidance for semiconductor, VLSI, and electronics careers in India.
          </p>
        </div>
      </div>

      {/* Task Cards — 2x2 Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TASK_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => onSelectSuggestion(card.query)}
              className={`flex items-start gap-3 p-4 rounded-2xl border ${card.border} ${card.bg} hover:shadow-md transition-all text-left group`}
            >
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-bold ${card.text}`}>
                    {card.title}
                  </p>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  {card.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick prompts */}
      <div className="w-full space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Quick Questions
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "GATE ECE 6-month strategy",
            "SystemVerilog UVM roadmap",
            "DRDO eligibility criteria",
            "VLSI fresher salary ranges",
          ].map((q) => (
            <button
              key={q}
              onClick={() => onSelectSuggestion(q)}
              className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 px-3 py-1.5 rounded-xl transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
