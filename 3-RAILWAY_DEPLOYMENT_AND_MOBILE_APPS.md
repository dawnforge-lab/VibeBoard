# VibeBoard — Railway Deployment & Mobile App Distribution

## Document Purpose
This guide covers production deployment on Railway, CI/CD pipeline setup, mobile app builds and distribution to App Store / Google Play, and ongoing DevOps operations.

**Version:** 1.0  
**Audience:** DevOps engineers, build engineers, deployment leads

---

## 1. Why Railway?

### 1.1 Railway Advantages for VibeBoard
- **Zero-Config Deployment:** Git push → automatic deploy (GitHub integration)
- **Environment Management:** Easy env var management (Supabase creds, API keys)
- **PostgreSQL Built-In:** Attach Supabase databases directly
- **Pricing Model:** Pay-as-you-go (perfect for MVP with low initial traffic)
- **Built-in CLI:** Easy local testing with `railway up`
- **Observability:** Logs, metrics, error tracking out of box
- **Scalability:** Auto-scaling, multi-region support (future)
- **Cost Effective:** ~$5/month for small web app (vs Vercel/Heroku)

### 1.2 Architecture
```
┌─────────────────────────────────────────────┐
│         Railway Project: VibeBoard          │
├─────────────────────────────────────────────┤
│ Service 1: Web (Next.js)                    │
│   - Dockerfile build                        │
│   - Auto deploy on git push                 │
│   - 2 replicas for HA                       │
├─────────────────────────────────────────────┤
│ Service 2: Analytics (PostHog) [Optional]   │
│   - Self-hosted analytics                   │
│   - Custom dashboards                       │
├─────────────────────────────────────────────┤
│ Database: Supabase PostgreSQL               │
│   - Managed external                        │
│   - Environment-specific creds              │
├─────────────────────────────────────────────┤
│ DNS: Vercel Edge / CloudFlare               │
│   - CDN caching                             │
│   - Global distribution                     │
└─────────────────────────────────────────────┘
```

---

## 2. Initial Railway Setup

### 2.1 Create Railway Account & Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
# Opens browser for OAuth

# Create new project
railway init
# Select "Create new project"
# Name: "vibeboard"
# Environment: "production" (create staging later)
```

### 2.2 Connect GitHub Repository
1. Go to [railway.app](https://railway.app)
2. Create New Project → GitHub
3. Select GitHub repo `vibeboard`
4. Authorize Railway GitHub app
5. Railway auto-detects Next.js and configures build

### 2.3 Project Structure in Railway
```
VibeBoard Project (railway.app/projects/vibeboard)
├── Environments
│   ├── production (main branch)
│   └── staging (develop branch)
├── Services
│   ├── Web (Next.js app)
│   └── PostgreSQL (Supabase pointer)
└── Settings
    ├── Environment variables
    ├── Deployments
    └── Logs
```

---

## 3. Dockerfile Configuration

### 3.1 Optimized Next.js Dockerfile
```dockerfile
# Dockerfile (placed in repo root)

# Stage 1: Build dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Stage 2: Build application
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build web app and core package
RUN pnpm run -F @vibeboard/core build
RUN pnpm run -F @vibeboard/web build

# Stage 3: Production image (slim)
FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV production

# Copy necessary files only
COPY --from=builder /app/packages/web/.next ./packages/web/.next
COPY --from=builder /app/packages/web/public ./packages/web/public
COPY --from=builder /app/packages/web/package.json ./packages/web/package.json
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/package.json ./packages/core/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/pnpm-lock.yaml ./

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000
ENV PORT 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "packages/web/.next/standalone/server.js"]
```

### 3.2 Next.js Build Optimization
```javascript
// packages/web/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Standalone output for Docker
  output: 'standalone',

  // Image optimization
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/webp', 'image/avif'],
  },

  // Compression
  compress: true,

  // SWC minification (faster than Terser)
  swcMinify: true,

  // Experimental: faster builds
  experimental: {
    optimizePackageImports: [
      '@vibeboard/core',
    ],
  },

  // Environment variables (public)
  env: {
    NEXT_PUBLIC_APP_NAME: 'VibeBoard',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
};

