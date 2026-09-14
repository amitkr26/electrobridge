"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Download, Sparkles, Loader2, LayoutTemplate, User,
  Building2, Pen
} from "lucide-react";
import { toast } from "sonner";

interface CoverLetterData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  positionTitle: string;
  hiringManager: string;
  opening: string;
  body1: string;
  body2: string;
  body3: string;
  closing: string;
  template: "professional" | "modern" | "academic";
}

const DEFAULT_DATA: CoverLetterData = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  positionTitle: "",
  hiringManager: "",
  opening: "",
  body1: "",
  body2: "",
  body3: "",
  closing: "",
  template: "professional",
};

const TEMPLATES = [
  { id: "professional" as const, name: "Professional", desc: "Clean, traditional format" },
  { id: "modern" as const, name: "Modern", desc: "Contemporary style with flair" },
  { id: "academic" as const, name: "Academic", desc: "Formal academic tone" },
];

export default function CoverLetterBuilderPage() {
  const [data, setData] = useState<CoverLetterData>(DEFAULT_DATA);
  const [aiLoading, setAiLoading] = useState(false);
  const [mobileMode, setMobileMode] = useState<"editor" | "preview">("editor");
  const [accentColor, setAccentColor] = useState("#2563eb");
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eb_cover_letter_v1");
      if (stored) setData(JSON.parse(stored));
      // Read accent color from resume style config to keep designs unified
      const resumeDraft = localStorage.getItem("eb_resume_draft_v1");
      if (resumeDraft) {
        const { style } = JSON.parse(resumeDraft);
        if (style?.accentColor) setAccentColor(style.accentColor);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("eb_cover_letter_v1", JSON.stringify(data));
    } catch {}
  }, [data]);

  const handleAIGenerate = async () => {
    if (!data.companyName || !data.positionTitle) {
      toast.error("Please enter company name and position title first.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Write a professional cover letter for the position of ${data.positionTitle} at ${data.companyName}. ${data.hiringManager ? `Address it to ${data.hiringManager}.` : ""} 

Return ONLY a JSON object with these keys (no markdown, no extra text):
{
  "opening": "A compelling opening paragraph (2-3 sentences) that shows enthusiasm and connects the candidate to the role",
  "body1": "First body paragraph about relevant technical skills and experience (3-4 sentences)",
  "body2": "Second body paragraph about key achievements and what you bring to the role (3-4 sentences)",
  "body3": "Optional third body paragraph about cultural fit or specific company projects (2-3 sentences, can be empty string)",
  "closing": "A professional closing paragraph (2-3 sentences) with a call to action"
}

Make it specific to semiconductor/VLSI engineering. Use active voice. Be concise and impactful.`,
            },
          ],
        }),
      });
      const result = await res.json();
      const reply = result.answer || result.message || result.reply || "";

      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setData((prev) => ({
          ...prev,
          opening: parsed.opening || prev.opening,
          body1: parsed.body1 || prev.body1,
          body2: parsed.body2 || prev.body2,
          body3: parsed.body3 || prev.body3,
          closing: parsed.closing || prev.closing,
        }));
        toast.success("Cover letter generated with AI!");
      } else {
        toast.error("AI response could not be parsed. Try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate cover letter");
    } finally {
      setAiLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const { default: html2pdf } = await import("html2pdf.js");
      const filename = `${(data.fullName || "cover_letter").replace(/\s+/g, "_")}.pdf`;
      await html2pdf()
        .set({
          margin: 0,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" } as any,
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        } as any)
        .from(previewRef.current)
        .save();
      toast.success(`Downloaded ${filename}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const greeting = data.hiringManager ? `Dear ${data.hiringManager},` : "Dear Hiring Manager,";
  const body = [data.body1, data.body2, data.body3].filter(Boolean).join("\n\n");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex flex-col font-sans print:bg-white print:min-h-0 print:p-0">
      {/* Top Toolbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-xs">
              CL
            </div>
            <div>
              <h1 className="font-bold text-sm text-white leading-tight">Cover Letter Builder</h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Professional cover letters for semiconductor roles</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="lg:hidden flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setMobileMode("editor")}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                mobileMode === "editor" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileMode("preview")}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                mobileMode === "preview" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400"
              }`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={handleAIGenerate}
            disabled={aiLoading}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-xl transition shadow-sm"
          >
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{aiLoading ? "Generating..." : "Generate with AI"}</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{exporting ? "Exporting..." : "Download PDF"}</span>
          </button>
        </div>
      </header>

      {/* 2-Panel Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0 print:block print:overflow-visible">
        {/* Left: Editor */}
        <div
          className={`w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-slate-900 overflow-hidden print:hidden ${
            mobileMode === "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Template Selector */}
            <div>
              <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-blue-400" /> Template
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setData({ ...data, template: t.id })}
                    className={`p-3 rounded-xl border text-center transition ${
                      data.template === t.id
                        ? "bg-blue-600/10 border-blue-500 text-blue-400"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-xs font-bold block">{t.name}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Your Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={(e) => setData({ ...data, fullName: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="amit@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Job Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" /> Position Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                    placeholder="e.g. Qualcomm"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Position Title</label>
                  <input
                    type="text"
                    value={data.positionTitle}
                    onChange={(e) => setData({ ...data, positionTitle: e.target.value })}
                    placeholder="e.g. RTL Design Engineer"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Hiring Manager (optional)</label>
                <input
                  type="text"
                  value={data.hiringManager}
                  onChange={(e) => setData({ ...data, hiringManager: e.target.value })}
                  placeholder="e.g. Dr. Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Cover Letter Paragraphs */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Pen className="w-4 h-4 text-blue-400" /> Cover Letter Content
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Opening Paragraph</label>
                <textarea
                  rows={3}
                  value={data.opening}
                  onChange={(e) => setData({ ...data, opening: e.target.value })}
                  placeholder="I am writing to express my strong interest in the RTL Design Engineer position at Qualcomm..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Body Paragraph 1</label>
                <textarea
                  rows={3}
                  value={data.body1}
                  onChange={(e) => setData({ ...data, body1: e.target.value })}
                  placeholder="With hands-on experience in RTL design using SystemVerilog and expertise in logic synthesis..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Body Paragraph 2</label>
                <textarea
                  rows={3}
                  value={data.body2}
                  onChange={(e) => setData({ ...data, body2: e.target.value })}
                  placeholder="During my internship at Example Company, I designed and verified high-speed digital modules..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Body Paragraph 3 (optional)</label>
                <textarea
                  rows={2}
                  value={data.body3}
                  onChange={(e) => setData({ ...data, body3: e.target.value })}
                  placeholder="I am particularly drawn to Qualcomm's work in 5G modem design and low-power SoC architecture..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Closing Paragraph</label>
                <textarea
                  rows={3}
                  value={data.closing}
                  onChange={(e) => setData({ ...data, closing: e.target.value })}
                  placeholder="I would welcome the opportunity to discuss how my skills and experience align with your team's goals..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div
          className={`w-full lg:w-1/2 bg-slate-800 overflow-y-auto print:block print:bg-white print:w-full ${
            mobileMode === "editor" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="p-6 sm:p-8 flex justify-center">
            <div
              ref={previewRef}
              className={`w-full max-w-[600px] bg-white text-slate-900 shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none ${
                data.template === "modern" ? "border-t-4" :
                data.template === "academic" ? "border-t-4 border-slate-800" :
                "border border-slate-200"
              }`}
              style={data.template === "modern" ? { borderTopColor: accentColor } : undefined}
              id="cover-letter-preview"
            >
              <div className="p-8 sm:p-10 space-y-6">
                {/* Header */}
                <div className={`${data.template === "modern" ? "text-left" : data.template === "academic" ? "text-center" : "text-left"}`}>
                  {data.template === "modern" && (
                    <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor }}></div>
                  )}
                  <h1 className={`text-2xl font-bold text-slate-900 ${data.template === "academic" ? "tracking-wide" : ""}`}>
                    {data.fullName || "Your Name"}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>{data.phone}</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{today}</p>
                </div>

                {/* Separator */}
                <hr className={`border-slate-200 ${data.template === "academic" ? "border-2" : ""}`} />

                {/* Greeting */}
                <p className="text-sm text-slate-800 font-medium">{greeting}</p>

                {/* Body */}
                <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                  {data.opening && <p>{data.opening}</p>}
                  {body.split("\n\n").map((para, i) => para && <p key={i}>{para}</p>)}
                  {data.closing && <p>{data.closing}</p>}
                </div>

                {/* Signature */}
                <div className="pt-4">
                  <p className="text-sm text-slate-700">Sincerely,</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{data.fullName || "Your Name"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
