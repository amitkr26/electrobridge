# electrobridge

**Verified Opportunity Engine for the Semiconductor & VLSI Industry**

electrobridge is a streamlined, AI-powered opportunity aggregator built exclusively for the semiconductor, VLSI, and electronics engineering community in India. It centralizes JRF positions, PhD admissions, government jobs (DRDO, ISRO, CSIR), and private sector roles into a single, high-performance platform.

## Features

- **Live Ingestion**: Aggregates verified opportunities from 100+ organizations across India.
- **Smart Categorization**: Opportunities are classified into specific categories (JRF, SRF, PhD, Govt, Fellowship, Private, International).
- **Fast Search & Filtering**: Client-side filtering and rapid search to find the exact roles you need quickly.
- **Professional Design**: Premium modern UI built with Tailwind CSS, featuring subtle micro-animations and a unified design system.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons.
- **Typography**: Inter (Body), Space Grotesk (Display).
- **Deployment**: Vercel.

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd electrobridge/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the `frontend` directory based on `.env.example` (if provided). You will need Supabase credentials to fetch real opportunities.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`.

## Architecture Scope

electrobridge is intentionally scoped as a **pure opportunity aggregator**. It is a standalone, finished project designed to cleanly demonstrate modern Next.js frontend capabilities and integration with a backend data engine.
