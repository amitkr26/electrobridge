# MASTER_CONTEXT.md — ElectroBridge

## PROJECT IDENTITY

| | |
|---|---|
| Name | ElectroBridge |
| URL | https://electrobridge.vercel.app |
| GitHub | https://github.com/amitkr26/JobsAI |
| Root directory | `electrobridge/` |
| Stack | Next.js 14.2.0 (App Router) + TypeScript + Supabase + Tailwind CSS |
| Deployment | Vercel (auto-deploy from `main` branch) |
| Path alias | `@/*` → `./src/*` |

## TECH STACK

- next 14.2.0, typescript ^5, tailwindcss ^3.4.1, @supabase/supabase-js ^2.108.2
- sonner ^2.0.7, date-fns ^3.6.0, lucide-react ^0.383.0, clsx ^2.1.1
- cheerio ^1.2.0, rss-parser ^3.13.0, resend ^16.6.0
- Fonts: Space Grotesk (display) + Inter (body) via next/font
- Dark mode: `html class="dark"` in layout.tsx

## DATABASE (Supabase: `aqauempuwmbizqoaolop`)

- **opportunities** (28 records) — id, title, organization, category, location, stipend, deadline, tags, is_active, verification_status, apply_clicks, slug, org_slug, source_url
- **news_articles** (560 records) — id, title, slug, source_name, source_url, image_url, tags, published_at
- **subscribers** (3 records) — email, keywords, categories, is_active
- Other tables: link_check_logs, ai_usage_log, opportunity_reports, suggestions, telegram_subscribers, calendar_exports

## PAGES

| Route | File | Notes |
|-------|------|-------|
| `/` | `page.tsx` | StatsBar (6 cards), ExpiringSoon, latest opps + news |
| `/admin` | `admin/page.tsx` | Password-protected dashboard (Opps/Verification/Add/Subscribers/Sources/Logs/Popular/AI tabs) |
| `/admin/add-news` | `admin/add-news/page.tsx` | Manually add news |
| `/admin/add-opportunity` | `admin/add-opportunity/page.tsx` | Manually add opportunity |
| `/admin/edit-opportunity/[id]` | `admin/edit-opportunity/[id]/page.tsx` | Edit/delete |
| `/categories` | `categories/page.tsx` | 6 category cards with live DB counts |
| `/category/[category]` | `category/[category]/page.tsx` | Per-category listing |
| `/chat` | `chat/page.tsx` + `loading.tsx` | AI chat |
| `/match` | `match/page.tsx` | AI resume matcher |
| `/news` | `news/page.tsx` + `loading.tsx` | News articles grid |
| `/news/[slug]` | `news/[slug]/page.tsx` | ISR (1800s revalidate) |
| `/opportunities` | `opportunities/page.tsx` + `loading.tsx` | Filters + AI search |
| `/opportunities/[slug]` | `opportunities/[slug]/page.tsx` | ISR (3600s revalidate) |
| `/organizations` | `organizations/page.tsx` | Org list with counts |
| `/organizations/[slug]` | `organizations/[slug]/page.tsx` | Per-org opportunities |
| `/resources` | `resources/page.tsx` | 5 guide cards + reference info |
| `/resources/jrf-guide` | `resources/jrf-guide/page.tsx` | JRF complete guide |
| `/resources/phd-guide` | `resources/phd-guide/page.tsx` | PhD admission guide |
| `/resources/vlsi-careers` | `resources/vlsi-careers/page.tsx` | VLSI career guide |
| `/resources/international-fellowships` | `resources/international-fellowships/page.tsx` | Intl fellowships |
| `/resources/net-vs-gate` | `resources/net-vs-gate/page.tsx` | NET vs GATE comparison |
| Not found | `not-found.tsx` | Global 404 |
| Error | `error.tsx` | Global error boundary |
| `/sitemap.xml` | `sitemap.ts` | Dynamic sitemap |

## API ROUTES

Key routes: `/api/scrape` (unified scraper), `/api/cleanup-news` (dedup), `/api/subscribe` (rate-limited), `/api/report-issue` (validated), `/api/opportunities`, `/api/news`, `/api/ai/*` (chat, match, search, summarize, expire), `/api/check-links`, `/api/send-digest`, `/api/seed`, `/api/seed-news`, `/api/scrape-jobs`, `/api/opportunities-feed`, `/api/track-click`, `/api/calendar-export/[id]`.

