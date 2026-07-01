# ElectroBridge MVP Migration Plan

*Generated: June 30, 2026 — Before architecture changes*

---

## 1. Current State Summary

Two codebases exist in the repository:

| Codebase | Framework | Status | Purpose |
|----------|-----------|--------|---------|
| `electrobridge/` | Next.js 14 + inline API routes | 🔴 LEGACY (read-only) | Original full-featured app |
| `ElectroBridge Web App Design/` | Next.js 15 frontend + Express 5 backend | 🟢 ACTIVE (MVP target) | Simplified redesign |

### 1.1 Duplication Analysis

**17 lib modules duplicated** (identical structure, minor variations):
- `ai/providers.ts`, `ai/matcher.ts`, `ai/summarizer.ts`, `ai/search-parser.ts`, `ai/news-filter-ai.ts`, `ai/newsletter.ts`, `ai/expiry-checker.ts`
- `supabase.ts`
- `scrapers/` (9 files: types, utils, news-filter, rss-parser, opportunity-scraper, csir-scraper, drdo-scraper, isro-scraper, govt-scraper)

**3 components duplicated by basename:**
- `Footer.tsx`, `Navbar.tsx`, `OpportunityCard.tsx`

**0 type definitions overlap** — `electrobridge/src/types/index.ts` has no equivalent in `ElectroBridge Web App Design/shared/`.

---

## 2. Planned Architecture Changes

### 2.1 Backend (`ElectroBridge Web App Design/backend/`)

#### Reduce AI to Single Provider (Groq only)

**Current:** `providers.ts` — 115 lines with 3 providers (Groq, Gemini, OpenRouter), fallback chain, usage logging to Supabase.

**Target:** Remove Gemini and OpenRouter providers. Collapse `callAI` to a direct Groq call. Remove AI usage logging to Supabase (no audit table needed for MVP).

- Delete: `providers.ts` → replace with inline Groq-only helper
- Delete: unused env vars `GEMINI_API_KEY`, `OPENROUTER_API_KEY` from example configs
- Keep: `GROQ_API_KEY` only

#### Remove Script Files (unused in production)
```
src/scripts/expire-opportunities.ts
src/scripts/run-scrapers.ts
src/scripts/send-newsletter.ts
src/workers/index.ts
```
These are CLI scripts meant for cron jobs. No cron infrastructure exists. Delete them.

#### Remove Scraper Modules (no cron infrastructure)
```
src/lib/scrapers/                    ← 9 files
src/routes/scrape.ts                 ← cron-guarded endpoints
```
Scrapers cannot run without a cron scheduler (Render free plan has no cron). Delete the scraper modules and the scrape route. They can be re-added when cron infrastructure is set up.

#### Remove Newsletter Route
```
src/routes/newsletter.ts             ← cron-guarded endpoints
src/lib/ai/newsletter.ts             ← only used by newsletter route
```
No cron → no newsletter delivery. Remove.

#### Remove AI Expiry Checker
```
src/lib/ai/expiry-checker.ts         ← only used by /api/ai/expire
```
No cron → no auto-expiry. Remove.

#### Tighten Security

**Current:**
```typescript
// auth.ts  line 5 — hardcoded fallback password
const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'electrobridge2026';
```

**Target:** Remove the hardcoded fallback. Admin password must be explicitly set in env or admin routes are locked.

#### Supabase Client Simplification

**Current:** Uses `SUPABASE_SERVICE_ROLE_KEY` (admin key) for all queries.
**Target:** Keep service_role usage but ensure it's properly guarded. Remove unused env vars from example.

#### Remove Unused Dependencies
```
backend/package.json → remove:
  pg (neon is connected via DATABASE_URL, not direct pg)
  cheerio (scrapers removed)
  rss-parser (scrapers removed)
  resend (newsletter removed)
```

**Keep:**
```
express, cors, helmet, @supabase/supabase-js, date-fns, dotenv
tsx, typescript, @types/node, @types/express, @types/cors
```

---

### 2.2 Backend — Kept as-is (no changes)

| Module | Reason |
|--------|--------|
| `routes/opportunities.ts` | Core feature — CRUD for opportunities |
| `routes/news.ts` | Core feature — news listing/detail |
| `routes/organizations.ts` | Core feature — org pages |
| `routes/subscribe.ts` | Newsletter subscription (can work without cron) |
| `routes/admin.ts` | Admin dashboard API |
| `routes/ai.ts` | AI chat, match, search, summarize |
| `lib/supabase.ts` | DB connection |
| `lib/neon.ts` | Analytics connection |
| `lib/ai/matcher.ts` | AI match — core feature |
| `lib/ai/search-parser.ts` | AI search — core feature |
| `lib/ai/summarizer.ts` | AI summarize — core feature |
| `lib/ai/news-filter-ai.ts` | Used by scrapers (keep for when scrapers return) |
| `middleware/auth.ts` | Auth guards — needs security fix |

