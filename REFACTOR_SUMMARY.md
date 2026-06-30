# ElectroBridge Figma Design Refactoring — Complete Summary

## Overview
Refactored the ElectroBridge UI to match the Figma design specification (`ElectroBridge Web App Design/`). All visual tokens, component styles, spacing, typography, shadows, and hover effects now match the Figma prototype exactly.

---

## Files Created

| File | Purpose |
|------|---------|
| `src/lib/design-tokens.ts` | Exported Figma token constants for reference |
| `REFACTOR_SUMMARY.md` | This file |

## Files Modified

### Design System Foundation (3 files)

| File | Changes |
|------|---------|
| `tailwind.config.ts` | Added Figma color palette (background/foreground/card/primary/secondary/muted/accent/destructive/success/warning), fonts (Inter + Space Grotesk + Geist Mono), boxShadow (card/card-hover/glow-cyan/glow-sm), backgroundImage gradients |
| `src/app/globals.css` | Added CSS custom properties for all Figma tokens, Google Fonts import, scrollbar styling, base body styles |
| `next.config.js` | (added previously for Plausible analytics) |

### Components (12 files — visual styling only, no logic changes)

| Component | Figma Tokens Applied |
|-----------|---------------------|
| `Navbar.tsx` | bg `#0B1120/90`, border `#1F2937`, logo cyan accent, active nav `bg-[#00E5FF]/10` |
| `Footer.tsx` | border `#1F2937`, link hover white, brand with cyan accent |
| `OpportunityCard.tsx` | card bg `#1A2438`, border `#1F2937`, hover glow + translateY, cyan bookmark |
| `NewsCard.tsx` | same card pattern as OpportunityCard, source dot colors |
| `SearchBar.tsx` | input bg `#111827`, border `#1F2937`, focus-within `#00E5FF/40` |
| `SubscribeSection.tsx` | Figma input/button styling |
| `DeadlineCountdown.tsx` | urgency colors: destructive `#EF4444`, warning `#F59E0B` |
| `ShareButtons.tsx` | Figma button/card styling |
| `LoadingSkeleton.tsx` | Figma card/skeleton colors |
| `StatsBar.tsx` | Figma stat card styling |
| `ExpiringSoon.tsx` | Figma card+urgency styling |

### Pages (16 files — visual styling only)

| Page | Old Classes → Figma Equivalents |
|------|-------------------------------|
| `app/page.tsx` | Complete Figma hero section: glow divs, grid SVG pattern, chip illustration, gradient text, CTA buttons with shadow-glow, stats strip, section alternation |
| `app/opportunities/page.tsx` | `text-white`, `text-[#94A3B8]`, `border-[#1F2937]`, `bg-[#111827]`, `bg-[#00E5FF]`, `text-[#0B1120]` |
| `app/opportunities/[slug]/page.tsx` | Same token replacements + `bg-[#1A2438]`, `bg-[#111827]`, `text-[#10B981]`, `text-[#EF4444]`, `text-[#F59E0B]` |
| `app/news/page.tsx` | Replaced `text-text-primary`/`text-text-muted`/`border-gray-700`/`bg-navy-light`/`bg-cyan`/`text-navy` → Figma hex |
| `app/news/[slug]/page.tsx` | Same + `bg-navy` → `bg-[#0B1120]` |
| `app/organizations/page.tsx` | Token replacements |
| `app/organizations/[slug]/page.tsx` | Token replacements |
| `app/categories/page.tsx` | Token replacements |
| `app/category/[category]/page.tsx` | Token replacements |
| `app/resources/page.tsx` | Token replacements |
| `app/chat/page.tsx` | Token replacements + bg/border fixes |
| `app/match/page.tsx` | Token replacements |
| `app/about/page.tsx` | Token replacements |
| `app/contact/page.tsx` | Token replacements |
| `app/admin/page.tsx` | Token replacements |

## Color Token Mapping

| Old Class | Figma Hex | Description |
|-----------|-----------|-------------|
| `text-text-primary` | `#FFFFFF` | Primary text (white) |
| `text-text-muted` | `#94A3B8` | Muted/secondary text |
| `bg-navy` | `#0B1120` | Page background |
| `bg-navy-light` | `#1A2438` | Card/section background |
| `bg-cyan` | `#00E5FF` | Primary brand color |
| `text-navy` | `#0B1120` | Text on cyan backgrounds |
| `text-cyan` | `#00E5FF` | Cyan text/badge text |
| `border-gray-800` | `#1F2937` | Default border |
| `border-gray-700` | `#1F2937` | Default border |
| `bg-gray-800` | `#111827` | Input/table bg |
| `text-green-400` | `#10B981` | Success/verified |
| `text-red-400` | `#EF4444` | Error/expired |
| `text-amber-400` | `#F59E0B` | Warning/urgent |

## Key Design Decisions

1. **All CSS variables from Figma `theme.css` mapped to Tailwind config** — classes like `text-white`/`bg-[#hex]` preferred over semantic tokens for exact matching
2. **Hover effects follow Figma exactly**: `hover:-translate-y-0.5`, `hover:shadow-[0_0_24px_rgba(0,229,255,0.08)]`, `hover:border-[#00E5FF]/30`
3. **Homepage hero**: Figma's SVG grid pattern, radial gradients, chip illustration, animated glow, gradient text, search bar with CTA
4. **Section alternation**: Light sections on `bg-[#0B1120]`, alt sections on `bg-[#111827]/30`
5. **Card design**: All cards use `bg-[#1A2438]` + `border-[#1F2937]` + `rounded-xl` (12px) + `rounded-2xl` (16px for larger cards)
6. **Deadline urgency**: Uses exact Figma destructive (`#EF4444`) and warning (`#F59E0B`) values
7. **Fonts**: Inter (400-900) primary, Space Grotesk (400-700) for display, Geist Mono for technical text

## Build Verification

- `npm run build` — **PASSES** with no TypeScript errors
- All pre-existing warnings (img elements, dynamic API routes, url.parse deprecation) are unrelated to this refactoring
