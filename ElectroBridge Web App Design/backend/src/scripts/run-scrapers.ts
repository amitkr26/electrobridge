import 'dotenv/config';
import { runAllScrapers } from '../lib/scrapers/opportunity-scraper.js';
import { runRssNewsScrapers } from '../lib/scrapers/rss-parser.js';

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'all';

  console.log(`[Scraper] Starting in mode: ${mode}`);
  const start = Date.now();

  try {
    if (mode === 'news' || mode === 'all') {
      console.log('[Scraper] Running RSS news scrapers...');
      const newsResult = await runRssNewsScrapers();
      console.log('[Scraper] News result:', JSON.stringify(newsResult));
    }

    if (mode === 'opportunities' || mode === 'all') {
      console.log('[Scraper] Running opportunity scrapers...');
      const oppResult = await runAllScrapers();
      console.log('[Scraper] Opportunities result:', JSON.stringify(oppResult));
    }

    console.log(`[Scraper] Complete in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  } catch (error) {
    console.error('[Scraper] Fatal error:', error);
    process.exit(1);
  }
}

main();