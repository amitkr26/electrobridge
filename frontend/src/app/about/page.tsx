import { FileText, Sparkles, BarChart3, Users, Zap, Target, ArrowRight, Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ElectroBridge - a free career platform for engineers.",
};

const OFFERINGS = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "10 professional templates with live preview, section reordering, and ATS-optimized formatting. Free forever.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Sparkles,
    title: "AI Career Assistant",
    description: "Context-aware AI that knows your resume, skills, and target role. Get tailored career guidance, not generic advice.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "ATS Optimization",
    description: "Check your resume against Applicant Tracking Systems. Get keyword matching, formatting analysis, and actionable fixes.",
    color: "bg-violet-50 text-violet-600",
  },
];

const VALUES = [
  { icon: Target, label: "Engineer-First", desc: "Built by engineers who understand the semiconductor industry from the inside." },
  { icon: Zap, label: "AI-Native", desc: "Leveraging modern AI to automate the tedious parts of job applications." },
  { icon: Users, label: "Community", desc: "By the engineering community, for the engineering community. Free tools, no gatekeeping." },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white font-sans">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Users className="w-3.5 h-3.5" /> About ElectroBridge
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Making career tools{" "}
            <span className="text-gradient-primary">accessible</span> for every engineer
          </h1>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            Built by engineers who believe every professional deserves access to high-quality career tools — for free.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OFFERINGS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-premium rounded-xl p-6">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-premium rounded-xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {VALUES.map((val) => {
                const Icon = val.icon;
                return (
                  <div key={val.label} className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{val.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Built By */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="glass-premium rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Who Built It</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
            Built by engineers who understand the industry — from design floors to verification labs.
            We know what recruiters look for because we&apos;ve been on both sides of the interview table.
          </p>
          <div className="mt-6">
            <a
              href="mailto:hello@electrobridge.in"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-400">hello@electrobridge.in</p>
        </div>
      </section>
    </div>
  );
}
