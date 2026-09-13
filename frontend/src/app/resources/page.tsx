"use client";

import {
  Route, BookOpen, FileText, DollarSign, Building2, TrendingUp,
  ArrowRight, Target, Zap, Users, Star,
} from "lucide-react";

const RESOURCES = [
  {
    icon: Route,
    title: "Career Roadmap",
    description: "From fresher to senior engineer — a step-by-step career path in semiconductor design and verification.",
    color: "bg-blue-50 text-blue-600",
    tags: ["Career Path", "Fresher Guide"],
  },
  {
    icon: BookOpen,
    title: "Interview Preparation",
    description: "Common interview questions on digital design, STA, UVM, and system architecture — with answers.",
    color: "bg-emerald-50 text-emerald-600",
    tags: ["Interviews", "Q&A"],
  },
  {
    icon: FileText,
    title: "Resume Writing Tips",
    description: "What recruiters look for: project impact, tool proficiency, and quantifiable results.",
    color: "bg-violet-50 text-violet-600",
    tags: ["Resume", "ATS"],
  },
  {
    icon: DollarSign,
    title: "Salary Guide",
    description: "Industry salaries for RTL design, verification, DFT, and physical design roles.",
    color: "bg-amber-50 text-amber-600",
    tags: ["Salary", "Compensation"],
  },
  {
    icon: Building2,
    title: "Top Companies Hiring",
    description: "Who's hiring — major semiconductor companies and their recruitment patterns.",
    color: "bg-rose-50 text-rose-600",
    tags: ["Companies", "Hiring"],
  },
  {
    icon: TrendingUp,
    title: "Skill Development Path",
    description: "What to learn and when — SystemVerilog, UVM, low-power design, timing analysis, and beyond.",
    color: "bg-cyan-50 text-cyan-600",
    tags: ["Skills", "Learning"],
  },
];

const tips = [
  { text: "Build 2-3 strong projects with measurable outcomes", icon: Star },
  { text: "Master one EDA tool deeply — Vivado, Design Compiler, or QuestaSim", icon: Zap },
  { text: "Contribute to open-source RTL repos on GitHub for visibility", icon: Users },
  { text: "Apply through employee referrals — 3x higher response rate", icon: Target },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white font-sans">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> Career Resources
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Resources for{" "}
            <span className="text-gradient-primary">career growth</span>
          </h1>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            Guides, tips, and tools to help you build a successful engineering career.
          </p>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <div key={resource.title} className="glass-premium rounded-xl p-6 group cursor-pointer">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${resource.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Tips */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-premium rounded-xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" /> Quick Career Tips
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tips.map((tip, i) => {
                const TipIcon = tip.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <TipIcon className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-600">{tip.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
