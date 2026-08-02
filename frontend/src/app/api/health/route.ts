import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export async function GET() {
  if (!isAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 }
    );
  }

  let lastScrape: string | null = null;
  let lastNews: string | null = null;
  let opportunitiesCount = 0;
  let newsCount = 0;
  let error: string | null = null;

  try {
    const { data: opp } = await supabaseAdmin
      .from("opportunities")
      .select("created_at", { count: "exact", head: true })
      .order("created_at", { ascending: false })
      .limit(1);
    if (opp && opp.length > 0) lastScrape = opp[0].created_at;

    const { count: oppCount } = await supabaseAdmin
      .from("opportunities")
      .select("*", { count: "exact", head: true });
    opportunitiesCount = oppCount || 0;

    const { data: news } = await supabaseAdmin
      .from("news_articles")
      .select("created_at", { count: "exact", head: true })
      .order("created_at", { ascending: false })
      .limit(1);
    if (news && news.length > 0) lastNews = news[0].created_at;

    const { count: newsCountResult } = await supabaseAdmin
      .from("news_articles")
      .select("*", { count: "exact", head: true });
    newsCount = newsCountResult || 0;
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    status: error ? "degraded" : "ok",
    timestamp: new Date().toISOString(),
    database: error ? error : "ok",
    last_scrape: lastScrape,
    last_news: lastNews,
    opportunities_count: opportunitiesCount,
    news_count: newsCount,
  });
}