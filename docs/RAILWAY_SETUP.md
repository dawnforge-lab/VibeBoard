# Railway Deployment Setup

This guide covers deploying VibeBoard to Railway for production hosting.

## Prerequisites

- Railway account ([Sign up](https://railway.app))
- GitHub repository connected
- Railway CLI installed (optional, for local deployments)

## Story 1.4: Railway Project Initialization

### Task Checklist

- [ ] Create Railway account
- [ ] Connect GitHub repository to Railway
- [ ] Create production environment
- [ ] Create staging environment (linked to develop branch)
- [ ] Install Railway CLI locally: `npm i -g @railway/cli`
- [ ] Test Railway login and project link
- [ ] Configure environment variables in Railway dashboard
- [ ] Test initial deployment with placeholder app

## Setup Steps

### 1. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `dawnforge-lab/VibeBoard`
5. Railway will auto-detect Next.js and configure build settings

### 2. Configure Build Settings

Railway should auto-detect Next.js, but verify:

**Build Command:**
```bash
pnpm install && pnpm build:web
```

**Start Command:**
```bash
cd packages/web && node .next/standalone/server.js
```

**Root Directory:** `/` (monorepo root)

**Watch Paths:**
- `packages/web/**`
- `packages/core/**`
- `data/**`

### 3. Environment Variables

Add these in Railway Dashboard → Variables:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=VibeBoard
NEXT_PUBLIC_APP_URL=https://vibeboard.app

# (Phase 2 variables will be added later)
# SUPABASE_URL=...
# STRIPE_SECRET_KEY=...
# etc.
```

### 4. Create Staging Environment

1. In Railway Dashboard, go to your project
2. Click "New Environment"
3. Name it "staging"
4. Link to `develop` branch
5. Use different environment variables for staging

**Staging URL:** `https://staging-vibeboard.up.railway.app`

### 5. Configure Custom Domain (Production)

1. Go to Railway project → Settings → Domains
2. Add custom domain: `vibeboard.app`
3. Add DNS records at your domain registrar:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `your-app.up.railway.app`
4. Wait for DNS propagation (5-60 minutes)
5. Railway will auto-provision SSL certificate

### 6. Install Railway CLI (Optional)

For local deployments:

```bash
# Install globally
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Deploy from CLI
railway up

# View logs
railway logs

# Open dashboard
railway open
```

### 7. GitHub Actions Integration

The repository includes `.github/workflows/deploy.yml` which deploys on push to `main`.

Add Railway token to GitHub secrets:

1. Go to Railway → Account → Tokens
2. Create new token with deployment permissions
3. Go to GitHub repo → Settings → Secrets → Actions
4. Add new secret:
   - Name: `RAILWAY_TOKEN`
   - Value: `your-railway-token`

### 8. Verify Deployment

After deployment:

1. Check Railway logs for errors
2. Visit your production URL
3. Test core functionality:
   - [ ] Homepage loads
   - [ ] Can input text
   - [ ] Styles generate correctly
   - [ ] Copy to clipboard works
   - [ ] Theme toggle works
   - [ ] No console errors

### 9. Monitoring & Alerts

Configure in Railway Dashboard:

- **Health Checks:** Enable HTTP health check on `/` or `/api/health`
- **Metrics:** Monitor CPU, memory, request count
- **Alerts:** Set up notifications for:
  - Deployment failures
  - High error rates
  - Resource limits reached

## Railway Configuration File

Create `railway.json` in project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build:web"
  },
  "deploy": {
    "startCommand": "cd packages/web && node .next/standalone/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Troubleshooting

### Build Fails

```bash
# Check Railway logs
railway logs

# Common fixes:
# 1. Ensure pnpm is used (not npm)
# 2. Check Node version (should be 18+)
# 3. Verify all dependencies are in package.json
```

### App Crashes on Start

```bash
# Check start command
# Ensure it points to correct Next.js server file

# Verify environment variables are set
railway variables
```

### Slow Cold Starts

Railway apps may have cold starts. Consider:
- Keeping app warm with uptime monitors (e.g., UptimeRobot)
- Upgrading to Railway Pro for persistent instances

## Cost Estimation

**Railway Free Tier:**
- $5 free credit per month
- Sleeps after inactivity
- Good for staging/development

**Railway Pro ($20/month):**
- $20 credit included
- No sleep
- Better performance
- Custom domains

**Estimated Costs (Production):**
- Small app: ~$10-15/month
- Medium traffic: ~$20-30/month
- High traffic: ~$50+/month

## Next Steps

- [ ] Complete Epic 1 Story 1.4 tasks
- [ ] Deploy to staging environment
- [ ] Test deployment workflow
- [ ] Configure monitoring alerts
- [ ] Document deployment URLs
- [ ] Proceed to Epic 2: Core Styling Engine

## Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Next.js Guide](https://docs.railway.app/guides/nextjs)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [VibeBoard Technical Architecture](../2-TECHNICAL_ARCHITECTURE.md)

---

**Epic 1 Story 1.4 Status:** ✅ Documentation Complete

**Note:** Actual Railway deployment will happen during Epic 8 (Deployment & Launch). This document provides the setup instructions for when that phase begins.
