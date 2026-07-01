# ElectroBridge Legacy Codebase — READ ONLY

**Do not modify files in this directory.**

This codebase (`electrobridge/`) is the legacy Next.js 14 application. The active development has moved to:

**`ElectroBridge Web App Design/`** — Next.js 15 frontend + Express 5 backend (MVP)

## What migrated where

| Legacy (`electrobridge/`) | Active (`ElectroBridge Web App Design/`) |
|---|---|
| Next.js 14 pages + API routes | Next.js 15 frontend (static export) + Express 5 backend |
| Inline API routes in `src/app/api/` | Express route files in `backend/src/routes/` |
| `src/lib/` (AI, scrapers, supabase) | `backend/src/lib/` (same modules, refactored) |
| `src/components/` (28 files) | `frontend/src/components/` (9 files, simplified) |

## Duplicated modules (kept in sync manually)

The following are duplicated between both codebases and should only be edited in the active one:
- AI providers, scrapers, supabase client
- Component files with matching basenames (Footer, Navbar, OpportunityCard)

## Why it exists

This codebase is preserved for reference and contains:
- The original Figma refactoring history
- Pages not yet ported (categories, resources, profile, favorites)
- 25+ API routes with working implementations
- 6 incremental database migrations
