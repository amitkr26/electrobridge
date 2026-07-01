import type { Request, Response, NextFunction } from 'express';
import { isConfigured } from '../lib/supabase.js';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password not configured.' });
  }
  const token = req.headers['x-admin-token'] as string;
  if (!token || token !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized. Provide x-admin-token header.' });
  }
  next();
}

export function requireCronSecret(req: Request, res: Response, next: NextFunction) {
  const cronSecret = process.env.CRON_SECRET || '';
  const token = req.headers['x-cron-secret'] as string;

  if (!token || token !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorized. Provide x-cron-secret header.' });
  }
  next();
}

export function requireDatabase(req: Request, res: Response, next: NextFunction) {
  if (!isConfigured) {
    return res.status(503).json({ error: 'Database not configured.' });
  }
  next();
}
