# TASKS.md — ElectroBridge (ALL DONE ✅)

## ALL ENGINEERING TASKS COMPLETE ✅

| Task | Status | Details |
|------|--------|---------|
| Sonner toasts | ✅ | Subscribe, report, contact, admin forms |
| Error/404 pages | ✅ | Global + route-level |
| Loading skeletons | ✅ | 4 routes + LoadingSkeleton component |
| Google Fonts dedup | ✅ | Removed @import |
| Input validation | ✅ | Email, UUID, length limits |
| SEO metadata | ✅ | All pages have proper meta |
| Admin: edit/delete/add | ✅ | Full CRUD for opps + news |
| Sitemap guard | ✅ | Falls back to static URLs |
| Rate limiting | ✅ | 3 req/IP/hr on subscribe |
| ISR detail pages | ✅ | generateStaticParams + revalidate |
| Homepage stats | ✅ | 6 cards, proper counts |
| News dedup | ✅ | check-then-insert + cleanup API |
| Plausible Analytics | ✅ | Script in layout |
| Resources hub | ✅ | 5 guide pages with live DB feeds |
| Categories page | ✅ | 6 cards with live counts |
| NET vs GATE page | ✅ | Full comparison, FAQPage schema, live feed |
| PhD guide page | ✅ | Routes, institutions, funding, timeline |
| Navbar/Footer | ✅ | Resources dropdown with all 5 guides |
| Opportunity RSS | ✅ | Replaced FindAPhD (CF-blocked) with 3 working feeds |

## STILL NEEDED (manual — YOU do these, not OpenCode)

1. **Fix .env.local security** — rotate SUPABASE_SERVICE_ROLE_KEY, add to .gitignore, scrub git history
2. **Enable AI** — sign up at groq.com, add GROQ_API_KEY to Vercel
3. **Enable email digest** — sign up at resend.com, add RESEND_API_KEY + FROM_EMAIL
4. **Telegram bot** — @BotFather, add TELEGRAM_BOT_TOKEN + TELEGRAM_CHANNEL_ID
5. **Run supabase-cleanup.sql** in Supabase SQL Editor (adds unique constraint, dedup news)
6. **Hit POST /api/cleanup-news** with `Authorization: Bearer CRON_SECRET` to deduplicate

## PRIORITY
S1 (security) > S2 (groq AI) > S3 (resend email) > S4 (telegram) > DB cleanup
