# ElectroBridge Deployment Checklist

## Vercel Environment Variables (add all of these)
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] SUPABASE_2_URL
- [ ] SUPABASE_2_ANON_KEY
- [ ] SUPABASE_2_SERVICE_ROLE_KEY
- [ ] NEON_1_DATABASE_URL
- [ ] NEON_2_DATABASE_URL
- [ ] NEXT_PUBLIC_ADMIN_PASSWORD
- [ ] CRON_SECRET
- [ ] GROQ_API_KEY
- [ ] NVIDIA_NIM_API_KEY
- [ ] GEMINI_API_KEY
- [ ] OPENROUTER_API_KEY
- [ ] HUGGINGFACE_API_KEY
- [ ] CLOUDFLARE_AI_TOKEN
- [ ] CLOUDFLARE_ACCOUNT_ID
- [ ] AWS_BEARER_TOKEN_BEDROCK
- [ ] RESEND_API_KEY
- [ ] FROM_EMAIL
- [ ] TELEGRAM_BOT_TOKEN
- [ ] TELEGRAM_CHANNEL_ID

## Supabase Primary — Run These SQL Files
- [ ] supabase/migrations/20260501000001_fix_duplicates_and_cleanup.sql
- [ ] supabase/migrations/20260501000002_verification_and_slugs.sql
- [ ] supabase/migrations/20260501000003_cleanup_irrelevant_news.sql
- [ ] supabase/migrations/20260501000004_ai_usage_log.sql
- [ ] supabase/migrations/20260501000005_news_slug_suggestions.sql
- [ ] supabase/migrations/20260630000001_user_profiles.sql
- [ ] supabase/migrations/20260702000001_resume_builder.sql
- [ ] supabase/migrations/20260702000002_community.sql

## Supabase Secondary — Run This SQL
- [ ] supabase/migrations/20260703000002_supabase2_schema.sql

## Neon Primary — Run This SQL
- [ ] supabase/migrations/20260703000001_neon_schema.sql (Neon 1 section)

## Neon Secondary — Run This SQL
- [ ] supabase/migrations/20260703000001_neon_schema.sql (Neon 2 section)

## Google OAuth Setup
- [ ] Google Cloud Console -> Create OAuth Client
- [ ] Authorized redirect URI: https://[supabase-project].supabase.co/auth/v1/callback
- [ ] Add Client ID + Secret to Supabase Auth -> Providers -> Google

## Telegram Bot Setup
- [ ] @BotFather -> /newbot -> electrobridge_bot
- [ ] Create channel @electrobridge_jobs -> add bot as admin
- [ ] Get Channel ID via @userinfobot

## Post-Deploy Verification
- [ ] https://electrobridge.vercel.app loads
- [ ] /opportunities shows listings
- [ ] /news shows articles
- [ ] /login works (email signup)
- [ ] /dashboard accessible after login
- [ ] /resume loads
- [ ] /community loads
- [ ] /admin accessible
- [ ] AI chat responds (/chat)
- [ ] Manually trigger scrape: curl https://electrobridge.vercel.app/api/scrape?mode=all -H "Authorization: Bearer [CRON_SECRET]"
