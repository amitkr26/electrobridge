# API Specification

## Base URLs

| Environment | Backend API (Render) |
|-------------|----------------------|
| Development | http://localhost:4000 |
| Production | https://electrobridge-api.onrender.com |

## Authentication

### Backend Admin Auth
- Admin endpoints protected with `ADMIN_PASSWORD` env var
- Header: `x-admin-token: <ADMIN_PASSWORD>`

## Endpoints

### Opportunities

```
GET /api/opportunities
  Query: ?category=&type=&location=&search=&tags=&verified=&sort=&page=&limit=
  Response: { data: Opportunity[], total: number, page: number }

GET /api/opportunities/[slug]
  Response: { data: Opportunity }

GET /api/opportunities/[id]
  Response: { data: Opportunity }

POST /api/opportunities (Admin)
  Body: Opportunity fields
  Response: { data: Opportunity }

PATCH /api/opportunities/[id] (Admin)
  Body: Partial<Opportunity>
  Response: { data: Opportunity }

DELETE /api/opportunities/[id] (Admin)
  Response: { success: true }
```

### News

```
GET /api/news
  Query: ?search=&tags=&category=&source=&page=&limit=
  Response: { data: NewsArticle[], total: number }

GET /api/news/[slug]
  Response: { data: NewsArticle }
```

### Organizations

```
GET /api/organizations
  Response: { data: { name: string, slug: string, count: number }[] }

GET /api/organizations/[slug]
  Response: { data: Organization }
```

### AI

```
POST /api/ai/chat
  Body: { message: string, history?: ChatMessage[] }
  Response: { data: { message: string, sources?: Opportunity[] } }

POST /api/ai/match
  Body: { skills: string[], interests: string[], experience?: string }
  Response: { data: { matches: Opportunity[], scores: number[] } }

GET /api/ai/search
  Query: ?q=natural+language+query
  Response: { data: Opportunity[] }

POST /api/ai/summarize
  Body: { text: string }
  Response: { data: { summary: string, keyPoints: string[] } }

GET /api/ai/opportunity-summary/[slug]
  Response: { data: { matchScore: number, skillGaps: string[], insights: string[] } }

GET /api/ai/expire
  Header: x-cron-secret
  Response: { data: { expired: number, updated: number } }
```

### Subscribers

```
POST /api/subscribe
  Body: { email: string, keywords?: string[], categories?: string[] }
  Rate Limit: 3/IP/hour
  Response: { data: { id: string } }

POST /api/unsubscribe
  Body: { email: string }
  Response: { success: true }
```

### Reports

```
POST /api/report-issue
  Body: { opportunityId: string, reason: string, details?: string, email?: string }
  Response: { data: { id: string } }

POST /api/suggestions
  Body: { name: string, email: string, message: string }
  Response: { data: { id: string } }
```

### Admin (Password Protected)

```
GET /api/admin/stats
  Response: { data: { totalOpportunities, totalNews, totalSubscribers, aiUsage } }

POST /api/admin/add-opportunity
  Body: Opportunity fields
  Response: { data: Opportunity }

POST /api/admin/add-news
  Body: NewsArticle fields
  Response: { data: NewsArticle }

POST /api/admin/recheck-link
  Body: { opportunityId: string }
  Response: { data: LinkCheckResult }
```

### Scraping (Cron Protected)

```
GET /api/scrape?mode=all
  Header: x-cron-secret
  Response: { data: { scraped: number, updated: number, errors: string[] } }

GET /api/scrape-opportunities
  Header: x-cron-secret
  Response: { data: { scraped: number, errors: string[] } }

GET /api/check-links
  Header: x-cron-secret
  Response: { data: { checked: number, broken: number } }

GET /api/cleanup-news
  Header: x-cron-secret
  Response: { data: { removed: number } }

GET /api/send-digest
  Header: x-cron-secret
  Response: { data: { sent: number, failed: number } }
```

### Feed & Export

```
GET /api/opportunities-feed
  Response: RSS/JSON feed of opportunities

GET /api/track-click
  Query: ?id=opportunity_id
  Response: Redirect to apply link
```

## Shared Types

```typescript
interface Opportunity {
  id: string;
  title: string;
  organization: string;
  org_slug?: string;
  category: string;
  type: 'Internship' | 'Full-time' | 'Fellowship' | 'PhD' | 'Trainee' | 'Research';
  description: string;
  location: string;
  stipend?: string;
  min_stipend?: number;
  max_stipend?: number;
  currency?: string;
  deadline: string;
  degree_requirement?: string;
  eligibility?: string;
  tags: string[];
  source_url: string;
  apply_link?: string;
  apply_link_type?: 'direct' | 'homepage' | 'pdf' | 'email' | 'portal';
  source: string;
  slug: string;
  verification_status: 'verified' | 'unverified' | 'expired' | 'flagged';
  is_active: boolean;
  is_featured: boolean;
  posted_at: string;
  created_at: string;
  updated_at: string;
}

interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  source: string;
  source_url: string;
  source_site?: string;
  image_url?: string;
  tags: string[];
  category?: string;
  slug: string;
  published_at: string;
  created_at: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}
```
