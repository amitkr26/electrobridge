# ElectroBridge

**Free AI Career Platform for Semiconductor & VLSI Engineers**

ElectroBridge is an all-in-one career operating system for India's electronics and semiconductor community. Build professional resumes, get AI-powered career guidance, optimize for ATS systems, generate cover letters, and discover live research opportunities — all for free.

## Features

- **Resume Builder** — 10 professional templates with real-time preview, PDF export, section reordering, custom labels, and multi-resume management. No login required.
- **AI Career Assistant** — Grounded chat assistant specialized in Indian semiconductor careers, VLSI design, JRF research positions, and ISRO/DRDO exams.
- **ATS Resume Checker** — Upload your resume for instant ATS scoring with keyword extraction, JD matching, and tailored improvement suggestions.
- **Cover Letter Generator** — AI-generated cover letters that match your resume design and style.
- **Opportunity Discovery** — Search live research and semiconductor vacancies from DRDO, ISRO, CSIR, IITs, and IISc.
- **SEO Landing Pages** — ATS Resume Checker and AI Resume Builder landing pages for organic discovery.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS, Lucide Icons |
| AI | Groq / OpenAI via provider abstraction |
| Database | Supabase (opportunities, news grounding) |
| PDF Export | html2pdf.js (client-side) |
| Deployment | Vercel |
| Shared API | `@electrobridge/api` (rate limiting, error handling) |

## Repository Layout

```
frontend/             Next.js app (pages, API routes, components, templates)
backend/api/          Shared API utilities (rate limiting, error helpers, validation)
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
   GROQ_API_KEY=            # for AI chat
   OPENAI_API_KEY=          # optional fallback
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`.

## Routes

| Route | Description |
|-------|------------|
| `/` | Landing page with product overview |
| `/resume` | Resume builder with 10 templates |
| `/cover-letter` | AI cover letter generator |
| `/resume-review` | ATS resume scoring and review |
| `/ask-ai` | AI career assistant chat |
| `/templates` | Resume template gallery |
| `/resources` | Career resources for VLSI engineers |
| `/ats-resume-checker` | SEO landing page |
| `/ai-resume-builder` | SEO landing page |
| `/about` | About ElectroBridge |
| `/contact` | Contact page |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/ai/chat` | POST | AI career assistant (grounded in Supabase) |
| `/api/ai/enhance` | POST | AI resume enhancement |
| `/api/resume` | POST | Resume PDF parsing |
| `/api/resume/ai-suggest` | POST | AI resume suggestions |
| `/api/profile/parse-resume` | POST | Resume text extraction |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run test suite |
| `npm run lint` | Lint the workspace |
| `npm run typecheck` | Type-check the workspace |

## License

MIT
