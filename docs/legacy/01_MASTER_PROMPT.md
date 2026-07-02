# ElectroBridge — Complete Build Prompt for OpenCode

## ROLE & GOAL
You are a senior full-stack developer. Build a complete, production-ready web platform called **ElectroBridge** — a one-stop aggregator for the electronics and semiconductor community. The platform must aggregate job postings, JRF/PhD positions, government research jobs, technology news, and industry trends from across the web and present them in a clean, filterable dashboard.

**Primary audience:** Electronics engineers, semiconductor researchers, MSc/PhD students in India and globally, looking for opportunities (JRF, SRF, PhD, Govt jobs, private jobs) and industry news.

## TECH STACK (ALL FREE TIER)
- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL + RLS)
- **Deployment:** Vercel (root directory: `electrobridge/`)
- **Styling:** Tailwind CSS (dark theme)
- **AI:** Multi-provider fallback (Groq, Gemini, OpenRouter, Cloudflare, HuggingFace)
- **Package manager:** npm

## COMPLETE FEATURE LIST

### 1. OPPORTUNITY AGGREGATOR
- JRF / SRF / PhD / Govt Jobs / Private Sector / Fellowships / International
- Filters: category, eligibility, location, deadline, search
- Verification system (verified/unverified/link_unavailable/expired)
- Auto link-checking with HTTP status tracking
- Slug-based URLs for SEO
- Calendar export (.ics)

### 2. TECHNOLOGY NEWS FEED
- 18 electronics-specific RSS sources
- Multi-layer filter: hard blocklist → keyword whitelist → AI relevance (optional)
- Auto-tagging with 20+ electronics tags
- Detail pages with NewsArticle schema

### 3. CATEGORY PAGES (7)
JRF, SRF, PhD, Govt Job, Fellowship, Private, International — each with:
- SEO-optimized H1/description
- DB-filtered opportunity grid
- Category-specific FAQ with FAQPage schema
- Related resource links

### 4. RESOURCE GUIDES (4 + hub)
- JRF Complete Guide (FAQPage schema, stipend table, live feed)
- International Fellowships (DAAD/SINGA/MEXT/Marie Curie comparison)
- VLSI Career Guide (roles/companies/salary tables)
- NET vs GATE Comparison

### 5. AI FEATURES
- Multi-provider fallback engine (`lib/ai/providers.ts`)
- Smart Summarizer (admin auto-fill)
- Opportunity Matcher (`/match` page)
- News relevance filter
- AI Insights on detail pages
- Smart Search (natural language → filters)
- Weekly AI-generated newsletter digest
- AI Chatbot (`/chat` page)
- Auto-Expire Checker (cron endpoint)
- Usage logging to `ai_usage_log` table
- Admin AI Analytics tab (provider/feature charts)

### 6. ORGANIZATION PAGES
- Per-org opportunity listings
- SEO-optimized org detail pages

### 7. USER FEATURES
- Email alerts / weekly digest
- Share buttons (WhatsApp, Twitter, Copy Link)
- Report issues on opportunities

### 8. ADMIN PANEL
- Dashboard with stats
- Add/edit/expire/manual opportunity entry
- AI Auto-Fill button (pastes raw text → AI fills fields)
- AI Usage analytics tab (provider bar chart, feature breakdown, recent log)
- Subscriber list management
- Trigger scrape / check links / generate digest actions

## DATABASE SCHEMA (Supabase — use migrations)

All migrations are in `supabase/migrations/`:

### opportunities table
```sql
create table opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  organization text not null,
  category text not null, -- 'JRF', 'SRF', 'PhD', 'Govt Job', 'Private Job', 'Fellowship'
  location text,
  stipend text,
  deadline date,
  eligibility text,
  description text,
  apply_link text,
  source_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  posted_at timestamp with time zone,
  tags text[],
  slug text unique,
  org_slug text,
  verification_status text default 'unverified',
  verified_at timestamp with time zone,
  official_page_url text,
  apply_link_type text,
  last_link_checked timestamp with time zone,
  link_check_status integer,
  admin_notes text
);
```

### news_articles table
```sql
create table news_articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text,
  source text,
  source_url text,
  published_at timestamp with time zone,
  image_url text,
  tags text[],
  created_at timestamp with time zone default now(),
  slug text unique
);
```

