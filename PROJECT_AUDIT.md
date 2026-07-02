# PROJECT_AUDIT.md

> **Note:** This repo contains two codebases — `electrobridge/` (active, Next.js 14.2.21, App Router, 7 AI providers, 4 databases) and `ElectroBridge Web App Design/` (legacy, Next.js 15 static export + Express 5 backend, Groq-only). This audit covers **both**, with primary focus on the actively developed `electrobridge/`.
> For the legacy codebase's standalone audit, see `ElectroBridge Web App Design/documents/15_PROJECT_AUDIT.md`

**Last Updated:** July 2, 2026 (Session 5 — All Databases Provisioned & Env Vars Set)

---

## Repository Overview

| Metric | Value |
|--------|-------|
| **Full repo path** | `/workspaces/JobsAI` |
| **Git remote** | `origin https://github.com/amitk26/JobsAI.git` |
| **Default branch** | `main` (only branch, tracks `origin/main`) |
| **Total commits** | 86 |
| **Last commit** | `4272024` — "docs: update audit with build fix, Node 24 compat, final route counts" |
| **Total repo size** | ~3.5 GB (includes node_modules, .next build output) |
| **Active codebase** | `electrobridge/` — 14,725 lines of TypeScript/TSX/CSS |
| **Legacy codebase** | `ElectroBridge Web App Design/` — 10,398 lines of TypeScript/TSX/CSS/JS |

### GitHub Configuration
- **Repository:** `amitk26/JobsAI`
- **CI/CD:** 3 GitHub Actions workflows (`.github/workflows/`):
  - `ci.yml` — PR checks
  - `deploy.yml` — Auto-deploy
  - `keep-alive.yml` — Keep Render instances awake (legacy)
- **Deployment:** Vercel (`amitk26/electrobridge`) — auto-deploys from `main`, root dir `electrobridge/`

---

## Directory Structure

```
JobsAI/
├── .github/workflows/           # CI/CD pipelines (3 workflows)
│   ├── ci.yml
│   ├── deploy.yml
│   └── keep-alive.yml
├── .gitignore
├── .gitattributes
├── PROJECT_AUDIT.md             # ← This file
├── README.md                    # Outdated — describes legacy codebase
├── REFACTOR_SUMMARY.md          # Legacy refactoring notes
├── opencode.json                # OpenCode AI config
│
├── docs/                        # Legacy project documentation (16+ files)
│   ├── 00_START_HERE.md
│   ├── 01_MASTER_PROMPT.md
│   ├── 01_AI_INTEGRATION_PROMPT.md
│   ├── 01_PLATFORM_BLUEPRINT.md
│   ├── 02_API_KEYS_GUIDE.md
│   ├── 02_BUILD_PROMPT.md
│   ├── 02_SETUP_GUIDE.md
│   ├── 03_OPENCODE_PROMPTS.md
│   ├── 04_WEEKLY_MAINTENANCE.md
│   ├── API KEYS.md
│   ├── FEATURE_SUMMARY_V3.md
│   ├── MASTER_CONTEXT.md
│   ├── OPENCODE_STARTER_PROMPT.txt
│   ├── PROJECT_AUDIT.md
│   └── TASKS.md
│
├── ElectroBridge Web App Design/  ← LEGACY CODEBASE (10,398 LOC, 112 files)
│   ├── frontend/                  Next.js 15 static export (17 pages, 7 components)
│   │   ├── src/app/               Pages: about, admin, chat, community, contact,
│   │   │                          dashboard, login, news, opportunities, orgs,
│   │   │                          resume, signup (12 route groups)
│   │   ├── src/components/        7 components: AvatarCircle, Footer, LandingHero,
│   │   │                          Navbar, OpportunityCard, VerifiedBadge, plus ui/
│   │   └── src/lib/               api.ts, supabase.ts, utils.ts
│   ├── backend/                   Express 5 API (6 route modules, AI, supabase)
│   │   ├── src/routes/            admin, ai, news, opportunities, orgs, subscribe
│   │   ├── src/lib/               supabase, ai modules (groq, matcher, search-parser, summarizer)
│   │   └── src/middleware/        auth.ts
│   ├── shared/                    Types, constants, utilities
│   ├── documents/                 16 docs (master context, architecture, schema, deploy, etc.)
│   ├── src/                       Figma design system (52 shadcn/ui components)
│   │   └── app/components/ui/     52 shadcn components
│   └── (published at: electrongineer.netlify.app, API at: electrobridge-api.onrender.com)
│
├── electrobridge/                ← ACTIVE CODEBASE (14,725 LOC, 133 source files)
│   ├── src/
│   │   ├── app/                  30 page routes + 34 API routes
│   │   ├── components/           23 React components
│   │   ├── lib/                  18 modules (db, ai, scrapers, utils)
│   │   ├── types/                1 file (type definitions)
│   │   └── middleware.ts         Supabase SSR auth middleware
│   ├── supabase/migrations/      8 migration files (6 legacy + 2 multi-DB)
│   ├── docs/                     1 file (DEPLOYMENT_CHECKLIST.md)
│   ├── .vercel/                  Vercel project link + cached env
│   │   ├── project.json
│   │   └── .env.development.local
│   └── (published at: electrobridge.vercel.app)
```

