import { Router } from 'express';
import { supabase, isConfigured } from '../lib/supabase.js';
import { requireDatabase } from '../middleware/auth.js';
import { callAI } from '../lib/ai/providers.js';
import { parseSearchQuery } from '../lib/ai/search-parser.js';
import { matchOpportunities } from '../lib/ai/matcher.js';
import { summarizeText } from '../lib/ai/summarizer.js';
import { expireOpportunities } from '../lib/ai/expiry-checker.js';

export const aiRouter = Router();

const CHAT_SYSTEM_PROMPT = 'You are ElectroBridge AI, a career assistant specializing in electronics, semiconductor, VLSI, research, and government job opportunities in India. Help users find opportunities, review resumes, and plan careers.';

aiRouter.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
      const { text, provider } = await callAI(message, CHAT_SYSTEM_PROMPT, { feature: 'chat' });
      if (supabase) {
        await supabase.from('ai_usage_log').insert([{
          feature: 'chat', provider, success: true, user_id: (req as any).user?.id || null,
        }]).maybeSingle();
      }
      res.json({ data: { message: text, provider } });
    } catch {
      res.status(503).json({ error: 'AI service unavailable. No providers responded.' });
    }
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI chat failed' });
  }
});

aiRouter.post('/match', requireDatabase, async (req, res) => {
  try {
    const { skills, interests, experience } = req.body;
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills array is required' });
    }

    const matches = await matchOpportunities(skills, interests, experience);

    if (supabase) {
      await supabase.from('ai_usage_log').insert([{
        feature: 'match', provider: 'local', success: true,
      }]).maybeSingle();
    }

    res.json({ data: { matches } });
  } catch (error) {
    console.error('AI match error:', error);
    res.status(500).json({ error: 'Matching failed' });
  }
});

aiRouter.get('/search', requireDatabase, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    const filters = await parseSearchQuery(q as string);

    const today = new Date().toISOString().split('T')[0];
    let query = supabase!
      .from('opportunities')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .or(`deadline.gte.${today},deadline.is.null`);

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);
    if (filters.organization_hint) query = query.ilike('organization', `%${filters.organization_hint}%`);
    if (filters.eligibility) query = query.ilike('eligibility', `%${filters.eligibility}%`);

    const { data, error, count } = await query.limit(20);
    if (error) throw error;

    res.json({ data: data || [], total: count || 0 });
  } catch (error) {
    console.error('AI search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

aiRouter.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const result = await summarizeText(text);
    res.json({ data: result });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Summarization failed' });
  }
});

aiRouter.get('/expire', requireDatabase, async (_req, res) => {
  try {
    const result = await expireOpportunities();
    res.json({ data: result });
  } catch (error) {
    console.error('Expire error:', error);
    res.status(500).json({ error: 'Failed to expire opportunities' });
  }
});