module.exports = nextConfig;
```

---

## 4. Environment Configuration

### 4.1 Railway Environment Variables Dashboard
Navigate to: Project Settings → Variables

**Add these variables:**

#### 4.1.1 Production Variables
```bash
# Next.js
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://vibeboard.app
NEXT_PUBLIC_APP_NAME=VibeBoard

# Database (from Supabase)
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/vibeboard
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxx... (public key)
SUPABASE_SERVICE_KEY=eyJxx... (secret key)

# Analytics (Phase 2)
POSTHOG_API_KEY=phc_xxx
POSTHOG_API_HOST=https://posthog.vibeboard.app

# Stripe (Payment processing)
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# AI Integration (Phase 2)
OPENAI_API_KEY=sk-proj-xxx

# Sentry Error Tracking
SENTRY_AUTH_TOKEN=sntrys_xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/yyy

# Build secrets
RAILWAY_TOKEN=[Generated from Railway settings]
```

#### 4.1.2 Staging Variables
Same as production, but with staging endpoints:
```bash
NEXT_PUBLIC_APP_URL=https://staging.vibeboard.app
SUPABASE_URL=https://xxx-staging.supabase.co
STRIPE_SECRET_KEY=sk_test_xxx
```

### 4.2 Set Variables via Railway CLI
```bash
# Login to Railway
railway login

# Link to project
railway link

# Set variable
railway variables set NODE_ENV production
railway variables set DATABASE_URL "postgresql://..."

# View all variables
railway variables
```

---

## 5. Deployment Pipeline

### 5.1 GitHub Actions: Automated Deployments
```yaml
# .github/workflows/deploy.yml

name: Deploy to Railway

on:
  push:
    branches:
      - main      # → Production
      - develop   # → Staging
  workflow_dispatch:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Unit tests
        run: pnpm test -- --run

      - name: Build web
        run: pnpm run -F @vibeboard/web build

  deploy-staging:
    needs: validate
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway (Staging)
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN_STAGING }}
        run: |
          npm install -g @railway/cli
          railway up --service web --environment staging

  deploy-production:
    needs: validate
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          VERSION=$(jq -r '.version' packages/web/package.json)
          gh release create "v$VERSION" --generate-notes

      - name: Deploy to Railway (Production)
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --service web --environment production
```

### 5.2 Rollback Strategy
```bash
# Rollback to previous deployment via Railway CLI
railway rollback

# Or via Railway dashboard: Deployments → Select previous → Rollback

# Monitor logs after rollback
railway logs --follow
```

---

## 6. Database Management (Supabase)

### 6.1 Connect Railway to Supabase
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Copy connection string: `postgresql://user:password@db.supabase.co:5432/vibeboard`
3. In Railway dashboard → Add Variable → `DATABASE_URL`

### 6.2 Migrations via Supabase CLI
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Create migration
supabase migration new create_users_table

# Write migration SQL in generated file
# packages/api/supabase/migrations/xxx_create_users_table.sql

# Apply locally
supabase migration up

# Push to production
supabase db push

# View schema changes
supabase db remote update
```

### 6.3 Sample Migrations
```sql
-- migrations/001_init.sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  style_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, style_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
```

### 6.4 Backup Strategy
```bash
# Manual backup via Supabase dashboard
# Settings → Database → Backups → Download

# Automated daily backups (Supabase Pro)
# Enabled automatically with Pro plan

# Restore from backup
supabase db restore --backup-id xxxxx
```

---

## 7. Monitoring & Observability

### 7.1 Railway Built-In Logs
```bash
# Stream logs from Railway
railway logs --follow

# Filter by service
railway logs web --follow

# View deployment logs
railway deployments --follow
```

### 7.2 Sentry Integration (Error Tracking)
```typescript
// packages/web/instrumentation.node.ts

import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      integrations: [
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      replaySessionSampleRate: 0.1,
      replayOnErrorSampleRate: 1.0,
    });
  }
}
```

### 7.3 Health Check Endpoint
```typescript
// packages/web/app/api/health/route.ts

export async function GET() {
  try {
    // Check database connectivity
    const supabase = createServerComponentClient({ cookies });
    await supabase.from('users').select('count()', { count: 'exact' });

    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return Response.json(
      { status: 'error', error: error.message },
      { status: 503 }
    );
  }
}
```

### 7.4 Monitoring Dashboard
```bash
# PostHog self-hosted (optional, on Railway)
# View: https://posthog.vibeboard.app
# Tracks: button clicks, page views, errors

