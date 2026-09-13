import Link from "next/link";
import { Sparkles, ArrowRight, FileText, BarChart3, CheckCircle2, MessageSquare, Wand2 } from "lucide-react";

export default function AIResumeBuilderPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white font-sans">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Resume Builder
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Build a Better Resume with{" "}
            <span className="text-gradient-primary">AI Assistance</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Create an ATS-optimized resume with AI-powered suggestions, professional templates, and intelligent content enhancement. Free for engineers and job seekers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/resume" className="btn-glow px-7 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              Start Building <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/templates" className="px-7 py-3 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all inline-flex items-center gap-2">
              <FileText className="w-4 h-4" /> Browse Templates
            </Link>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">
          AI-Powered Resume Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Sparkles, title: "AI Content Suggestions", description: "Get intelligent suggestions for your summary, experience bullets, and skills based on your target role." },
            { icon: Wand2, title: "AI Bullet Polish", description: "Transform weak bullet points into impactful, achievement-focused statements with AI enhancement." },
            { icon: BarChart3, title: "ATS Score Analysis", description: "Real-time ATS compatibility scoring with specific recommendations to improve your score." },
            { icon: MessageSquare, title: "AI Career Chat", description: "Ask our AI assistant about career strategy, interview prep, salary negotiation, and more." },
            { icon: FileText, title: "10 Professional Templates", description: "ATS-optimized templates designed for engineers, VLSI professionals, and technical roles." },
            { icon: CheckCircle2, title: "Job Description Matching", description: "Paste a job description and get a match score with tailored resume improvements." },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass-premium rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-1.5">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who It's For */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">
            Built for Engineers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {["VLSI Engineers", "RTL Designers", "Verification Engineers", "Physical Design", "ASIC Designers", "Embedded Engineers", "Hardware Engineers", "Electronics Engineers"].map((role) => (
              <div key={role} className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center text-sm font-medium text-slate-700">
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Build your resume with AI
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto mb-8">
            Free. No sign-up. Professional results.
          </p>
          <Link href="/resume" className="btn-glow px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
            Start Building Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
