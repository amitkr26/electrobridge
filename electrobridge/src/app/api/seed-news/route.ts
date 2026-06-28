import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import Parser from "rss-parser";

const SEED_SOURCES = [
  {
    name: "IEEE Spectrum",
    url: "https://spectrum.ieee.org/feeds/feed.rss",
    tags: ["IEEE", "electronics"],
  },
  {
    name: "Semiconductor Engineering",
    url: "https://semiengineering.com/feed/",
    tags: ["semiconductor", "design"],
  },
  {
    name: "Electronics Weekly",
    url: "https://www.electronicsweekly.com/feed/",
    tags: ["electronics", "news"],
  },
];

export async function GET() {
  if (!isAdminConfigured) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const results: Record<string, any> = {};

  for (const source of SEED_SOURCES) {
    try {
      const parser = new Parser({
        timeout: 10000,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ElectroBridge/1.0)" },
      });
      const feed = await parser.parseURL(source.url);
      let inserted = 0;
      let skipped = 0;

      for (const item of feed.items) {
        const sourceUrl = item.link || "";
        if (!sourceUrl) {
          skipped++;
          continue;
        }

        const { data: existing } = await supabaseAdmin
          .from("news_articles")
          .select("id")
          .eq("source_url", sourceUrl)
          .maybeSingle();

        if (existing) {
          skipped++;
          continue;
        }

        const article = {
          title: item.title || "Untitled",
          summary: item.contentSnippet?.substring(0, 300) || null,
          source: source.name,
          source_url: sourceUrl,
          published_at: item.pubDate || item.isoDate || null,
          image_url: item.enclosure?.url || null,
          tags: source.tags,
        };

        const { error } = await supabaseAdmin
          .from("news_articles")
          .insert([article]);

        if (!error) {
          inserted++;
        } else {
          console.error(`Error inserting article:`, error);
        }
      }

      results[source.name] = {
        total: feed.items.length,
        inserted,
        skipped,
      };
    } catch (error) {
      console.error(`Error fetching ${source.name}:`, error);
      results[source.name] = { error: String(error) };
    }
  }

  return NextResponse.json({
    message: "Seed complete",
    sources: results,
  });
}
