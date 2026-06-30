import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireCronSecret, requireDatabase } from '../middleware/auth.js';
import { runAllScrapers } from '../lib/scrapers/opportunity-scraper.js';
import { runRssNewsScrapers } from '../lib/scrapers/rss-parser.js';

export const scrapeRouter = Router();

scrapeRouter.use(requireCronSecret);

scrapeRouter.get('/', requireDatabase, async (_req, res) => {
  try {
    res.json({ data: { message: 'Scrapers ready. Use GET /opportunities and GET /news' } });
  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({ error: 'Scrape failed' });
  }
});

scrapeRouter.get('/news', requireDatabase, async (_req, res) => {
  try {
    const result = await runRssNewsScrapers();
    await supabase!.from('ai_usage_log').insert([{
      feature: 'scrape-news', provider: 'rss', success: true,
    }]).maybeSingle();
    res.json({ data: { ...result, message: 'News scraped successfully' } });
  } catch (error) {
    console.error('Scrape news error:', error);
    res.status(500).json({ error: 'News scraping failed' });
  }
});

scrapeRouter.get('/opportunities', requireDatabase, async (_req, res) => {
  try {
    const result = await runAllScrapers();
    await supabase!.from('ai_usage_log').insert([{
      feature: 'scrape-opportunities', provider: 'cheerio', success: true,
    }]).maybeSingle();
    res.json({ data: { ...result, message: 'Opportunities scraped successfully' } });
  } catch (error) {
    console.error('Scrape opportunities error:', error);
    res.status(500).json({ error: 'Opportunity scraping failed' });
  }
});

scrapeRouter.get('/check-links', requireDatabase, async (_req, res) => {
  try {
    const { data: opportunities, error } = await supabase!
      .from('opportunities')
      .select('id, apply_link, source_url')
      .eq('is_active', true)
      .limit(50);

    if (error) throw error;

    let broken = 0;
    for (const opp of opportunities || []) {
      const urls = [opp.apply_link, opp.source_url].filter(Boolean);
      for (const url of urls) {
        try {
          const response = await fetch(url!, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
          if (!response.ok) broken++;
          await supabase!.from('link_check_logs').insert([{
            opportunity_id: opp.id, url, status: response.ok ? 'valid' : 'broken',
            status_code: response.status, checked_at: new Date().toISOString(),
          }]);
        } catch { broken++; }
      }
    }
    res.json({ data: { checked: opportunities?.length || 0, broken } });
  } catch (error) {
    console.error('Check links error:', error);
    res.status(500).json({ error: 'Link check failed' });
  }
});

scrapeRouter.get('/cleanup-news', requireDatabase, async (_req, res) => {
  try {
    const { data, error } = await supabase!
      .from('news_articles')
      .select('id, source_url');
    if (error) throw error;

    const seen = new Map<string, string[]>();
    const toRemove: string[] = [];
    for (const article of data || []) {
      if (!article.source_url) continue;
      const key = article.source_url.replace(/\/$/, '').trim().toLowerCase();
      if (seen.has(key)) toRemove.push(article.id);
      else seen.set(key, [article.id]);
    }
    if (toRemove.length > 0) {
      await supabase!.from('news_articles').delete().in('id', toRemove);
    }
    res.json({ data: { removed: toRemove.length } });
  } catch (error) {
    console.error('Cleanup news error:', error);
    res.status(500).json({ error: 'Cleanup failed' });
  }
});