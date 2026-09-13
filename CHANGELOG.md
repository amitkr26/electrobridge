# Changelog

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
