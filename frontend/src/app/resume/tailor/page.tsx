"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, FileText, ClipboardPaste, Sparkles, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle, XCircle, Loader2, Download, Eye,
  Briefcase, BarChart3, RefreshCw, ChevronDown, ChevronUp, Copy,
} from "lucide-react";
import { ResumeData } from "../types";

// ─── TYPES ─────────────────────────────────────────────────────

type Step = "input" | "analyzing" | "results" | "review";

interface JDAnalysis {
  jobTitle: string;
  company: string;
  location: string;
  experienceRequirement: string;
  educationRequirement: string;
  technicalSkills: string[];
  softwareTools: string[];
  programmingLanguages: string[];
  hardwareTechnologies: string[];
  certifications: string[];
  softSkills: string[];
  responsibilities: string[];
  keywords: Array<{ keyword: string; category: string; frequency: number }>;
  seniority: string;
  domain: string;
}

interface SkillMatch {
  keyword: string;
  status: "matched" | "partial" | "missing";
  similarTo?: string;
  category: string;
  explanation?: string;
}

interface MatchScores {
  overall: number;
  technicalSkills: number;
  experience: number;
  education: number;
  keywords: number;
  roleAlignment: number;
}

interface ResumeChange {
  section: string;
  type: string;
  before: string;
  after: string;
  reason: string;
}

interface TailorResult {
  jobAnalysis: JDAnalysis;
  skillMatches: SkillMatch[];
  scores: MatchScores;
  changes: ResumeChange[];
  optimizedResume: Record<string, unknown>;
  aiExplanation: string;
}

// ─── LOCAL STORAGE KEY ─────────────────────────────────────────

const RESUME_KEY = "eb_resume_draft_v1";

// ─── MAIN COMPONENT ────────────────────────────────────────────

