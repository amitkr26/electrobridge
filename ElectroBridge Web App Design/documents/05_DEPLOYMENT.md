# Deployment (MVP)

## Architecture

| Component | Platform | Stack | Build Command | Start Command |
|-----------|----------|-------|---------------|---------------|
| Frontend | Netlify | Next.js 15, static export | `npm run build` → `out/` | Static hosting |
| Backend | Render | Express 5, `tsx` runtime | `npm install` | `npx tsx src/index.ts` |
| Database | Supabase | PostgreSQL, RLS | — | Cloud |

## Frontend (Netlify)

### Build Settings
```
Root: frontend/
Build: npm run build
Publish: out/
```

Uses `next.config.ts` with `output: 'export'`. All pages are pre-rendered static HTML deployed via zip upload or CI.

### Deploy Methods

**1. Zip Upload (manual):**
```
zip -r out.zip out/
curl -H "Authorization: Bearer $NETLIFY_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary @out.zip \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys"
```

**2. GitHub Actions (auto):** `.github/workflows/deploy.yml` — trigger on push to main. Currently needs working `NETLIFY_AUTH_TOKEN`.

### API Proxy
`public/_redirects` routes `/api/*` → `https://electrobridge-api.onrender.com/api/:splat`

## Backend (Render)

### Web Service
```
Name: electrobridge-api
ID: srv-d91ojvi8qa3s73b00na0
URL: https://electrobridge-api.onrender.com
Root: ElectroBridge Web App Design/backend
Build: npm install
Start: npx tsx src/index.ts
Health: /health
Runtime: Node
Plan: Free (Oregon)
```

### Env Vars (13 configured)
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `GROQ_API_KEY`, `ADMIN_PASSWORD`, `CORS_ORIGIN`, `PORT`, plus frontend vars.

### No Cron Jobs
MVP has no cron infrastructure. Data added manually via admin panel or direct DB insert.

## Database (Supabase)

**Project:** `ElectroBridge` (`jbqjipwanfsxyqkfrrpx`) — Singapore region

**Migrations Applied:**
- `20260630000001_base_schema.sql` — 11 base tables
- `20260630000002_extensions.sql` — pgcrypto, slug triggers
- `20260630000003_rls_policies.sql` — Row-level security

**Seed Data:** 5 opportunities, 5 news articles

Neon database still connected for health check but analytics schema not actively in use.

## CI/CD

### GitHub Actions
- `ci.yml` — lint + build on push/PR to main
- `deploy.yml` — build + zip + POST to Netlify API (token currently denied)

### Branch
- `main` → production (single branch)

## Monitoring
- Render dashboard for backend logs
- Supabase dashboard for DB queries
- Netlify analytics for frontend traffic
