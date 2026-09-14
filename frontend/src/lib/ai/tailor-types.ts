/**
 * Types for the Job-Tailored Resume feature.
 * Reuses existing ResumeData from resume/types.ts.
 */

export type KeywordCategory = "required" | "preferred" | "important" | "supporting";

export interface ExtractedKeyword {
  keyword: string;
  category: KeywordCategory;
  /** Semantic cluster this keyword belongs to (e.g., "verification", "rtl", "physical-design") */
  cluster?: string;
  /** How many times mentioned in the JD */
  frequency: number;
}

export interface JobDescriptionAnalysis {
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
  keywords: ExtractedKeyword[];
  seniority: "entry" | "mid" | "senior" | "lead" | "executive";
  domain: string;
  rawText: string;
}

export interface SkillMatch {
  keyword: string;
  /** "matched" = found in resume, "partial" = similar skill exists, "missing" = not found */
  status: "matched" | "partial" | "missing";
  /** If partial match, what skill in the resume is similar */
  similarTo?: string;
  /** Category from the JD */
  category: KeywordCategory;
  /** AI explanation of why this matters */
  explanation?: string;
}

export interface MatchScores {
  overall: number;
  technicalSkills: number;
  experience: number;
  education: number;
  keywords: number;
  roleAlignment: number;
}

export interface ResumeChange {
  section: "summary" | "skills" | "experience" | "projects" | "education" | "certifications" | "other";
  type: "rewritten" | "added" | "reordered" | "unchanged";
  before: string;
  after: string;
  reason: string;
}

export interface TailorResult {
  /** The analysis of the job description */
  jobAnalysis: JobDescriptionAnalysis;
  /** Skills matched against the resume */
  skillMatches: SkillMatch[];
  /** Match scores */
  scores: MatchScores;
  /** Changes made to the resume */
  changes: ResumeChange[];
  /** The optimized resume (as ResumeData-compatible object) */
  optimizedResume: Record<string, unknown>;
  /** AI explanation of overall recommendations */
  aiExplanation: string;
}

export interface TailorRequest {
  /** The resume data to tailor (from ElectroBridge or parsed from upload) */
  resumeData: Record<string, unknown>;
  /** The job description text */
  jobDescriptionText: string;
  /** Which sections to optimize (default: all) */
  sections?: string[];
}

/** What the /api/ai/tailor endpoint accepts */
export type TailorAPIRequest = TailorRequest;
