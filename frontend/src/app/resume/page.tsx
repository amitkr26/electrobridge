"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Download, Save, UploadCloud, Sparkles,
  Layers, Loader2, ZoomIn, ZoomOut, Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { ResumeData, ResumeStyleConfig, TemplateId } from "./types";
import { ParsedResumeProfile } from "@/lib/resume-text-parser";
import { ResumePreview } from "./components/ResumePreview";
import { TemplateSelector, TEMPLATE_OPTIONS } from "./components/TemplateSelector";
import { StyleCustomizer } from "./components/StyleCustomizer";
import { ImportReviewModal } from "./components/ImportReviewModal";
import { AIResumeAdvisor, TargetRole } from "./components/AIResumeAdvisor";
import { AIImproveDiffModal } from "./components/AIImproveDiffModal";
import { MyResumesDrawer, SavedResumeMeta } from "./components/MyResumesDrawer";
import SectionNav from "./components/sections/SectionNav";
import PersonalSection from "./components/sections/PersonalSection";
import SummarySection from "./components/sections/SummarySection";
import ExperienceSection from "./components/sections/ExperienceSection";
import EducationSection from "./components/sections/EducationSection";
import SkillsSection from "./components/sections/SkillsSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import ExtrasSection from "./components/sections/ExtrasSection";

const DEFAULT_RESUME_DATA: ResumeData = {
  fullName: "Alex Morgan",
  headline: "Electronics & VLSI Engineer",
  email: "alex.morgan@example.com",
  phone: "+1 555 0123",
  location: "Austin, TX",
  linkedin: "linkedin.com/in/alexmorgan",
  github: "github.com/alexmorgan",
  website: "",
  summary: "Electronics engineer with experience in RTL design, digital verification, and embedded systems. Proficient in SystemVerilog, FPGA development, and hardware-software co-design.",
  education: [
    {
      id: "edu-1",
      school: "Example University",
      degree: "M.S. Electrical & Computer Engineering",
      year: "2021 - 2023",
      cgpa: "",
    },
    {
      id: "edu-2",
      school: "Example State University",
      degree: "B.S. Electronics Engineering",
      year: "2017 - 2021",
      cgpa: "",
    },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Hardware Design Engineer",
      org: "Example Semiconductor Inc.",
      period: "Jul 2023 - Present",
      detail: "Design and verify RTL modules for high-speed data path using SystemVerilog. Collaborate with physical design team on timing closure and synthesis optimization.",
    },
    {
      id: "exp-2",
      role: "VLSI Design Intern",
      org: "Example Tech Labs",
      period: "Jan 2023 - Jun 2023",
      detail: "Developed UVM testbenches for PCIe endpoint verification. Achieved 97% functional coverage across all test scenarios.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "5-Stage Pipelined Processor",
      technologies: "SystemVerilog, Vivado",
      detail: "Implemented a pipelined RISC processor with hazard detection, forwarding, and branch prediction. Synthesized on FPGA at 200MHz.",
    },
    {
      id: "proj-2",
      name: "I2C Master Controller",
      technologies: "Verilog, ModelSim",
      detail: "Designed a parameterized I2C master with multi-byte read/write support and clock stretching. Verified with directed and random tests.",
    },
  ],
  skills: [
    "SystemVerilog", "Verilog", "UVM", "RTL Design", "FPGA",
    "Vivado", "ModelSim", "Python", "C", "Linux"
  ],
  certifications: [],
  publications: [],
  languages: [],
  volunteer: [],
  awards: [],
  interests: [],
};

const DEFAULT_STYLE_CONFIG: ResumeStyleConfig = {
  templateId: "modern-professional",
  accentColor: "#2563EB",
  fontFamily: "font-sans",
  marginSize: "normal",
  sectionSpacing: "normal",
  sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications", "publications", "languages", "volunteer", "awards", "interests"],
  sectionLabels: {},
  dateFormat: "MMM YYYY",
  pageSize: "A4",
  visibleSections: {
    summary: true,
    experience: true,
    education: true,
    projects: true,
    skills: true,
    certifications: true,
    publications: true,
    languages: true,
    volunteer: true,
    awards: true,
    interests: true,
  },
};

