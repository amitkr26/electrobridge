import { supabase } from "../supabase.js";

export interface MatchResult {
  opportunity: Record<string, unknown>;
  matchScore: number;
}

export async function matchOpportunities(skills: string[], interests?: string[], experience?: string): Promise<MatchResult[]> {
  if (!supabase) return [];

  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("is_active", true)
    .limit(50);

  if (error) throw error;

  const matches = (opportunities || []).map((opp) => {
    const tagMatch = (opp.tags || []).filter((t: string) =>
      skills.some((s: string) => t.toLowerCase().includes(s.toLowerCase()))
    ).length;
    const descMatch = skills.filter((s: string) =>
      (opp.description || "").toLowerCase().includes(s.toLowerCase())
    ).length;
    const score = Math.min(100, Math.round(((tagMatch * 3 + descMatch) / (skills.length * 3)) * 100));
    return { opportunity: opp, matchScore: score };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
}