# ElectroBridge — Build Prompt History (v2.0)

This document records the Phase 2 build prompt used to create category pages, resource guides, news detail pages, mobile hamburger menu, navbar dropdowns, contact page, about page redesign, and technical SEO completions.

All phases below are now **COMPLETED**.

---

## Phase 1: Category Pages (7 pages) ✅

`/category/[category]/page.tsx` with:
- jrf, srf, phd, govt-job, fellowship, private, international
- SEO H1/description, DB-filtered opportunity grid
- Category-specific FAQ with FAQPage schema
- Related resource links

## Phase 2: Resource Pages ✅

- `/resources/page.tsx` — hub with guide cards + stipend table
- `/resources/jrf-guide/page.tsx` — full guide with FAQPage schema + live feed
- `/resources/international-fellowships/page.tsx` — comparison table + live feed
- `/resources/vlsi-careers/page.tsx` — roles/companies/salaries + live feed
- `/resources/net-vs-gate/page.tsx` — comparison table + FAQ schema

## Phase 3: News Detail Pages ✅

- `ALTER TABLE news_articles ADD COLUMN slug text;`
- `/news/[slug]/page.tsx` — breadcrumb, header, summary, "Read Original" button, related news + related opportunities
- NewsArticle JSON-LD schema

## Phase 4: About Page ✅

- `/about/page.tsx` — mission, stats cards (500+, 50+, 1000+, 10K+), coverage grid, 4-step verification process, 6 platform FAQs, contact CTA
- WebSite + FAQPage schema

## Phase 5: Mobile Hamburger Menu ✅

- Full-screen overlay with grouped sections, all links, subscribe CTA
- Body scroll lock on open

## Phase 6: Navbar Dropdowns ✅

- Opportunities dropdown (7 sub-links)
- Resources dropdown (5 sub-links)
- Full-screen mobile overlay

## Phase 7: Contact Page ✅

- `/contact/page.tsx` with suggestions form
- Saves to `suggestions` table
- Type, URL, notes, email fields

## Phase 8: Technical SEO ✅

- Updated `sitemap.ts` with all pages
- Updated `Footer.tsx` with all links
- JSON-LD schema on all page types
- Migration `20260501000005` applied (news slug + suggestions table)

## Build Order Used

1. SQL migration (news slug + suggestions table)
2. Category pages (7 pages)
3. Resource hub + 4 guide pages
4. News detail pages
5. About page redesign
6. Mobile hamburger menu
7. Navbar dropdowns
8. Contact page
9. Sitemap + footer updates
10. TypeScript check + commit + push
