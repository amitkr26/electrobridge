# ElectroBridge — Weekly Update Checklist
## Har Hafte 30 Minute Mein Platform Alive Rakhne Ka Tarika

---

## SOURCES TO CHECK EVERY WEEK

### Government Research (JRF/SRF/Project Posts)

| Organization | Website | What to Look For |
|-------------|---------|-----------------|
| ISRO URSC | ursc.gov.in/careers | JRF, Project Scientist |
| ISRO SAC | sac.gov.in | JRF, Research Associate |
| DRDO (all labs) | drdo.gov.in/careers | JRF, RA, Scientist B |
| DRDO SSPL Delhi | sspl.drdo.gov.in | Thin film, electronics posts |
| CSIR-NPL Delhi | nplindia.org/careers | Walk-in interviews |
| CSIR-CEERI Pilani | ceeri.res.in | Electronics research posts |
| BARC Mumbai | barc.gov.in/recruitment | Research fellowships |
| IIT Delhi IRD | ird.iitd.ac.in | Project positions |
| IIT Bombay | ircc.iitb.ac.in | Project research posts |
| IIT Madras | research.iitm.ac.in | All research positions |
| NIT (all) | nit.ac.in (check each) | JRF, project posts |
| IISER (all) | iiser websites | PhD, JRF |
| TIFR | tifr.res.in/~graduate | JRF, RA |

### International PhD & Fellowships

| Source | Website | Frequency |
|--------|---------|-----------|
| DAAD Scholarships | daad.de/en/study-and-research-in-germany | Weekly |
| SINGA Singapore | a-star.edu.sg/Scholarships | Monthly |
| FindAPhD | findaphd.com (search: semiconductor, electronics) | Weekly |
| MEXT Japan | studyinjapan.go.jp | Yearly (March-May) |
| Marie Curie | ec.europa.eu/research/mariecurieactions | Monthly |

### Private Sector Jobs (India)

| Source | Search Keywords |
|--------|----------------|
| linkedin.com/jobs | "VLSI engineer", "embedded systems", "semiconductor" |
| naukri.com | Electronics engineer, VLSI design, chip design |

---

## WEEKLY CHECKLIST (30 min)

### Monday: Govt Research Check (15 min)
- [ ] Check DRDO careers page
- [ ] Check CSIR NPL walk-in schedule
- [ ] Check ISRO URSC/SAC
- [ ] Add any new positions to admin panel

### Wednesday: International Opportunities (10 min)
- [ ] Check FindAPhD for new electronics/semiconductor PhDs
- [ ] Check DAAD for new scholarships
- [ ] Add relevant ones to platform

### Friday: Cleanup + AI Check (5 min)
- [ ] Check admin AI Usage tab — any provider near limit?
- [ ] Mark expired opportunities (or run auto-expire cron)
- [ ] Quick scan for broken links from user reports

---

## ADMIN PANEL QUICK REFERENCE

URL: `https://electrobridge.vercel.app/admin`
Password: `electrobridge2026`

### Tabs

1. **Dashboard** — Stats: total opportunities, active, verified, news count
2. **Add Opportunity** — Manual entry form with "✨ AI Auto-Fill" button
3. **AI Usage** — Provider usage chart, feature usage chart, recent log
4. **Subscribers** — Email subscriber list with dates
5. **Actions** — Trigger news scrape, check all links, generate weekly digest

---

## AI PROVIDER MONITORING

AI Usage tab mein dekho:
- **Provider bar chart** — Groq, Gemini, etc. ka usage
- **Feature bar chart** — kaunsa feature kitna use ho raha
- **Recent log** — last 50 AI calls with status

Agar koi provider fail ho raha hai:
1. Check ki uski API key sahi hai
2. Providers.ts mein priority order adjust karo
3. Naya API key le lo aur update karo

---

## ADDING AN OPPORTUNITY

1. Admin panel → "Add Opportunity"
2. Title, Organization, Category, Location, Stipend bharo
3. Description mein raw text paste karo (notification se copy)
4. **"✨ AI Auto-Fill" click karo** — AI suggested tags + cleaned title + eligibility extract karega
5. Review karo, adjust karo, "Save" karo

---

## GROWING THE PLATFORM

### Month 1-2: Foundation
- Platform live karo
- 50+ opportunities seed karo
- Social media accounts banao

### Month 3-4: Community
- LinkedIn page: "ElectroBridge — Electronics & Semiconductor Opportunities"
- Telegram channel: "@electrobridge"
- Weekly post: "Top 5 JRF/PhD openings this week"
- Reddit: r/indianacademia, r/electronics mein share karo

### Month 5-6: Monetization (Optional)
- Google AdSense (electronics audience = high CPM ₹300-800)
- Sponsored job listings
- Premium email alerts

---

## PLATFORM GROWTH TARGETS

| Month | Visitors/Day | Email Subscribers | Opportunities |
|-------|-------------|-------------------|---------------|
| 1 | 50 | 20 | 50 |
| 3 | 200 | 100 | 150 |
| 6 | 500 | 300 | 300 |
| 12 | 2000 | 1000 | 500+ |

---

## VERCEL DEPLOY ISSUES

Agar Vercel deploy BLOCKED show kare:
- **Cause:** Hobby plan limit — ~20 rapid deploys in one session triggers block
- **Fix:** Wait 1-2 hours for queue to clear, then deploy again
- **Permanent fix:** Upgrade to Pro ($20/month) for instant deploys
- **Alternative:** Deploy to [Render.com](https://render.com) (free tier, no deploy limit)

---

## YOUR UNFAIR ADVANTAGE

Tumhare paas hai:
- Electronics + semiconductor background (authentic voice)
- UGC-NET qualification (credibility)
- Personal experience searching for JRF/PhD
- Delhi/India perspective + international research connections

Yeh platform tumhari personal credibility se grow karega — tum "just a website" nahi ho, tum us community ke member ho jisko tum serve kar rahe ho.
