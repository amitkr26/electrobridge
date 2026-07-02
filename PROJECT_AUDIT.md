# PROJECT_AUDIT.md

> **Note:** This repo contains two codebases — `electrobridge/` (Next.js 14, 7 AI providers, App Router) and `ElectroBridge Web App Design/` (Next.js 15 static export + Express backend). This audit covers the **`electrobridge/`** codebase, which is the actively developed version.
> For the other codebase, see `ElectroBridge Web App Design/documents/15_PROJECT_AUDIT.md`

**Updated:** July 2, 2026 (Session 4)

---

## Recent Changes (Session 3)

### Resume Builder (NEW)
- **Migration:** `supabase/migrations/20260702000001_resume_builder.sql` — `user_resumes` table with RLS, `sync_ats_score` trigger
- **API:** `src/app/api/resume/route.ts` — GET/POST with AI ATS scoring via Bedrock (7-provider fallback chain)
- **Page:** `src/app/resume/page.tsx` — 6-step stepper (Personal → Education → Skills → Experience → Projects → Publications), live ATS preview sidebar, AI scoring, PDF export via `window.print()`
- **Loading:** `src/app/resume/loading.tsx`
- **Protected:** Redirects to `/login` if no session

### Community Forum (NEW)
- **Migration:** `supabase/migrations/20260702000002_community.sql` — `community_posts`, `community_comments`, `community_votes` tables with RLS, `toggle_upvote` function
- **API Routes:**
  - `src/app/api/community/posts/route.ts` — GET (list with category/sort filter) / POST (create, auth required)
  - `src/app/api/community/posts/[id]/route.ts` — GET (single post with comments) / DELETE (own post)
  - `src/app/api/community/vote/route.ts` — POST toggle upvote via RPC
  - `src/app/api/community/comments/route.ts` — POST add comment, increments comment_count
- **Pages:**
  - `src/app/community/page.tsx` — Category tabs (Trending/Latest/Q&A/Showcase), post cards with upvote/comment counts, new post modal, empty state with CTA
  - `src/app/community/[id]/page.tsx` — Post detail with comments, upvoting, comment input

### Dashboard Enhancements
- **Build Resume** button → links to `/resume` (replaced `/profile`)
- **Resume Score card:** Shows "View Resume" link if ATS score exists, "Build Resume →" button if not
- **Application Tracker:** Static status badge replaced with `<select>` dropdown — calls `PATCH /api/applications` on change

### Navbar Updates
- Added **Community** (MessageSquare icon) and **Resume** (FileText icon) to NAV_ITEMS between Ask AI and About
- Both visible in desktop nav and mobile hamburger menu

### Sitemap
- Added `/login`, `/signup` to static routes

### Build Verification
- Build passes: **198 static pages** (up from 194), **0 TypeScript errors**
- All existing pages intact (opportunities, news, match, chat, admin, dashboard, etc.)

### AI Provider Chain (`src/lib/ai/providers.ts`)
- **7 providers** in fallback order: Bedrock (openai.gpt-oss-120b) → Groq → NVIDIA → Gemini → OpenRouter → Cloudflare → HuggingFace
- Bedrock uses `AWS_BEARER_TOKEN_BEDROCK` env var with bedrock-mantle endpoint (OpenAI-compatible)
- Usage logged to `ai_usage_log` table

### Files Created (Session 3)
- `supabase/migrations/20260702000001_resume_builder.sql`
- `supabase/migrations/20260702000002_community.sql`
- `src/app/api/resume/route.ts`
- `src/app/api/community/posts/route.ts`
- `src/app/api/community/posts/[id]/route.ts`
- `src/app/api/community/vote/route.ts`
- `src/app/api/community/comments/route.ts`
- `src/app/resume/page.tsx`
- `src/app/resume/loading.tsx`
- `src/app/community/page.tsx`
- `src/app/community/[id]/page.tsx`
- `docs/FEATURE_SUMMARY_V3.md`

### Files Modified (Session 3)
- `src/components/Navbar.tsx` — Added Community + Resume links
- `src/app/globals.css` — Added `@media print` rules for PDF export
- `src/app/sitemap.ts` — Added /login, /signup
- `src/app/dashboard/page.tsx` — Resume link, score card, status dropdown
- `electrobridge/.env.local.example` — Added missing env vars (OPENROUTER, HUGGINGFACE, CLOUDFLARE, BEDROCK)
- `PROJECT_AUDIT.md` — This file

### Vercel Cron Jobs (Updated)
- `/api/scrape?mode=all` — Daily 6am UTC
- `/api/send-digest` — Weekly Sunday 3am UTC
- `/api/archive-news` — **NEW** Weekly Sunday 2am UTC (moves old news to Supabase 2)
- `/api/sync-replica` — **NEW** Daily 7am UTC (syncs to Neon read replica)

---

### Multi-Database Architecture (Session 4)

**4 databases now power ElectroBridge:**