---

## Active Codebase: `electrobridge/` — Complete Breakdown

### Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 14.2.21 | React framework (App Router) |
| **UI** | React | ^18.3.1 | UI library |
| **Language** | TypeScript | ^5 | Type safety |
| **Styling** | Tailwind CSS | ^3.4.1 | Dark theme utility-first CSS |
| **Typography** | Tailwind Typography | ^0.5.20 | Prose styling |
| **Icons** | lucide-react | ^0.383.0 | Icon library |
| **Toasts** | sonner | ^2.0.7 | Toast notifications |
| **CSS** | autoprefixer | ^10.5.2 | CSS vendor prefixes |
| **Date** | date-fns | ^3.6.0 | Date formatting |
| **Classnames** | clsx | ^2.1.1 | Conditional class merging |

#### Database & ORM

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase JS** | ^2.108.2 | Supabase client (db1 + db2) |
| **@supabase/ssr** | latest | SSR auth middleware |
| **@neondatabase/serverless** | ^1.1.0 | Neon HTTP-based Postgres driver (db3 + db4) |
| **pg** (dev) | ^8.22.0 | PostgreSQL client for migrations |

#### AI & External Services

| Service | Type | Used In |
|---------|------|---------|
| **AWS Bedrock Mantle** | AI (fallback #1) | `providers.ts` — `openai.gpt-oss-120b` |
| **Groq** | AI (fallback #2) | `providers.ts` — `llama-3.3-70b-versatile` |
| **NVIDIA NIM** | AI (fallback #3) | `providers.ts` — `mistralai/mixtral-8x22b-instruct-v0.1` |
| **Google Gemini** | AI (fallback #4) | `providers.ts` — `gemini-1.5-flash` |
| **OpenRouter** | AI (fallback #5) | `providers.ts` — `openai/gpt-4o-mini` |
| **Cloudflare Workers AI** | AI (fallback #6) | `providers.ts` — `@cf/meta/llama-3.1-8b-instruct` |
| **HuggingFace** | AI (fallback #7) | `providers.ts` — `mistralai/Mistral-7B-Instruct-v0.3` |
| **Resend** | Email | `email-digest.ts` — weekly digest sending |
| **Telegram Bot API** | Messaging | `telegram-bot.ts` — opportunity notifications |
| **Plausible Analytics** | Analytics | `layout.tsx` — visitor tracking script |

#### Hosting

| Component | Platform | URL |
|-----------|----------|-----|
| **Active (electrobridge)** | Vercel | https://electrobridge.vercel.app |
| **Legacy Frontend** | Netlify | https://electrobridge.netlify.app |
| **Legacy Backend** | Render | https://electrobridge-api.onrender.com |

#### Source File Summary (electrobridge/src)

| File Type | Count | Lines |
|-----------|-------|-------|
| TypeScript (.ts) | 64 | varies |
| TypeScript React (.tsx) | 68 | varies |
| CSS | 1 | 92 |
| **Total** | **133** | **14,725** |

### Pages (30 Page Routes)

| # | Route | Type | Auth | Description |
|---|-------|------|------|-------------|
| 1 | `/` | Server (async) | — | Homepage: stats, opportunities, news, trending tags, JSON-LD SEO |
| 2 | `/about` | Server | — | About page with live DB stats |
| 3 | `/categories` | Server | — | Category overview grid |
| 4 | `/category/[category]` | Server | — | Filtered listing by category |
| 5 | `/opportunities` | Client | — | Full filtered listing |
| 6 | `/opportunities/[slug]` | Server (ISR 3600s) | — | Detail page with AI insights |
| 7 | `/news` | Client | — | News listing with source tabs |
| 8 | `/news/[slug]` | Server (ISR 1800s) | — | News detail page |
| 9 | `/organizations` | Server | — | All organizations with counts |
| 10 | `/organizations/[slug]` | Server (ISR) | — | Org detail with opportunities |
| 11 | `/match` | Client | — | AI opportunity matcher |
| 12 | `/chat` | Client | — | AI chatbot (electronics career) |
| 13 | `/login` | Client | — | Auth login |
| 14 | `/signup` | Client | — | Auth signup |
| 15 | `/dashboard` | Client | ✅ Protected | Stats, saved, applications, resume score |
| 16 | `/profile` | Client | ✅ Protected | User profile form |
| 17 | `/resume` | Client | ✅ Protected | 6-step AI resume builder |
| 18 | `/community` | Client | — | Forum with category tabs |
| 19 | `/community/[id]` | Client | — | Post detail with comments |
| 20 | `/admin` | Client | Admin | Full admin panel |
| 21 | `/admin/add-opportunity` | Client | Admin | Add opportunity form |
| 22 | `/admin/add-news` | Client | Admin | Add news form |
| 23 | `/admin/edit-opportunity/[id]` | Client | Admin | Edit opportunity |
| 24 | `/contact` | Client | — | Contact form |
| 25 | `/resources` | Server | — | Resources hub |
| 26 | `/resources/jrf-guide` | Server | — | JRF career guide |
| 27 | `/resources/phd-guide` | Server | — | PhD guide |
| 28 | `/resources/international-fellowships` | Server | — | Fellowships guide |
| 29 | `/resources/vlsi-careers` | Server | — | VLSI career guide |
| 30 | `/resources/net-vs-gate` | Server | — | NET vs GATE comparison |

### API Routes (34 API Endpoints)

| # | Route | Method | Auth | Purpose |
|---|-------|--------|------|---------|
| 1 | `/api/opportunities` | GET | — | List with filters |
| 2 | `/api/opportunities` | POST | Admin | Create opportunity |
| 3 | `/api/opportunities/[id]` | GET | — | Single opportunity |
| 4 | `/api/opportunities/[id]` | PATCH | Admin | Update opportunity |
| 5 | `/api/opportunities/[id]` | DELETE | Admin | Delete opportunity |
| 6 | `/api/opportunities-feed` | GET | — | Public JSON feed |
| 7 | `/api/news` | GET | — | List news with filters |
| 8 | `/api/track-click` | POST | — | Track apply clicks |
| 9 | `/api/subscribe` | POST | — | Subscribe (rate-limited) |
| 10 | `/api/subscribe` | DELETE | — | Unsubscribe |
| 11 | `/api/report-issue` | POST | — | Report an issue |
| 12 | `/api/applications` | GET | ✅ Auth | List saved applications |
| 13 | `/api/applications` | PATCH | ✅ Auth | Update app status |
| 14 | `/api/applications` | DELETE | ✅ Auth | Delete application |
| 15 | `/api/organizations` | GET | — | List orgs with counts |
| 16 | `/api/similar/[id]` | GET | — | Similar opportunities |
| 17 | `/api/calendar-export/[id]` | GET | — | ICS calendar download |
| 18 | `/api/check-links` | GET | Cron | Verify opportunity links |
| 19 | `/api/admin/recheck-link` | POST | Admin | Recheck single link |
| 20 | `/api/cleanup-news` | POST | Cron | Deduplicate news |
| 21 | `/api/auth/signout` | POST | ✅ Auth | Sign out |
| 22 | `/api/ai/chat` | POST | — | AI chatbot |
| 23 | `/api/ai/match` | POST | — | AI opp matcher |
| 24 | `/api/ai/search` | POST | — | AI natural language search |
| 25 | `/api/ai/summarize` | POST | — | AI description summarizer |
| 26 | `/api/ai/expire` | GET | Cron | AI expiry checker |
| 27 | `/api/ai/opportunity-summary/[slug]` | GET | — | AI insight summary |
| 28 | `/api/analytics/ai-usage` | GET | Admin | AI usage stats (Neon) |
| 29 | `/api/analytics/platform` | GET | Admin | Platform analytics (Neon) |
| 30 | `/api/archive-news` | GET | Cron | Archive old news (db1→db2) |
| 31 | `/api/sync-replica` | GET | Cron | Sync to Neon read replica |
| 32 | `/api/send-digest` | GET | Cron | Weekly email digest |
| 33 | `/api/scrape` | GET | Cron | Main scraper (news + opps) |
| 34 | `/api/scrape-opportunities` | GET | Cron | Legacy opp scraper |
| 35 | `/api/scrape-jobs` | GET | Cron | Deprecated (returns notice) |
| 36 | `/api/community/posts` | GET | — | List forum posts |
| 37 | `/api/community/posts` | POST | ✅ Auth | Create post |
| 38 | `/api/community/posts/[id]` | GET | — | Single post with comments |
| 39 | `/api/community/posts/[id]` | DELETE | ✅ Auth | Delete own post |
| 40 | `/api/community/comments` | POST | ✅ Auth | Add comment |
| 41 | `/api/community/vote` | POST | ✅ Auth | Toggle upvote |
| 42 | `/api/resume` | GET | ✅ Auth | Get user resume |
| 43 | `/api/resume` | POST | ✅ Auth | Save resume |

Routes count: 36 (30 pages + `/auth/callback` + `/robots.txt` + `/sitemap.xml` + `/favicon.ico` + `/api/og` + `/api/og/opportunity/[slug]`)
API routes count: 34 (43 entries above, but some share route.ts)

### Components (23 Components)

| Component | Category | Description |
|-----------|----------|-------------|
| `AIAnalyticsPanel` | Admin | AI usage stats & charts from Neon |
| `AIOpportunitySummary` | Opportunity | AI-powered insight panel |
| `ApplyButton` | Opportunity | Click tracker + app logger |
| `CategoryBadge` | UI | Color-coded category badge |
| `CopyLinkButton` | UI | Clipboard copy with feedback |
| `DeadlineCountdown` | UI | Urgency countdown timer |
| `ExpiringSoon` | Opportunity | Server-side expiring banner |
| `FilterBar` | Opportunity | Sidebar filter checkboxes |
| `Footer` | Layout | Site footer with links |
| `LinkTypeIndicator` | UI | Apply link type icon |
| `LoadingSkeleton` | UI | Animated placeholder |
| `Navbar` | Layout | Main nav (desktop + mobile) |
| `NewsCard` | News | Article card with source color |
| `NewsImage` | News | Image with error fallback |
| `OpportunityCard` | Opportunity | Listing card with all metadata |
| `OpportunityDisclaimer` | UI | Pre-apply tips + report button |
| `ReportIssueModal` | Modal | Issue report form |
| `SearchBar` | UI | Search input |
| `ShareButtons` | UI | WhatsApp + Twitter sharing |
| `SimilarOpportunities` | Opportunity | Server-side related opps |
| `SubscribeModal` | Modal | Full subscription form |
| `SubscribeSection` | UI | Compact email subscribe |
| `VerificationBadge` | UI | Verification status indicator |

### Library Modules (18 Modules)

| Module | Path | Lines | Description |
|--------|------|-------|-------------|
| **DB Router** | `src/lib/db/index.ts` | 46 | Multi-DB router (db1, db2, neonPrimary, neonSecondary) |
| **Supabase Client** | `src/lib/supabase.ts` | 20 | Anon + service role clients |
| **SSR Client** | `src/lib/supabase/server.ts` | 22 | Server cookie client |
| **Browser Client** | `src/lib/supabase/client.ts` | 8 | Browser SSR client |
| **AI Providers** | `src/lib/ai/providers.ts` | 381 | 7-provider fallback chain |
| **AI Matcher** | `src/lib/ai/matcher.ts` | 60 | User-to-opportunity matching |
| **AI Summarizer** | `src/lib/ai/summarizer.ts` | 38 | Description summarization |
| **AI Search Parser** | `src/lib/ai/search-parser.ts` | 40 | NL query → structured filters |
| **AI Expiry Checker** | `src/lib/ai/expiry-checker.ts` | 25 | Deadline + AI expiry detection |
| **AI Newsletter** | `src/lib/ai/newsletter.ts` | 37 | Weekly digest generation |
| **AI News Filter** | `src/lib/ai/news-filter-ai.ts` | 61 | Article relevance classification |
| **Scraper: RSS** | `src/lib/scrapers/rss-parser.ts` | 278 | 16 RSS sources, news + opps |
| **Scraper: Filter** | `src/lib/scrapers/news-filter.ts` | 576 | 380+ keywords, 45 blocked patterns |
| **Scraper: ISRO** | `src/lib/scrapers/isro-scraper.ts` | 127 | ISRO careers HTML scraper |
| **Scraper: DRDO** | `src/lib/scrapers/drdo-scraper.ts` | 123 | DRDO vacancies HTML scraper |
| **Scraper: CSIR** | `src/lib/scrapers/csir-scraper.ts` | 108 | CSIR recruitment HTML scraper |
| **Scraper: Govt** | `src/lib/scrapers/govt-scraper.ts` | 141 | CSIR RSS + combined govt scraper |
| **Scraper: Orchestrator** | `src/lib/scrapers/opportunity-scraper.ts` | 51 | Runs all scrapers |
| **Scraper: Types** | `src/lib/scrapers/types.ts` | 20 | Data type definitions |
| **Scraper: Utils** | `src/lib/scrapers/utils.ts` | 57 | Text cleaning, slugification |
| **Email Digest** | `src/lib/email-digest.ts` | 195 | Resend weekly digest |
| **Telegram Bot** | `src/lib/telegram-bot.ts` | 55 | Telegram notifications |
| **Rate Limiter** | `src/lib/rate-limiter.ts` | 22 | In-memory IP rate limiting |
| **Utils** | `src/lib/utils.ts` | 93 | Date formatting, filter options |
| **Design Tokens** | `src/lib/design-tokens.ts` | 101 | Dark theme design system |

### Scraping Sources (16 RSS + 3 HTML)

**News RSS (Tier 1):** IEEE Spectrum, Semiconductor Engineering, EE Times, Electronics Weekly, Chip Design, SemiWiki, Electronics For You, Nature Electronics, Science Daily (×2), Phys.org (×2), India Semiconductor Mission, IESA

**News RSS (Tier 2):** AnandTech, The Register

**Opportunity RSS:** Academic Positions, Scholarship Roof, Jobs.ac.uk

**HTML Scraping:** ISRO Careers (`isro.gov.in`), DRDO Vacancies (`drdo.gov.in`), CSIR Recruitment (`csir.res.in`), CSIR RSS feed

### Content Filtering (news-filter.ts)
- **Blocklist:** 45 regex patterns filtering out AI/ML content, general tech, biotech, gaming, space exploration, consumer electronics, finance, weather, social media
- **Keywords:** 380+ electronics/semiconductor keywords
- **Auto-tagging:** 20+ tag categories — Foundry, EDA, Chip Design, AI Chips, Materials, Equipment, Markets, Policy, India, IoT, EV/Power, 5G/6G, Quantum, Photonics, Memory, Sensors, Security, Aerospace, Manufacturing, Research

---

## Database Architecture (4 Databases, 36 Tables)

### Supabase Primary — db1 (Core Data)
- **Project ref:** `aqauempuwmbizqoaolop` ("electrobridge")
- **Org:** New account (`klmterftkepmalhasmdb`)
- **Region:** `ap-southeast-1` (Singapore)
- **Status:** ✅ ACTIVE_HEALTHY
- **Tables (17):**

| Table | Purpose | Created |
|-------|---------|---------|
| `opportunities` | Verified R&D opportunities | Session 1 |
| `news_articles` | Electronics news articles | Session 1 |
| `subscribers` | Email subscribers | Session 1 |
| `ai_usage_log` | _(now on Neon, kept for legacy)_ | Session 1 |
| `link_check_logs` | _(now on Neon, kept for legacy)_ | Session 1 |
| `opportunity_reports` | _(now on Neon, kept for legacy)_ | Session 1 |
| `telegram_subscribers` | Telegram bot subscriptions | Session 1 |
| `calendar_exports` | Calendar export logs | Session 1 |
| `suggestions` | User suggestions | Session 1 |
| `user_profiles` | Extended user profiles | Session 2 |
| `saved_opportunities` | Bookmarks | Session 2 |
| `applications` | Application tracking | Session 2 |
| `user_alerts` | Keyword alerts | Session 2 |
| `user_resumes` | Resume data + ATS scores | Session 3 |
| `community_posts` | Forum posts | Session 3 |
| `community_comments` | Post comments | Session 3 |
| `community_votes` | Upvotes | Session 3 |

### Supabase Secondary — db2 (Archive / Overflow)
- **Project ref:** `jbqjipwanfsxyqkfrrpx` ("ElectroBridge")
- **Org:** Old account (`mlmrdjqolmmfwnimvbss`)
- **Region:** `ap-southeast-1` (Singapore)
- **Status:** ✅ ACTIVE_HEALTHY
- **Tables (2 new + 11 existing):**

| Table | Purpose | Created |
|-------|---------|---------|
| `news_archive` | News older than 30 days (moved by cron) | Session 5 |
| `subscribers_overflow` | Extra subscriber storage | Session 5 |
| _(11 original tables from legacy)_ | Same schema as db1 | Legacy |

### Neon Primary — db3 (Analytics)
- **Project:** `raspy-mouse-45454356` ("electrobridge")
- **Region:** `aws-us-east-1`
- **Status:** ✅ Active
- **Connection:** `postgresql://neondb_owner:npg_Lk8yw9PbUhoK@ep-shy-resonance-atwa1cr9.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require`
- **Tables (4):**

| Table | Purpose | Created |
|-------|---------|---------|
| `ai_usage_log` | AI provider audit trail (moved from Supabase) | Session 5 |
| `link_check_logs` | Link verification audit (moved from Supabase) | Session 5 |
| `opportunity_reports` | User issue reports (moved from Supabase) | Session 5 |
| `platform_analytics` | Page views, clicks, shares | Session 5 |

### Neon Secondary — db4 (Read Replica)
- **Project:** `plain-glade-52224468` ("electrobridge")
- **Region:** `aws-us-east-1`
- **Status:** ✅ Active
- **Connection:** `postgresql://neondb_owner:npg_Jp3OtAenHVM5@ep-green-paper-ad3dy630.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
- **Tables (2):**

| Table | Purpose | Created |
|-------|---------|---------|
| `opportunities_mirror` | Read-only copy of active opportunities | Session 5 |
| `news_mirror` | Read-only copy of recent news | Session 5 |

### Migrations (8 Files)

| File | Database | Purpose |
|------|----------|---------|
| `20260501000001_fix_duplicates_and_cleanup.sql` | Supabase Primary | Dedup, cleanup |
| `20260501000002_verification_and_slugs.sql` | Supabase Primary | Verification system, slugs |
| `20260501000003_cleanup_irrelevant_news.sql` | Supabase Primary | Remove irrelevant news |
| `20260501000004_ai_usage_log.sql` | Supabase Primary | AI logging table |
| `20260501000005_news_slug_suggestions.sql` | Supabase Primary | Suggestions table |
| `20260630000001_user_profiles.sql` | Supabase Primary | User profiles table |
| `20260703000001_neon_schema.sql` | Neon Both | Analytics tables + mirror tables |
| `20260703000002_supabase2_schema.sql` | Supabase Secondary | Archive + overflow tables |

---

## AI Provider Chain

The 7-provider fallback chain in `src/lib/ai/providers.ts`:

```
Success rate: ~99% (Bedrock handles ~60%, fallbacks catch the rest)
```

| Order | Provider | Model | Endpoint | Avg Latency |
|-------|----------|-------|----------|-------------|
| 1 | **AWS Bedrock** | `openai.gpt-oss-120b` | `bedrock-mantle.us-east-1.api.aws` | ~2s |
| 2 | **Groq** | `llama-3.3-70b-versatile` | `api.groq.com` | ~1.5s |
| 3 | **NVIDIA NIM** | `mistralai/mixtral-8x22b-instruct-v0.1` | `integrate.api.nvidia.com` | ~3s |
| 4 | **Gemini** | `gemini-1.5-flash` | `generativelanguage.googleapis.com` | ~2s |
| 5 | **OpenRouter** | `openai/gpt-4o-mini` | `openrouter.ai` | ~1s |
| 6 | **Cloudflare** | `@cf/meta/llama-3.1-8b-instruct` | `api.cloudflare.com` | ~2s |
| 7 | **HuggingFace** | `Mistral-7B-Instruct-v0.3` | `api-inference.huggingface.co` | ~5s |

### AI-powered Features
- **Chat** (`/api/ai/chat`) — Electronics career advisor chatbot
- **Match** (`/api/ai/match`) — Profile-to-opportunity matching (top 10)
- **Search** (`/api/ai/search`) — Natural language query → DB filters
- **Summarize** (`/api/ai/summarize`) — Raw description → structured summary
- **Expiry Check** (`/api/ai/expire`) — Cron-based expiry detection
- **Opportunity Summary** (`/api/ai/opportunity-summary/[slug]`) — AI insights panel
- **Weekly Digest** (`/src/lib/ai/newsletter.ts`) — AI-generated digest email
- **News Filter** (`/src/lib/ai/news-filter-ai.ts`) — AI article relevance classifier
- **Resume ATS Scoring** (`/api/resume`) — AI-powered resume scoring

---

## Environment Variables

### Vercel Status: ✅ ALL 23 Variables Set (Production + Development)

| Variable | Public | Vercel Prod | Vercel Dev | Used In |
|----------|--------|-------------|------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Public | ✅ | ✅ | `supabase.ts`, middleware |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Public | ✅ | ✅ | `supabase.ts`, middleware |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 Private | ✅ | ✅ | `supabase.ts` (admin ops) |
| `SUPABASE_2_URL` | 🔒 Private | ✅ | ✅ | `db/index.ts` (db2) |
| `SUPABASE_2_ANON_KEY` | ✅ Public | ✅ | ✅ | `db/index.ts` (db2) |
| `SUPABASE_2_SERVICE_ROLE_KEY` | 🔒 Private | ✅ | ✅ | `db/index.ts` (db2) |
| `NEON_1_DATABASE_URL` | 🔒 Private | ✅ | ✅ | `db/index.ts` (db3) |
| `NEON_2_DATABASE_URL` | 🔒 Private | ✅ | ✅ | `db/index.ts` (db4) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | ✅ Public | ✅ | ✅ | Admin panel auth |
| `CRON_SECRET` | 🔒 Private | ✅ | ✅ | Cron endpoint auth |
| `GROQ_API_KEY` | 🔒 Private | ✅ | ✅ | AI providers (#2) |
| `NVIDIA_NIM_API_KEY` | 🔒 Private | ✅ | ✅ | AI providers (#3) |
| `GEMINI_API_KEY` | 🔒 Private | ✅ | ✅ | AI providers (#4) |
| `OPENROUTER_API_KEY` | 🔒 Private | ✅ | ✅ | AI providers (#5) |
| `HUGGINGFACE_API_KEY` | 🔒 Private | ✅ | ✅ | AI providers (#7) |
| `CLOUDFLARE_AI_TOKEN` | 🔒 Private | ✅ | ✅ | AI providers (#6) |
| `CLOUDFLARE_ACCOUNT_ID` | 🔒 Private | ✅ | ✅ | AI providers (#6) |
| `AWS_BEARER_TOKEN_BEDROCK` | 🔒 Private | ✅ | ✅ | AI providers (#1) |
| `RESEND_API_KEY` | 🔒 Private | ✅ | ✅ | Email digest |
| `FROM_EMAIL` | 🔒 Private | ✅ | ✅ | Email sender address |
| `TELEGRAM_BOT_TOKEN` | 🔒 Private | ✅ | ✅ | Telegram bot |
| `TELEGRAM_CHANNEL_ID` | 🔒 Private | ✅ | ✅ | Telegram bot |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 Private | ✅ | ✅ | Legacy admin ops |

**Note:** `PREVIEW` environments have most vars inherited from Production. Preview prompt asks for git branch (interactive), so only Production + Development were explicitly set.

---

## Vercel Configuration

### Project Settings
- **Vercel Project:** `amitk26/electrobridge`
- **Framework:** Next.js
- **Root Directory:** `electrobridge/`
- **Node.js Version:** 24.x
- **Auto-deploy:** From `main` branch

### Cron Jobs (vercel.json)

| Route | Schedule | Purpose |
|-------|----------|---------|
| `/api/scrape?mode=all` | Daily 6:00 UTC | Scrape news + opportunities |
| `/api/send-digest` | Weekly Sun 3:00 UTC | Weekly email digest |
| `/api/archive-news` | Weekly Sun 2:00 UTC | Archive old news (db1 → db2) |
| `/api/sync-replica` | Daily 7:00 UTC | Sync to Neon read replica (db1 → db4) |
| `/api/check-links` | (runs within scrape) | Link verification |
| `/api/ai/expire` | (runs within scrape) | Expiry detection |
| `/api/cleanup-news` | (runs within scrape) | News deduplication |

### Build Output (Last Successful Build)

| Metric | Value |
|--------|-------|
| Build ID | `GHXZU7tyulr33lHzmsVso` |
| Build Time | ~2 min |
| Total Routes | 64 |
| Static Pages | 60 |
| Static (auto) | 27 |
| Dynamic Routes | 4 |
| TypeScript Errors | 0 |
| Lint Warnings | 3 (non-blocking) |

---

## Legacy Codebase Summary

### `ElectroBridge Web App Design/`
- **Frontend:** Next.js 15 App Router, static export, 17 page routes, 7 components
- **Backend:** Express 5 API, tsx runtime, 6 route modules
- **Shared:** Types, constants, utilities
- **Design:** 52 shadcn/ui components in `/src/app/components/ui/`
- **Documents:** 16 documentation files in `/documents/`
- **Status:** Published at `electrobridge.netlify.app` + `electrobridge-api.onrender.com`
- **AI:** Groq only (single provider), no multi-DB
- **Size:** 10,398 LOC across 112 source files

---

## What Was Done — Session Summary

### Session 1 (Initial Setup)
- Repository cloned, scanned
- Build fixed for Node.js v24 compatibility
- All 21 database tables created and verified

### Session 2 (Core Features)
- User profiles, saved opportunities, applications, alerts
- Telegram bot integration
- Email digest system
- Expiring opportunities detection
- Similar opportunities component

### Session 3 (Resume Builder + Community Forum)
- Resume builder with 6-step wizard, AI ATS scoring, PDF export
- Community forum with posts, comments, upvotes
- Dashboard enhancements (resume score, app status dropdown)
- Navbar links for Community + Resume

### Session 4 (Multi-Database Architecture)
- 4-database architecture designed and implemented
- `src/lib/db/index.ts` — Smart DB router
- Neon schema written (analytics + mirrors)
- Supabase 2 schema written (archive + overflow)
- AI logging relocated from Supabase to Neon
- Cron jobs configured in vercel.json
- Next.js 14.2.0 → 14.2.21 (Node 24 compat)

### Session 5 (Database Provisioning + Vercel Env Vars)
- **Neon Primary** (`raspy-mouse`): Password reset, tables created, DB URL set in Vercel
- **Neon Secondary** (`plain-glade`): Password reset, tables created, DB URL set in Vercel
- **Supabase Secondary** (`jbqjipwanfsxyqkfrrpx`): Password set, tables created, all 3 keys set in Vercel
- `AWS_BEARER_TOKEN_BEDROCK` added to Vercel Production + Development
- All 23 env vars now set in Vercel (Production + Development)
- Local `.env.local` updated with real connection strings
- Build verified: TypeScript passes with 0 errors

---

## What's Left — Known Issues & TODOs

| # | Issue | Priority | Status |
|---|-------|----------|--------|
| 1 | `calendar_exports` table exists but never written to | Low | ⚠️ Open |
| 2 | `telegram_subscribers` has no subscription UI | Low | ⚠️ Open |
| 3 | FIRST cron runs: archive-news (Sun 2am), sync-replica (7am) have never triggered | Medium | ⚠️ Pending next schedule |
| 4 | `README.md` at repo root still describes legacy codebase | Low | ⚠️ Needs update |
| 5 | No automated tests (unit, integration, e2e) | High | ⚠️ Not started |
| 6 | No monitoring/alerting for cron job failures | Medium | ⚠️ Not started |
| 7 | Rate limiter is in-memory (resets on Vercel cold start) | Low | ⚠️ Consider Redis |
| 8 | No proper error tracking (Sentry, etc.) | Medium | ⚠️ Not started |
| 9 | No analytics dashboard for non-admin users | Low | ⚠️ Not started |
| 10 | Legacy `docs/` directory has 16+ outdated files | Low | ⚠️ Cleanup needed |
| 11 | `ElectroBridge Web App Design/` is dead code taking space | Low | ⚠️ Consider archiving |
| 12 | No database backup verification process | Medium | ⚠️ Not started |
| 13 | No CDN for static assets (images, fonts) | Low | ⚠️ Not started |
| 14 | Storybook / component library not set up | Low | ⚠️ Not started |
| 15 | No OpenAPI/Swagger docs for API routes | Medium | ⚠️ Not started |

---

## Build & Deploy Notes

### Critical: Node.js v24 Compatibility
- **Next.js 14.2.0** silently exits with code 0 producing **no build output** on Node.js v24.14.0
- **Must use Next.js ≥ 14.2.21** (currently at 14.2.21)
- Build command: `cd electrobridge && npm run build` (next build)
- Expected output: 64 routes, 60 static pages, 0 errors

### Vercel Deploy Flow
```
git push origin main
  → GitHub Action (deploy.yml) triggers
  → Vercel auto-detects main branch push
  → Installs deps in electrobridge/
  → Runs next build (Node 24.x)
  → Deploys to production
```

### Local Development
```bash
cd electrobridge
cp .env.local.example .env.local  # fill in real keys
npm install
npm run dev  # → http://localhost:3000
```

---

## Legacy Codebase Quick Reference

- **Frontend Live:** https://electrobridge.netlify.app
- **Backend Live:** https://electrobridge-api.onrender.com
- **Frontend Repo:** `ElectroBridge Web App Design/frontend/` (Next.js 15 static export)
- **Backend Repo:** `ElectroBridge Web App Design/backend/` (Express 5)
- **Docs:** `ElectroBridge Web App Design/documents/` (16 markdown files)
- **CI:** Netlify auto-deploys from GitHub; Render deploys from GitHub
- **Status:** Fully functional but superseded by `electrobridge/`
