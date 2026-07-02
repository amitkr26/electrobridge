# ElectroBridge Project Audit

Generated: 2026-07-02

---

## 1. Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | ElectroBridge |
| **Description** | Electronics & semiconductor job aggregator for Indian researchers |
| **URL** | https://electrobridge.vercel.app |
| **GitHub** | https://github.com/amitkr26/JobsAI |
| **Stack** | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase + Neon |
| **Deployment** | Vercel (auto-deploy from main branch) |
| **Node** | ^18+ (Next.js 14 requirement) |
| **Package Manager** | npm |
| **Testing** | Jest 30 + ts-jest + @testing-library/react |
| **Error Tracking** | @sentry/nextjs |

---

## 2. Directory Structure

```
JobsAI/
├── .git/
├── .gitattributes
├── .gitignore
├── .github/
├── docs/
│   └── legacy/                      ← Historical build prompts (archived)
├── README.md
└── electrobridge/
    ├── .env.local                    ← SECRETS COMMITTED (see §6)
    ├── .gitignore
    ├── next.config.mjs               ← Wrapped with withSentryConfig
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── tsconfig.test.json            ← Test-specific tsconfig (jsx: react-jsx)
    ├── jest.config.ts                ← Jest config with ts-jest
    ├── sentry.client.config.ts       ← Sentry browser init
    ├── sentry.server.config.ts       ← Sentry server init
    ├── vercel.json
    ├── supabase-migration.sql
    ├── docs/
    │   ├── README.md                 ← Doc index
    │   ├── FEATURE_SUMMARY_V3.md
    │   ├── PROJECT_AUDIT.md          ← THIS FILE
    │   └── archive/
    │       └── DEPLOYMENT_CHECKLIST.md
    ├── public/
    │   ├── logo.svg
    │   ├── llms.txt
    │   └── ...
    └── src/
        ├── __tests__/                ← NEW: 4 test suites (31 tests)
        │   ├── setup.ts
        │   ├── lib/
        │   │   ├── news-filter.test.ts
        │   │   └── utils.test.ts
        │   ├── components/
        │   │   └── DeadlineCountdown.test.tsx
        │   └── api/
        │       └── opportunities.test.ts
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── sitemap.ts
        │   ├── not-found.tsx
        │   ├── error.tsx
        │   ├── auth/callback/route.ts     ← Error handling added
        │   ├── api/
        │   │   ├── health/route.ts        ← NEW: multi-DB health check
        │   │   ├── ... (existing routes)
        │   │   ├── archive-news/route.ts
        │   │   ├── sync-replica/route.ts
        │   │   ├── analytics/
        │   │   │   ├── platform/route.ts
        │   │   │   └── ai-usage/route.ts
        │   │   └── community/
        │   │       ├── posts/route.ts
        │   │       ├── posts/[id]/route.ts
        │   │       ├── comments/route.ts
        │   │       └── vote/route.ts
        │   ├── resume/page.tsx
        │   ├── resume/loading.tsx
        │   ├── community/page.tsx
        │   ├── community/[id]/page.tsx
        │   ├── login/page.tsx
        │   ├── signup/page.tsx
        │   └── ... (existing pages)
        ├── components/
        │   ├── Navbar.tsx                  ← Community + Resume links added
        │   └── ... (existing components)
        └── lib/
            ├── db/index.ts                 ← NEW: Multi-DB router (lazy init)
            ├── supabase/
            │   ├── client.ts
            │   └── server.ts
            ├── supabase.ts                 ← Legacy singleton (guarded)
            ├── utils.ts                    ← getURL() now checks NEXT_PUBLIC_APP_URL
            ├── ai/providers.ts             ← Uses neonPrimary from db/index
            └── ... (existing libs)
```

---

## 3. Route Map

### Pages (Current)

| Route | File | Status |
|-------|------|--------|
| `/` | `src/app/page.tsx` | ✅ Live |
| `/admin*` | 4 admin pages | ✅ Live |
| `/about` | `src/app/about/page.tsx` | ✅ Live |
| `/auth/callback` | `src/app/auth/callback/route.ts` | ✅ Live - OAuth + email verification handler |
| `/categories`, `/category/[category]` | 2 pages | ✅ Live |
| `/chat` | `src/app/chat/page.tsx` | ✅ Live |
| `/community` | `src/app/community/page.tsx` | NEW: Forum with tabs |
| `/community/[id]` | `src/app/community/[id]/page.tsx` | NEW: Post detail + comments |
| `/contact` | `src/app/contact/page.tsx` | ✅ Live |
| `/dashboard` | `src/app/dashboard/page.tsx` | ✅ Live |
| `/login` | `src/app/login/page.tsx` | ✅ Email + Google OAuth |
| `/match` | `src/app/match/page.tsx` | ✅ Live |
| `/news*` | 3 pages | ✅ Live |
| `/opportunities*` | 3 pages | ✅ Live |
| `/organizations*` | 2 pages | ✅ Live |
| `/profile` | `src/app/profile/page.tsx` | ✅ Live |
| `/resume` | `src/app/resume/page.tsx` | NEW: 6-step resume builder |
| `/resources/*` | 5 guide pages | ✅ Live |
| `/signup` | `src/app/signup/page.tsx` | ✅ Email + Google OAuth |
| `/sitemap.xml` | `src/app/sitemap.ts` | ✅ Dynamic sitemap |