| Database | Type | Purpose |
|----------|------|---------|
| Supabase Primary (db1) | Supabase | Core data — opportunities, news, auth, community |
| Supabase Secondary (db2) | Supabase | News archive overflow, subscriber overflow |
| Neon Primary (neon1) | PostgreSQL | Analytics — ai_usage_log, link_check_logs, platform_analytics |
| Neon Secondary (neon2) | PostgreSQL | Read replica — opportunities_mirror, news_mirror |

**Smart Router:** `src/lib/db/index.ts` — `getDB(purpose)` routes queries to the correct database based on operation type.

**AI Logging Relocated:** `ai_usage_log` writes now go to Neon Primary (faster writes, no Supabase row limits) instead of Supabase.

**Archival System:** News older than 30 days is automatically moved from Supabase Primary → Supabase Secondary via weekly cron (`/api/archive-news`).

**Read Replica:** Active opportunities and recent news are synced daily to Neon Secondary (`/api/sync-replica`) for fast read-only queries.

### Files Created (Session 4)
- `src/lib/db/index.ts` — Multi-DB router
- `src/app/api/archive-news/route.ts` — News archival endpoint
- `src/app/api/sync-replica/route.ts` — Neon sync endpoint
- `src/app/api/analytics/ai-usage/route.ts` — AI usage analytics from Neon
- `src/app/api/analytics/platform/route.ts` — Platform analytics from Neon
- `supabase/migrations/20260703000001_neon_schema.sql` — Neon schemas
- `supabase/migrations/20260703000002_supabase2_schema.sql` — Supabase 2 schema
- `docs/DEPLOYMENT_CHECKLIST.md` — Full deployment checklist

### Files Modified (Session 4)
- `src/lib/ai/providers.ts` — Switched ai_usage_log writes from Supabase to Neon
- `src/components/AIAnalyticsPanel.tsx` — Fetches from Neon API instead of direct Supabase
- `vercel.json` — Added archive-news + sync-replica cron jobs
- `.env.local.example` — Added SUPABASE_2_*, NEON_* vars
- `package.json` — Added @neondatabase/serverless, bumped next@14.2.21 for Node 24 compatibility
- `PROJECT_AUDIT.md` — This file

### Build Verification (Session 4)
- **Next.js 14.2.0 → 14.2.21** — Required for Node.js v24 compatibility (v24.14.0 in Codespaces)
- **64 routes** compiled successfully (36 pages + 28 API routes)
- **60 static pages** generated
- **0 TypeScript errors**, 0 build failures
- **4 new API routes** added: `/api/analytics/ai-usage`, `/api/analytics/platform`, `/api/archive-news`, `/api/sync-replica`
- 3 pre-existing warnings (Supabase edge runtime, dynamic route static gen) — non-blocking

---

## Tech Stack (`electrobridge/`)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.21 | React framework (App Router) |
| React | ^18 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^3.4.1 | Styling (dark theme) |
| Supabase JS | ^2.108.2 | Database client |
| @supabase/ssr | latest | SSR auth (middleware, client/server clients) |
| PostgreSQL | (via Supabase) | Database (Primary) |
| @neondatabase/serverless | latest | Database (Analytics + Read Replica) |
| lucide-react | ^0.383.0 | Icons |
| sonner | ^2.0.7 | Toast notifications |

**Hosting:** Vercel — `https://electrobridge.vercel.app`
**Databases:** Supabase (Primary + Secondary), Neon (Primary + Secondary)

---

## Environment Variables

