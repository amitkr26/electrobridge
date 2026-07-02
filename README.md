# ElectroBridge — Electronics & Semiconductor Opportunities Platform

AI-powered platform aggregating verified R&D, JRF, PhD, and engineering opportunities from ISRO, DRDO, CSIR, IITs, IISc, TIFR, and industry. Built for India's semiconductor and electronics research community.

| Component | Live URL | Stack |
|-----------|----------|-------|
| **Active App** | [electrobridge.vercel.app](https://electrobridge.vercel.app) | Next.js 14.2.21, App Router, 7 AI providers |
| **Legacy Frontend** | [electrobridge.netlify.app](https://electrobridge.netlify.app) | Next.js 15 static export |
| **Legacy Backend** | [electrobridge-api.onrender.com](https://electrobridge-api.onrender.com) | Express 5 |

## Active Codebase: `electrobridge/`

**14,725 lines** of TypeScript/TSX/CSS — 30 pages, 34 API routes, 23 components, 4 databases, 7 AI providers.

```
electrobridge/
├── src/
│   ├── app/                   30 pages + auth callback + sitemap + robots
│   │   └── api/               34 API endpoints
│   ├── components/            23 React components
│   ├── lib/                   18 modules (db, ai, scrapers, utils)
│   │   ├── db/                Multi-database router (4 DBs)
│   │   ├── ai/                7-provider AI fallback chain
│   │   └── scrapers/          ISRO, DRDO, CSIR scrapers + 16 RSS feeds
│   ├── types/                 TypeScript interfaces
│   └── middleware.ts          Supabase SSR auth
├── supabase/migrations/       8 migration files
├── .vercel/                   Vercel project config
└── docs/                      Deployment checklist
```

### Quick Start

```bash
cd electrobridge
cp .env.local.example .env.local   # fill in real keys
npm install
npm run dev                        # → http://localhost:3000
```

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14.2.21 (App Router) |
| **UI** | React 18, Tailwind CSS 3.4 |
| **Styling** | Dark theme, Space Grotesk + Inter fonts |
| **Database** | Supabase (Primary + Secondary), Neon (Primary + Secondary) — 36 tables across 4 DBs |
| **AI** | 7-provider fallback: Bedrock → Groq → NVIDIA → Gemini → OpenRouter → Cloudflare → HuggingFace |
| **Auth** | Supabase SSR (email/password + Google OAuth) |
| **Email** | Resend (weekly digests) |
| **Messaging** | Telegram Bot API (opportunity notifications) |
| **Icons** | lucide-react |
| **Scraping** | cheerio (ISRO, DRDO, CSIR), rss-parser (16 RSS sources) |
| **Hosting** | Vercel (auto-deploy from `main`) |

### Key Features

- **Verified Opportunities** — R&D roles from top Indian research orgs with link verification and expiry detection
- **Electronics News** — Aggregated from 16 RSS sources with AI relevance filtering
- **AI Chat** — Career assistant specialized in Indian R&D opportunities
- **AI Match** — Profile-to-opportunity matching with scoring
- **AI Search** — Natural language query parsing
- **AI Resume Builder** — 6-step wizard with ATS scoring
- **Community Forum** — Posts, comments, upvotes
- **Weekly Digest** — AI-generated email newsletter
- **Multi-Database** — 4 databases: Supabase for core data + archive, Neon for analytics + read replica
- **Admin Panel** — Add/edit opportunities/news, view AI usage analytics

### Database Architecture

| DB | Type | Purpose | Tables |
|----|------|---------|--------|
| Supabase Primary | PostgreSQL | Core data (opportunities, news, auth, community) | 17 |
| Supabase Secondary | PostgreSQL | News archive, subscriber overflow | 13 |
| Neon Primary | PostgreSQL | Analytics (AI usage, platform analytics) | 4 |
| Neon Secondary | PostgreSQL | Read replica (opportunities mirror, news mirror) | 2 |

### Environment Variables

23 variables required — all set in Vercel (Production + Development). See `.env.local.example` for the full list.

---

## Legacy Codebase: `ElectroBridge Web App Design/`

Previous version (10,398 LOC):
- `frontend/` — Next.js 15 static export, 17 page routes
- `backend/` — Express 5 API, 6 route modules, Groq-only AI
- Published at `electrobridge.netlify.app` + `electrobridge-api.onrender.com`

See `ElectroBridge Web App Design/documents/` for legacy docs.

---

## License

Built for the electronics research community. 100% free tier.