---

### 2.3 Frontend (`ElectroBridge Web App Design/frontend/`)

#### Fix Static Export / Dynamic Routes

**Current:** `generateStaticParams` in 3 layout files has hardcoded UUIDs.
**Target:** Fetch from API during build for `generateStaticParams`. Fall back to empty array on failure. Build succeeds either way — detail pages just won't exist if API is unreachable.

Remove the 3 layout files (`[slug]/layout.tsx`) and inline `generateStaticParams` directly in each `[slug]/page.tsx`.

#### Remove Unused Dependencies
```
frontend/package.json → remove:
  @radix-ui/react-slot (only used by shadcn ui/button — can inline)
  class-variance-authority (shadcn utility)
  clsx (shadcn utility — can use template literals)
  next-themes (dark mode — not implemented)
  tailwind-merge (shadcn utility)
```

**Keep:**
```
next, react, react-dom, @supabase/supabase-js, date-fns, lucide-react, sonner
@tailwindcss/postcss, tailwindcss, postcss, typescript, @types/*
```

#### Simplify Components

Review component files and remove any dead code or unused exports.

#### Pages That Exist in MVP Frontend (keep all):
```
/                       ← Landing
/opportunities          ← List
/opportunities/[slug]   ← Detail
/news                   ← List
/news/[slug]            ← Detail
/organizations/[slug]   ← Detail (no list page — create if needed)
/chat                   ← AI chat
/login                  ← Auth
/signup                 ← Auth
/dashboard              ← User dashboard
/admin                  ← Admin panel
/about                  ← Info
/contact                ← Contact
/resume                 ← Resume tool
/community              ← Community
```

#### Pages NOT in MVP Frontend (not migrating — too niche for MVP):
```
/categories             ← Nice-to-have browse
/category/[category]    ← Filter view
/favorites              ← Needs auth
/profile                ← Needs auth
/resources/*            ← Content pages, can link externally
/match                  ← Can merge with /chat
```

---

### 2.4 Infrastructure Changes

#### Clean Up .env Files

**Current state on disk (gitignored):**
- `backend/.env` — contains REAL keys for Supabase service_role, Groq, Gemini, OpenRouter, Resend
- `frontend/.env.local` — contains REAL Supabase anon key

**Target:** Remove keys that are no longer needed (Gemini, OpenRouter, Resend) from both `.env` files and from backend `.env.example`.

#### Remove Hardcoded Default Password

Change `auth.ts` line 5 from fallback to explicit-required.

---

## 3. Files to Delete

### Backend — 20 files removed

| File | Reason |
|------|--------|
| `backend/src/scripts/` (3 files) | No cron infrastructure |
| `backend/src/workers/` (1 file) | No cron infrastructure |
| `backend/src/lib/scrapers/` (9 files) | No cron infrastructure |
| `backend/src/routes/scrape.ts` | Scrapers removed |
| `backend/src/routes/newsletter.ts` | Newsletter removed (no cron) |
| `backend/src/lib/ai/expiry-checker.ts` | AI expiry removed (no cron) |
| `backend/src/lib/ai/newsletter.ts` | Newsletter AI removed |
| `backend/src/lib/ai/providers.ts` | Replaced with inline Groq call |
| `backend/render.yaml.bak` | Backup file, no longer needed |

### Frontend — 3 files removed

| File | Reason |
|------|--------|
| `frontend/src/app/news/[slug]/layout.tsx` | generateStaticParams → page.tsx |
| `frontend/src/app/opportunities/[slug]/layout.tsx` | generateStaticParams → page.tsx |
| `frontend/src/app/organizations/[slug]/layout.tsx` | generateStaticParams → page.tsx |

### Root — 1 file removed

| File | Reason |
|------|--------|
| `ElectroBridge Web App Design/scripts/` | Setup script, one-time use |

---

## 4. Dependencies to Remove

### Backend (`backend/package.json`)
| Package | Reason |
|---------|--------|
| `pg` | Supabase client used instead of raw pg |
| `cheerio` | Scrapers removed |
| `rss-parser` | Scrapers removed |
| `resend` | Newsletter removed |
| `@types/pg` | pg removed |

### Frontend (`frontend/package.json`)
| Package | Reason |
|---------|--------|
| `@radix-ui/react-slot` | shadcn utility, can inline |
| `class-variance-authority` | shadcn utility, not needed |
| `clsx` | Template literals suffice |
| `next-themes` | Dark mode not implemented |
| `tailwind-merge` | shadcn utility, not needed |