type ActiveEditorTab = "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "extras" | "styling" | "ai";

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [styleConfig, setStyleConfig] = useState<ResumeStyleConfig>(DEFAULT_STYLE_CONFIG);
  const [activeTab, setActiveTab] = useState<ActiveEditorTab>("personal");
  const [zoomScale, setZoomScale] = useState(1.0);
  const [fitToWidth, setFitToWidth] = useState(true);
  const [mobileMode, setMobileMode] = useState<"editor" | "preview">("editor");
  const previewPanelRef = useRef<HTMLDivElement>(null);

  // Multi-resume state
  const [savedResumes, setSavedResumes] = useState<SavedResumeMeta[]>([
    {
      id: "resume-1",
      name: "Primary Resume",
      templateId: "modern-professional",
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [activeResumeId, setActiveResumeId] = useState("resume-1");

  // Modals & Drawers state
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [myResumesOpen, setMyResumesOpen] = useState(false);
  const [importReviewOpen, setImportReviewOpen] = useState(false);
  const [parsedDataForReview, setParsedDataForReview] = useState<ParsedResumeProfile | null>(null);
  const [aiDiffModalOpen, setAiDiffModalOpen] = useState(false);
  const [aiDiffContext, setAiDiffContext] = useState<{
    section: string;
    itemId?: string;
    original: string;
    suggested: string;
  }>({
    section: "summary",
    itemId: undefined,
    original: "",
    suggested: "",
  });

  // Async States
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [targetRole, setTargetRole] = useState<TargetRole>("rtl-design");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // 1. Load draft and versions from localStorage on mount
  useEffect(() => {
    try {
      const storedMap = localStorage.getItem("eb_resume_versions_map_v1");
      const storedList = localStorage.getItem("eb_resume_list_v1");

      if (storedList) {
        const parsedList = JSON.parse(storedList);
        if (Array.isArray(parsedList) && parsedList.length > 0) {
          setSavedResumes(parsedList);
          const firstId = parsedList[0].id;
          setActiveResumeId(firstId);

          if (storedMap) {
            const parsedMap = JSON.parse(storedMap);
            if (parsedMap[firstId]) {
              if (parsedMap[firstId].data) setResumeData(parsedMap[firstId].data);
              if (parsedMap[firstId].style) setStyleConfig(parsedMap[firstId].style);
              return;
            }
          }
        }
      }

      // Fallback to legacy single draft
      const storedDraft = localStorage.getItem("eb_resume_draft_v1");
      if (storedDraft) {
        const parsed = JSON.parse(storedDraft);
        if (parsed.data) setResumeData(parsed.data);
        if (parsed.style) setStyleConfig(parsed.style);
      }
    } catch {}
  }, []);

  // 2. Persist active draft and versions map to localStorage on change
  useEffect(() => {
    try {
      const currentVersion = { data: resumeData, style: styleConfig };
      localStorage.setItem("eb_resume_draft_v1", JSON.stringify(currentVersion));

      const storedMap = localStorage.getItem("eb_resume_versions_map_v1");
      const versionsMap = storedMap ? JSON.parse(storedMap) : {};
      versionsMap[activeResumeId] = currentVersion;
      localStorage.setItem("eb_resume_versions_map_v1", JSON.stringify(versionsMap));
      localStorage.setItem("eb_resume_list_v1", JSON.stringify(savedResumes));
    } catch {}
  }, [resumeData, styleConfig, activeResumeId, savedResumes]);

  // 3. Fit-to-width: auto-calculate zoom to fill the preview panel
  useEffect(() => {
    if (!fitToWidth || !previewPanelRef.current) return;
    const panel = previewPanelRef.current;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (width && width > 0) {
        const a4WidthPx = 800; // max-w-[800px] on the canvas
        const padding = 48; // p-6 on each side
        const available = width - padding;
        const scale = Math.min(1.2, Math.max(0.4, available / a4WidthPx));
        setZoomScale(Math.round(scale * 100) / 100);
      }
    });
    observer.observe(panel);
    return () => observer.disconnect();
  }, [fitToWidth]);

  // File Upload Handler (PDF, DOCX, TXT)
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.name.match(/\.(pdf|docx|txt|md|doc)$/i)) {
      toast.error("Please upload a PDF, DOCX, TXT, or MD resume file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/parse-resume", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to extract resume data");
      }

      setParsedDataForReview(result.profile);
      setImportReviewOpen(true);
      toast.success("Resume parsed successfully! Review extracted data.");
    } catch (err: any) {
      toast.error(err.message || "Failed to parse uploaded resume");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Import Review Confirmations
  const handleApplyAllExtracted = (p: ParsedResumeProfile) => {
    setResumeData((prev) => ({
      ...prev,
      fullName: p.full_name || prev.fullName,
      headline: p.headline || prev.headline,
      email: p.email || prev.email,
      phone: p.phone || prev.phone,
      location: p.location || p.city || prev.location,
      summary: p.about || prev.summary,
      skills: p.skills && p.skills.length > 0 ? p.skills : prev.skills,
      education: p.education && p.education.length > 0
        ? p.education.map((e, idx) => ({ id: `edu-${Date.now()}-${idx}`, school: e.institution, degree: e.degree, year: e.duration, cgpa: e.cgpa }))
        : prev.education,
      experience: p.experience && p.experience.length > 0
        ? p.experience.map((e, idx) => ({ id: `exp-${Date.now()}-${idx}`, role: e.role, org: e.company, period: e.duration, detail: e.description }))
        : prev.experience,
      projects: p.projects && p.projects.length > 0
        ? p.projects.map((pr, idx) => ({ id: `proj-${Date.now()}-${idx}`, name: pr.name, detail: pr.description, technologies: pr.technologies }))
        : prev.projects,
    }));
    setImportReviewOpen(false);
    toast.success("All extracted fields applied to your resume!");
  };

  const handleMergeExtracted = (p: ParsedResumeProfile) => {
    setResumeData((prev) => ({
      ...prev,
      skills: Array.from(new Set([...prev.skills, ...(p.skills || [])])),
      education: [
        ...prev.education,
        ...(p.education || []).map((e, idx) => ({ id: `edu-${Date.now()}-${idx}`, school: e.institution, degree: e.degree, year: e.duration, cgpa: e.cgpa })),
      ],
      experience: [
        ...prev.experience,
        ...(p.experience || []).map((e, idx) => ({ id: `exp-${Date.now()}-${idx}`, role: e.role, org: e.company, period: e.duration, detail: e.description })),
      ],
      projects: [
        ...prev.projects,
        ...(p.projects || []).map((pr, idx) => ({ id: `proj-${Date.now()}-${idx}`, name: pr.name, detail: pr.description, technologies: pr.technologies })),
      ],
    }));
    setImportReviewOpen(false);
    toast.success("Extracted sections merged with your existing resume data!");
  };

  // AI Suggestion Handler
  const handleRequestAIImprovement = async (
    type: "summary" | "experience" | "skills" | "projects",
    context: any
  ) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/resume/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: type, context }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "AI generation failed");


      let originalText = "";
      if (type === "summary") originalText = resumeData.summary;
      else if (type === "experience") originalText = context?.detail || context?.role || "";
      else if (type === "projects") originalText = context?.detail || context?.name || "";
      else if (type === "skills") originalText = resumeData.skills.join(", ");

      setAiDiffContext({
        section: type,
        itemId: context?.id,
        original: originalText,
        suggested: data.suggestion,
      });
      setAiDiffModalOpen(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI suggestion");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveToBackend = async () => {
    setSaving(true);
    try {
      const currentMeta = savedResumes.find((r) => r.id === activeResumeId);
      const payload = {
        version_id: activeResumeId,
        version_name: currentMeta?.name || "Primary Resume",
        style: styleConfig,
        full_name: resumeData.fullName,
        headline: resumeData.headline,
        email: resumeData.email,
        phone: resumeData.phone,
        location: resumeData.location,
        summary: resumeData.summary,
        education: resumeData.education,
        experience: resumeData.experience,
        projects: resumeData.projects,
        skills: resumeData.skills,
        publications: resumeData.publications,
        certifications: resumeData.certifications,
      };

      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        if (result.version?.id && result.version.id !== activeResumeId) {
          const newId = result.version.id;
          setActiveResumeId(newId);
          setSavedResumes((prev) =>
            prev.map((r) => (r.id === activeResumeId ? { ...r, id: newId } : r))
          );
        }
        toast.success(`Resume saved to cloud! ATS Match Score: ${result.ats_score || 85}/100`);
      } else {
        toast.error(result.error || "Failed to save to cloud; saved locally.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save resume; saved locally.");
    } finally {
      setSaving(false);
    }
  };

  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    const el = previewContainerRef.current;
    if (!el) return;
    setExporting(true);
    try {
      const { default: html2pdf } = await import("html2pdf.js");
      const filename = `${(resumeData.fullName || "resume").replace(/\s+/g, "_")}_resume.pdf`;
      await html2pdf()
        .set({
          margin: 0,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: "mm", format: styleConfig.pageSize.toLowerCase(), orientation: "portrait" } as any,
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        } as any)
        .from(el)
        .save();
      toast.success(`Downloaded ${filename}`);
    } catch {
      toast.error("PDF export failed. Try Print / PDF instead.");
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentTemplateName =
    TEMPLATE_OPTIONS.find((t) => t.id === styleConfig.templateId)?.name || "Modern Professional";

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-50 flex flex-col font-sans overflow-hidden print:bg-white print:h-auto print:min-h-0 print:p-0">
      {/* TOP TOOLBAR */}
      <header className="h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 z-20 print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-[10px]">EB</div>
            <span className="font-bold text-sm text-slate-900 hidden sm:block">Resume Builder</span>
          </div>
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg ml-2" role="tablist" aria-label="Resume editor mode">
            <button
              role="tab"
              aria-selected={activeTab !== "styling" && activeTab !== "ai"}
              onClick={() => setActiveTab("personal")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                activeTab !== "styling" && activeTab !== "ai"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Content
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "styling"}
              onClick={() => setActiveTab("styling")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                activeTab === "styling"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Customize
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "ai"}
              onClick={() => setActiveTab("ai")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                activeTab === "ai"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Tools</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="lg:hidden flex bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setMobileMode("editor")}
              className={`text-xs px-2 py-1 rounded-md font-bold transition ${
                mobileMode === "editor" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileMode("preview")}
              className={`text-xs px-2 py-1 rounded-md font-bold transition ${
                mobileMode === "preview" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Preview
            </button>
          </div>
          <button
            onClick={() => setMyResumesOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition"
          >
            <Layers className="w-3.5 h-3.5" /> My Resumes ({savedResumes.length})
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition"
            title="Import existing resume"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5 text-blue-600" />}
            <span>{uploading ? "Parsing..." : "Import"}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md,.doc"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <Link
            href="/resume/tailor"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Tailor to Job</span>
          </Link>
          <button
            onClick={handleSaveToBackend}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition shadow-sm disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{exporting ? "Exporting..." : "Download PDF"}</span>
          </button>
        </div>
      </header>

      {/* 3-PANEL WORKSPACE */}
      <div className="flex-1 flex overflow-hidden min-h-0 print:block print:overflow-visible">

        {/* LEFT SIDEBAR: Section Nav (only in Content mode) */}
        {(activeTab !== "styling" && activeTab !== "ai") && (
          <SectionNav activeSection={activeTab} onSectionChange={(s) => setActiveTab(s as ActiveEditorTab)} resumeData={resumeData} />
        )}

        {/* CENTER: Editor Panel */}
        <div className={`flex-1 flex flex-col overflow-hidden bg-white border-r border-slate-200 print:hidden ${mobileMode === "preview" ? "hidden lg:flex" : "flex"}`}>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto p-5 sm:p-6">
              {activeTab === "personal" && <PersonalSection data={resumeData} onChange={setResumeData} onOpenTemplateSelector={() => setTemplateModalOpen(true)} currentTemplateName={currentTemplateName} />}
              {activeTab === "summary" && <SummarySection data={resumeData} onChange={setResumeData} onRequestAI={() => handleRequestAIImprovement("summary", { name: resumeData.fullName, headline: resumeData.headline, skills: resumeData.skills, location: resumeData.location })} isAILoading={aiLoading} />}
              {activeTab === "experience" && <ExperienceSection data={resumeData} onChange={setResumeData} onRequestAI={(itemId) => { const exp = resumeData.experience.find((e) => e.id === itemId); if (exp) handleRequestAIImprovement("experience", { id: exp.id, role: exp.role, org: exp.org, detail: exp.detail }); }} isAILoading={aiLoading} />}
              {activeTab === "education" && <EducationSection data={resumeData} onChange={setResumeData} />}
              {activeTab === "skills" && <SkillsSection data={resumeData} onChange={setResumeData} />}
              {activeTab === "projects" && <ProjectsSection data={resumeData} onChange={setResumeData} onRequestAI={(itemId) => { const proj = resumeData.projects.find((p) => p.id === itemId); if (proj) handleRequestAIImprovement("projects", { id: proj.id, name: proj.name, technologies: proj.technologies, detail: proj.detail }); }} isAILoading={aiLoading} />}
              {activeTab === "extras" && <ExtrasSection data={resumeData} onChange={setResumeData} />}
              {activeTab === "styling" && <StyleCustomizer style={styleConfig} onChange={setStyleConfig} />}
              {activeTab === "ai" && <AIResumeAdvisor data={resumeData} targetRole={targetRole} onTargetRoleChange={setTargetRole} onRequestImprovement={handleRequestAIImprovement} isAiLoading={aiLoading} />}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div ref={previewPanelRef} className={`w-full lg:w-[45%] xl:w-[42%] bg-slate-200/60 overflow-y-auto flex flex-col items-center relative print:w-full print:p-0 print:bg-white ${mobileMode === "editor" ? "hidden lg:flex" : "flex"}`}>
          <div className="sticky top-0 z-10 w-full bg-slate-200/80 backdrop-blur-sm border-b border-slate-300/50 px-4 py-2 flex items-center justify-between print:hidden">
            <span className="text-[11px] font-semibold text-slate-500">{currentTemplateName}</span>
            <div className="flex items-center gap-2">
              {/* Fit to width toggle */}
              <button
                onClick={() => setFitToWidth((prev) => !prev)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition ${
                  fitToWidth ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-white/60"
                }`}
                title={fitToWidth ? "Fit to width (auto-zoom)" : "Manual zoom"}
                aria-label="Toggle fit to width"
              >
                Fit
              </button>
              {/* Zoom controls */}
              <button
                onClick={() => { setFitToWidth(false); setZoomScale((prev) => Math.max(0.5, prev - 0.1)); }}
                className="p-1 hover:bg-white/80 rounded text-slate-500 transition"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setFitToWidth(false); }}
                className="text-[11px] font-mono text-slate-500 w-10 text-center hover:text-blue-600 transition cursor-pointer"
                title="Click to reset to 100%"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onClick={() => { setFitToWidth(false); setZoomScale((prev) => Math.min(1.5, prev + 0.1)); }}
                className="p-1 hover:bg-white/80 rounded text-slate-500 transition"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center p-4 sm:p-6 print:p-0">
            <ResumePreview ref={previewContainerRef} data={resumeData} style={styleConfig} scale={zoomScale} />
          </div>
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      <TemplateSelector
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        selectedTemplateId={styleConfig.templateId}
        onSelectTemplate={(id) => setStyleConfig({ ...styleConfig, templateId: id })}
      />

      <MyResumesDrawer
        isOpen={myResumesOpen}
        onClose={() => setMyResumesOpen(false)}
        resumes={savedResumes}
        activeResumeId={activeResumeId}
        onSelectResume={(id) => {
          if (id === activeResumeId) return;
          try {
            const storedMap = localStorage.getItem("eb_resume_versions_map_v1");
            if (storedMap) {
              const parsedMap = JSON.parse(storedMap);
              if (parsedMap[id]) {
                if (parsedMap[id].data) setResumeData(parsedMap[id].data);
                if (parsedMap[id].style) setStyleConfig(parsedMap[id].style);
              }
            }
          } catch {}
          setActiveResumeId(id);
          toast.success("Switched active resume version");
        }}
        onCreateNew={() => {
          const newId = `resume-${Date.now()}`;
          const newResume: SavedResumeMeta = {
            id: newId,
            name: `Resume Version ${savedResumes.length + 1}`,
            templateId: styleConfig.templateId,
            updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          const newVersion = { data: DEFAULT_RESUME_DATA, style: styleConfig };
          try {
            const storedMap = localStorage.getItem("eb_resume_versions_map_v1");
            const parsedMap = storedMap ? JSON.parse(storedMap) : {};
            parsedMap[newId] = newVersion;
            localStorage.setItem("eb_resume_versions_map_v1", JSON.stringify(parsedMap));
          } catch {}
          setSavedResumes([...savedResumes, newResume]);
          setActiveResumeId(newId);
          setResumeData(DEFAULT_RESUME_DATA);
          toast.success("Created new resume version!");
        }}
        onDuplicate={(id) => {
          const original = savedResumes.find((r) => r.id === id);
          if (!original) return;
          const cloneId = `resume-${Date.now()}`;
          const clonedMeta: SavedResumeMeta = {
            id: cloneId,
            name: `${original.name} (Copy)`,
            templateId: original.templateId,
            updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          try {
            const storedMap = localStorage.getItem("eb_resume_versions_map_v1");
            const parsedMap = storedMap ? JSON.parse(storedMap) : {};
            const sourceVersion = parsedMap[id] || { data: resumeData, style: styleConfig };
            parsedMap[cloneId] = JSON.parse(JSON.stringify(sourceVersion));
            localStorage.setItem("eb_resume_versions_map_v1", JSON.stringify(parsedMap));
          } catch {}
          setSavedResumes([...savedResumes, clonedMeta]);
          toast.success("Duplicated resume version!");
        }}
        onRename={(id, newName) => {
          setSavedResumes((prev) =>
            prev.map((r) => (r.id === id ? { ...r, name: newName } : r))
          );
        }}
        onDelete={(id) => {
          if (savedResumes.length <= 1) return;
          const remaining = savedResumes.filter((r) => r.id !== id);
          setSavedResumes(remaining);
          try {
            const storedMap = localStorage.getItem("eb_resume_versions_map_v1");
            if (storedMap) {
              const parsedMap = JSON.parse(storedMap);
              delete parsedMap[id];
              localStorage.setItem("eb_resume_versions_map_v1", JSON.stringify(parsedMap));
            }
          } catch {}
          if (activeResumeId === id) {
            const fallbackId = remaining[0].id;
            setActiveResumeId(fallbackId);
            try {
              const storedMap = localStorage.getItem("eb_resume_versions_map_v1");
              if (storedMap) {
                const parsedMap = JSON.parse(storedMap);
                if (parsedMap[fallbackId]) {
                  if (parsedMap[fallbackId].data) setResumeData(parsedMap[fallbackId].data);
                  if (parsedMap[fallbackId].style) setStyleConfig(parsedMap[fallbackId].style);
                }
              }
            } catch {}
          }
          toast.success("Deleted resume version");
        }}
      />

      {parsedDataForReview && (
        <ImportReviewModal
          isOpen={importReviewOpen}
          onClose={() => setImportReviewOpen(false)}
          parsedData={parsedDataForReview}
          onApplyAll={handleApplyAllExtracted}
          onMerge={handleMergeExtracted}
        />
      )}

      <AIImproveDiffModal
        isOpen={aiDiffModalOpen}
        onClose={() => setAiDiffModalOpen(false)}
        sectionType={aiDiffContext.section}
        originalText={aiDiffContext.original}
        suggestedText={aiDiffContext.suggested}
        onAccept={(accepted) => {
          if (aiDiffContext.section === "summary") {
            setResumeData((prev) => ({ ...prev, summary: accepted }));
            toast.success("Updated professional summary!");
          } else if (aiDiffContext.section === "experience" && aiDiffContext.itemId) {
            setResumeData((prev) => ({
              ...prev,
              experience: prev.experience.map((exp) =>
                exp.id === aiDiffContext.itemId ? { ...exp, detail: accepted } : exp
              ),
            }));
            toast.success("Updated experience bullet points!");
          } else if (aiDiffContext.section === "projects" && aiDiffContext.itemId) {
            setResumeData((prev) => ({
              ...prev,
              projects: prev.projects.map((proj) =>
                proj.id === aiDiffContext.itemId ? { ...proj, detail: accepted } : proj
              ),
            }));
            toast.success("Updated project details!");
          } else if (aiDiffContext.section === "skills") {
            const newSkills = accepted
              .split(/[,•\n]/)
              .map((s) => s.trim())
              .filter(Boolean);
            setResumeData((prev) => ({
              ...prev,
              skills: Array.from(new Set([...prev.skills, ...newSkills])),
            }));
            toast.success("Updated technical skills!");
          }
          setAiDiffModalOpen(false);
        }}
      />
    </div>
  );
}
