# Architecture (MVP)

## System Overview

```
┌──────────────────────────────────────────────────────────┐
│               Netlify (Frontend — Static Export)          │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Next.js 15 App Router                 │  │
│  │  Pages (client-side, fetch from API)               │  │
│  │  Tailwind CSS v4 │ TypeScript                      │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │
                    HTTPS / JSON
                         │
┌────────────────────────┴─────────────────────────────────┐
│                  Render (Backend — Express 5)             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Routes: opportunities, news, orgs, subscribe,    │  │
│  │          admin, ai (chat/match/search/summarize)   │  │
│  │  AI: Groq (single provider, llama-3.3-70b)        │  │
│  └────────────────────┬───────────────────────────────┘  │
│                       │                                    │
│              ┌────────┴──────┐                            │
│              │   Supabase    │                            │
│              │  (primary DB) │                            │
│              │  12 tables    │                            │
│              └───────────────┘                            │
└──────────────────────────────────────────────────────────┘
```

## Frontend Routes (Active)

```
/                       → Landing page
/opportunities          → Opportunity listing (API-fetched, paginated)
/opportunities/[slug]   → Opportunity detail (API-fetched)
/news                   → News listing (API-fetched, pill tabs)
/news/[slug]            → News detail (API-fetched)
/organizations/[slug]   → Organization detail (API-fetched)
/chat                   → AI chat assistant
/login                  → Auth page
/signup                 → Auth page
/dashboard              → User dashboard
/admin                  → Admin panel
/about                  → About page
/contact                → Contact page
/resume                 → Resume tool
/community              → Community page
```

### Data Flow
- All pages are `'use client'` — fetch data from the Express API at runtime
- Static export (`output: 'export'`) — routes are pre-built at deploy time
- `generateStaticParams` for `[slug]` routes fetches from API during build (with 5s timeout + fallback)

## Backend Routes

| Router | Endpoints |
|--------|-----------|
| `opportunities` | `GET /api/opportunities` (list), `GET /:id` (detail), `POST`, `PATCH`, `DELETE` |
| `news` | `GET /api/news` (list), `GET /:slug` (detail) |
| `organizations` | `GET /api/organizations` (list), `GET /:slug` (detail) |
| `subscribe` | `POST /api/subscribe`, `POST /unsubscribe` |
| `admin` | `GET /stats`, `POST /add-opportunity`, `POST /add-news` |
| `ai` | `POST /chat`, `POST /match`, `GET /search`, `POST /summarize` |

All data endpoints default to `verification_status='verified'`.

## AI Architecture

### Single Provider: Groq
- Model: `llama-3.3-70b-versatile`
- Used for: chat assistant, search query parsing, text summarization
- No fallback chain, no usage logging, no multi-provider abstraction

### Removed
- Gemini (was fallback)
- OpenRouter (was fallback)
- AWS Bedrock (never used)
- HuggingFace (never used)

## Database (Supabase Only — 12 tables)

| Table | Purpose |
|-------|---------|
| `opportunities` | Verified R&D opportunities (5 seeded) |
| `news_articles` | Electronics news (5 seeded) |
| `subscribers` | Newsletter subscribers |
| `user_profiles` | Linked to auth.users |
| `saved_opportunities` | User bookmarks |
| `applications` | Application tracking |
| `user_alerts` | Keyword/category alerts |
| `ai_usage_log` | Usage audit trail |
| `link_check_logs` | Link verification |
| `opportunity_reports` | User issue reports |
| `suggestions` | User suggestions |
| `telegram_subscribers` | Telegram bot |
| `calendar_exports` | ICS log |

Neon server still connected (health check) but analytics tables not actively used.

## Deployment

### Frontend → Netlify
- Static export from `frontend/out/`
- Deployed via zip upload or CI (currently needs token)
- `_redirects` proxies `/api/*` to Render

### Backend → Render
- Node web service, `npm install` + `npx tsx src/index.ts`
- No TypeScript compilation step
- Free tier (Oregon), no cron infrastructure

### Email → None (removed for MVP)
- Subscription endpoint exists (stores to DB)
- No email delivery pipeline (Resend removed)

### Cron Jobs → None (removed for MVP)
- No scrapers, no newsletter, no expiry checker
- Data is added manually via admin panel or direct DB insert