### subscribers table
```sql
create table subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  keywords text[],
  categories text[],
  created_at timestamp with time zone default now(),
  is_active boolean default true
);
```

### suggestions table
```sql
create table suggestions (
  id uuid default gen_random_uuid() primary key,
  type text,
  url text,
  notes text,
  contact_email text,
  submitted_at timestamp with time zone default now(),
  is_reviewed boolean default false
);
-- RLS: Anyone can insert, admin can read
```

### ai_usage_log table
```sql
create table ai_usage_log (
  id uuid default gen_random_uuid() primary key,
  feature text not null,
  provider text not null,
  model text,
  prompt_length integer,
  response_length integer,
  success boolean default true,
  error_message text,
  created_at timestamp with time zone default now()
);
```

### Additional tables
- `saved_opportunities` (user bookmarks, needs Supabase Auth)
- `link_check_logs` (HTTP status history)
- `opportunity_reports` (user-submitted issue reports)

## FOLDER STRUCTURE

```
electrobridge/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   ├── opportunities/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── category/[category]/page.tsx
│   ├── news/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── [slug]/page.tsx
│   ├── match/page.tsx
│   ├── chat/page.tsx
│   ├── organizations/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── resources/
│   │   ├── page.tsx
│   │   ├── jrf-guide/page.tsx
│   │   ├── international-fellowships/page.tsx
│   │   ├── vlsi-careers/page.tsx
│   │   └── net-vs-gate/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── admin/page.tsx
│   └── api/
│       ├── opportunities/route.ts
│       ├── news/route.ts
│       ├── news/scrape/route.ts
│       ├── ai/match/route.ts
│       ├── ai/chat/route.ts
│       ├── ai/search/route.ts
│       ├── ai/opportunity-summary/[slug]/route.ts
│       ├── ai/expire/route.ts
│       ├── subscribe/route.ts
│       ├── seed/route.ts
│       └── calendar-export/[id]/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── OpportunityCard.tsx
│   ├── NewsCard.tsx
│   ├── FilterBar.tsx
│   ├── SearchBar.tsx
│   ├── CategoryBadge.tsx
│   ├── DeadlineCountdown.tsx
│   ├── VerificationBadge.tsx
│   ├── ApplyButton.tsx
│   ├── ShareButtons.tsx
│   ├── SimilarOpportunities.tsx
│   ├── AIOpportunitySummary.tsx
│   └── ...
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   ├── ai/
│   │   ├── providers.ts
│   │   ├── summarizer.ts
│   │   ├── matcher.ts
│   │   └── ...
│   └── scrapers/
│       ├── news-filter.ts
│       └── ...
├── types/index.ts
├── supabase/migrations/
├── .env.local
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## ENVIRONMENT VARIABLES (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADMIN_PASSWORD=electrobridge2026
CRON_SECRET=mysecretcron2026
GROQ_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
CLOUDFLARE_AI_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```

## RSS SOURCES (18 sources)

IEEE Spectrum, Semiconductor Engineering, EE Times, Electronics Weekly, Chip Design Magazine, SemiWiki, Electronics For You, AnandTech, The Register — Hardware, Nature Electronics, Science Daily — Semiconductors, Science Daily — Electronics, Phys.org — Semiconductors, Phys.org — Electronics, India Semiconductor Mission, IESA News.

## UI DESIGN

**Colors:** `#0A0F1E` navy bg, `#00D4FF` cyan accent, `#7B2FBE` purple  
**Typography:** Space Grotesk (display), Inter (body)  
**Dark mode only**

## BUILD ORDER

1. Initialize Next.js with TypeScript + Tailwind
2. Install dependencies
3. Create Supabase client + types
4. Build all API routes
5. Build all components (Navbar with dropdowns, Footer, cards, etc.)
6. Build all pages (homepage, opportunities, detail, news, category, resources, about, contact, match, chat, admin)
7. Create seed data
8. Test locally (`npm run dev`)
9. Apply Supabase migrations (`npx supabase db push`)
10. Prepare for Vercel deployment (set root to `electrobridge/`)

## IMPORTANT NOTES
- Use `use client` only where necessary (filters, search, interactive components)
- Server components for SEO pages
- Handle loading and error states on every page
- SEO meta tags + JSON-LD schema on every page
- Mobile-first responsive design
- All AI features gracefully degrade if API keys are missing
