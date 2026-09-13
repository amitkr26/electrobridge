import Link from "next/link";
import { BarChart3, ArrowRight, CheckCircle2, FileText, Search, Zap } from "lucide-react";

export default function ATSResumeCheckerPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white font-sans">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <BarChart3 className="w-3.5 h-3.5" />
            Free ATS Resume Checker
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Will Your Resume Pass the{" "}
            <span className="text-gradient-primary">ATS Scan?</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Check your resume against Applicant Tracking Systems. Get a detailed compatibility score, identify keyword gaps, and receive actionable improvements — completely free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/resume-review" className="btn-glow px-7 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              Check Your ATS Score <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/resume" className="px-7 py-3 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all inline-flex items-center gap-2">
              <FileText className="w-4 h-4" /> Build Resume First
            </Link>
          </div>
        </div>
      </section>

      {/* What We Check */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">
          What Our ATS Checker Analyzes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Search, title: "Keyword Matching", description: "Identifies missing industry-specific keywords that ATS systems look for." },
            { icon: FileText, title: "Format Analysis", description: "Checks formatting consistency, section structure, and ATS-compatible layout." },
            { icon: BarChart3, title: "Section Scoring", description: "Evaluates each resume section for completeness and relevance." },
            { icon: Zap, title: "JD Matching", description: "Paste a job description to get a match score and tailored improvement suggestions." },
            { icon: CheckCircle2, title: "Actionable Fixes", description: "Get specific recommendations you can apply immediately to improve your score." },
            { icon: FileText, title: "Instant Results", description: "No waiting, no sign-up. Upload your resume and get your score in seconds." },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass-premium rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-1.5">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Upload or Paste", description: "Upload your resume PDF/DOCX or paste the text directly." },
              { step: "2", title: "Get Your Score", description: "Our ATS analyzer checks keywords, formatting, and section quality." },
              { step: "3", title: "Improve & Apply", description: "Follow the recommendations, then apply with confidence." },
            ].map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">{step}</div>
                <h3 className="font-bold text-sm mb-1">{title}</h3>
                <p className="text-slate-500 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Ready to check your resume?
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto mb-8">
            No sign-up required. Get your ATS score in seconds.
          </p>
          <Link href="/resume-review" className="btn-glow px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
            Check ATS Score Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
