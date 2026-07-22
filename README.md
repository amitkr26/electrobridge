# ⚡ ElectroBridge — Semiconductor & VLSI Opportunity Aggregator

> **The Dedicated Opportunity & News Aggregator for Semiconductor, Electronics, and Hardware Engineers.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-emerald)](https://supabase.com/)
[![Status](https://img.shields.io/badge/Production%20Status-100%25%20Verified%20%26%20Live-brightgreen)](https://electrobridge.vercel.app/)

---

## 🚀 Overview & Product Scope

**ElectroBridge** is a standalone, high-performance opportunity and news aggregator for the electronics and semiconductor ecosystem. It continuously ingests, cleans, and verifies job openings, JRF/SRF fellowships, PhD programs, and industry news across 100+ official corporate and research portals.

### 🌟 Core Features

1. 💼 **Verified Opportunity Engine (`/opportunities`)**
   - Ingests postings across **DRDO, ISRO, CSIR, IITs, IISc, BARC, TSMC, Intel, Qualcomm, NVIDIA, AMD, Texas Instruments, Tata Electronics, Arm, ASML, Synopsys, Cadence**, etc.
   - **Direct Official Links**: Every listing links directly to the official organization application portal.
   - Category filtering (*JRF, SRF, PhD, Govt Jobs, Corporate Openings, Fellowships, Internships*).

2. 📰 **Live Semiconductor News Engine (`/news`)**
   - Automated RSS scraper engine parsing **IEEE Spectrum, Semiconductor Engineering, EE Times, Electronics Weekly, SemiWiki, and Electronics For You**.
   - Executive summaries with direct **"Visit Official Article Source"** links (`target="_blank"`).

3. 🏢 **Organization Directory (`/organizations`)**
   - Searchable directory of semiconductor foundries, IDMs, fabless design houses, research labs, and universities.

4. ⚙️ **Automated Scrapers & Admin Panel (`/admin`)**
   - Built-in ATS adapters (Greenhouse, Lever, SmartRecruiters) and HTML scrapers.
   - Admin control panel to monitor scraper health, trigger ingestion cycles, and audit active postings.

---

## 🛠️ Repository Structure

```text
ElectroBridge/
├── frontend/                     # Next.js 14 Web Application (App Router)
│   ├── src/app/                  # Routes: /, /opportunities, /news, /organizations, /resources, /admin
│   ├── src/components/           # Navbar, Opportunity Cards, News Cards, Admin Panels
│   └── src/lib/scrapers/         # ATS Adapters, HTML Scrapers, RSS Parsers, Cleaners
├── scripts/
│   └── auto-daily-scraper.js     # Automated Daily Scraper Service
└── vercel.json                   # Automated Cron Configurations
```

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/amitkr26/electrobridge.git
cd electrobridge/frontend

# Install dependencies and start local dev server
npm install
npm run dev
```

Live Production Site: **[https://electrobridge.vercel.app/](https://electrobridge.vercel.app/)**
