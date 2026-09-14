import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai/providers";
import { apiError } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

/**
 * POST /api/ai/tailor
 *
 * Accepts: { action, resumeData?, jobDescriptionText?, ... }
 *
 * Actions:
 *   "analyze_jd"    — Parse the job description and extract keywords/categories
 *   "gap_analysis"  — Compare a resume against a JD and identify gaps
 *   "optimize"      — Generate an optimized resume based on gap analysis
 *   "full"          — All three steps in one call (for simplicity)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, resumeData, jobDescriptionText } = body;

    if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide a job description (at least 20 characters)." },
        { status: 400 }
      );
    }

    switch (action) {
      case "analyze_jd":
        return handleAnalyzeJD(jobDescriptionText);
      case "gap_analysis":
        if (!resumeData) {
          return NextResponse.json({ error: "Resume data required for gap analysis." }, { status: 400 });
        }
        return handleGapAnalysis(resumeData, jobDescriptionText);
      case "optimize":
        if (!resumeData) {
          return NextResponse.json({ error: "Resume data required for optimization." }, { status: 400 });
        }
        return handleOptimize(resumeData, jobDescriptionText, body.changes);
      case "full":
        if (!resumeData) {
          return NextResponse.json({ error: "Resume data required." }, { status: 400 });
        }
        return handleFull(resumeData, jobDescriptionText);
      default:
        return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }
  } catch (err: any) {
    return apiError(err, "ai-tailor");
  }
}

// ─── JD ANALYSIS ───────────────────────────────────────────────

async function handleAnalyzeJD(jdText: string) {
  const systemPrompt = `You are an expert job description analyzer for semiconductor, VLSI, and electronics engineering roles.
Extract structured information from the job description. Be precise and thorough.
Return ONLY valid JSON, no markdown fences.`;

  const prompt = `Analyze this job description and extract all structured information:

"""
${jdText.slice(0, 6000)}
"""

Return a JSON object with this exact structure:
{
  "jobTitle": "extracted job title",
  "company": "company name or empty string",
  "location": "location or empty string",
  "experienceRequirement": "e.g. '2-5 years' or 'Fresher/Entry Level'",
  "educationRequirement": "e.g. 'B.Tech ECE'",
  "technicalSkills": ["skill1", "skill2"],
  "softwareTools": ["tool1", "tool2"],
  "programmingLanguages": ["lang1", "lang2"],
  "hardwareTechnologies": ["hw1", "hw2"],
  "certifications": ["cert1"],
  "softSkills": ["skill1"],
  "responsibilities": ["resp1", "resp2"],
  "keywords": [
    {"keyword": "Verilog", "category": "required", "frequency": 3},
    {"keyword": "UVM", "category": "preferred", "frequency": 2},
    {"keyword": "STA", "category": "important", "frequency": 1}
  ],
  "seniority": "entry|mid|senior|lead|executive",
  "domain": "e.g. 'ASIC Verification' or 'Physical Design'"
}

Rules for keyword categorization:
- "required": explicitly stated as required/mandatory
- "preferred": stated as preferred/nice-to-have
- "important": mentioned multiple times or central to the role
- "supporting": mentioned but not central

For keywords, extract:
- Technical skills (Verilog, SystemVerilog, UVM, etc.)
- Tools (Cadence, Synopsys, Vivado, etc.)
- Concepts (STA, CDC, LINT, DFT, etc.)
- Methodologies (agile, waterfall, etc.)
- Domain terms (ASIC, FPGA, SoC, etc.)

Include acronyms AND their expanded forms when both appear.
Group semantically related terms (e.g., "RTL design" and "Verilog" are related).`;

  const aiRes = await callAI(prompt, systemPrompt, { feature: "tailor_jd_analysis" });
  const jsonText = extractJSON(aiRes.text);
  const analysis = JSON.parse(jsonText);

  return NextResponse.json({ success: true, analysis });
}

// ─── GAP ANALYSIS ──────────────────────────────────────────────

async function handleGapAnalysis(resumeData: Record<string, unknown>, jdText: string) {
  const resumeSummary = summarizeResume(resumeData);

  const systemPrompt = `You are an expert ATS and resume analyst for semiconductor/electronics engineering roles.
Compare a candidate's resume against a job description. Be honest and precise — never fabricate skills the candidate doesn't have.
Return ONLY valid JSON, no markdown fences.`;

  const prompt = `Compare this resume against the job description.

RESUME:
"""
${resumeSummary}
"""

JOB DESCRIPTION:
"""
${jdText.slice(0, 6000)}
"""

Return a JSON object:
{
  "scores": {
    "overall": <0-100>,
    "technicalSkills": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "keywords": <0-100>,
    "roleAlignment": <0-100>
  },
  "skillMatches": [
    {"keyword": "Verilog", "status": "matched", "category": "required", "explanation": "Found in skills and experience"},
    {"keyword": "UVM", "status": "partial", "similarTo": "SystemVerilog", "category": "required", "explanation": "Candidate knows SystemVerilog but UVM is not explicitly mentioned"},
    {"keyword": "formal verification", "status": "missing", "category": "preferred", "explanation": "Not found in resume. This is a preferred qualification."}
  ],
  "aiExplanation": "Your resume is a strong match for this role. You have solid Verilog and digital design experience. The main gap is UVM verification methodology. Your experience with SystemVerilog suggests you could learn UVM quickly."
}

Scoring methodology:
- "matched" = explicitly present in resume (counts toward score)
- "partial" = semantically related skill exists (counts partially)
- "missing" = no evidence in resume (does not count)

overall = weighted average: technicalSkills(30%) + experience(25%) + keywords(20%) + education(15%) + roleAlignment(10%)

Be conservative with scores. A resume with 3 missing required skills should not score above 70.`;

  const aiRes = await callAI(prompt, systemPrompt, { feature: "tailor_gap_analysis" });
  const jsonText = extractJSON(aiRes.text);
  const gapAnalysis = JSON.parse(jsonText);

  return NextResponse.json({ success: true, gapAnalysis });
}

// ─── OPTIMIZE RESUME ───────────────────────────────────────────

async function handleOptimize(
  resumeData: Record<string, unknown>,
  jdText: string,
  acceptedChanges?: string[]
) {
  const resumeSummary = summarizeResume(resumeData);

  const systemPrompt = `You are an expert resume optimizer for semiconductor, VLSI, and electronics engineering roles.
Rewrite and optimize a resume for a specific job description. CRITICAL RULES:
1. NEVER fabricate experience, companies, job titles, projects, degrees, certifications, skills, achievements, metrics, technologies, or responsibilities.
2. ONLY enhance content that already exists in the original resume.
3. Use the job description's terminology where the candidate's actual experience supports it.
4. Preserve all original metrics, numbers, and specific achievements.
5. Improve bullet points to use strong action verbs + technical work + method/tool + result/impact.
Return ONLY valid JSON, no markdown fences.`;

  const prompt = `Optimize this resume for the target job. Make targeted improvements only where the candidate's actual experience supports it.

ORIGINAL RESUME:
"""
${resumeSummary}
"""

TARGET JOB DESCRIPTION:
"""
${jdText.slice(0, 6000)}
"""

Rules:
- DO NOT invent new skills, experiences, companies, or achievements.
- DO rewrite weak bullet points to be more specific and action-oriented.
- DO reorder skills to prioritize the most relevant ones for this role.
- DO enhance the professional summary to align with the target role.
- DO use the job description's terminology where truthful (e.g., if resume says "digital circuits" and JD says "RTL design", and the candidate's work IS RTL design, use "RTL design").
- DO preserve all original metrics, numbers, dates, and specific details.
- DO explain every change you make.

Return a JSON object:
{
  "optimizedResume": {
    "fullName": "...",
    "headline": "...",
    "email": "...",
    "phone": "...",
    "location": "...",
    "linkedin": "...",
    "github": "...",
    "website": "...",
    "summary": "optimized summary text",
    "skills": ["skill1", "skill2", ...],
    "experience": [
      {
        "id": "same id as original",
        "role": "...",
        "org": "...",
        "period": "...",
        "detail": "optimized bullet points"
      }
    ],
    "education": [...same structure...],
    "projects": [
      {
        "id": "same id as original",
        "name": "...",
        "technologies": "...",
        "detail": "optimized description"
      }
    ],
    "certifications": [...],
    "publications": [...],
    "languages": [...],
    "volunteer": [...],
    "awards": [...],
    "interests": [...]
  },
  "changes": [
    {
      "section": "summary",
      "type": "rewritten",
      "before": "original summary text",
      "after": "new summary text",
      "reason": "Added relevant terminology while preserving the candidate's actual experience."
    },
    {
      "section": "skills",
      "type": "reordered",
      "before": "old skill order",
      "after": "new skill order",
      "reason": "Prioritized skills most relevant to the target role."
    },
    {
      "section": "experience",
      "type": "rewritten",
      "before": "original bullet",
      "after": "optimized bullet",
      "reason": "Improved action verbs and technical specificity."
    }
  ],
  "aiExplanation": "I optimized your resume by: 1) Enhancing the summary to highlight RTL design and verification experience. 2) Reordering skills to prioritize Verilog, SystemVerilog, and digital design. 3) Improving experience bullets to use stronger action verbs and more specific technical terminology. All changes are based on your actual experience — nothing was fabricated."
}`;

  const aiRes = await callAI(prompt, systemPrompt, { feature: "tailor_optimize" });
  const jsonText = extractJSON(aiRes.text);
  const result = JSON.parse(jsonText);

  return NextResponse.json({ success: true, ...result });
}

// ─── FULL PIPELINE ─────────────────────────────────────────────

async function handleFull(resumeData: Record<string, unknown>, jdText: string) {
  // Step 1: Analyze JD
  const jdAnalysisRes = await callAI(
    getJDAnalysisPrompt(jdText),
    getJDAnalysisSystemPrompt(),
    { feature: "tailor_jd_analysis" }
  );
  const jdAnalysis = JSON.parse(extractJSON(jdAnalysisRes.text));

  // Step 2: Gap analysis
  const resumeSummary = summarizeResume(resumeData);
  const gapRes = await callAI(
    getGapAnalysisPrompt(resumeSummary, jdText),
    getGapAnalysisSystemPrompt(),
    { feature: "tailor_gap_analysis" }
  );
  const gapAnalysis = JSON.parse(extractJSON(gapRes.text));

  // Step 3: Optimize
  const optimizeRes = await callAI(
    getOptimizePrompt(resumeSummary, jdText),
    getOptimizeSystemPrompt(),
    { feature: "tailor_optimize" }
  );
  const optimization = JSON.parse(extractJSON(optimizeRes.text));

  return NextResponse.json({
    success: true,
    jobAnalysis: jdAnalysis,
    gapAnalysis,
    ...optimization,
  });
}

// ─── HELPERS ───────────────────────────────────────────────────

function extractJSON(text: string): string {
  let cleaned = text.trim();
  // Strip markdown fences
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  }
  // Find the first { and last }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.substring(start, end + 1);
  }
  return cleaned;
}

function summarizeResume(data: Record<string, unknown>): string {
  const parts: string[] = [];
  if (data.fullName) parts.push(`Name: ${data.fullName}`);
  if (data.headline) parts.push(`Headline: ${data.headline}`);
  if (data.summary) parts.push(`Summary: ${data.summary}`);
  if (data.location) parts.push(`Location: ${data.location}`);
  if (Array.isArray(data.skills) && data.skills.length) parts.push(`Skills: ${data.skills.join(", ")}`);
  if (Array.isArray(data.experience)) {
    data.experience.forEach((exp: any) => {
      parts.push(`Experience: ${exp.role || ""} at ${exp.org || ""} (${exp.period || ""})\n${exp.detail || ""}`);
    });
  }
  if (Array.isArray(data.education)) {
    data.education.forEach((edu: any) => {
      parts.push(`Education: ${edu.degree || ""} ${edu.field || ""} from ${edu.school || ""} (${edu.year || ""})`);
    });
  }
  if (Array.isArray(data.projects)) {
    data.projects.forEach((proj: any) => {
      parts.push(`Project: ${proj.name || ""} (${proj.technologies || ""})\n${proj.detail || ""}`);
    });
  }
  if (Array.isArray(data.certifications)) {
    data.certifications.forEach((c: any) => parts.push(`Certification: ${c.name || ""} (${c.year || ""})`));
  }
  if (Array.isArray(data.publications)) {
    data.publications.forEach((p: any) => parts.push(`Publication: ${p.title || ""} (${p.venue || ""})`));
  }
  return parts.join("\n");
}

// Prompt generators (extracted for reuse in full pipeline)
function getJDAnalysisSystemPrompt(): string {
  return `You are an expert job description analyzer for semiconductor, VLSI, and electronics engineering roles.
Extract structured information from the job description. Be precise and thorough.
Return ONLY valid JSON, no markdown fences.`;
}

function getJDAnalysisPrompt(jdText: string): string {
  return `Analyze this job description and extract all structured information:

"""
${jdText.slice(0, 6000)}
"""

Return a JSON object with this exact structure:
{
  "jobTitle": "extracted job title",
  "company": "company name or empty string",
  "location": "location or empty string",
  "experienceRequirement": "e.g. '2-5 years'",
  "educationRequirement": "e.g. 'B.Tech ECE'",
  "technicalSkills": ["skill1", "skill2"],
  "softwareTools": ["tool1", "tool2"],
  "programmingLanguages": ["lang1", "lang2"],
  "hardwareTechnologies": ["hw1", "hw2"],
  "certifications": ["cert1"],
  "softSkills": ["skill1"],
  "responsibilities": ["resp1", "resp2"],
  "keywords": [
    {"keyword": "Verilog", "category": "required", "frequency": 3}
  ],
  "seniority": "entry|mid|senior|lead|executive",
  "domain": "e.g. 'ASIC Verification'"
}`;
}

function getGapAnalysisSystemPrompt(): string {
  return `You are an expert ATS and resume analyst for semiconductor/electronics engineering roles.
Compare a candidate's resume against a job description. Be honest and precise — never fabricate skills the candidate doesn't have.
Return ONLY valid JSON, no markdown fences.`;
}

function getGapAnalysisPrompt(resumeSummary: string, jdText: string): string {
  return `Compare this resume against the job description.

RESUME:
"""
${resumeSummary}
"""

JOB DESCRIPTION:
"""
${jdText.slice(0, 6000)}
"""

Return a JSON object:
{
  "scores": {
    "overall": <0-100>,
    "technicalSkills": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "keywords": <0-100>,
    "roleAlignment": <0-100>
  },
  "skillMatches": [
    {"keyword": "Verilog", "status": "matched", "category": "required", "explanation": "Found in skills and experience"},
    {"keyword": "UVM", "status": "partial", "similarTo": "SystemVerilog", "category": "required", "explanation": "Candidate knows SystemVerilog but UVM is not explicitly mentioned"},
    {"keyword": "formal verification", "status": "missing", "category": "preferred", "explanation": "Not found in resume."}
  ],
  "aiExplanation": "Your resume is a strong match..."
}

Scoring: overall = technicalSkills(30%) + experience(25%) + keywords(20%) + education(15%) + roleAlignment(10%)`;
}

function getOptimizeSystemPrompt(): string {
  return `You are an expert resume optimizer for semiconductor, VLSI, and electronics engineering roles.
CRITICAL RULES:
1. NEVER fabricate experience, companies, job titles, projects, degrees, certifications, skills, achievements, metrics, technologies, or responsibilities.
2. ONLY enhance content that already exists in the original resume.
3. Use the job description's terminology where the candidate's actual experience supports it.
4. Preserve all original metrics, numbers, and specific achievements.
5. Improve bullet points to use strong action verbs + technical work + method/tool + result/impact.
Return ONLY valid JSON, no markdown fences.`;
}

function getOptimizePrompt(resumeSummary: string, jdText: string): string {
  return `Optimize this resume for the target job. Make targeted improvements only where the candidate's actual experience supports it.

ORIGINAL RESUME:
"""
${resumeSummary}
"""

TARGET JOB DESCRIPTION:
"""
${jdText.slice(0, 6000)}
"""

Return a JSON object:
{
  "optimizedResume": {
    "fullName": "...", "headline": "...", "email": "...", "phone": "...",
    "location": "...", "linkedin": "...", "github": "...", "website": "...",
    "summary": "optimized summary",
    "skills": ["skill1", "skill2"],
    "experience": [{"id": "...", "role": "...", "org": "...", "period": "...", "detail": "optimized bullets"}],
    "education": [{"id": "...", "school": "...", "degree": "...", "field": "...", "year": "...", "cgpa": "..."}],
    "projects": [{"id": "...", "name": "...", "technologies": "...", "detail": "optimized"}],
    "certifications": [{"id": "...", "name": "...", "issuer": "...", "year": "..."}],
    "publications": [{"id": "...", "title": "...", "venue": "...", "year": "..."}],
    "languages": [...],
    "volunteer": [...],
    "awards": [...],
    "interests": [...]
  },
  "changes": [
    {"section": "summary", "type": "rewritten", "before": "original", "after": "optimized", "reason": "why"}
  ],
  "aiExplanation": "Overall explanation of changes"
}`;
}
