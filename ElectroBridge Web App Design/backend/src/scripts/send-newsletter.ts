import 'dotenv/config';
import { generateWeeklyDigest } from '../lib/ai/newsletter.js';
import { supabase } from '../lib/supabase.js';

async function main() {
  console.log('[Newsletter] Generating weekly digest...');
  const start = Date.now();

  try {
    const today = new Date().toISOString().split('T')[0];
    const [{ data: opportunities }, { data: newsArticles }] = await Promise.all([
      supabase!.from('opportunities').select('title, organization, deadline, stipend').eq('is_active', true).gte('deadline', today).limit(20),
      supabase!.from('news_articles').select('title, source').order('published_at', { ascending: false }).limit(20),
    ]);

    const digest = await generateWeeklyDigest(opportunities || [], newsArticles || []);

    const { data: subscribers } = await supabase!
      .from('subscribers')
      .select('email')
      .eq('is_active', true)
      .limit(10);

    if (subscribers && subscribers.length > 0 && process.env.RESEND_API_KEY) {
      for (const sub of subscribers) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'ElectroBridge <digest@electrobridge.com>',
              to: sub.email,
              subject: `ElectroBridge Weekly Digest — ${new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}`,
              text: digest,
            }),
          });
        } catch (e) { console.error(`Failed to send to ${sub.email}:`, e); }
      }
    }

    console.log(`[Newsletter] Sent to ${subscribers?.length || 0} subscribers in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  } catch (error) {
    console.error('[Newsletter] Error:', error);
    process.exit(1);
  }
}

main();