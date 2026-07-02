# Environment Variables (MVP)

## Frontend (Netlify / .env.local)

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | ✓ | `http://localhost:4000/api` (dev) or `https://electrobridge-api.onrender.com/api` (prod) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | `https://jbqjipwanfsxyqkfrrpx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | Supabase anon JWT |
| `NEXT_PUBLIC_SITE_URL` | | `http://localhost:3000` (dev) or `https://electrobridge.netlify.app` (prod) |

## Backend (Render / .env)

| Variable | Required | Status |
|----------|----------|--------|
| `SUPABASE_URL` | ✓ | ✅ Set |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | ✅ Set (service role JWT) |
| `DATABASE_URL` | ✓ | ✅ Set (Neon connection string) |
| `GROQ_API_KEY` | ✓ | ✅ Set |
| `ADMIN_PASSWORD` | ✓ | ✅ Set |
| `CORS_ORIGIN` | | ✅ Set — `https://electrobridge.netlify.app` |
| `PORT` | | `4000` (default) |

### Removed (not needed for MVP)
- `GEMINI_API_KEY` — single provider (Groq only)
- `OPENROUTER_API_KEY` — single provider
- `RESEND_API_KEY` — no email pipeline
- `CRON_SECRET` — no cron infrastructure
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHANNEL_ID` — no telegram
- `NEXT_PUBLIC_ADMIN_PASSWORD` — renamed to server-only `ADMIN_PASSWORD`

## Local Development

```
# Backend (.env)
PORT=4000
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://jbqjipwanfsxyqkfrrpx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=gsk_your_key
ADMIN_PASSWORD=your_admin_password

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://jbqjipwanfsxyqkfrrpx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Security Notes
- NEVER commit `.env` or `.env.local` (gitignored by `.env*` pattern)
- `.env.example` files are tracked — keep placeholders only
- `SUPABASE_SERVICE_ROLE_KEY` has full DB access — never expose client-side
- `GROQ_API_KEY` is server-side only
- `ADMIN_PASSWORD` is server-side only (removed `NEXT_PUBLIC_` prefix for security)
