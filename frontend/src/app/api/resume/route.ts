import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateOrThrow } from "@/lib/validation";

export const dynamic = "force-dynamic";

const resumeSchema = z.object({
  full_name: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  github: z.string().optional().default(""),
  website: z.string().optional().default(""),
  headline: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
  education: z.array(z.any()).optional().default([]),
  experience: z.array(z.any()).optional().default([]),
  projects: z.array(z.any()).optional().default([]),
  certifications: z.array(z.any()).optional().default([]),
  publications: z.array(z.any()).optional().default([]),
  awards: z.array(z.any()).optional().default([]),
}).passthrough();

function calculateAtsScore(resume: any) {
  let score = 40;
  const feedback: string[] = [];

  if (resume.full_name && resume.full_name.length > 2) score += 5;
  if (resume.email && resume.email.includes("@")) score += 5;
  if (resume.phone && resume.phone.length >= 8) score += 5;
  if (resume.headline && resume.headline.length > 5) score += 5;
  if (resume.summary && resume.summary.length > 20) score += 5;

  const skillsCount = Array.isArray(resume.skills) ? resume.skills.length : 0;
  if (skillsCount >= 5) score += 10;
  else feedback.push("Add at least 5 key technical semiconductor skills (e.g. Verilog, UVM, STA).");

  const expCount = Array.isArray(resume.experience) ? resume.experience.length : 0;
  if (expCount >= 1) score += 10;
  else feedback.push("Add detailed internship, research lab, or industry experience.");

  const eduCount = Array.isArray(resume.education) ? resume.education.length : 0;
  if (eduCount >= 1) score += 10;
  else feedback.push("Add your academic background (Degree, University, Graduation Year).");

  const projCount = Array.isArray(resume.projects) ? resume.projects.length : 0;
  if (projCount >= 1) score += 5;

  return {
    score: Math.min(100, Math.max(40, score)),
    feedback: feedback.length > 0 ? feedback : ["Great profile! Strong alignment with semiconductor industry ATS standards."],
  };
}

export async function GET(request: NextRequest) {
  // Without auth, return empty resume data (guest mode — client uses localStorage)
  return NextResponse.json({
    resume: {},
    versions: [],
    ats_score: 85,
    ats_feedback: ["Guest mode — sign in to save resumes to the cloud."],
  });
}

export async function POST(request: NextRequest) {
  return PATCH(request);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const updates = validateOrThrow(resumeSchema, body);
  const { score, feedback } = calculateAtsScore(updates);

  // Without auth, just return success with ATS score (data lives in localStorage)
  return NextResponse.json({
    success: true,
    resume: updates,
    version: null,
    ats_score: score,
    ats_feedback: feedback,
  });
}

export async function DELETE(request: NextRequest) {
  // Without auth, just return success (no server data to delete)
  return NextResponse.json({ success: true });
}
