# Changelog

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