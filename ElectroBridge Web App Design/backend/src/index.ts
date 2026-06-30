import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { opportunitiesRouter } from './routes/opportunities.js';
import { newsRouter } from './routes/news.js';
import { subscribeRouter } from './routes/subscribe.js';
import { adminRouter } from './routes/admin.js';
import { aiRouter } from './routes/ai.js';
import { organizationsRouter } from './routes/organizations.js';
import { scrapeRouter } from './routes/scrape.js';
import { newsletterRouter } from './routes/newsletter.js';
import { isConfigured } from './lib/supabase.js';
import { checkConnection } from './lib/neon.js';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', async (_req, res) => {
  const supabaseOk = isConfigured;
  const neonOk = await checkConnection();
  res.json({
    status: supabaseOk && neonOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: { supabase: supabaseOk, neon: neonOk },
  });
});

app.use('/api/opportunities', opportunitiesRouter);
app.use('/api/news', newsRouter);
app.use('/api/subscribe', subscribeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/scrape', scrapeRouter);
app.use('/api/newsletter', newsletterRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`ElectroBridge API running on port ${PORT}`);
  console.log(`Supabase: ${isConfigured ? 'connected' : 'not configured'}`);
});

export default app;
