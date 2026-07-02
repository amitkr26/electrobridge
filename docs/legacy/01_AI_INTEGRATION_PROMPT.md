# ElectroBridge — AI Integration Master Prompt
## Multi-Provider AI with Automatic Fallback System

You are an agentic coding assistant working exactly like Claude Code.
Loop until everything is complete. Fix all errors automatically. Never stop and ask permission.
Only stop when ALL tasks are 100% done.

Platform: ElectroBridge at https://electrobridge.vercel.app
Stack: Next.js 14 App Router + Supabase + Vercel (free tier)

Integrate AI features using multiple free AI APIs with automatic fallback.

═══════════════════════════════════════════════════
STEP 1: ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════

```env
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
CLOUDFLARE_AI_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```

═══════════════════════════════════════════════════
STEP 2: AI PROVIDER FALLBACK ENGINE
═══════════════════════════════════════════════════

Create `lib/ai/providers.ts` — the core fallback engine.

Provider priority: Groq → Gemini → OpenRouter → Cloudflare → HuggingFace

Functions to create:
- `callGroq()` — Llama 3.1 8B Instant, fastest
- `callGemini()` — Gemini 1.5 Flash, most capable
- `callOpenRouter()` — Llama 3.1 8B Free
- `callCloudflare()` — Llama 3.1 8B via Workers AI
- `callHuggingFace()` — Mistral 7B, slowest backup

Main export: `callAI(prompt, systemPrompt?, options?)` → tries providers in order, returns `{ text, provider, model }`.

Each call logs to `ai_usage_log` table (feature, provider, model, prompt_length, response_length, success, error_message).

═══════════════════════════════════════════════════
STEP 3: AI-POWERED FEATURES
═══════════════════════════════════════════════════

### FEATURE A: Smart Opportunity Summarizer (`lib/ai/summarizer.ts`)
- Takes raw description → returns JSON: clean_title, summary, eligibility_points, suggested_tags, stipend_extracted, deadline_extracted
- Admin panel gets "✨ AI Auto-Fill" button next to description

### FEATURE B: Personalized Opportunity Matching (`lib/ai/matcher.ts`)
- Takes user profile (qualification, specialization, NET/GATE, location, looking_for)
- Returns top 5 matches with score + reason
- `/match` page with form → calls `/api/ai/match` → shows ranked results

### FEATURE C: AI News Relevance Filter
- For scraped articles, AI decides if truly electronics-relevant
- Fast keyword check first (saves API credits)
- Falls back to AI for borderline cases

### FEATURE D: Opportunity Detail AI Summary
- `AIOpportunitySummary` component on detail pages
- Lazy loaded: user clicks "✨ Get AI Insights" → calls `/api/ai/opportunity-summary/[slug]`
- Shows: what you'll do, why apply, documents needed, tips, difficulty, career stage

### FEATURE E: Search with AI Understanding
- `/api/ai/search` — converts natural language to structured filters
- "DRDO thin film JRF Delhi NET" → `{ category: "JRF", tags: ["thin film"], location: "Delhi" }`
- Shows extracted filters as chips below search bar

### FEATURE F: Weekly AI-Curated Newsletter (`lib/ai/newsletter.ts`)
- `generateWeeklyDigest(opportunities, newsArticles)`
- Returns plain text: intro, opportunity spotlight, news roundup, closing
- Called from `lib/email-digest.ts` when building weekly emails

### FEATURE G: AI Chatbot (`/chat` + `/api/ai/chat`)
- System prompt: ElectroBridge Assistant for electronics researchers
- Suggestion chips: "Find JRF for NET Electronics", "DRDO vs CSIR", etc.
- Shows provider name subtly ("Powered by Groq")
- Full conversation history passed to AI

### FEATURE H: Auto-Expire Checker (`lib/ai/expiry-checker.ts`)
- Checks if deadline is past (fast path)
- For no-deadline opportunities, AI checks description for expiry language
- Cron endpoint at `/api/ai/expire`

═══════════════════════════════════════════════════
STEP 4: ADMIN PANEL — AI USAGE MONITOR
═══════════════════════════════════════════════════

Add "AI Usage" tab to `/admin` showing:
- Stats cards: total calls today/week, success rate, unique features
- Provider bar chart: calls per provider
- Feature bar chart: calls per feature
- Recent AI usage log table

═══════════════════════════════════════════════════
STEP 5: NAVBAR UPDATES
═══════════════════════════════════════════════════

Add: Opportunities (with dropdown) | News | Resources (with dropdown) | Find My Match | Ask AI | About

═══════════════════════════════════════════════════
BUILD ORDER — FOLLOW EXACTLY
═══════════════════════════════════════════════════

1. `lib/ai/providers.ts` (fallback engine)
2. Create `ai_usage_log` table in Supabase
3. Feature A: Summarizer + admin AI button
4. Feature B: Matcher + `/match` page
5. Feature C: News relevance filter
6. Feature D: Opportunity detail AI summary
7. Feature E: AI smart search
8. Feature F: Newsletter generator
9. Feature G: AI Chatbot + `/chat` page
10. Feature H: Auto-expire checker
11. Admin AI usage monitor
12. Update navbar

After done:
- List all files created/modified
- Confirm all 5 AI providers configured in fallback chain
- Provide `ai_usage_log` cleanup SQL (keep 30 days)
