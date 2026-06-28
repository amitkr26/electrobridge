import type { ScrapedOpportunity, ScrapeResult } from "./types";
import { scrapeISRO } from "./isro-scraper";
import { scrapeCSIR } from "./csir-scraper";
import { scrapeGovtJobs } from "./govt-scraper";

export interface ScrapeAllResult {
  opportunities: ScrapedOpportunity[];
  results: ScrapeResult[];
  total: number;
}

export async function scrapeAllOpportunities(): Promise<ScrapeAllResult> {
  const sources = [
    { name: "ISRO", scraper: scrapeISRO },
    { name: "CSIR", scraper: scrapeCSIR },
    { name: "GovtJobs", scraper: () => scrapeGovtJobs().then(r => r.opportunities) },
  ];

  const allResults: ScrapeResult[] = [];
  const allOpportunities: ScrapedOpportunity[] = [];

  for (const source of sources) {
    try {
      const data = await source.scraper();
      allOpportunities.push(...data);
      allResults.push({
        source: source.name,
        success: true,
        count: data.length,
      });
      console.log(`${source.name}: ${data.length} opportunities scraped`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`${source.name} scraper failed:`, msg);
      allResults.push({
        source: source.name,
        success: false,
        count: 0,
        error: msg,
      });
    }
  }

  return {
    opportunities: allOpportunities,
    results: allResults,
    total: allOpportunities.length,
  };
}
