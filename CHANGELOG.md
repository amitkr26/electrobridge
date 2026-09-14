# Changelog

## [1.1.1] - 2026-09-14

### Fixed
- **Customize dead features wired up**: marginSize, sectionSpacing, dateFormat, pageSize now actually affect resume rendering
  - `getMarginClass()` maps compact/normal/relaxed to padding classes on the A4 canvas
  - `getSectionSpacingClass()` maps section spacing config to section margin-bottom
  - `formatDate()` utility parses common date formats (Jan 2024, 01/2024, YYYY) and respects dateFormat setting
  - PDF export uses `styleConfig.pageSize` (A4/Letter) instead of hardcoded "a4"
  - All 11 date-rendering spots in SectionContent + ModernSidebar now use `formatDate()`
  - SiliconTech template: removed hardcoded `mb-5` on SectionBlock to inherit sectionSpacing
- **useSpeechRecognition re-creation bug**: callback ref pattern prevents recognition object from being destroyed/recreated on every render (was causing voice input to break)
- **SavedView rate limit waste**: fetch now runs on mount only (component unmounts on tab switch, so each tab visit = one fetch), plus manual Refresh button added
- **DiscoverView rate limit burn**: removed auto-fetch on filter change; users now click "Search" or "Apply Filters" to trigger API calls, preventing accidental quota exhaustion
- **resume/route.ts crash**: added try/catch around PATCH/POST handlers to catch malformed JSON (SyntaxError) and validation errors
- **ask-ai/error.tsx**: now displays error.message to help debug production failures
- **ChatHeader nested `<header>`**: changed to `<div>` to avoid invalid HTML nesting inside page's `<header>`

### Changed
- **StyleCustomizer**: added Section Spacing control (Tight/Balanced/Airy) with visual segmented buttons
- **AI EmptyState redesigned**: "Career Copilot" with 4 task cards (Find Jobs, Improve Resume, Plan Career, Research & Government) + quick question pills
- **handleSelectPrompt**: clears input field after sending (was setting input to prompt text redundantly)

### Removed (dead code cleanup)
- `useSpeechSynthesis`: removed `pause`, `resume`, `isPaused` (never consumed by any component)
- `useChatSessions`: removed `clearAllSessions`, `allSessions` (exported but never used)
- `DiscoverView`: removed auto-fetch `useEffect` (replaced with explicit Search button)
- 5 dead imports across ask-ai components (cleared in prior commit, verified clean)

## [1.1.0] - 2026-09-13

### Added
- Resume builder with 10 professional templates, section reordering, custom labels, visibility toggles
- 5 new resume sections: Languages, Volunteer, Awards, Interests, consolidated Extras
- 11 total resume sections with completion progress indicator
- Real PDF export via html2pdf.js (SSR-safe dynamic import)
- JD keyword matching in ATS review (optional JD textarea, keyword extraction, match %)
- Cover letter design unification with resume accent color
- Fit-to-width preview with ResizeObserver-based auto-zoom
- Multi-resume management (My Resumes drawer)
- AI resume improvement diff modal
- AI resume advisor with target role selection
- Mobile navigation with slide-out drawer and icon links
- 6-column footer with all social profiles (LinkedIn, Instagram, YouTube, X, Facebook, Reddit, Pinterest)
- SEO metadata layout files for 6 client pages
- JSON-LD structured data on homepage (WebApplication schema)
- 2 new SEO landing pages: /ats-resume-checker, /ai-resume-builder
- Sitemap expanded from 3 to 11 routes
- robots.ts with AI crawler allow rules (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot)
- llms.txt describing the product correctly

### Fixed
- Production runtime errors: undefined.map, undefined.length defensive guards
- /api/opportunities 404: replaced dead endpoint with /api/ai/chat integration
- Temporal dead zone in ask-ai/page.tsx (messages variable before useEffect)
- ChatMessage defensive array guards on opportunities, sources, savedIds
- SavedView loading state and better empty state when saved IDs not found
- CSS phantom classes restored: glass-premium, btn-glow, bg-grid-pattern
- Footer duplicate link deduplication
- Mobile hamburger button with slide-out drawer
- middleware.ts: new URL(referer) crash on malformed headers (try/catch)
- AlertsManager: isScanning race condition (single boolean shared across alerts)
- SavedView: silent failure replaced with proper error state
- ask-ai route: added error.tsx boundary and loading.tsx skeleton

### Changed
- Landing page rewritten with clear product communication, feature comparison, workflow visualization
- Theme normalized: about, contact, resources, templates, 404, error pages all light theme
- Navigation improved with icons on all links
- Footer redesigned with integrated social profiles and custom SVG icons
- Root metadata updated: title "Free AI Career Platform for Engineers"
- llms.txt rewritten to describe ElectroBridge correctly
- Default resume data: "Alex Morgan" with example content

### Removed (repo cleanup)
- AGENTS.md (agent instructions, not part of app)
- opencode.json (opencode config, not part of app)
- neon/schema.sql (BDW leftover analytics schema)
- backend/api/openapi.json (923 lines of BDW-era API spec)
- backend/api/src/openapi/ (BDW openapi generator)
- frontend/supabase/seed/ (BDW organization seed data)
- backend/api/__tests__/openapi.test.ts (BDW openapi tests)
- frontend/src/lib/supabase/client.ts (dead file, unused)
- frontend/src/lib/supabase/server.ts (dead file, unused)
- frontend/src/types/index.ts (dead file, unused)
- 24 dead imports across 7 files (about, cover-letter, resume, ask-ai components, grounding)

## [1.0.0] - 2026-08-02

### Added
- ElectroBridge: AI resume builder + career assistant for semiconductor & VLSI engineers
- Resume builder with 10 professional templates (no login required)
- AI-powered resume enhancement, suggestions, and cover letter generation
- Ask AI chat assistant grounded in live opportunity database
- Resume review with ATS scoring
- Contact page with email support
- Weekly email digest (optional)

### Removed (previous BerojgarDegreeWala-era features)
- User accounts, auth, login/signup
- LinkedIn-style network (profiles, connections, messages, feed)
- Opportunity aggregation (moved to BerojgarDegreeWala)
- VLSI Academy / learning platform
- Admin dashboard

### Changed
- Brand renamed to ElectroBridge
- Middleware: removed auth gating, kept security headers + rate limiting
- All localStorage keys migrated from `bdw_` prefix to `eb_`
