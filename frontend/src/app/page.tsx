import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Sparkles,
  BarChart3,
  Briefcase,
  Search,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  Target,
  Shield,
  Pen,
  TrendingUp,
} from "lucide-react";

/* ── Product pillars ─────────────────────────────────────────────────────── */

const pillars = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "10 ATS-optimized templates. Drag-and-drop section ordering. Live preview. Professional PDF export.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Sparkles,
    title: "AI Career Assistant",
    description: "Get AI-powered resume improvements, skill gap analysis, and career guidance — context-aware, not generic.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Briefcase,
    title: "Job Discovery",
    description: "Browse curated opportunities. Save roles. Track applications. Match your resume to job descriptions.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: BarChart3,
    title: "ATS Score Checker",
    description: "Upload your resume or paste a job description. Get a detailed compatibility report with actionable fixes.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Pen,
    title: "Cover Letter Builder",
    description: "AI-generated, job-specific cover letters that match your resume design. Tailored to each application.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: TrendingUp,
    title: "Career Resources",
    description: "Interview prep, salary guides, career roadmaps, and skill development paths — all free.",
    color: "bg-cyan-50 text-cyan-600",
  },
];

/* ── How it works ────────────────────────────────────────────────────────── */

const steps = [
  { icon: Search, label: "Discover", description: "Find opportunities that match your skills and goals." },
  { icon: FileText, label: "Build", description: "Create or import your resume with our professional editor." },
  { icon: Target, label: "Optimize", description: "AI tailors your resume for each specific job description." },
  { icon: Shield, label: "Apply", description: "Check ATS compatibility, then apply with confidence." },
];

/* ── Comparison ──────────────────────────────────────────────────────────── */

const comparisons = [
  { feature: "Resume Builder", electrobridge: true, flowcv: true },
  { feature: "ATS Score Analysis", electrobridge: true, flowcv: true },
  { feature: "PDF Export", electrobridge: true, flowcv: true },
  { feature: "AI Career Assistant", electrobridge: true, flowcv: false },
  { feature: "Job Matching & Discovery", electrobridge: true, flowcv: false },
  { feature: "Application Tracker", electrobridge: true, flowcv: false },
  { feature: "Cover Letter Builder", electrobridge: true, flowcv: true },
  { feature: "Resume-to-Job Optimization", electrobridge: true, flowcv: false },
  { feature: "100% Free", electrobridge: true, flowcv: true },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="bg-white text-slate-900">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Free Forever &bull; No Account Required
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Build your resume.{" "}
            <span className="text-gradient-primary">Find better jobs.</span>{" "}
            Get hired.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            An all-in-one career platform with a professional resume builder, AI-powered career assistance,
            job matching, ATS optimization, and career resources — completely free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/resume"
              className="btn-glow px-7 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
            >
              Build Your Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ask-ai"
              className="px-7 py-3 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI
            </Link>
            <Link
              href="/templates"
              className="px-7 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all inline-flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      {/* ── Product pillars ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your complete career toolkit
          </h2>
          <p className="mt-3 text-slate-500 text-base max-w-xl mx-auto">
            Everything you need to discover opportunities, build a professional resume, and get hired.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="glass-premium rounded-xl p-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-1.5">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              From discovery to hire
            </h2>
            <p className="mt-3 text-slate-500 text-base">
              A complete career workflow, not just a resume builder.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, label, description }, i) => (
              <div key={label} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-full w-full h-px bg-slate-200" />
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-sm">{label}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed pl-[52px]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ElectroBridge ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              More than a resume builder
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-6">
              ElectroBridge combines resume building with job-search intelligence. Paste a job description,
              and AI will tailor your resume for that specific role. Track every application.
              Know your ATS score before you apply.
            </p>
            <div className="space-y-3">
              {[
                "Context-aware AI that knows your resume and target role",
                "Resume-to-job matching with skill gap analysis",
                "Application tracking across your entire job search",
                "Professional templates that pass automated screening",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-premium rounded-xl p-6 border border-slate-200">
            <div className="text-center mb-5">
              <div className="text-4xl font-extrabold text-blue-600 mb-1">100%</div>
              <div className="text-slate-500 text-sm font-medium">Free. No catches.</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                { value: "10", label: "Templates" },
                { value: "AI", label: "Career Coach" },
                { value: "ATS", label: "Score Check" },
                { value: "0", label: "Hidden Fees" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="text-lg font-bold text-slate-900">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Why ElectroBridge?
            </h2>
            <p className="mt-3 text-slate-500 text-sm">
              Compared to other free resume builders
            </p>
          </div>
          <div className="glass-premium rounded-xl overflow-hidden border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-blue-600">ElectroBridge</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-400">Others</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map(({ feature, electrobridge, flowcv }, i) => (
                  <tr key={feature} className={i < comparisons.length - 1 ? "border-b border-slate-100" : ""}>
                    <td className="py-2.5 px-4 text-slate-600">{feature}</td>
                    <td className="py-2.5 px-4 text-center">
                      {electrobridge ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300">&mdash;</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {flowcv ? (
                        <CheckCircle2 className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-slate-300">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Start building your career today
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto mb-8">
            No sign-up. No credit card. Just a professional resume and the tools to get hired.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/resume"
              className="btn-glow px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
            >
              Build Your Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ask-ai"
              className="px-8 py-3 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Try AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