| Variable | Public? | Used In | Purpose |
|----------|---------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | lib/supabase | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | lib/supabase | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | lib/supabase | Service role (admin ops) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Public | admin pages | Admin panel password |
| `CRON_SECRET` | Private | api/* | Bearer auth for cron endpoints |
| `GROQ_API_KEY` | Private | lib/ai/providers | Groq AI |
| `NVIDIA_NIM_API_KEY` | Private | lib/ai/providers | NVIDIA NIM |
| `GEMINI_API_KEY` | Private | lib/ai/providers | Google Gemini |
| `OPENROUTER_API_KEY` | Private | lib/ai/providers | OpenRouter |
| `HUGGINGFACE_API_KEY` | Private | lib/ai/providers | HuggingFace |
| `CLOUDFLARE_AI_TOKEN` | Private | lib/ai/providers | Cloudflare Workers AI |
| `CLOUDFLARE_ACCOUNT_ID` | Private | lib/ai/providers | Cloudflare account ID |
| `AWS_BEARER_TOKEN_BEDROCK` | Private | lib/ai/providers | AWS Bedrock Mantle API key |
| `RESEND_API_KEY` | Private | lib/email-digest | Resend email |
| `FROM_EMAIL` | Private | lib/email-digest | Sender email |
| `TELEGRAM_BOT_TOKEN` | Private | lib/telegram-bot | Telegram bot |
| `TELEGRAM_CHANNEL_ID` | Private | lib/telegram-bot | Telegram channel |
| `SUPABASE_2_URL` | Private | lib/db | Supabase Secondary URL |
| `SUPABASE_2_ANON_KEY` | Public | lib/db | Supabase Secondary anon key |
| `SUPABASE_2_SERVICE_ROLE_KEY` | Private | lib/db | Supabase Secondary service role |
| `NEON_1_DATABASE_URL` | Private | lib/db | Neon Primary connection string |
| `NEON_2_DATABASE_URL` | Private | lib/db | Neon Secondary connection string |

---

## Pages & Routes

| Route | Type | Status |
|-------|------|--------|
| `/` | Server (async) | ✅ Homepage with stats, opportunities, news, trending tags |
| `/opportunities` | Client | ✅ Filtered listing |
| `/opportunities/[slug]` | Server (ISR 3600s) | ✅ Detail with AI insights |
| `/news` | Client | ✅ News listing with category tabs |
| `/news/[slug]` | Server (ISR 1800s) | ✅ News detail |
| `/categories` | Server | ✅ Category overview |
| `/category/[category]` | Server | ✅ Category detail |
| `/organizations` | Server | ✅ Org listing |
| `/organizations/[slug]` | Server (ISR) | ✅ Org detail |
| `/match` | Client | ✅ AI opportunity matcher |
| `/chat` | Client | ✅ AI chatbot |
| `/login` | Client | ✅ Auth login |
| `/signup` | Client | ✅ Auth signup |
| `/dashboard` | Client (protected) | ✅ Stats, apps, resume, deadlines |
| `/profile` | Client (protected) | ✅ User profile form |
| `/admin` | Client | ✅ Full admin panel |
| `/admin/add-opportunity` | Client | ✅ Add form |
| `/admin/add-news` | Client | ✅ Add news form |
| `/admin/edit-opportunity/[id]` | Client | ✅ Edit form |
| `/about` | Server | ✅ About with live DB stats |
| `/contact` | Client | ✅ Contact form |
| `/resources` | Server | ✅ Resources hub |
| `/resources/jrf-guide` | Server | ✅ JRF guide |
| `/resources/phd-guide` | Server | ✅ PhD guide |
| `/resources/international-fellowships` | Server | ✅ Fellowships guide |
| `/resources/vlsi-careers` | Server | ✅ VLSI guide |
| `/resources/net-vs-gate` | Server | ✅ NET vs GATE guide |
| `/favorites` | Client | ✅ Bookmarks |
| `/resume` | Client (protected) | **NEW** 6-step AI resume builder |
| `/community` | Client | **NEW** Community forum |
| `/community/[id]` | Client | **NEW** Post detail with comments |

---

## Database Tables

| Table | Purpose | Status |
|-------|---------|--------|
| `opportunities` | Verified R&D opportunities | ✅ |
| `news_articles` | Electronics news | ✅ |
| `subscribers` | Email subscribers | ✅ |
| `ai_usage_log` | AI provider audit trail | ✅ |
| `link_check_logs` | Link verification | ✅ |
| `opportunity_reports` | Issue reports | ✅ |
| `telegram_subscribers` | Telegram bot | ✅ |
| `calendar_exports` | Export logs | ✅ |
| `suggestions` | User suggestions | ✅ |
| `user_profiles` | User profiles | ✅ |
| `saved_opportunities` | Bookmarks | ✅ |
| `applications` | Applications with status | ✅ |
| `user_alerts` | Keyword alerts | ✅ |
| `user_resumes` | Resume data + ATS score | **NEW** |
| `community_posts` | Forum posts | **NEW** |
| `community_comments` | Post comments | **NEW** |
| `community_votes` | Post upvotes | **NEW** |

### New Tables (Session 4 — Multi-DB)

| Table | Database | Purpose |
|-------|----------|---------|
| `ai_usage_log` | Neon Primary | AI provider usage (moved from Supabase) |
| `link_check_logs` | Neon Primary | Link verification audit |
| `opportunity_reports` | Neon Primary | User issue reports |
| `platform_analytics` | Neon Primary | Page views, apply clicks, shares |
| `opportunities_mirror` | Neon Secondary | Read-only opps copy for fast queries |
| `news_mirror` | Neon Secondary | Read-only news copy for fast queries |
| `news_archive` | Supabase Secondary | News older than 30 days |
| `subscribers_overflow` | Supabase Secondary | Extra subscriber storage |

---

## Known Issues

| Issue | Status |
|-------|--------|
| `calendar_exports` table never written to | ⚠️ Open |
| `telegram_subscribers` no subscription UI | ⚠️ Open |
| Email digest requires cron setup | ⚠️ Open |
| Netlify deploy token denied (in other codebase) | ⚠️ Refer to alternate audit |
| Community DB migrations need applying to Supabase | ⚠️ Run via Supabase dashboard |
| Resume DB migration needs applying to Supabase | ⚠️ Run via Supabase dashboard |
| Neon schemas need running on Neon Primary + Secondary | ⚠️ Run via Neon SQL editor |
| Supabase 2 schema needs running on Netlify Supabase | ⚠️ Run via Supabase dashboard |
| SUPABASE_2_* and NEON_* env vars not set in Vercel | ⚠️ Add to Vercel dashboard |
| News archival has never been triggered | ⚠️ Will run next Sunday 2am UTC |
| Sync-replica has never been triggered | ⚠️ Will run next daily 7am UTC |