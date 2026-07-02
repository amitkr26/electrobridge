import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';

function trySupabase(url: string | undefined, key: string | undefined) {
  if (!url || !key) return undefined as any;
  return createSupabaseClient(url, key);
}

function tryNeon(url: string | undefined) {
  if (!url) return undefined as any;
  return neon(url);
}

export const db1 = trySupabase(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const db2 = trySupabase(
  process.env.SUPABASE_2_URL,
  process.env.SUPABASE_2_SERVICE_ROLE_KEY
);

export const neonPrimary = tryNeon(process.env.NEON_1_DATABASE_URL);

export const neonSecondary = tryNeon(process.env.NEON_2_DATABASE_URL);

export function getDB(purpose:
  | 'opportunities'
  | 'news'
  | 'auth'
  | 'community'
  | 'analytics'
  | 'news_archive'
  | 'read_replica'
) {
  switch (purpose) {
    case 'analytics':
      return { type: 'neon' as const, client: neonPrimary };
    case 'news_archive':
      return { type: 'supabase' as const, client: db2 };
    case 'read_replica':
      return { type: 'neon' as const, client: neonSecondary };
    default:
      return { type: 'supabase' as const, client: db1 };
  }
}