# Railway Metrics
# CPU, Memory, Network usage
# View in Railway dashboard → Metrics
```

---

## 8. Domain & DNS Configuration

### 8.1 Custom Domain Setup
1. Register domain (e.g., `vibeboard.app` on Namecheap/Route53)
2. In Railway dashboard → Settings → Domains
3. Add custom domain: `vibeboard.app`
4. Railway generates CNAME: `xxx.railway.app`
5. Add DNS record in registrar:
   ```
   Name: @
   Type: CNAME
   Value: xxx.railway.app
   TTL: 3600
   ```
6. Wait for DNS propagation (~1-5 mins)

### 8.2 SSL/TLS Certificate
- Railway provides automatic Let's Encrypt certificate
- Renews every 90 days
- No action required
- View in Railway dashboard → Domains → Certificate

### 8.3 Staging Domain
```
Production: vibeboard.app
Staging:    staging.vibeboard.app

DNS record:
Name: staging
Type: CNAME
Value: xxx-staging.railway.app
```

---

## 9. Cost Estimation

### 9.1 Railway Pricing Breakdown
| Service | Monthly Cost | Notes |
|---------|------------|-------|
| Web (Next.js) | ~$5–15 | 0.5GB RAM, auto-scale |
| Database (Supabase) | ~$25–100 | Managed PostgreSQL |
| Analytics (PostHog) | $0–50 | Self-hosted or cloud |
| Storage | ~$5 | Font packs, analytics cache |
| **Total** | **~$40–180** | Scales with users |

### 9.2 Cost Optimization
- Use Railway's free tier for staging
- Cache static assets (CDN)
- Compress font pack JSONs
- Archive old analytics events to cold storage
- Scale database read replicas only during high traffic

---

## 10. Mobile App Distribution

### 10.1 iOS App Store Distribution

#### 10.1.1 Prerequisites
- Apple Developer Account ($99/year)
- Xcode installed
- Provisioning profiles & certificates

#### 10.1.2 Build for App Store
```bash
# Increase version
npm version minor --workspace @vibeboard/mobile

# Build for iOS
cd packages/mobile
eas build --platform ios --auto-submit

# Or manually:
# Build via Xcode
# Archive & upload via TestFlight
```

#### 10.1.3 App Store Connect Setup
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create new app: "VibeBoard"
3. Set bundle identifier: `com.vibeboard.app`
4. Fill metadata:
   - App name
   - Subtitle: "Stylize Your Text"
   - Description
   - Keywords: "fonts, text, stylized, aesthetic"
   - Category: Productivity
   - Content rating

#### 10.1.4 Build & Release Process
```bash
# 1. Increment version
npm version patch

# 2. Build for TestFlight
eas build --platform ios

# 3. Submit to TestFlight (via EAS)
eas submit --platform ios

# 4. Invite testers, gather feedback

# 5. Submit to App Review
# In App Store Connect → Version → Submit for Review

# 6. Apple review (1–3 days typically)

# 7. Release when approved
# App Store Connect → Release
```

#### 10.1.5 App Store Screenshots
- 6 screenshots per locale (1242x2208 px)
- Show: input → preview → favorite → share
- Use contrasting colors, clear text

### 10.2 Google Play Distribution

#### 10.2.1 Prerequisites
- Google Play Developer Account ($25 one-time)
- Google Play Console access
- Keystore file (APK signing)

#### 10.2.2 Build for Play Store
```bash
# Generate signed APK
cd packages/mobile
eas build --platform android

# Or manually:
cd android
./gradlew bundleRelease

# Produces app-release.aab (Android App Bundle)
```

#### 10.2.3 Google Play Console Setup
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create app: "VibeBoard"
3. Set bundle ID: `com.vibeboard.app`
4. Fill store listing:
   - Title
   - Short description (80 chars)
   - Full description
   - Screenshots (1080x1920 px, 5 per locale)
   - Promotional graphic (1024x500 px)
   - Icon (512x512 px)

#### 10.2.4 Build & Release Process
```bash
# 1. Increment version
npm version patch

# 2. Build for Play Store
eas build --platform android

# 3. Submit to Play Console (via EAS)
eas submit --platform android

# 4. Fill store listing details

