import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireCronSecret, requireDatabase } from '../middleware/auth.js';
import { generateWeeklyDigest } from '../lib/ai/newsletter.js';
import { callAI } from '../lib/ai/providers.js';

export const newsletterRouter = Router();

newsletterRouter.use(requireCronSecret);

newsletterRouter.get('/weekly-digest', requireDatabase, async (_req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [{ data: opportunities }, { data: newsArticles }] = await Promise.all([
      supabase!.from('opportunities').select('title, organization, deadline, stipend').eq('is_active', true).gte('deadline', today).limit(20),
      supabase!.from('news_articles').select('title, source').order('published_at', { ascending: false }).limit(20),
    ]);

    const digest = await generateWeeklyDigest(opportunities || [], newsArticles || []);
    res.json({ data: { digest } });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ error: 'Failed to generate digest' });
  }
});

newsletterRouter.get('/send', requireDatabase, async (_req, res) => {
  try {
    const { data: subscribers } = await supabase!
      .from('subscribers')
      .select('email')
      .eq('is_active', true)
      .limit(10);

    const today = new Date().toISOString().split('T')[0];
    const [{ data: opportunities }, { data: newsArticles }] = await Promise.all([
      supabase!.from('opportunities').select('title, organization, deadline, stipend').eq('is_active', true).gte('deadline', today).limit(20),
      supabase!.from('news_articles').select('title, source').order('published_at', { ascending: false }).limit(20),
    ]);

    const digest = await generateWeeklyDigest(opportunities || [], newsArticles || []);
    const emails = (subscribers || []).map(s => s.email);

    if (emails.length > 0 && process.env.RESEND_API_KEY) {
      for (const email of emails) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'ElectroBridge <digest@electrobridge.com>',
              to: email,
              subject: `ElectroBridge Weekly Digest — ${new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}`,
              text: digest,
            }),
          });
        } catch (e) { console.error(`Failed to send to ${email}:`, e); }
      }
    }

    res.json({ data: { sent: emails.length, total: subscribers?.length || 0 } });
  } catch (error) {
    console.error('Newsletter send error:', error);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});