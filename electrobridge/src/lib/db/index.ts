/**
 * ElectroBridge Multi-Database Router
 *
 * DB1 (Supabase Primary):   Core data — opportunities, news, community, auth
 * DB2 (Supabase Secondary): Overflow — news archive, additional storage
 * DB3 (Neon Primary):       Analytics — ai_usage_log, link_check_logs, reports
 * DB4 (Neon Secondary):     Read replica — opportunities read mirror
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';

export const db1 = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const db2 = createSupabaseClient(
  process.env.SUPABASE_2_URL!,
  process.env.SUPABASE_2_SERVICE_ROLE_KEY!
);

export const neonPrimary = neon(process.env.NEON_1_DATABASE_URL!);

export const neonSecondary = neon(process.env.NEON_2_DATABASE_URL!);

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
