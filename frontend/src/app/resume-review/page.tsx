"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowRight,
  Eye,
  Sparkles,
  Shield,
  Target,
  Zap,
  BarChart3,
} from "lucide-react";

interface ScoreSection {
  name: string;
  score: number;
  maxScore: number;
  status: "pass" | "warn" | "fail";
  details: string[];
}

interface ATSResult {
  overallScore: number;
  sections: ScoreSection[];
  keywordsFound: string[];
  keywordsMissing: string[];
  formattingIssues: string[];
  suggestions: string[];
  jdMatchPercent: number | null;
}

const INITIAL_RESULT: ATSResult = {
  overallScore: 0,
  sections: [],
  keywordsFound: [],
  keywordsMissing: [],
  formattingIssues: [],
  suggestions: [],
  jdMatchPercent: null,
};

function scoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "text-emerald-400";
  if (pct >= 50) return "text-amber-400";
  return "text-red-400";
}

function scoreBg(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function StatusIcon({ status }: { status: "pass" | "warn" | "fail" }) {
  if (status === "pass") return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
  if (status === "warn") return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
}

export default function ResumeReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeResume = useCallback(async (selectedFile: File) => {
    setUploading(true);
    setResult(null);
    setFile(selectedFile);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const parseRes = await fetch("/api/profile/parse-resume", {
        method: "POST",
        body: formData,
      });
      const parseData = await parseRes.json();

      if (!parseRes.ok || !parseData.success) {
        throw new Error(parseData.error || "Failed to parse resume");
      }

      const profile = parseData.profile;

      // Client-side ATS scoring
      const sections: ScoreSection[] = [];

      // Contact
      const contactItems = [profile.email, profile.phone, profile.location].filter(Boolean);
      const contactScore = Math.min(contactItems.length * 2, 20);
      sections.push({
        name: "Contact Information",
        score: contactScore,
        maxScore: 20,
        status: contactScore >= 16 ? "pass" : contactScore >= 10 ? "warn" : "fail",
        details: [
          profile.email ? "Email present" : "Missing email",
          profile.phone ? "Phone present" : "Missing phone",
          profile.location ? "Location present" : "Missing location",
        ],
      });

      // Experience
      const expCount = profile.experience?.length || 0;
      const expScore = Math.min(expCount * 5 + (expCount > 0 ? 5 : 0), 25);
      sections.push({
        name: "Experience",
        score: expScore,
        maxScore: 25,
        status: expScore >= 20 ? "pass" : expScore >= 10 ? "warn" : "fail",
        details: [
          `${expCount} experience entries found`,
          expCount === 0 ? "No experience section detected" : "Good",
        ],
      });

      // Education
      const eduCount = profile.education?.length || 0;
      const eduScore = Math.min(eduCount * 5 + (eduCount > 0 ? 5 : 0), 20);
      sections.push({
        name: "Education",
        score: eduScore,
        maxScore: 20,
        status: eduScore >= 15 ? "pass" : eduScore >= 8 ? "warn" : "fail",
        details: [
          `${eduCount} education entries found`,
          eduCount === 0 ? "No education section detected" : "Good",
        ],
      });

      // Skills
      const skillCount = profile.skills?.length || 0;
      const skillScore = Math.min(skillCount * 2 + (skillCount >= 5 ? 5 : 0), 20);
      sections.push({
        name: "Skills",
        score: skillScore,
        maxScore: 20,
        status: skillScore >= 15 ? "pass" : skillScore >= 8 ? "warn" : "fail",
        details: [
          `${skillCount} skills listed`,
          skillCount < 5 ? "Consider adding more relevant skills" : "Good coverage",
        ],
      });

      // Summary
      const summaryLen = (profile.about || "").length;
      const summaryScore = summaryLen > 50 ? 15 : summaryLen > 20 ? 10 : summaryLen > 0 ? 5 : 0;
      sections.push({
        name: "Professional Summary",
        score: summaryScore,
        maxScore: 15,
        status: summaryScore >= 12 ? "pass" : summaryScore >= 6 ? "warn" : "fail",
        details: [
          summaryLen > 0 ? `${summaryLen} characters` : "No summary found",
          summaryLen < 50 ? "Summary is too brief" : "Good length",
        ],
      });

      const overallScore = sections.reduce((sum, s) => sum + s.score, 0);

      // Keywords — industry defaults + extracted from JD
      const defaultKeywords = [
        "RTL", "Verilog", "SystemVerilog", "UVM", "ASIC", "FPGA", "VLSI",
        "STA", "Synthesis", "DFT", "Formal Verification",
        "Cadence", "Synopsys", "Mentor", "Tcl", "Python", "Linux",
      ];

      // Extract meaningful keywords from JD (3+ letter words, deduplicated)
      const jdKeywords = jobDescription
        .replace(/[^\w\s+#]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !/^(the|and|for|with|this|that|from|have|are|was|will|our|your|you|can|may|must|all|any|but|not|who|what|where|when|how|why|using|used|use|job|role|team|company|years|experience|required|preferred|minimum|ability)$/i.test(w))
        .map((w) => w.replace(/^[#+]+/, ""))
        .filter((w) => w.length >= 3);

      const allKeywords = [...new Set([...defaultKeywords, ...jdKeywords])];
      const allText = JSON.stringify(profile).toLowerCase();
      const keywordsFound = allKeywords.filter((k) => allText.includes(k.toLowerCase()));
      const keywordsMissing = allKeywords.filter((k) => !allText.includes(k.toLowerCase()));
      const jdKeywordCount = jdKeywords.length;
      const jdMatchPercent = jdKeywordCount > 0 ? Math.round((keywordsFound.filter((k) => jdKeywords.includes(k)).length / jdKeywordCount) * 100) : null;

      // Formatting issues
      const formattingIssues: string[] = [];
      if (!profile.email) formattingIssues.push("No email address found");
      if (!profile.phone) formattingIssues.push("No phone number found");
      if (summaryLen < 50) formattingIssues.push("Summary section is too short or missing");
      if (skillCount < 5) formattingIssues.push("Fewer than 5 skills listed");

      // Suggestions
      const suggestions: string[] = [];
      if (expCount === 0) suggestions.push("Add work experience entries with quantifiable achievements");
      if (skillCount < 8) suggestions.push("Add more technical skills relevant to semiconductor roles");
      if (summaryLen < 100) suggestions.push("Expand your professional summary to 2-4 sentences");
      if (keywordsMissing.length > 5) suggestions.push("Include more industry-specific keywords (RTL, Verilog, UVM, etc.)");
      if (jdKeywordCount > 0 && jdMatchPercent !== null && jdMatchPercent < 50) {
        suggestions.push(`Only ${jdMatchPercent}% of JD keywords found — tailor your resume to this specific role`);
      }
      if (!profile.linkedin) suggestions.push("Add your LinkedIn profile URL");
      suggestions.push("Use action verbs to start experience bullet points");
      suggestions.push("Quantify achievements with metrics (%, MHz, nodes, coverage)");

      setResult({
        overallScore,
        sections,
        keywordsFound,
        keywordsMissing: keywordsMissing.slice(0, 10),
        formattingIssues,
        suggestions,
        jdMatchPercent,
      });
    } catch (err: any) {
      setResult({
        overallScore: 0,
        sections: [],
        keywordsFound: [],
        keywordsMissing: [],
        formattingIssues: [err.message || "Failed to analyze resume"],
        suggestions: ["Please try uploading a different file or check the format"],
        jdMatchPercent: null,
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) analyzeResume(droppedFile);
    },
    [analyzeResume]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) analyzeResume(selectedFile);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Shield className="w-3.5 h-3.5" />
            ATS Compatibility Check
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Will Your Resume Pass the ATS?
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Over 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them.
            Upload yours to get an instant ATS compatibility score and actionable feedback.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Instant scoring
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Section-by-section breakdown
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Keyword analysis
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Zone */}
        {!result && (
          <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-12 sm:p-16 text-center transition-all duration-300 ${
              dragOver
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-900/80"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileSelect}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                <div>
                  <p className="text-white font-bold text-sm">Analyzing your resume...</p>
                  <p className="text-slate-500 text-xs mt-1">This usually takes 5-10 seconds</p>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${dragOver ? "text-emerald-400" : "text-slate-600"}`} />
                <p className="text-white font-bold text-base mb-1">
                  Drop your resume here or click to browse
                </p>
                <p className="text-slate-500 text-xs">
                  Supports PDF, DOCX, and TXT files up to 10MB
                </p>
              </>
            )}
          </div>

          {/* Job Description Paste */}
          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Paste Job Description (Optional — improves keyword matching)
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get a personalized keyword match score..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          </>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
                <BarChart3 className="w-3.5 h-3.5" />
                ATS Compatibility Score
              </div>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#1E293B" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={result.overallScore >= 80 ? "#10B981" : result.overallScore >= 50 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="10"
                    strokeDasharray={`${(result.overallScore / 100) * 327} 327`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-extrabold ${scoreColor(result.overallScore, 100)}`}>
                    {result.overallScore}
                  </span>
                  <span className="text-slate-500 text-[10px] font-bold">/100</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs">
                {result.overallScore >= 80
                  ? "Great! Your resume is well-optimized for ATS systems."
                  : result.overallScore >= 50
                  ? "Decent, but there's room for improvement."
                  : "Your resume needs significant optimization for ATS systems."}
              </p>

              {file && (
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                  <FileText className="w-3.5 h-3.5" />
                  {file.name}
                  <button
                    onClick={() => {
                      setResult(null);
                      setFile(null);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold ml-2"
                  >
                    Analyze another
                  </button>
                </div>
              )}
            </div>

            {/* Section Breakdown */}
            {result.sections.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Section-by-Section Breakdown
                </h2>
                <div className="space-y-4">
                  {result.sections.map((section) => (
                    <div key={section.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <StatusIcon status={section.status} />
                          <span className="text-slate-200 text-xs font-bold">{section.name}</span>
                        </div>
                        <span className={`text-xs font-bold ${scoreColor(section.score, section.maxScore)}`}>
                          {section.score}/{section.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${scoreBg(section.score, section.maxScore)}`}
                          style={{ width: `${(section.score / section.maxScore) * 100}%` }}
                        />
                      </div>
                      <div className="pl-6 space-y-0.5">
                        {section.details.map((detail, i) => (
                          <p key={i} className="text-slate-500 text-[11px]">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JD Keyword Match */}
            {result.jdMatchPercent !== null && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
                <h3 className="text-blue-400 font-bold text-xs mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Job Description Match
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-white">{result.jdMatchPercent}%</div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-800 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          result.jdMatchPercent >= 70 ? "bg-emerald-500" : result.jdMatchPercent >= 40 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${result.jdMatchPercent}%` }}
                      />
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">
                      {result.jdMatchPercent >= 70 ? "Strong match — your resume covers most JD keywords" :
                       result.jdMatchPercent >= 40 ? "Moderate match — consider adding missing keywords" :
                       "Weak match — tailor your resume to this specific role"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-emerald-400 font-bold text-xs mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Keywords Found ({result.keywordsFound.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywordsFound.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-lg"
                    >
                      {kw}
                    </span>
                  ))}
                  {result.keywordsFound.length === 0 && (
                    <p className="text-slate-600 text-[11px]">No industry keywords detected</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold text-xs mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Missing Keywords ({result.keywordsMissing.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywordsMissing.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold rounded-lg"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Formatting Issues */}
            {result.formattingIssues.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-red-400 font-bold text-xs mb-3 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  Formatting Issues
                </h3>
                <ul className="space-y-2">
                  {result.formattingIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-400 text-xs">
                      <span className="text-red-400 mt-0.5">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-emerald-400 font-bold text-xs mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-400 text-xs">
                      <span className="text-emerald-400 mt-0.5">→</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 text-center">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-base mb-2">
                Improve Your Resume with AI
              </h3>
              <p className="text-slate-400 text-xs mb-5 max-w-md mx-auto">
                Use our AI-powered resume builder to fix these issues, add missing keywords,
                and create an ATS-optimized resume in minutes.
              </p>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/25"
              >
                Open Resume Builder
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
