import 'dotenv/config';
import { expireOpportunities } from '../lib/ai/expiry-checker.js';

async function main() {
  console.log('[Expire] Checking for expired opportunities...');
  const start = Date.now();

  try {
    const result = await expireOpportunities();
    console.log(`[Expire] Done: ${result.expired} expired, ${result.updated} updated in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  } catch (error) {
    console.error('[Expire] Error:', error);
    process.exit(1);
  }
}

main();