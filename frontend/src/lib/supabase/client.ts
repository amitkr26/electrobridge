import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client for electrobridge.
 *
 * During CI the NEXT_PUBLIC_SUPABASE_* env vars are empty.
 * Fallback to harmless placeholders so the client constructs without throwing.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
  return createSupabaseClient(url, anonKey);
}
