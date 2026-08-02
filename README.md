# electrobridge

**Verified Opportunity Engine for the Semiconductor & VLSI Industry**

electrobridge is a pure opportunity aggregator for the semiconductor, VLSI, and electronics engineering community in India. It centralizes JRF positions, PhD admissions, government jobs (DRDO, ISRO, CSIR), fellowships, and private sector roles into a single searchable platform.

## Features

- **Live Ingestion** — Automated scrapers pull opportunities and news daily from official sources (DRDO, ISRO, CSIR, IITs, international programs) via Vercel Cron.
- **Verified Listings** — Auto-scraped rows are filtered, tagged, and marked verified; broken/expired links are re-checked and archived.
- **Fast Search & Filtering** — Search by keyword, category, eligibility, location, and deadline with card/grid view toggling.
- **Structured Content** — Detailed opportunity pages with deadlines, stipends, eligibility, calendars (ICS export), share buttons, and similar-opportunity suggestions.
- **Weekly Digest** — Optional email digest of new opportunities for subscribers.

## Tech Stack

- **Frontend**: Next.js 14 (App Router, React 18), TypeScript, Tailwind CSS, Lucide Icons.
- **Data**: Supabase (opportunities, news, organizations), Neon (analytics).
- **Scraping**: Custom scrapers using Cheerio and RSS parser.
- **Deployment**: Vercel (with cron schedules).

## Repository Layout

```
backend/api          Shared API utilities (response helpers, validation, rate limiting)
frontend/            Next.js app (pages, API routes, scrapers, components)
neon/                Neon analytics schema
```

## Local Setup

1. **Install dependencies** (from repository root):
   ```bash
   npm install
   ```

2. **Set environment variables** in `frontend/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   RESEND_API_KEY=          # optional, for the weekly digest
   CRON_SECRET=             # protects cron endpoints
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`.

## Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start the Next.js dev server         |
| `npm run build`  | Production build                     |
| `npm test`       | Run the test suite                   |
| `npm run lint`   | Lint the workspace                   |
| `make env-check` | Verify required environment keys     |

## Deployment

Vercel Cron Jobs handle scheduled ingestion:

- `0 0 * * *` — `/api/cron/scrape-india`
- `0 4 * * *` — `/api/cron/scrape-global`
- `0 6 * * *` — `/api/cron/scrape-news`
- `0 8 * * *` — `/api/cron/digest`
- `0 2 * * 0` — `/api/cron/cleanup`

## License

MIT.