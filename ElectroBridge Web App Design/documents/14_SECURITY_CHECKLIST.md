# Security Checklist

## Environment & Secrets

- [x] No secrets committed to version control
- [x] `.env*` in `.gitignore` (except `.env.example`)
- [x] Environment variables set via platform dashboard (Netlify, Render)
- [x] API keys restricted to specific origins where possible
- [x] Service role keys never exposed to client
- [x] Hardcoded admin password fallback removed (auth.ts)
- [x] Admin password renamed to server-only `ADMIN_PASSWORD`

## Authentication (Supabase Auth)

- [ ] Email/password auth enabled (not configured yet)
- [x] Admin panel password-protected via `x-admin-token` header

## Row-Level Security (Supabase)

- [ ] All tables have RLS enabled
- [ ] Public tables: read-only for opportunities, news
- [ ] User tables: users can only read/write own data
- [ ] Admin tables: service-role-only access
- [ ] Subscriber table: insert-only for public
- [ ] Report/suggestion tables: insert-only for public
- [ ] RLS policies tested with different roles

## API Security

- [ ] All API endpoints validate input
- [ ] Rate limiting on public endpoints (subscribe: 3/IP/hr)
- [ ] Admin endpoints password-protected
- [ ] Cron endpoints secret-protected
- [ ] CORS configured correctly
- [ ] Request size limits
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React auto-escapes, content-security-policy)

## Frontend Security

- [ ] Content Security Policy headers
- [ ] XSS prevention (no dangerouslySetInnerHTML)
- [ ] Secure cookie handling (httpOnly, secure, sameSite)
- [ ] Sanitize user-generated content if any
- [ ] Proper iframe/embed policies
- [ ] No inline scripts in production

## Backend Security

- [x] Input validation on all endpoints
- [x] Timeout handling on AI API calls (30s AbortSignal)
- [x] Error messages don't leak internals
- [x] CORS configured
- [x] Rate limiting on subscribe (3/hr/IP)
- [ ] Dependency vulnerability scanning

## Deployment Security

- [ ] HTTPS enforced (Netlify + Render)
- [ ] SSL certificates valid and auto-renewing
- [ ] DDoS protection (Netlify edge + Cloudflare if needed)
- [ ] Security headers configured:
  - [ ] Strict-Transport-Security
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
  - [ ] X-XSS-Protection
  - [ ] Referrer-Policy
  - [ ] Permissions-Policy

## Data Privacy

- [ ] User email stored securely
- [ ] Unsubscribe mechanism present in all emails
- [ ] Data retention policy documented
- [ ] User data export capability
- [ ] User data deletion capability
- [ ] No tracking cookies without consent (if applicable)
- [ ] GDPR compliance basics (if EU users)

## Operational Security

- [ ] Regular dependency updates
- [ ] Vulnerability scanning (npm audit)
- [ ] Backup strategy for databases
- [ ] Incident response plan
- [ ] Monitoring for suspicious activity
- [ ] Access review for admin panel

## Audit Items (Pre-Launch)

- [ ] Full dependency audit (`npm audit`)
- [ ] RLS policy review
- [ ] API endpoint penetration test (basic)
- [ ] Auth flow review
- [ ] Environment variable audit
- [ ] Build output inspection (no leaked secrets)
- [ ] Security headers verified
