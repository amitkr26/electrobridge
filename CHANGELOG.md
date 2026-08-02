# Changelog

## [1.0.0] - 2026-08-02

### Added
- electrobridge: pure opportunity aggregator for the semiconductor & VLSI community
- Automated scraping (India, global, news) via Vercel Cron
- Opportunity detail pages, sharing, calendar export, similar suggestions
- Weekly email digest (optional)
- Enhanced Supabase schema: verification, slugs, link-check logging

### Removed (previous BerojgarDegreeWala-era features)
- User accounts, auth, login/signup
- LinkedIn-style network (profiles, connections, messages, feed)
- AI features (chat, summaries, matching, classification)
- VLSI Academy, resume builder, admin dashboard
- Multi-database (2x Supabase + 2x Neon) reduced to single Supabase + Neon

### Changed
- Brand renamed to electrobridge
- Middleware: removed auth gating, kept security headers + rate limiting