export default function TailorResumePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("input");

  // Input state
  const [resumeSource, setResumeSource] = useState<"existing" | "upload">("existing");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [uploadedResumeText, setUploadedResumeText] = useState("");
  const [jdInput, setJdInput] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [uploadingJD, setUploadingJD] = useState(false);

  // Result state
  const [result, setResult] = useState<TailorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(new Set());

  // File input refs
  const resumeFileRef = useRef<HTMLInputElement>(null);
  const jdFileRef = useRef<HTMLInputElement>(null);

  // Load existing resume on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(RESUME_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setResumeData(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // ─── JD FILE UPLOAD ────────────────────────────────────────

  const handleJDFileUpload = useCallback(async (file: File) => {
    setUploadingJD(true);
    setError(null);
    try {
      const text = await file.text();
      if (text.trim().length < 20) {
        throw new Error("File appears empty or has insufficient content.");
      }
      setJdInput(text);
      setJdFile(file);
    } catch (err: any) {
      setError(err.message || "Failed to read file.");
    } finally {
      setUploadingJD(false);
    }
  }, []);

  // ─── RESUME FILE UPLOAD ────────────────────────────────────

  const handleResumeFileUpload = useCallback(async (file: File) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/profile/parse-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to parse resume.");
      if (data.profile) {
        setResumeData({
          fullName: data.profile.full_name || "",
          headline: data.profile.headline || "",
          email: data.profile.email || "",
          phone: data.profile.phone || "",
          location: data.profile.location || "",
          linkedin: "",
          github: "",
          website: "",
          summary: data.profile.about || "",
          education: (data.profile.education || []).map((e: any) => ({
            id: crypto.randomUUID(),
            school: e.institution || "",
            degree: e.degree || "",
            field: "",
            year: e.duration || "",
            cgpa: e.cgpa || "",
          })),
          experience: (data.profile.experience || []).map((e: any) => ({
            id: crypto.randomUUID(),
            role: e.role || "",
            org: e.company || "",
            period: e.duration || "",
            detail: e.description || "",
          })),
          projects: (data.profile.projects || []).map((p: any) => ({
            id: crypto.randomUUID(),
            name: p.name || "",
            technologies: p.technologies || "",
            detail: p.description || "",
          })),
          skills: data.profile.skills || [],
          certifications: (data.profile.certifications || []).map((c: any) => ({
            id: crypto.randomUUID(),
            name: c.name || "",
            issuer: "",
            year: c.year || "",
          })),
          publications: (data.profile.publications || []).map((p: any) => ({
            id: crypto.randomUUID(),
            title: p.title || "",
            venue: p.venue || "",
            year: p.year || "",
          })),
          languages: [],
          volunteer: [],
          awards: [],
          interests: [],
        });
        setResumeSource("upload");
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse resume.");
    }
  }, []);

  // ─── ANALYZE ───────────────────────────────────────────────

  const handleAnalyze = useCallback(async () => {
    if (!jdInput.trim()) {
      setError("Please provide a job description.");
      return;
    }
    if (jdInput.trim().length < 20) {
      setError("Job description is too short. Please provide more details.");
      return;
    }

    const currentResume = resumeData;
    if (!currentResume) {
      setError("No resume data found. Please load or upload a resume first.");
      return;
    }

    setStep("analyzing");
    setError(null);

    try {
      const res = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "full",
          resumeData: currentResume,
          jobDescriptionText: jdInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResult(data);
      setStep("results");
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
      setStep("input");
    }
  }, [jdInput, resumeData]);

  // ─── APPLY TAILORED RESUME ─────────────────────────────────

  const handleApplyTailored = useCallback(() => {
    if (!result?.optimizedResume) return;

    // Create new resume data from optimized version
    const optimized = result.optimizedResume as Partial<ResumeData>;
    const currentResume = resumeData || {} as ResumeData;

    const newResumeData: ResumeData = {
      ...currentResume,
      ...optimized,
      // Preserve IDs from original
      experience: (optimized.experience || currentResume.experience || []).map((exp: any, i: number) => ({
        ...exp,
        id: exp.id || currentResume.experience?.[i]?.id || crypto.randomUUID(),
      })),
      education: (optimized.education || currentResume.education || []).map((edu: any, i: number) => ({
        ...edu,
        id: edu.id || currentResume.education?.[i]?.id || crypto.randomUUID(),
      })),
      projects: (optimized.projects || currentResume.projects || []).map((proj: any, i: number) => ({
        ...proj,
        id: proj.id || currentResume.projects?.[i]?.id || crypto.randomUUID(),
      })),
      certifications: (optimized.certifications || currentResume.certifications || []).map((c: any, i: number) => ({
        ...c,
        id: c.id || currentResume.certifications?.[i]?.id || crypto.randomUUID(),
      })),
      publications: (optimized.publications || currentResume.publications || []).map((p: any, i: number) => ({
        ...p,
        id: p.id || currentResume.publications?.[i]?.id || crypto.randomUUID(),
      })),
    };

    // Save as a new version
    try {
      const versionsMap = JSON.parse(localStorage.getItem("eb_resume_versions_map_v1") || "{}");
      const versionId = `tailored-${Date.now()}`;
      const versionName = `${currentResume.fullName || "Resume"} — Tailored for ${result.jobAnalysis?.jobTitle || "Job"}`;

      // Save the tailored version
      const versions = JSON.parse(localStorage.getItem("eb_resume_list_v1") || "[]");
      versions.push({
        id: versionId,
        name: versionName,
        data: newResumeData,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("eb_resume_list_v1", JSON.stringify(versions));

      // Update the version map
      versionsMap[versionId] = versionName;
      localStorage.setItem("eb_resume_versions_map_v1", JSON.stringify(versionsMap));

      // Set as current draft
      localStorage.setItem(RESUME_KEY, JSON.stringify(newResumeData));

      router.push("/resume");
    } catch (err: any) {
      setError("Failed to save tailored resume. Please try again.");
    }
  }, [result, resumeData, router]);

  // ─── RENDER ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Tailor Resume to Job
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Match your resume to a specific job description
              </p>
            </div>
          </div>
          {step !== "input" && step !== "analyzing" && (
            <button
              onClick={() => { setStep("input"); setResult(null); setError(null); }}
              className="text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ═══ STEP: INPUT ═══ */}
        {step === "input" && (
          <div className="space-y-6">
            {/* Resume Source */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Step 1: Your Resume
              </h2>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setResumeSource("existing")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border-2 transition ${
                    resumeSource === "existing"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {resumeData ? "Use My ElectroBridge Resume" : "No Resume Found"}
                </button>
                <button
                  onClick={() => setResumeSource("upload")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border-2 transition ${
                    resumeSource === "upload"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  Upload Resume
                </button>
              </div>

              {resumeSource === "existing" && resumeData && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <p className="font-bold text-slate-800">{resumeData.fullName || "Unnamed"}</p>
                  <p>{resumeData.headline || "No headline"}</p>
                  <p className="text-slate-400 mt-1">
                    {resumeData.experience?.length || 0} experiences, {resumeData.skills?.length || 0} skills
                  </p>
                </div>
              )}

              {resumeSource === "upload" && (
                <div>
                  <input
                    ref={resumeFileRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleResumeFileUpload(file);
                    }}
                  />
                  <button
                    onClick={() => resumeFileRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 transition flex flex-col items-center gap-2"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-xs font-bold">Click to upload resume (PDF, DOCX, TXT)</span>
                  </button>
                  {resumeData && resumeSource === "upload" && (
                    <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resume parsed successfully
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Step 2: Job Description
              </h2>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => document.getElementById("jd-textarea")?.focus()}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:border-blue-400 transition flex items-center justify-center gap-1.5"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" /> Paste Text
                </button>
                <button
                  onClick={() => jdFileRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:border-blue-400 transition flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </button>
              </div>

              <input
                ref={jdFileRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleJDFileUpload(file);
                }}
              />

              <textarea
                id="jd-textarea"
                value={jdInput}
                onChange={(e) => setJdInput(e.target.value)}
                placeholder="Paste the full job description here...&#10;&#10;Include the job title, required skills, responsibilities, qualifications, and any other relevant details."
                rows={12}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium leading-relaxed"
              />

              {jdFile && (
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {jdFile.name} ({(jdFile.size / 1024).toFixed(1)} KB)
                </p>
              )}

              {uploadingJD && (
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Parsing file...
                </p>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!jdInput.trim() || jdInput.trim().length < 20 || !resumeData}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Job & Tailor Resume
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              ATS scores are estimates based on keyword, skills, and content alignment. No score guarantees shortlisting.
            </p>
          </div>
        )}

        {/* ═══ STEP: ANALYZING ═══ */}
        {step === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Analyzing Job Description</h2>
            <p className="text-sm text-slate-500 text-center max-w-md">
              Extracting keywords, comparing against your resume, and generating optimized content...
            </p>
            <div className="flex items-center gap-6 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Parsing JD</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Gap Analysis</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Optimization</span>
            </div>
          </div>
        )}

        {/* ═══ STEP: RESULTS ═══ */}
        {step === "results" && result && (
          <div className="space-y-6">
            {/* Score Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Analysis Complete
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
                  Your Resume is Ready
                </h2>
                {result.jobAnalysis && (
                  <p className="text-sm text-slate-300">
                    Target Role: <strong className="text-white">{result.jobAnalysis.jobTitle}</strong>
                    {result.jobAnalysis.company && <> at <strong className="text-white">{result.jobAnalysis.company}</strong></>}
                  </p>
                )}
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Overall", value: result.scores.overall, color: "blue" },
                { label: "Technical", value: result.scores.technicalSkills, color: "emerald" },
                { label: "Experience", value: result.scores.experience, color: "amber" },
                { label: "Education", value: result.scores.education, color: "purple" },
                { label: "Keywords", value: result.scores.keywords, color: "cyan" },
                { label: "Role Fit", value: result.scores.roleAlignment, color: "indigo" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{s.label}</p>
                  <p className={`text-2xl font-black ${
                    s.value >= 80 ? "text-emerald-600" :
                    s.value >= 60 ? "text-amber-600" : "text-red-600"
                  }`}>{s.value}%</p>
                </div>
              ))}
            </div>

            {/* Skill Matches */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Keyword Coverage
              </h3>

              {/* Match bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-600">Match Rate</span>
                  <span className="text-xs font-black text-blue-600">
                    {result.skillMatches.filter((m) => m.status === "matched").length}/{result.skillMatches.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${result.scores.keywords}%` }}
                  />
                </div>
              </div>

              {/* Grouped matches */}
              {(["matched", "partial", "missing"] as const).map((status) => {
                const items = result.skillMatches.filter((m) => m.status === status);
                if (!items.length) return null;
                return (
                  <div key={status} className="mb-3">
                    <p className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${
                      status === "matched" ? "text-emerald-600" :
                      status === "partial" ? "text-amber-600" : "text-red-600"
                    }`}>
                      {status === "matched" && <CheckCircle2 className="w-3 h-3" />}
                      {status === "partial" && <AlertTriangle className="w-3 h-3" />}
                      {status === "missing" && <XCircle className="w-3 h-3" />}
                      {status === "matched" ? "Matched" : status === "partial" ? "Partially Matched" : "Missing"} ({items.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((m, i) => (
                        <span
                          key={i}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                            status === "matched"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : status === "partial"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                          title={m.explanation}
                        >
                          {status === "matched" && "✓ "}
                          {status === "partial" && "△ "}
                          {status === "missing" && "✕ "}
                          {m.keyword}
                          {m.similarTo && <span className="text-slate-400 ml-1">({m.similarTo})</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Changes */}
            {result.changes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  What Changed ({result.changes.length} updates)
                </h3>
                <div className="space-y-3">
                  {result.changes.map((change, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => {
                          const next = new Set(expandedChanges);
                          next.has(i) ? next.delete(i) : next.add(i);
                          setExpandedChanges(next);
                        }}
                        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 uppercase">{change.section}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            change.type === "rewritten" ? "bg-blue-100 text-blue-700" :
                            change.type === "reordered" ? "bg-purple-100 text-purple-700" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {change.type}
                          </span>
                        </div>
                        {expandedChanges.has(i) ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {expandedChanges.has(i) && (
                        <div className="p-4 space-y-3 text-xs">
                          <div>
                            <p className="font-bold text-slate-500 mb-1">Before:</p>
                            <p className="text-slate-700 bg-red-50 border border-red-100 rounded-lg p-2 whitespace-pre-wrap">{change.before || "(empty)"}</p>
                          </div>
                          <div>
                            <p className="font-bold text-slate-500 mb-1">After:</p>
                            <p className="text-slate-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2 whitespace-pre-wrap">{change.after || "(empty)"}</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2">
                            <p className="font-bold text-blue-700 mb-0.5">Why:</p>
                            <p className="text-blue-800">{change.reason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Explanation */}
            {result.aiExplanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Summary
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">{result.aiExplanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApplyTailored}
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Use Tailored Resume
              </button>
              <button
                onClick={() => {
                  setStep("input");
                  setResult(null);
                  setError(null);
                }}
                className="flex-1 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Another Job
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              The tailored resume is saved as a new version. Your original resume is preserved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
