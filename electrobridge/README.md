# ElectroBridge — Active App

Next.js 14.2.21 App Router application deployed at [electrobridge.vercel.app](https://electrobridge.vercel.app).

## Quick Start

```bash
cp .env.local.example .env.local   # fill in keys
npm install
npm run dev                        # → http://localhost:3000
npm run build                      # 64 routes, 0 TS errors
```

## Architecture

- **30 pages** — opportunities, news, match, chat, community, resume, admin, dashboard, resources, etc.
- **34 API routes** — CRUD, AI, scraping, analytics, cron jobs
- **23 components** — navbar, cards, filters, modals, AI panels
- **4 databases** — Supabase (core + archive), Neon (analytics + read replica)
- **7 AI providers** — Bedrock → Groq → NVIDIA → Gemini → OpenRouter → Cloudflare → HuggingFace
- **6 cron jobs** — scraping, digests, archival, sync-replica, link checks, expiry

## Key Directories

```
src/
├── app/              Pages + API routes
├── components/       React components
├── lib/              DB router, AI providers, scrapers, utils
├── types/            TypeScript interfaces
└── middleware.ts     Auth middleware

supabase/migrations/  8 SQL migrations
```

See the [root README](../README.md) for full project details.
