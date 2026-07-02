# Project Audit Report: ElectroBridge (JobsAI)

*Updated: July 2, 2026*

---

## 1. Project Overview

**ElectroBridge** — a full-stack web platform connecting Indian students/professionals to verified R&D opportunities in electronics, semiconductor, and space sectors. Aggregates from ISRO, DRDO, CSIR, IITs, IISc, TIFR, and industry. Includes AI-powered chat, matchmaking, and summarization via Groq.

### Tech Stack
| Layer | Stack | Hosting |
|-------|-------|---------|
| Frontend | Next.js 15, Tailwind CSS v4, static export | Netlify |
| Backend | Express 5, `npx tsx` runtime | Render (Free, Oregon) |
| Database | Supabase (primary) + Neon (analytics) | Supabase Cloud + Neon Cloud |
| Auth | Supabase Auth | Supabase |
| AI | Groq LLaMA 3.3 70B (single provider) | External API |

### Live URLs
| Component | URL |
|-----------|-----|
| Frontend | `https://electrobridge.netlify.app` |
| Backend | `https://electrobridge-api.onrender.com` |
| Health | `https://electrobridge-api.onrender.com/health` |

### Repository
- **Origin:** `https://github.com/amitkr26/JobsAI`
- **Fork:** `https://github.com/pogotunes/JobsAI` (push 403 — PAT expired)
- **Commits:** 75+ | **Branch:** `main`
- **Total files:** ~120 across active codebase

---

## 2. What Is Done ✅

### 2.1 Backend (Express 5 — `ElectroBridge Web App Design/backend/`)
| Component | Status | Details |
|-----------|--------|---------|
| Express server entry | ✅ | CORS, helmet, health endpoint, routers at `/api/*` |
| Opportunities CRUD routes | ✅ | List (paginated, filterable), detail, create, update, delete — all default verified-only |
| News routes | ✅ | List (paginated, filterable), detail by slug — all default verified-only |
| Organizations routes | ✅ | List aggregated from opps, detail by org_slug — all default verified-only |
| AI routes | ✅ | `/chat`, `/match`, `/search`, `/summarize` — all Groq-only |
| Subscribe routes | ✅ | Subscribe (rate-limited 3/hr/IP), unsubscribe |
| Admin routes | ✅ | Stats, create/update/delete opportunities, add news |
| Auth middleware | ✅ | `requireAdmin` (no hardcoded fallback), `requireDatabase` |
| AI Matcher | ✅ | Tag + description scoring against user skills |
| AI Summarizer | ✅ | Description summarization via Groq |
| AI Search parser | ✅ | NL queries → DB filters via Groq |
| Verified-only filter (all routes) | ✅ | Default: `verification_status='verified'` / `is_verified=true` |
| `.nvmrc` (Node 22) | ✅ | |
| Render deploy | ✅ | Live with `npx tsx src/index.ts` |
| Render keep-alive (GH Actions) | ✅ | Pings `/health` every 10 min via cron |

### 2.2 Frontend (Next.js 15 — `ElectroBridge Web App Design/frontend/`)
| Component | Status | Details |
|-----------|--------|---------|
| App Router with static export | ✅ | `output: 'export'` in next.config.ts |
| Tailwind CSS v4 | ✅ | |
| Landing page | ✅ | Hero, real API-fetched stats, featured opps, news, AI CTA |
| Opportunities list | ✅ | API-fetched, paginated, filters |
| Opportunity detail | ✅ | 5 UUIDs pre-built via generateStaticParams |
| News list | ✅ | Category pill tabs, API-fetched |
| News detail | ✅ | 5 slugs pre-built |
| Organizations detail | ✅ | 5 orgs pre-built |
| AI Chat | ✅ | Real API call to Groq via `/api/ai/chat` |
| AI Match | ✅ | Skill input + matching |
| Resume page | ✅ | Empty defaults, live ATS preview |
| About / Contact | ✅ | Generic copy, no fake team |
| Login / Signup | ✅ | Supabase Auth UI |
| Dashboard | ✅ | Stats, application tracker |
| Admin panel | ✅ | Stats, opportunity table (real data) |
| Community | ✅ | Coming Soon placeholder (no fake posts) |
| Navbar (auth-aware) | ✅ | Login state, dashboard link |
| Loading/Error/404 states | ✅ | All pages |
| API client (`lib/api.ts`) | ✅ | Thin fetch wrapper |
| Netlify config | ✅ | `netlify.toml`, `_redirects`, security headers |
| No hardcoded dummy data | ✅ | All pages fetch from API or show honest empty states |