## SCRAPERS

- **ISRO** (`isro-scraper.ts`) — cheerio HTML scraper ✅
- **DRDO** (`drdo-scraper.ts`) — cheerio HTML scraper ✅
- **CSIR** (`csir-scraper.ts`) — cheerio HTML scraper ✅
- **CSIR RSS** (`govt-scraper.ts`) — RSS scraper ✅
- **10 News RSS** (`rss-parser.ts`) — IEEE Spectrum, EE Times, Semiconductor Engineering, Electronics Weekly, The Hindu Science, Physics World, Nature Electronics, Economic Times Tech, Times of India Science, Hindustan Times Tech ✅
- **3 Opportunity RSS** (`rss-parser.ts`) — Academic Positions, Scholarship Roar, Jobs.ac.uk Electronics ✅ (replaced FindAPhD, was CF-blocked)
- **Opportunity scraper** (`opportunity-scraper.ts`) — orchestrates all above
- News filter + auto-tagger in `news-filter.ts`

## ENV VARS

### Set in Vercel ✅
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_ADMIN_PASSWORD`, `CRON_SECRET`

### Not set ❌ (need free signups)
`GROQ_API_KEY` (groq.com), `GEMINI_API_KEY` (aistudio), `RESEND_API_KEY` (resend.com), `FROM_EMAIL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `OPENAI_API_KEY`

## CRON JOBS

| Trigger | Endpoint | What |
|---------|----------|------|
| Every 6h (Vercel) | `/api/scrape?mode=all` | All scrapers |
| Sunday 3am UTC | `/api/send-digest` | Weekly email |
| Daily 3:30am UTC (pg_cron) | `/api/scrape-jobs` | Govt jobs |

## FEATURES COMPLETED

- ✅ Sonner toasts on subscribe, report, contact, admin forms
- ✅ error.tsx + not-found.tsx + route-level 404s (opps + news)
- ✅ loading.tsx files (chat, news, opps, opps/[slug]) + LoadingSkeleton component
- ✅ Google Fonts dedup (removed @import from globals.css)
- ✅ Input validation (email regex+lowercase, UUID check, 500-char limit)
- ✅ SEO metadata (chat, match, organizations, all resource pages)
- ✅ Admin: edit/delete opp, add news, add opportunity
- ✅ ISR: generateStaticParams + revalidate (opps 3600s, news 1800s)
- ✅ Homepage stats: 6 cards, full-ISO deadline comparison, govt counter
- ✅ News dedup: check-then-insert by source_url + /api/cleanup-news
- ✅ Rate limiting: 3 req/IP/hr on subscribe (in-memory Map)
- ✅ Sitemap guard: isConfigured check returns static URLs
- ✅ Plausible analytics script in layout.tsx
- ✅ NewsImage client component (fixes SSG build with img onError)
- ✅ Resources hub with 5 dedicated guide pages
- ✅ Categories page with live DB counts
- ✅ NET vs GATE page (full comparison table, FAQPage schema, live feed)
- ✅ PhD guide page (admission routes, 7 institutions, 5 funding options, timeline, live feed)
- ✅ Navbar + Footer: Resources dropdown with all 5 guides
- ✅ Sitemap: includes all resource pages + phd-guide
- ✅ Opportunity RSS feeds: replaced FindAPhD (CF-blocked) with Academic Positions, Scholarship Roar, Jobs.ac.uk

## SECURITY ISSUES
- 🔴 `.env.local` committed to GitHub with live `SUPABASE_SERVICE_ROLE_KEY` (must rotate)
- ⚠️ Weak admin password (change in Vercel)
- ⚠️ Weak cron secret (change in Vercel)

## CODING RULES
1. Never hardcode opportunity/news data — always fetch from Supabase
2. `supabase` (anon) for client, `supabaseAdmin` (service_role) for API routes
3. All Supabase queries must have error handling
4. Server components by default — `'use client'` only when needed
5. Mobile responsive always (Tailwind mobile-first)
6. Use `sonner` toast for all user action feedback
7. Admin password is `process.env.NEXT_PUBLIC_ADMIN_PASSWORD` — never hardcode
8. Rate limit public POST endpoints using `rate-limiter.ts`
9. Validate/sanitize all user input
