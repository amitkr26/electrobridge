import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Sparkles,
  BarChart3,
  Upload,
  Palette,
  Wand2,
  Download,
  ArrowRight,
  CheckCircle2,
  Star,
  Quote,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "10 Professional Templates",
    description:
      "ATS-optimized templates designed for semiconductor, VLSI, and chip design roles.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Enhancement",
    description:
      "ATS score analysis, skill gap identification, and intelligent content suggestions.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: MessageSquare,
    title: "Career Assistant",
    description:
      "AI chat for job opportunities, interview prep, and career guidance in semiconductor.",
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

const steps = [
  { icon: Upload, label: "Upload or Build", description: "Import an existing resume or start from scratch." },
  { icon: Palette, label: "Customize", description: "Choose a template and tailor your content." },
  { icon: Wand2, label: "AI Enhance", description: "Let AI optimize your resume for ATS and recruiters." },
  { icon: Download, label: "Download", description: "Export as PDF or DOCX, ready to send." },
];

const templates = [
  { name: "Executive", category: "Senior / Management", color: "from-blue-600 to-blue-800" },
  { name: "Technical", category: "VLSI / RTL Design", color: "from-emerald-600 to-teal-700" },
  { name: "Modern", category: "All Roles", color: "from-violet-600 to-purple-700" },
  { name: "Minimal", category: "Clean & Focused", color: "from-slate-600 to-slate-800" },
];

const testimonials = [
  {
    quote: "Got shortlisted at Qualcomm in 2 weeks. The ATS-optimized template made all the difference.",
    author: "VLSI Design Engineer",
  },
  {
    quote: "AI suggestions were spot-on for RTL roles — it knew exactly what keywords to add for Synopsys applications.",
    author: "RTL Verification Engineer",
  },
  {
    quote: "Best free resume builder for VLSI engineers. No other tool understands semiconductor roles this well.",
    author: "ASIC Design Lead",
  },
  {
    quote: "The skill gap analysis showed me I needed CDC expertise — landed a role at a top fabless firm after upskilling.",
    author: "Physical Design Engineer",
  },
];

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
            <CheckCircle2 className="w-4 h-4" />
            100% Free — No Login Required
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Build Your Dream{" "}
            <span className="text-gradient-primary">Semiconductor Career</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            AI-powered resume builder and career assistant designed for VLSI, chip design, and
            semiconductor engineers. 10 templates, ATS optimization, and career chat — all free.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/resume"
              className="btn-glow px-8 py-3.5 rounded-xl text-base font-semibold inline-flex items-center gap-2"
            >
              Build Your Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ask-ai"
              className="px-8 py-3.5 rounded-xl text-base font-semibold border border-border hover:border-border-hover bg-surface transition-all duration-200 inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat with AI
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything You Need to Land Your Next Role
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">
            Purpose-built for semiconductor professionals. Not another generic resume builder.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="glass-premium rounded-2xl p-8">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-text-secondary leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              From Upload to Offer in 4 Steps
            </h2>
            <p className="mt-4 text-text-secondary text-lg">
              Simple, fast, and optimized for semiconductor hiring pipelines.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, label, description }, i) => (
              <div key={label} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-1">{label}</h3>
                <p className="text-text-secondary text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            10 Professional Templates
          </h2>
          <p className="mt-4 text-text-secondary text-lg">
            ATS-tested and designed to pass automated screening systems.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(({ name, category, color }) => (
            <div key={name} className="glass-premium rounded-2xl overflow-hidden group">
              <div className={`h-40 bg-gradient-to-br ${color} flex items-center justify-center`}>
                <FileText className="w-12 h-12 text-white/80" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-text-muted text-sm mt-1">{category}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            View All 10 Templates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ATS Score Section */}
      <section className="bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="glass-premium rounded-2xl p-10 sm:p-14 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5">
                <BarChart3 className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Will Your Resume Pass the ATS?
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Get a detailed ATS compatibility score with actionable fixes. Know exactly where your
                resume stands before you hit send.
              </p>
              <Link
                href="/resume-review"
                className="btn-glow px-7 py-3 rounded-xl text-base font-semibold inline-flex items-center gap-2"
              >
                Check Your ATS Score
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-full md:w-72 bg-bg-secondary rounded-xl p-6 border border-border">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">87%</div>
                <div className="text-text-secondary text-sm font-medium">ATS Compatibility</div>
              </div>
              <div className="mt-5 space-y-3">
                {["Keywords", "Formatting", "Sections"].map((item) => (
                  <div key={item} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{item}</span>
                    <span className="font-semibold text-emerald-600">
                      {item === "Keywords" ? "92%" : item === "Formatting" ? "85%" : "84%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Trusted by Semiconductor Engineers
          </h2>
          <p className="mt-4 text-text-secondary text-lg">
            Real results from real VLSI professionals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(({ quote, author }) => (
            <div key={author} className="glass-premium rounded-2xl p-6 flex flex-col">
              <Quote className="w-8 h-8 text-blue-200 mb-3" />
              <p className="text-text-primary leading-relaxed flex-1 text-sm">{quote}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-text-muted text-xs font-medium">{author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Start Building Your Resume — It&apos;s Free
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
            No sign-up. No hidden fees. Just a professional resume built for semiconductor roles.
          </p>
          <Link
            href="/resume"
            className="btn-glow px-10 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
