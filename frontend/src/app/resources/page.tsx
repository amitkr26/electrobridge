"use client";

import {
  Route, BookOpen, FileText, DollarSign, Building2, TrendingUp,
  ArrowRight, Mail, ChevronRight, Star, Zap, Target, Users
} from "lucide-react";

const RESOURCES = [
  {
    icon: Route,
    title: "VLSI Career Roadmap",
    description: "From fresher to senior engineer — a step-by-step career path in semiconductor design and verification.",
    color: "from-blue-600 to-blue-800",
    bgColor: "bg-blue-950/30",
    borderColor: "border-blue-800/30",
    tags: ["Career Path", "Fresher Guide"],
  },
  {
    icon: BookOpen,
    title: "Interview Preparation Guide",
    description: "Common VLSI interview questions on digital design, STA, UVM, and system architecture — with answers.",
    color: "from-emerald-600 to-emerald-800",
    bgColor: "bg-emerald-950/30",
    borderColor: "border-emerald-800/30",
    tags: ["Interviews", "Q&A"],
  },
  {
    icon: FileText,
    title: "Resume Tips for VLSI",
    description: "What semiconductor recruiters look for: project impact, tool proficiency, and quantifiable results.",
    color: "from-violet-600 to-violet-800",
    bgColor: "bg-violet-950/30",
    borderColor: "border-violet-800/30",
    tags: ["Resume", "ATS"],
  },
  {
    icon: DollarSign,
    title: "Salary Guide",
    description: "Semiconductor industry salaries in India — RTL design, verification, DFT, physical design roles.",
    color: "from-amber-600 to-amber-800",
    bgColor: "bg-amber-950/30",
    borderColor: "border-amber-800/30",
    tags: ["Salary", "India"],
  },
  {
    icon: Building2,
    title: "Top Companies Hiring",
    description: "DRDO, ISRO, Intel, Qualcomm, AMD, Samsung, TSMC, Texas Instruments — who's hiring in India.",
    color: "from-rose-600 to-rose-800",
    bgColor: "bg-rose-950/30",
    borderColor: "border-rose-800/30",
    tags: ["Companies", "Hiring"],
  },
  {
    icon: TrendingUp,
    title: "Skill Development Path",
    description: "What to learn and when — SystemVerilog, UVM, low-power design, timing analysis, and beyond.",
    color: "from-cyan-600 to-cyan-800",
    bgColor: "bg-cyan-950/30",
    borderColor: "border-cyan-800/30",
    tags: ["Skills", "Learning"],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 font-sans">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> Career Growth Resources
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Career Resources for{" "}
            <span className="text-blue-400">Semiconductor Engineers</span>
          </h1>
          <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Everything you need to build a successful career in VLSI, ASIC design, and semiconductor engineering.
          </p>
        </div>
      </section>

      {/* Resource Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.title}
                className={`group ${resource.bgColor} border ${resource.borderColor} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" /> Quick Career Tips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { text: "Build at least 2-3 strong VLSI projects with measurable outcomes", icon: Star },
              { text: "Master one EDA tool deeply — Vivado, Design Compiler, or QuestaSim", icon: Zap },
              { text: "Contribute to open-source RTL repos on GitHub for visibility", icon: Users },
              { text: "Apply through employee referrals — 3x higher response rate", icon: Target },
            ].map((tip, i) => {
              const TipIcon = tip.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
                  <TipIcon className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300">{tip.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <Mail className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Stay Updated</h2>
          <p className="text-slate-400 text-sm mb-6">
            Get the latest VLSI job openings, career tips, and semiconductor industry insights.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