---

## 5. Frontend Page Audit (MVP scope)

| Page | Exists Now | Keep for MVP | Changes Needed |
|------|-----------|--------------|----------------|
| `/` | ✅ | ✅ | None |
| `/opportunities` | ✅ | ✅ | None |
| `/opportunities/[slug]` | ✅ | ✅ | Move generateStaticParams into page.tsx |
| `/news` | ✅ | ✅ | None |
| `/news/[slug]` | ✅ | ✅ | Move generateStaticParams into page.tsx |
| `/organizations` | ❌ | ❌ | Not critical — slug pages cover org access |
| `/organizations/[slug]` | ✅ | ✅ | Move generateStaticParams into page.tsx |
| `/chat` | ✅ | ✅ | None |
| `/login` | ✅ | ✅ | None |
| `/signup` | ✅ | ✅ | None |
| `/dashboard` | ✅ | ✅ | None |
| `/admin` | ✅ | ✅ | None |
| `/about` | ✅ | ✅ | None |
| `/contact` | ✅ | ✅ | None |
| `/resume` | ✅ | ✅ | None |
| `/community` | ✅ | ✅ | None |
| `loading/error/not-found` | ✅ | ✅ | None |

---

## 6. Secrets & Security Audit Results

### ✅ Properly handled
- `.env` and `.env.local` are gitignored (root `.gitignore` has `.env*` pattern)
- `.env.example` files use placeholder values
- No API keys hardcoded in source `.ts`/`.tsx`/`.js` files

### ⚠️ Issues found

| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| Hardcoded admin password fallback | `backend/src/middleware/auth.ts:5` | MEDIUM | Remove fallback; require explicit env var |
| `NEXT_PUBLIC_ADMIN_PASSWORD` exposed | `backend/.env` (disk), `.env.example` | LOW | Remove from .env.example; document as required env |
| Admin password in client env | `NEXT_PUBLIC_ADMIN_PASSWORD` prefix | LOW | Rename to `ADMIN_PASSWORD` (server-only) if possible |

### ✅ No action needed
- `.env` files on developer machines — gitignored and local-only
- Documentation references use placeholder values (`your_key`, `gsk_your_key`)

---

## 7. Pre-Migration Checklist

- [x] Audit both codebases for duplicated modules
- [x] Mark `electrobridge/` as legacy read-only (`LEGACY_READONLY.md` added)
- [x] Audit for exposed secrets and env leaks
- [x] Generate this migration report
- [ ] Delete 20+ backend files (scrapers, scripts, newsletter, expiry)
- [ ] Simplify AI provider to single Groq call
- [ ] Remove unused dependencies from package.json
- [ ] Move generateStaticParams from layout files to page files
- [ ] Fix hardcoded admin password fallback
- [ ] Clean up .env.example files
- [ ] Rebuild and verify

---

## 8. Post-Migration Target State

```
ElectroBridge Web App Design/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── opportunities.ts    ← Core CRUD
│   │   │   ├── news.ts             ← Core list/detail
│   │   │   ├── organizations.ts    ← Core list/detail
│   │   │   ├── subscribe.ts        ← Email subscription
│   │   │   ├── admin.ts            ← Admin API
│   │   │   └── ai.ts               ← AI chat/match/search/summarize
│   │   ├── middleware/
│   │   │   └── auth.ts             ← Admin + cron auth (no fallback)
│   │   ├── lib/
│   │   │   ├── supabase.ts         ← DB client
│   │   │   ├── neon.ts             ← Analytics client
│   │   │   └── ai/
│   │   │       ├── groq.ts         ← Single Groq provider (was providers.ts)
│   │   │       ├── matcher.ts      ← AI match
│   │   │       ├── search-parser.ts← AI search
│   │   │       ├── summarizer.ts   ← AI summarize
│   │   │       └── news-filter-ai.ts← AI news filter
│   │   └── index.ts                ← Entry point (simplified)
│   ├── package.json                ← Slimmed deps
│   ├── .env.example                ← Cleaned env vars
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                    ← 17 routes, no layout wrappers for [slug]
│   │   ├── components/             ← 9 components (no shadcn cruft)
│   │   └── lib/
│   │       ├── api.ts              ← API client
│   │       └── supabase.ts         ← Browser supabase client
│   ├── package.json                ← Slimmed deps
│   └── next.config.ts              ← Static export, dynamic routes
```

**Net change:** ~25 files deleted, ~20 files simplified, 0 new files added.