### 2.3 Infrastructure
| Component | Status | Details |
|-----------|--------|---------|
| Supabase project | ✅ | Live, 12+ tables, RLS enabled |
| Neon database | ✅ | Live, 5 analytics tables |
| Render backend | ✅ | Deployed, healthy (supabase:true, neon:true) |
| GitHub Actions CI | ✅ | Lint + build on push to main |
| GitHub Actions Deploy | ✅ | Build → zip → POST to Netlify (token DENIED) |
| GitHub Actions Keep-Alive | ✅ | Pings Render `/health` every 10 min |
| `opencode.json` | ✅ | AI context config |

### 2.4 Database Schema (Supabase)
| Table | Rows | Purpose |
|-------|------|---------|
| `opportunities` | **5** | Verified R&D opportunities |
| `news_articles` | **5** | Verified electronics news |
| `subscribers` | 0 | Email newsletter subscribers |
| `user_profiles` | 0 | Linked to `auth.users` |
| `saved_opportunities` | 0 | User bookmarks |
| `applications` | 0 | User applications with status |
| `user_alerts` | 0 | Keyword/category alerts |
| `ai_usage_log` | 0 | AI provider audit trail |
| `link_check_logs` | 0 | Link verification history |
| `opportunity_reports` | 0 | User-submitted issue reports |
| `suggestions` | 0 | User suggestions |
| `telegram_subscribers` | 0 | Telegram bot users |

### 2.5 Documentation
16 files in `documents/`: architecture, DB schema, env vars, deployment, task tracker, progress log, API spec, testing plan, security checklist, project audit, migration plan, etc.

---

## 3. What Is NOT Done ❌

### 3.1 Critical / High Priority
| Item | Priority | Notes |
|------|----------|-------|
| Netlify CD deploy token denied | 🔴 HIGH | `nfp_` token returns 401; CD pipeline broken |
| Fork push broken | 🔴 HIGH | `pogotunes/JobsAI` push 403 — PAT expired |
| No automated deploys | 🟡 MED | Need working deploy token |
| Frontend detail pages fragile | 🟡 MED | Pre-built UUIDs only; new DB records = no detail pages until rebuild |

### 3.2 Medium Priority
| Item | Priority | Notes |
|------|----------|-------|
| Supabase Auth not configured | 🟡 MED | Needs Email/Google OAuth setup in Supabase dashboard |
| All user tables empty | 🟡 MED | Zero real users, profiles, saves, or applications |
| No cron infrastructure | 🟡 MED | Scrapers, newsletter, expiry checker removed; data added manually |
| No email delivery | 🟡 MED | No cron triggers newsletter; subscribes stored to DB only |
| No analytics data | 🟡 MED | Neon tables all zero — no monitoring possible |
| No link checking | 🟡 MED | Links never verified |
| No AI usage monitoring | 🟡 MED | `ai_usage_log` empty |
| Two codebases diverging | 🟡 MED | `electrobridge/` (legacy) vs `ElectroBridge Web App Design/` (active) |
| No package-lock in frontend | 🟡 RISK | Non-reproducible builds |

### 3.3 Low Priority
| Item | Notes |
|------|-------|
| Admin dashboard minimal | No analytics, user mgmt, moderation workflows |
| ICS calendar export | Not implemented |
| Favorites / Categories / Resources pages | Not ported from legacy |
| Password reset | No frontend page |
| PWA / offline | Not started |

---

