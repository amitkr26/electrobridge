# electrobridge — Frontend

Next.js 14 frontend for the electrobridge semiconductor opportunities aggregator. Deployed on Vercel.

## Tech Stack

| Category   | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | Next.js 14.2.21 (App Router)                |
| UI         | React 18, Tailwind CSS 3.4, lucide-react    |
| Database   | Supabase (opportunities, news, organizations) |
| Scraping   | Cheerio + RSS parser                        |

## Local Setup

```bash
npm install
cp .env.example .env.local   # add your Supabase credentials
npm run dev
```

Required environment variables:

| Variable                      | Purpose                          |
| ----------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`    | Supabase project URL             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key             |
| `SUPABASE_SERVICE_ROLE_KEY`   | Server-side database access      |
| `CRON_SECRET`                 | Guards cron endpoints            |
| `RESEND_API_KEY`              | Optional — weekly email digest   |

## Project Structure

```
src/app/
  page.tsx                 Home
  opportunities/           Opportunity list + detail
  news/                    News list + detail
  organizations/           Organization directory + detail
  categories/, category/   Category browsing
  api/                     Public JSON APIs (opportunities, news, sitemap, og, ...)
  api/cron/                Scraping + maintenance cron jobs
src/lib/
  scrapers/                Automated aggregation engines
  supabase.ts              Database client
src/components/            UI components (cards, filters, share, ...)
```

## Commands

| `npm run dev`        | Development server       |
| -------------------- | ------------------------ |
| `npm run build`      | Production build         |
| `npm test`           | Run tests                |
| `npm run lint`       | Lint                     |