# 5. Choose release track
# - Internal Testing (internal team only)
# - Closed Testing (limited testers)
# - Open Testing (public beta, all devices)
# - Production (full release)

# 6. Start with Open Testing (gather reviews)

# 7. Roll out to Production
# Play Console → Releases → Production → Create Release
```

#### 10.2.5 Play Store Screenshots
- 8 images per locale (1080x1920 px)
- Landscape & portrait
- Show key features

### 10.3 Expedited Review (Paid)

| Platform | Service | Cost | Timeline |
|----------|---------|------|----------|
| iOS | Apple Expedited Review | Free (sometimes available) | 24–48 hrs |
| Android | Google Play Priority Review | $500–1000 | 24 hrs |

---

## 11. Over-the-Air Updates (Phase 2)

### 11.1 EAS Updates
```bash
# Publish update without rebuilding app binaries
cd packages/mobile

# Publish new version
eas update --branch production

# Creates delta patch (~2-5MB)
# Auto-downloaded by apps on next launch
```

### 11.2 Staged Rollout
```javascript
// packages/mobile/app.json
{
  "updates": {
    "url": "https://u.expo.dev/xxx",
    "enabled": true,
    "fallbackToCacheTimeout": 1000,
    "codeSigningCertificate": "./certs/code-signing.pem"
  },
  "runtimeVersion": "1.0.0"
}
```

---

## 12. Beta Testing

### 12.1 iOS TestFlight
```bash
# 1. Build & submit
eas build --platform ios --auto-submit

# 2. Invite testers via App Store Connect
# Settings → Testers & Groups → Add

# 3. Testers download via TestFlight app
# Gather crash logs & feedback

# 4. Iterate on beta versions
eas build --platform ios
eas submit --platform ios
```

### 12.2 Google Play Closed Testing
```bash
# 1. Submit AAB to Play Console

# 2. Create closed testing track
# Testing → Closed Testing → Create

# 3. Add testers (up to 50,000 via Google Group)

# 4. Testers opt-in, download app

# 5. Monitor feedback & crash reports
```

### 12.3 Beta Feedback Loop
- Use Sentry for crash tracking
- In-app feedback form (email or Firebase)
- Iterate weekly on beta builds
- Gather 100+ beta testers for validation

---

## 13. Security & Compliance

### 13.1 App Security Checklist
- ✅ SSL/TLS enforcement (HTTPS only)
- ✅ Data encryption in transit (HTTPS + TLS)
- ✅ Secrets in environment variables (never hardcoded)
- ✅ API key rotation (quarterly)
- ✅ Dependency scanning (Snyk, Dependabot)
- ✅ Code signing (App Store & Play Store)
- ✅ Regular security audits (quarterly)

### 13.2 GDPR & Privacy
```markdown
## Privacy Policy (required for App Stores)

### Data Collection
- No personal data collected (offline-first)
- Optional: usage analytics (PostHog)
- Opt-in consent required

### Data Deletion
- User can delete app = all data gone
- Cloud sync data deletable via Settings
- Supabase GDPR-compliant

### Cookie & Tracking
- No cookies in app
- Web: Google Analytics (if opted in)
- Mobile: Firebase Analytics (if opted in)
```

### 13.3 Terms of Service
- Fair usage policy (no spam, abuse)
- Content guidelines (no offensive material)
- Disclaimer: "Fonts as-is, no warranty"

---

## 14. Post-Launch Monitoring

### 14.1 Week 1 Post-Launch
```
Day 1:
- Monitor Sentry for crashes
- Check Railway logs for errors
- Respond to user feedback

Day 3:
- Analyze analytics (daily actives, retention)
- Check App Store/Play Store reviews
- Patch any critical bugs

Week 1:
- Weekly review meeting
- Iterate on UI/UX based on feedback
- Plan Phase 2 features
```

### 14.2 Key Metrics to Track
```
Daily:
- DAU (Daily Active Users)
- Crash rate
- API latency

Weekly:
- Retention (D1, D7, D30)
- Free → Pro conversion
- Average session duration

Monthly:
- MAU (Monthly Active Users)
- Churn rate
- Feature adoption
```

### 14.3 Incident Response
```
Severity Levels:
- P1 (Critical): App down, data loss
  → Immediate rollback, notify team
