import type { ScrapedOpportunity, ScrapeResult } from "./types.js";
import { scrapeISRO } from "./isro-scraper.js";
import { scrapeCSIR } from "./csir-scraper.js";
import { scrapeDRDO } from "./drdo-scraper.js";
import { scrapeGovtJobs } from "./govt-scraper.js";
import { fetchOpportunitiesFromRSS } from "./rss-parser.js";
import { supabase } from "../supabase.js";

export interface ScrapeAllResult {
  opportunities: ScrapedOpportunity[];
  results: ScrapeResult[];
  total: number;
}

async function supabaseUpsert(opts: ScrapedOpportunity[]): Promise<number> {
  if (!supabase || opts.length === 0) return 0;
  const { error } = await supabase.from("opportunities").upsert(
    opts.map((o) => ({
      title: o.title, organization: o.organization, category: o.category,
      type: o.category === "JRF" ? "Fellowship" : o.category === "Fellowship" ? "Fellowship" : o.category === "Govt Job" ? "Full-time" : o.category === "SRF" ? "Fellowship" : "Research",
      description: o.description || "", location: o.location, stipend: o.stipend,
      deadline: o.deadline, eligibility: o.eligibility, tags: o.tags,
      source_url: o.source_url, apply_link: o.apply_link, source: o.organization,
      slug: o.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 100),
      verification_status: "unverified", is_active: true, is_featured: false,
    })),
    { onConflict: "source_url", ignoreDuplicates: true },
  );
  if (error) { console.error("Supabase upsert error:", error); return 0; }
  return opts.length;
}

export async function scrapeAllOpportunities(): Promise<ScrapeAllResult> {
  const sources: { name: string; scraper: () => Promise<ScrapedOpportunity[]> }[] = [
    { name: "ISRO", scraper: scrapeISRO },
    { name: "CSIR", scraper: scrapeCSIR },
    { name: "DRDO", scraper: scrapeDRDO },
    { name: "GovtJobs", scraper: () => scrapeGovtJobs().then(r => r.opportunities) },
    { name: "RSS Opportunities", scraper: fetchOpportunitiesFromRSS },
  ];

  const allResults: ScrapeResult[] = [];
  const allOpportunities: ScrapedOpportunity[] = [];

  for (const source of sources) {
    try {
      const data = await source.scraper();
      allOpportunities.push(...data);
      allResults.push({ source: source.name, success: true, count: data.length });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      allResults.push({ source: source.name, success: false, count: 0, error: msg });
    }
  }

  return { opportunities: allOpportunities, results: allResults, total: allOpportunities.length };
}

export async function runAllScrapers(): Promise<{ scraped: number; updated: number; errors: string[]; results: ScrapeResult[] }> {
  const { opportunities, results } = await scrapeAllOpportunities();
  const saved = await supabaseUpsert(opportunities);
  const errors = results.filter((r) => !r.success).map((r) => `${r.source}: ${r.error || "unknown"}`);
  return { scraped: opportunities.length, updated: saved, errors, results };
}