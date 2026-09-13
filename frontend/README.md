# ElectroBridge — Frontend

Next.js 14 frontend for the ElectroBridge career platform. Deployed on Vercel.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS, Lucide Icons |
| AI | Groq / OpenAI via provider abstraction |
| Database | Supabase (opportunities/news grounding) |
| PDF Export | html2pdf.js (client-side, SSR-safe dynamic import) |

## Local Setup

```bash
npm install
cp .env.example .env.local   # add your Supabase + AI keys
npm run dev
```

Required environment variables:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side database access |
| `GROQ_API_KEY` | AI chat (primary provider) |
| `OPENAI_API_KEY` | AI chat (optional fallback) |

## Project Structure

```
src/app/
  page.tsx                  Landing page
  resume/                   Resume builder (10 templates, section ordering, style customizer)
  cover-letter/             AI cover letter generator
  resume-review/            ATS resume scoring
  ask-ai/                   AI career assistant chat
  templates/                Template gallery
  resources/                Career resources
  ats-resume-checker/       SEO landing page
  ai-resume-builder/        SEO landing page
  about/                    About page
  contact/                  Contact page
  api/                      Serverless API routes
src/components/             Shared UI (AppLayout, navbar, footer)
src/lib/
  ai/                       AI provider abstraction, grounding, reasoning sanitizer
  supabase.ts               Supabase client
  supabase-admin.ts         Server-side Supabase client
  utils.ts                  Utility functions
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | Lint |
| `npm run typecheck` | Type-check |