## 4. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER                               │
│  electrobridge.netlify.app (Next.js 15 static export)   │
│  ┌──────────────────────────────────────────────┐       │
│  │  17 pages — all data fetched client-side     │       │
│  │  from API; no fallback/mock data             │       │
│  └──────────────────┬───────────────────────────┘       │
│                     │ API calls via fetch()               │
├─────────────────────┼───────────────────────────────────┤
│                     ▼                                    │
│  electrobridge-api.onrender.com (Express 5 + tsx)        │
│  ┌──────────────────────────────────────────────┐       │
│  │  /health                 → { status, svcs }  │       │
│  │  /api/opportunities      → verified-only CRUD│       │
│  │  /api/news               → verified-only     │       │
│  │  /api/organizations      → verified orgs     │       │
│  │  /api/ai/{chat,match,search,summarize}       │       │
│  │  /api/subscribe          → email (rate-ltd)  │       │
│  │  /api/admin/*            → admin panel       │       │
│  │                                              │       │
│  │  AI: Groq (single provider, no fallback)     │       │
│  │  No scrapers, no cron, no newsletter routes  │       │
│  └────┬────────────────────┬────────────────────┘       │
│       │                    │                              │
│       ▼                    ▼                              │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │  Supabase    │    │  Neon        │                   │
│  │  (primary)   │    │  (analytics) │                   │
│  │  12+ tables  │    │  5 tables    │                   │
│  └──────────────┘    └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
1. Frontend fetches data via `fetch()` to `NEXT_PUBLIC_API_URL` or via Netlify `_redirects` proxy
2. Backend queries Supabase with `verification_status='verified'` filter by default
3. AI requests go from frontend → backend → Groq API → response returned to user
4. Admin writes go through `requireAdmin` middleware (checks `x-admin-token` header against `ADMIN_PASSWORD` env var)
5. Subscribe endpoint rate-limited: 3 requests per IP per hour

### Key Design Decisions
- **Static export**: No SSR, no ISR, no API routes in Next.js. All data fetched client-side
- **Single Groq provider**: Replaced multi-provider fallback chain (Gemini, OpenRouter, HuggingFace, Bedrock) with direct Groq call
- **No cron infrastructure**: Removed all scrapers, newsletter routes, expiry checker. Data added manually or via admin panel
- **No hardcoded fallback data**: All empty states show honest "No data available" messages
- **Verified-only by default**: Every API endpoint filters to verified records unless `?verified=all` is passed

---

## 5. API Surface

### Public Endpoints
| Method | Path | Auth | Verified Filter |
|--------|------|------|----------------|
| GET | `/health` | None | — |
| GET | `/api/opportunities` | None | ✅ `eq('verification_status', 'verified')` |
| GET | `/api/opportunities/:id` | None | ✅ `eq('verification_status', 'verified')` |
| GET | `/api/news` | None | ✅ `eq('is_verified', true)` |
| GET | `/api/news/:slug` | None | ✅ `eq('is_verified', true)` |
| GET | `/api/organizations` | None | ✅ `eq('verification_status', 'verified')` |
| GET | `/api/organizations/:slug` | None | ✅ `eq('verification_status', 'verified')` |
| POST | `/api/subscribe` | None | — |
| POST | `/api/ai/chat` | None | — |
| POST | `/api/ai/match` | None | ✅ on matched opportunities |
| GET | `/api/ai/search` | None | ✅ `eq('verification_status', 'verified')` |
| POST | `/api/ai/summarize` | None | — |

### Protected Endpoints (require `x-admin-token` header)
| Method | Path |
|--------|------|
| POST | `/api/opportunities` |
| PATCH | `/api/opportunities/:id` |
| DELETE | `/api/opportunities/:id` |
| POST | `/api/admin/opportunities` |
| POST | `/api/admin/news` |
| GET | `/api/admin/stats` |

**Removed (MVP simplification):** All scrape, newsletter, cron, and expiry endpoints.

---

## 6. Seed Data

### Opportunities (5 verified, all with future deadlines)
1. VLSI Design Engineer Internship — ISRO Bengaluru (₹35k/mo, deadline Aug 15)
2. Semiconductor Process R&D Fellowship — IISc Bengaluru (₹42k/mo, deadline Jul 30)
3. PhD Scholarship Spintronics & Quantum — TIFR Mumbai (₹37k/mo, deadline Aug 10)
4. Embedded Systems Engineer EV — Tata Motors Pune (₹8.5 LPA, deadline Jul 20)
5. AI Chip Architecture Research Intern — Intel India R&D Hyderabad (₹60k/mo, deadline Sep 1)

### News (5 verified)
1. India Semiconductor Mission: ₹76,000 Cr Incentive Scheme
2. ISRO Chandrayaan-4 Mission Gets Cabinet Approval
3. IISc Researchers Develop Cryogenic Quantum Processor
4. DRDO Successfully Tests Hypersonic Missile
5. IIT Bombay and Intel Launch Joint AI Research Lab

---

## 7. Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ LIVE | `https://electrobridge.netlify.app` |
| Backend | ✅ LIVE | `https://electrobridge-api.onrender.com` (health: OK) |
| Supabase | ✅ LIVE | Project active, tables exist |
| Neon | ✅ LIVE | Connected via DATABASE_URL |
| CI | ✅ Configured | GitHub Actions: lint + build on push |
| CD | ❌ BROKEN | Netlify deploy token returns 401 |
| Keep-Alive | ✅ Configured | GitHub Actions cron pings /health every 10 min |

### Health Check
```json
GET /health → 200
{"status":"healthy","services":{"supabase":true,"neon":true}}
```

### Environment Variables (on Render)
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `GROQ_API_KEY`, `ADMIN_PASSWORD`, `CORS_ORIGIN`

---

## 8. Repository Structure

```
/workspaces/JobsAI/
├── ElectroBridge Web App Design/         ← ACTIVE CODEBASE
│   ├── frontend/                         Next.js 15, 17 pages, 7 components
│   │   ├── src/app/                      17 routes
│   │   ├── src/components/               Navbar, Footer, LandingHero, etc.
│   │   ├── src/data/                     API-fetching data layer
│   │   └── src/lib/                      API client, utils
│   ├── backend/                          Express 5, 6 route modules
│   │   ├── src/routes/                   6 routers
│   │   ├── src/lib/                      Supabase, Neon, Groq, matcher
│   │   └── src/middleware/               Admin auth, DB guard
│   ├── shared/                           Types, constants
│   └── documents/                        16 design/deployment docs
│
├── electrobridge/                        ← LEGACY (read-only)
├── docs/                                 ← Legacy documentation
└── .github/workflows/                    CI + Deploy + Keep-Alive
```

### File Count by Area
| Area | Files |
|------|-------|
| Backend (routes) | 6 |
| Backend (lib) | 6 (supabase, neon, groq, matcher, search-parser, summarizer) |
| Backend (middleware) | 2 (admin auth, DB guard) |
| Frontend (pages) | 17 |
| Frontend (components) | 7 |
| Frontend (data/lib) | 4 |
| Shared | 2 |
| Documentation | 16 |
| CI/CD | 3 |
| **Total (active)** | **~60** |

---

## 9. Known Issues & Risks

| Issue | Severity | Workaround |
|-------|----------|------------|
| Netlify token denied | 🔴 BLOCKER | Generate new `nfp_` token or enable auto-deploy from GitHub |
| Fork push 403 | 🔴 BLOCKER | Replace PAT; origin pushes work |
| Render tsc build fails | 🟡 WORKAROUND | Using `npx tsx` — works but non-standard |
| generateStaticParams hardcoded UUIDs | 🟡 FRAGILE | Rebuild needed when DB records change |
| No package-lock.json in frontend | 🟡 RISK | Run `npm install --package-lock-only` |
| Netlify CD pipeline broken | 🟡 RISK | Must deploy manually via CLI or zip upload |

---

## 10. Immediate Next Steps

| Priority | Action |
|----------|--------|
| 🔴 1 | Generate new Netlify deploy token / fix auto-deploy from GitHub |
| 🔴 2 | Add more seed/verified data (opportunities + news) |
| 🟡 3 | Configure Supabase Auth (Email + Google OAuth) |
| 🟡 4 | Set up cron-job.org for periodic backend pings (backup to GH Actions) |
| 🟡 5 | Add more verified opportunities via admin panel |
| 🟡 6 | Run `npm install --package-lock-only` in frontend |
| 🟢 7 | Port remaining pages from legacy if needed (favorites, resources) |
