"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutTemplate, ArrowRight, Sparkles } from "lucide-react";

interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  badge?: string;
  color: string;
}

const TEMPLATES: Template[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    slug: "modern-professional",
    category: "Professional",
    description: "Sleek accent bar, 2-column header. Clean hierarchy for semiconductor roles.",
    badge: "Most Popular",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    slug: "minimalist",
    category: "Professional",
    description: "Typography-focused, clean single column. Pure typographic elegance.",
    color: "from-slate-600 to-slate-700",
  },
  {
    id: "classic-corporate",
    name: "Classic Corporate",
    slug: "classic-corporate",
    category: "Professional",
    description: "Traditional professional layout with formal dividers and serif styling.",
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "compact-technical",
    name: "Compact Technical",
    slug: "compact-technical",
    category: "Technical",
    description: "High-density 1-page layout optimized for ASIC & VLSI hardware pros.",
    badge: "Hardware Pro",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "academic-research",
    name: "Academic Research",
    slug: "academic-research",
    category: "Academic",
    description: "Prioritizes research publications, JRF grants, advisor & labs.",
    badge: "JRF / PhD",
    color: "from-purple-600 to-violet-600",
  },
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    slug: "modern-sidebar",
    category: "Professional",
    description: "30/70 split layout with left tinted rail for contact & skills.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "two-column",
    name: "Two Column Grid",
    slug: "two-column",
    category: "Professional",
    description: "Balanced grid displaying experience and projects side-by-side.",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "executive",
    name: "Executive",
    slug: "executive",
    category: "Executive",
    description: "Bold dark header banner with strategic career trajectory focus.",
    color: "from-slate-800 to-slate-900",
  },
  {
    id: "fresher-campus",
    name: "Fresher Campus",
    slug: "fresher-campus",
    category: "Fresher",
    description: "Prioritizes degree credentials, coursework, GATE scores & projects.",
    badge: "Entry Level",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "silicon-tech",
    name: "Silicon Tech",
    slug: "silicon-tech",
    category: "Technical",
    description: "Monospace code styling, tapeout badges, & EDA tool tables.",
    badge: "EDA / ASIC",
    color: "from-emerald-400 to-cyan-500",
  },
];

const CATEGORIES = ["All", "Professional", "Technical", "Academic", "Executive", "Fresher"];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <LayoutTemplate className="w-3.5 h-3.5" />
            10 ATS-Optimized Templates
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Resume Template Gallery
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            Professional layouts tailored for semiconductor, VLSI, research, and hardware engineering careers.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Preview Card */}
              <div className={`h-40 bg-gradient-to-br ${t.color} relative flex items-center justify-center`}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-center">
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-white/60 text-[11px] mt-1">{t.category}</p>
                </div>
                {t.badge && (
                  <span className="absolute top-3 right-3 text-[10px] bg-white/20 backdrop-blur-sm text-white font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {t.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-white font-bold text-base mb-1.5 group-hover:text-emerald-400 transition">
                  {t.name}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  {t.description}
                </p>
                <Link
                  href={`/resume?template=${t.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                >
                  Use This Template
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <p className="text-slate-300 text-sm">
                Not sure which template? Let our AI pick the best one for your role.
              </p>
            </div>
            <Link
              href="/resume"
              className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/25"
            >
              Open Resume Builder
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