### API Routes

| Route | Purpose |
|-------|---------|
| `GET /api/health` | NEW: Multi-DB health check |
| `POST /api/ai/chat` | AI chat (7-provider fallback) |
| `GET/POST /api/opportunities` | Filtered list / create |
| `GET /api/news` | Paginated news |
| `GET /api/community/posts` | List + create posts |
| `GET/DELETE /api/community/posts/[id]` | Post detail + delete |
| `POST /api/community/comments` | Add comment |
| `POST /api/community/vote` | Toggle upvote |
| `GET/POST /api/resume` | Fetch/upsert resume + ATS scoring |
| `GET /api/analytics/platform` | Platform analytics (Neon) |
| `GET /api/analytics/ai-usage` | AI usage stats (Neon) |
| `GET /api/archive-news` | Archive old news to DB2 |
| `GET /api/sync-replica` | Sync to Neon read replica |
| ... (all existing routes) | |

---

## 4. Database Schema

### Supabase Primary (`aqauempuwmbizqoaolop`)

#### Tables
| Table | Rows | Notes |
|-------|------|-------|
| `opportunities` | ~28 | Core job/opp data |
| `news_articles` | ~560 | RSS-scraped news |
| `subscribers` | ~3 | Email subscribers |
| `telegram_subscribers` | 0 | Created by migration |
| `calendar_exports` | 0 | Created by migration |
| `link_check_logs` | varies | Link health history |
| `ai_usage_log` | varies | AI call logging |
| `opportunity_reports` | 0 | User-submitted reports |
| `suggestions` | 0 | Contact form |
| `user_resumes` | 0 | NEW: Resume builder (`20260702000001`) |
| `community_posts` | 0 | NEW: Forum posts (`20260702000002`) |
| `community_comments` | 0 | NEW: Forum comments |
| `community_votes` | 0 | NEW: Upvote tracking |

### Supabase Secondary (`SUPABASE_2_URL`)
| Table | Purpose |
|-------|---------|
| `news_archive` | Overflow archive for old news |

### Neon Primary (`NEON_1_DATABASE_URL`)
| Table | Purpose |
|-------|---------|
| `ai_usage_log` | Analytics/AI usage logging |
| `link_check_logs` | Link health check logs |
| `platform_analytics` | Page views, click tracking |

### Neon Secondary (`NEON_2_DATABASE_URL`)
| Table | Purpose |
|-------|---------|
| `opportunities_mirror` | Read replica of opportunities |
| `news_mirror` | Read replica of news_articles |

---

## 5. Environment Variables & Secrets

### Required by Application

| Variable | Source | Set in Vercel? | Set Locally? |
|----------|--------|----------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | ✅ | ✅ |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Custom | ✅ | ✅ |
| `CRON_SECRET` | Custom | ✅ | ✅ |
| `SUPABASE_2_URL` | Supabase (Netlify) | ❌ | ❌ |
| `SUPABASE_2_SERVICE_ROLE_KEY` | Supabase (Netlify) | ❌ | ❌ |
| `NEON_1_DATABASE_URL` | Neon | ❌ | ❌ |
| `NEON_2_DATABASE_URL` | Neon | ❌ | ❌ |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry | ❌ | ❌ |

### Missing from Vercel (all optional/semi-optional)
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `RESEND_API_KEY`, `FROM_EMAIL`, `GROQ_API_KEY`, `NVIDIA_NIM_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `HUGGINGFACE_API_KEY`, `CLOUDFLARE_AI_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `AWS_BEARER_TOKEN_BEDROCK`

### 🔴 SECURITY ISSUE: Secrets Committed in `.env.local`

Same as prior audits — `.env.local` with `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET=mysecretcron2026`, `NEXT_PUBLIC_ADMIN_PASSWORD=electrobridge2026` is committed.

---

## 6. Database Client Architecture

Four databases across two providers with lazy-initialized clients:

```typescript
// src/lib/db/index.ts — Multi-DB router
export const db1     → Supabase Primary   (opportunities, news, community, auth)
export const db2     → Supabase Secondary (news archive overflow)
export const neonPrimary   → Neon Primary (analytics, ai_usage_log)
export const neonSecondary → Neon Secondary (read replica)
```