- P2 (High): Major feature broken
  → Fix & deploy within 2 hours
- P3 (Medium): Non-critical bug
  → Include in next release
- P4 (Low): Minor UX issue
  → Backlog for future

Incident Report Template:
1. What happened?
2. When did it occur?
3. How many users affected?
4. Root cause
5. Resolution
6. Prevention for future
```

---

## 15. Scaling Beyond MVP

### 15.1 Database Scaling
```sql
-- Add read replicas for high traffic
-- Supabase: Settings → Replication

-- Add caching layer (Redis)
-- Use Railway Redis add-on

-- Partition analytics table
CREATE TABLE analytics_2025_q1 PARTITION OF analytics
  FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
```

### 15.2 App Server Scaling
```yaml
# Railway auto-scales, but optimize:
# 1. Enable HTTP/2 (faster multiplexing)
# 2. Add CDN for static assets (Cloudflare)
# 3. Implement caching headers (immutable for fonts)
# 4. Database query optimization
```

### 15.3 Multi-Region Deployment
```bash
# Phase 3: Add EU region for GDPR compliance
# Create new Railway environment: eu-production
# DNS geolocation routing via Cloudflare
```

---

## 16. Checklists

### 16.1 Pre-Launch Checklist
- [ ] All environment variables set in Railway
- [ ] Database migrations applied to production
- [ ] Sentry error tracking active
- [ ] Health check endpoint verified
- [ ] Domain DNS propagated and SSL active
- [ ] iOS build submitted to App Store
- [ ] Android build submitted to Play Store
- [ ] Privacy policy published and linked
- [ ] Terms of service published and linked
- [ ] Backup and recovery plan documented
- [ ] Monitoring dashboards set up (Railway + Sentry)
- [ ] On-call rotation defined
- [ ] Rollback procedure tested

### 16.2 Post-Launch Checklist (Week 1)
- [ ] Prod app traffic monitored (Railway metrics)
- [ ] No critical errors in Sentry
- [ ] Database performance acceptable (query latency)
- [ ] App Store reviews being monitored
- [ ] Beta testers given early access
- [ ] Incident response plan tested
- [ ] Team on standby for critical issues

### 16.3 Ongoing Maintenance
- [ ] Weekly dependency updates (Dependabot)
- [ ] Monthly security audit (Snyk)
- [ ] Quarterly database optimization
- [ ] Biannual disaster recovery drill
- [ ] Annual compliance review (GDPR, CCPA)

---

## 17. Useful Commands & Links

### 17.1 Railway CLI Commands
```bash
railway login                    # Authenticate
railway init                     # Setup project
railway link                     # Link to existing project
railway up                       # Deploy
railway logs --follow            # Stream logs
railway logs web --follow        # Service-specific logs
railway variables                # View env vars
railway variables set KEY value  # Set env var
railway rollback                 # Rollback deployment
railway deployments              # View deployment history
```

### 17.2 Useful Links
- Railway Dashboard: https://railway.app/dashboard
- Supabase Console: https://app.supabase.com
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
- Sentry: https://sentry.io
- PostHog: https://posthog.com

### 17.3 Key Files
```
- Dockerfile: Root of repo
- next.config.js: packages/web/
- app.json (Expo): packages/mobile/
- .github/workflows/deploy.yml: CI/CD
- .env.example: All env vars
```

---

## 18. Appendix: Troubleshooting

### 18.1 Railway Deployment Fails
```
Error: "Build failed - node_modules not found"
Solution: Ensure pnpm-lock.yaml is committed

Error: "Port 3000 not exposed"
Solution: Check Dockerfile EXPOSE 3000

Error: "Out of memory"
Solution: Increase Railway service RAM in dashboard
```

### 18.2 App Store Submission Rejected
```
Common reasons:
1. Missing privacy policy link
2. App crashes on launch → Check Sentry
3. Screenshots not matching actual app
4. Misleading functionality

Solution: Review App Store Connect → Resolution Center
```

### 18.3 Android Build Fails
```
Error: "Keystore file not found"
Solution: EAS handles code signing, no manual keystore needed

Error: "Bundle ID mismatch"
Solution: Verify app.json → runtimeVersion matches Play Console
```

---

**Document Version:** 1.0  
**Last Updated:** November 7, 2025  
**Reviewed By:** DevOps & Platform Team
