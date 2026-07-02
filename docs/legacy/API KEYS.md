# API Keys — Reference (REDACTED)

All API keys have been redacted from this file. Current keys are stored in:

- `.env.local` (local development, gitignored)
- Vercel Environment Variables (production)

## How to Get New Keys

See [02_API_KEYS_GUIDE.md](./02_API_KEYS_GUIDE.md) for detailed instructions on obtaining API keys from each provider.

## Required Keys

| Provider      | Env Variable               | Source                         |
|---------------|----------------------------|--------------------------------|
| Groq          | `GROQ_API_KEY`             | console.groq.com               |
| Gemini        | `GEMINI_API_KEY`           | aistudio.google.com            |
| OpenRouter    | `OPENROUTER_API_KEY`       | openrouter.ai                  |
| HuggingFace   | `HUGGINGFACE_API_KEY`      | huggingface.co/settings/tokens |
| Cloudflare AI | `CLOUDFLARE_AI_TOKEN`      | dash.cloudflare.com            |
| Cloudflare    | `CLOUDFLARE_ACCOUNT_ID`    | dash.cloudflare.com (My Profile)|
| Supabase URL  | `NEXT_PUBLIC_SUPABASE_URL` | supabase.com → Settings → API  |
| Supabase Anon | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase.com → Settings → API |
| Supabase SR   | `SUPABASE_SERVICE_ROLE_KEY`| supabase.com → Settings → API  |
| Admin Password| `NEXT_PUBLIC_ADMIN_PASSWORD`| Set your own                  |
| Cron Secret   | `CRON_SECRET`              | Set your own                  |