All clients use guard-clause initialization (returns `undefined` if env var missing) to prevent build-time crashes.

---

## 7. AI System

7-provider fallback chain: **Bedrock (Mantle)** → Groq → NVIDIA → Gemini → OpenRouter → Cloudflare → HuggingFace

Amazon Bedrock Mantle endpoint: `bedrock-mantle.us-east-1.api.aws/v1/chat/completions`, model `openai.gpt-oss-120b`.

AI routes gracefully degrade when no API keys are configured.

---

## 8. Components & UI

### New Components (Session 3)
| Component | Purpose |
|-----------|---------|
| ResumeBuilder (6-step) | Personal → Education → Skills → Exp → Projects → Publications |
| LoadingSkeleton (resume) | Resume page loading state |
| Community post cards | Category tabs, upvote/comment counts |
| Post detail + comments | Full post view, nested comments |

### Auth Pages
| Page | Auth Methods |
|------|-------------|
| `/login` | Email/password + Google OAuth |
| `/signup` | Email/password (confirmation) + Google OAuth |
| `/auth/callback` | Code exchange for OAuth + email verification |

---

## 9. Build & Deploy

### Commands
```bash
npm run dev       # Next.js dev server (localhost:3000)
npm run build     # Production build (✅ 203 pages, 0 errors)
npm run start     # Start production server
npm test          # Jest (✅ 31 tests passing)
npm run lint      # ESLint
```

### Build Status
- **203 static pages** generated
- **0 TypeScript errors**
- **31/31 tests passing**
- **Sentry**: Integrated (DSN required for error reporting)

---

## 10. Testing Infrastructure

| Config | Value |
|--------|-------|
| Framework | Jest 30 + ts-jest |
| Environment | jsdom (for component tests) |
| Path alias | `@/` → `<rootDir>/src/` |
| JSX transform | `tsconfig.test.json` (jsx: react-jsx) |
| Test location | `src/__tests__/` |

### Test Suites (31 total)
| Suite | Tests | What it covers |
|-------|-------|----------------|
| `lib/news-filter.test.ts` | 16 | `isElectronicsNews` — pass/block/edge cases |
| `lib/utils.test.ts` | 7 | `getDaysUntilDeadline`, `isExpired`, `formatDate` |
| `components/DeadlineCountdown.test.tsx` | 4 | Badge variant urgency colors |
| `api/opportunities.test.ts` | 4 | GET filtered, POST create, 503 when unconfigured |

---

## 11. Known Issues & Technical Debt

### Critical
- 🔴 **`.env.local` committed with live secrets** (service role key, weak passwords)
- 🔴 **Weak admin password**: `electrobridge2026`
- 🔴 **Weak CRON secret**: `mysecretcron2026`

### Medium
- ⚠️ **4 new DBs not configured**: SUPABASE_2, NEON_1, NEON_2 env vars missing; lazy init prevents crashes but DB features (archive, analytics, replica) are non-functional
- ⚠️ **Sentry DSN not configured**: `NEXT_PUBLIC_SENTRY_DSN` missing; error tracking inactive
- ⚠️ **Community + Resume migrations not applied**: Tables need to be created in Supabase SQL Editor
- ⚠️ **Vercel deploy fails**: GitHub Actions needs `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets

### Low
- 📝 **No `.nvmrc` or `.node-version`**: Node version not pinned
- 📝 **No migration tooling**: SQL files must be run manually

---

## 12. Recent Changes (Session 3)

### Auth & Redirects
- `getURL()` now also checks `NEXT_PUBLIC_APP_URL` as fallback
- Auth callback (`/auth/callback`) handles `error`, `error_description`, no-code, and exchange failures
- `.env.local.example` updated with Supabase Auth + Google OAuth config instructions
- Signup/login already used `getURL()` correctly — no localhost hardcoded in auth flow

### Database Layer
- `src/lib/db/index.ts`: Multi-database router with lazy initialization (Supabase × 2, Neon × 2)
- Guard clauses prevent build-time crashes when env vars are missing

### Testing (31 tests)
- Jest 30 configured with ts-jest, jsdom, path aliases
- 4 test suites covering news filter, utilities, component, and API

### Error Tracking
- `@sentry/nextjs` integrated
- `sentry.client.config.ts`, `sentry.server.config.ts` created
- `next.config.mjs` wrapped with `withSentryConfig`

### Health Monitoring
- `GET /api/health` — checks all 4 databases, returns timestamps + counts

### Docs Reorganization
- Root `docs/` → `docs/legacy/` with README
- `electrobridge/docs/` reorganized with active index + archive

### New Dependencies
| Package | Purpose |
|---------|---------|
| `@neondatabase/serverless` | Neon DB driver (for analytics/replica) |
| `@sentry/nextjs` | Error tracking |
| `jest`, `ts-jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/jest`, `jest-environment-jsdom` | Testing |
