import { FileText, Sparkles, Settings, Users, Zap, Target, ArrowRight } from "lucide-react";

const OFFERINGS = [
  {
    icon: FileText,
    title: "Free Resume Builder",
    description: "10 professional templates tailored for semiconductor and VLSI engineering roles. ATS-optimized and free forever.",
    color: "from-blue-600 to-blue-800",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Career Assistant",
    description: "Chat with an AI expert in VLSI careers, interview prep, salary negotiation, and career strategy.",
    color: "from-violet-600 to-violet-800",
  },
  {
    icon: Settings,
    title: "ATS Optimization Tools",
    description: "Ensure your resume passes Applicant Tracking Systems with keyword matching and format analysis.",
    color: "from-emerald-600 to-emerald-800",
  },
];

const VALUES = [
  { icon: Target, label: "Engineer-First", desc: "Built by engineers who understand the semiconductor industry from the inside." },
  { icon: Zap, label: "AI-Native", desc: "Leveraging modern AI to automate the tedious parts of job applications." },
  { icon: Users, label: "Community", desc: "By the VLSI community, for the VLSI community. Free tools, no gatekeeping." },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 font-sans">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Users className="w-3.5 h-3.5" /> About ElectroBridge
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Making career tools{" "}
            <span className="text-emerald-400">accessible</span> for every semiconductor engineer
          </h1>
          <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Built by engineers who understand the VLSI industry and believe every engineer deserves professional career tools.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OFFERINGS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{val.label}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built By */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <div className="bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-3">Who Built It</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Built by engineers who understand the VLSI industry — from RTL design floors to verification labs. 
            We know what semiconductor recruiters look for because we&apos;ve been on both sides of the interview table.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="mailto:hello@electrobridge.in"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">hello@electrobridge.in</p>
        </div>
      </section>
    </div>
  );
}
