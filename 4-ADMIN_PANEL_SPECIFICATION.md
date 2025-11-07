# VibeBoard — Admin Panel & Dynamic Configuration Specification

**Version:** 1.0
**Last Updated:** November 7, 2025
**Purpose:** Centralized management of AI prompts, settings, templates, and dynamic configurations

---

## Executive Summary

The VibeBoard admin panel provides a web-based interface for managing all dynamic configurations, AI prompts, content, and system settings without requiring code deployments. This enables rapid iteration, A/B testing, and content updates by non-technical team members.

**Key Principle:** **NEVER hardcode content, prompts, or settings that may need to change.**

---

## 1. Architecture Overview

### 1.1 Admin Panel Tech Stack
```
┌─────────────────────────────────────┐
│     Admin Panel (Next.js)           │
│     Route: /admin (Protected)       │
├─────────────────────────────────────┤
│   Authentication: Supabase Auth     │
│   Role Check: admin_users table     │
├─────────────────────────────────────┤
│   Database: Supabase PostgreSQL     │
│   - app_config table                │
│   - ai_prompts table                │
│   - content_templates table         │
│   - feature_flags table             │
│   - font_packs_meta table           │
└─────────────────────────────────────┘
```

### 1.2 Security Model
- **Authentication:** Supabase Auth with email verification
- **Authorization:** Role-based access control (RBAC)
- **Roles:**
  - `super_admin` — Full access to all settings
  - `content_admin` — Manage content, prompts, templates
  - `support_admin` — View-only for troubleshooting
  - `creator_admin` — Manage font packs, marketplace

---

## 2. Database Schema for Dynamic Configuration

### 2.1 Admin Users Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin', 'support_admin', 'creator_admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Row-level security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));
```

### 2.2 App Configuration Table
```sql
CREATE TABLE app_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT, -- 'general', 'monetization', 'features', 'limits'
  editable_by TEXT[], -- Roles that can edit this config
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example rows:
INSERT INTO app_config (key, value, description, category) VALUES
  ('max_input_length', '200', 'Maximum characters for text input', 'limits'),
  ('free_styles_limit', '10', 'Number of styles available for free users', 'monetization'),
  ('pro_monthly_price', '2.99', 'Pro subscription monthly price in USD', 'monetization'),
  ('enable_ai_suggestions', 'true', 'Toggle AI vibe recommendation feature', 'features'),
  ('maintenance_mode', 'false', 'Enable maintenance mode for app', 'general');
```

### 2.3 AI Prompts Table
```sql
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_key TEXT UNIQUE NOT NULL, -- e.g., 'vibe_recommendation_v1'
  prompt_text TEXT NOT NULL,
  model TEXT, -- 'gpt-4o', 'gpt-4o-mini', 'claude-3-sonnet'
  temperature FLOAT DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 150,
  active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  category TEXT, -- 'recommendation', 'moderation', 'content_generation'
  variables JSONB, -- Available template variables: {text}, {user_context}, etc.
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example prompt:
INSERT INTO ai_prompts (prompt_key, prompt_text, model, category, variables, description) VALUES
(
  'vibe_recommendation_v1',
  'Analyze the following text and suggest the most appropriate aesthetic style from this list: {available_styles}.

Text: "{text}"

Consider the tone, emotion, and context. Respond with only the style name and a one-sentence reason.

Format: STYLE_NAME | Reason',
  'gpt-4o-mini',
  'recommendation',
  '{"text": "User input text", "available_styles": "Array of available style names"}',
  'AI prompt for recommending font styles based on text sentiment'
);
```

### 2.4 Content Templates Table
```sql
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL, -- e.g., 'onboarding_welcome_title'
  content JSONB NOT NULL, -- Supports multi-language: {"en": "Welcome!", "es": "¡Bienvenido!"}
  template_type TEXT, -- 'ui_text', 'email', 'notification', 'error_message'
  variables JSONB, -- Template variables like {username}, {app_name}
  description TEXT,
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example templates:
INSERT INTO content_templates (template_key, content, template_type, variables, description) VALUES
(
  'onboarding_welcome_title',
  '{"en": "Welcome to VibeBoard!", "es": "¡Bienvenido a VibeBoard!"}',
  'ui_text',
  NULL,
  'Title for first onboarding screen'
),
(
  'share_message_template',
  '{"en": "{styled_text}\n\nStyled with VibeBoard — Your aesthetic text lab 🎨"}',
  'ui_text',
  '{"styled_text": "The transformed text"}',
  'Message template when user shares styled text'
);
```

### 2.5 Feature Flags Table
```sql
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT UNIQUE NOT NULL, -- e.g., 'enable_keyboard_extension'
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
  target_users JSONB, -- Optional: specific user IDs or segments
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example flags:
INSERT INTO feature_flags (flag_key, enabled, rollout_percentage, description) VALUES
  ('enable_ai_recommendations', true, 100, 'Enable AI vibe recommendations for all users'),
  ('enable_keyboard_extension', false, 0, 'Enable keyboard extension feature'),
  ('enable_marketplace', false, 10, 'Gradually roll out marketplace to 10% of users');
```

### 2.6 Font Packs Metadata Table
```sql
CREATE TABLE font_packs_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id TEXT UNIQUE NOT NULL, -- e.g., 'vaporwave'
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_cents INTEGER DEFAULT 0, -- 0 = free
  currency TEXT DEFAULT 'USD',
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  preview_image_url TEXT,
  pack_json_url TEXT, -- URL to actual pack JSON file in storage
  creator_id UUID REFERENCES users(id), -- For community packs
  download_count INTEGER DEFAULT 0,
  rating FLOAT,
  approved BOOLEAN DEFAULT false, -- For community submissions
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2.7 System Notifications Table
```sql
CREATE TABLE system_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_key TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL, -- Multi-language support
  message JSONB NOT NULL,
  type TEXT CHECK (type IN ('info', 'warning', 'error', 'success')),
  active BOOLEAN DEFAULT true,
  display_on TEXT[], -- ['web', 'mobile', 'both']
  priority INTEGER DEFAULT 0, -- Higher = more urgent
  dismissable BOOLEAN DEFAULT true,
  action_url TEXT, -- Optional link for "Learn More"
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Example: Maintenance notice
INSERT INTO system_notifications (notification_key, title, message, type, display_on, start_date, end_date) VALUES
(
  'maintenance_nov_10',
  '{"en": "Scheduled Maintenance"}',
  '{"en": "VibeBoard will be undergoing maintenance on Nov 10, 2025 from 2-4 AM UTC."}',
  'info',
  ARRAY['web', 'mobile'],
  '2025-11-09 00:00:00',
  '2025-11-10 05:00:00'
);
```

---

## 3. Admin Panel Interface

### 3.1 Dashboard Overview
**Route:** `/admin/dashboard`

**Metrics Displayed:**
- Total Users (DAU, MAU, WAU)
- Active Subscriptions (Free vs Pro)
- Revenue (Today, This Week, This Month)
- Top Styles Used (Last 7 days)
- Recent Errors (from Sentry)
- System Health (Railway status, Supabase latency)

**Quick Actions:**
- Create System Notification
- Toggle Maintenance Mode
- View Recent Support Tickets
- Deploy Config Changes

### 3.2 App Configuration Panel
**Route:** `/admin/config`

**UI Components:**
- **Search & Filter:** Search configs by key or category
- **Category Tabs:** General, Monetization, Features, Limits
- **Config List:** Table with columns:
  - Key (editable click-to-edit)
  - Value (JSON editor with validation)
  - Description
  - Last Updated (timestamp + admin name)
  - Actions (Edit, History, Reset to Default)

**Example Configs to Manage:**
```javascript
{
  // Limits
  "max_input_length": 200,
  "max_favorites": 50,
  "max_custom_packs": 10,

  // Monetization
  "pro_monthly_price_usd": 2.99,
  "pro_annual_price_usd": 20.99,
  "pack_dlc_price_usd": 0.99,
  "trial_period_days": 7,

  // Features
  "enable_ai_suggestions": true,
  "enable_cloud_sync": true,
  "enable_marketplace": false,
  "enable_keyboard_extension": false,

  // Analytics
  "analytics_enabled": true,
  "crash_reporting_enabled": true,
  "performance_monitoring_enabled": true,

  // Content Moderation
  "auto_moderate_packs": true,
  "profanity_filter_enabled": true
}
```

### 3.3 AI Prompts Management
**Route:** `/admin/ai-prompts`

**Features:**
- **Prompt Editor:** Monaco editor with syntax highlighting
- **Version Control:** Track prompt versions, rollback capability
- **A/B Testing:** Run multiple prompt variations, track performance
- **Variables Preview:** Test prompt with sample data
- **Cost Tracking:** Monitor token usage per prompt

**UI Layout:**
```
┌────────────────────────────────────────────┐
│ AI Prompts                    [+ New]      │
├────────────────────────────────────────────┤
│ 🔍 Search prompts...        Filter: [All▼]│
├────────────────────────────────────────────┤
│ ✅ vibe_recommendation_v1   [Edit] [Copy]  │
│    Model: gpt-4o-mini | Temp: 0.7         │
│    Last updated: 2 days ago by admin@...   │
│    Avg cost: $0.002/request               │
├────────────────────────────────────────────┤
│ ⚠️  content_moderation_v2    [Edit] [Copy] │
│    Model: gpt-4o | Temp: 0.3              │
│    Last updated: 1 week ago by admin@...   │
│    Avg cost: $0.005/request               │
└────────────────────────────────────────────┘
```

**Prompt Editor Modal:**
```javascript
// Prompt Key: vibe_recommendation_v1
// Model: [gpt-4o-mini ▼]
// Temperature: [0.7] (0-2)
// Max Tokens: [150]
// Active: [✓]

// Prompt Text:
// ┌──────────────────────────────────────────┐
// │ Analyze the following text and suggest   │
// │ the most appropriate aesthetic style...  │
// │                                          │
// │ Text: "{text}"                           │
// │                                          │
// │ Available styles: {available_styles}     │
// └──────────────────────────────────────────┘

// Variables (JSON):
// {
//   "text": "User input text",
//   "available_styles": ["Bold Sans", "Script", ...]
// }

// [Test Prompt] [Save] [Cancel]
```

### 3.4 Content Templates Management
**Route:** `/admin/templates`

**Features:**
- **Multi-Language Support:** Edit content in all supported languages
- **Template Variables:** Preview with sample data
- **Usage Tracking:** See where templates are used in app
- **Batch Import/Export:** CSV or JSON for bulk updates

**Example Templates:**
```javascript
{
  // Onboarding
  "onboarding_welcome_title": {
    "en": "Welcome to VibeBoard!",
    "es": "¡Bienvenido a VibeBoard!",
    "fr": "Bienvenue sur VibeBoard!"
  },
  "onboarding_step1_description": {
    "en": "Transform your text into aesthetic styles with just a few taps."
  },

  // Error Messages
  "error_network_offline": {
    "en": "You're offline. Don't worry, VibeBoard works offline too!",
    "es": "Estás sin conexión. ¡No te preocupes, VibeBoard funciona sin conexión!"
  },
  "error_purchase_failed": {
    "en": "Purchase failed. Please try again or contact support."
  },

  // Share Messages
  "share_message_template": {
    "en": "{styled_text}\n\nStyled with VibeBoard — Your aesthetic text lab 🎨\nhttps://vibeboard.app"
  },

  // Email Templates
  "welcome_email_subject": {
    "en": "Welcome to VibeBoard, {username}!"
  },
  "welcome_email_body": {
    "en": "Hi {username},\n\nThanks for joining VibeBoard!..."
  }
}
```

### 3.5 Feature Flags Management
**Route:** `/admin/feature-flags`

**Features:**
- **Toggle Switches:** Instant enable/disable
- **Gradual Rollout:** Set percentage (0-100%)
- **User Targeting:** Target specific user segments
- **Scheduled Rollouts:** Auto-enable at specific date/time
- **Audit Log:** Track who changed what and when

**UI Example:**
```
┌────────────────────────────────────────────┐
│ Feature Flags                              │
├────────────────────────────────────────────┤
│ 🟢 enable_ai_recommendations               │
│    Rollout: [========= 100%]              │
│    [Edit] [History]                        │
├────────────────────────────────────────────┤
│ 🔴 enable_marketplace                      │
│    Rollout: [=         10%]               │
│    [Edit] [History]                        │
├────────────────────────────────────────────┤
│ 🟡 enable_keyboard_extension               │
│    Rollout: [          0%]                │
│    Scheduled: Nov 15, 2025 @ 9:00 AM      │
│    [Edit] [History]                        │
└────────────────────────────────────────────┘
```

### 3.6 Font Packs Management
**Route:** `/admin/font-packs`

**Features:**
- **Pack Metadata Editor:** Edit name, description, pricing
- **Pack File Manager:** Upload JSON pack files to Supabase storage
- **Featured Packs:** Toggle featured status for homepage
- **Pricing Control:** Set price per pack, bulk discounts
- **Community Moderation:** Approve/reject community submissions
- **Analytics:** Track downloads, revenue per pack

**UI Components:**
```
┌────────────────────────────────────────────┐
│ Font Packs                   [+ Upload]    │
├────────────────────────────────────────────┤
│ 📦 Default Pack              [Edit]        │
│    Category: Core | Price: Free           │
│    Downloads: 50,000 | Rating: 4.8        │
├────────────────────────────────────────────┤
│ 📦 Vaporwave Aesthetic       [Edit]        │
│    Category: DLC | Price: $0.99           │
│    Downloads: 2,500 | Rating: 4.6         │
│    Revenue: $2,475                         │
├────────────────────────────────────────────┤
│ ⏳ Cyberpunk Neon (Pending)  [Review]      │
│    Submitted by: @creator123              │
│    [Approve] [Reject] [Preview]            │
└────────────────────────────────────────────┘
```

### 3.7 System Notifications
**Route:** `/admin/notifications`

**Features:**
- **Create Notification:** Rich text editor with preview
- **Schedule Display:** Set start/end dates
- **Platform Targeting:** Web, mobile, or both
- **Priority Levels:** Info, warning, error, success
- **Action Links:** Optional "Learn More" button

**Use Cases:**
- Maintenance announcements
- New feature releases
- Security alerts
- Seasonal promotions
- App update reminders

### 3.8 User Management
**Route:** `/admin/users`

**Features:**
- **Search Users:** By email, username, or user ID
- **View Profile:** Subscription status, favorites, usage stats
- **Manual Actions:** Grant Pro, refund purchase, reset password
- **Ban/Suspend:** Moderation actions with reason logging
- **Support Tools:** View user's error logs, session replays

---

## 4. API Endpoints for Config Retrieval

### 4.1 Client-Side Config Fetching
**Endpoint:** `GET /api/config`

**Response:**
```json
{
  "max_input_length": 200,
  "free_styles_limit": 10,
  "enable_ai_suggestions": true,
  "pro_monthly_price": 2.99,
  "share_message_template": "{styled_text}\n\nStyled with VibeBoard — Your aesthetic text lab 🎨"
}
```

**Implementation:**
```typescript
// packages/web/app/api/config/route.ts

import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('app_config')
    .select('key, value');

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Transform array to object
  const config = data.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});

  return Response.json(config, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
```

### 4.2 AI Prompt Fetching
**Endpoint:** `GET /api/ai/prompt/:key`

**Response:**
```json
{
  "prompt_text": "Analyze the following text...",
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "max_tokens": 150,
  "variables": {
    "text": "User input",
    "available_styles": "Array of styles"
  }
}
```

### 4.3 Content Template Fetching
**Endpoint:** `GET /api/templates/:key?lang=en`

**Response:**
```json
{
  "template_key": "onboarding_welcome_title",
  "content": "Welcome to VibeBoard!",
  "variables": null
}
```

### 4.4 Feature Flag Checking
**Endpoint:** `GET /api/features/:flag_key`

**Response:**
```json
{
  "enabled": true,
  "rollout_percentage": 100
}
```

**Client Usage:**
```typescript
// Check if feature is enabled for current user
const isEnabled = await checkFeatureFlag('enable_ai_recommendations', user.id);

if (isEnabled) {
  // Show AI recommendation UI
}
```

---

## 5. Best Practices: What to Make Dynamic

### ✅ ALWAYS Dynamic (Admin-Managed)
- **AI Prompts:** All LLM prompts for recommendations, moderation, content generation
- **Pricing:** Subscription prices, DLC pack prices, trial periods
- **Limits:** Input length, favorites count, API rate limits
- **Content:** UI text, error messages, email templates, notifications
- **Feature Flags:** Enable/disable features, gradual rollouts
- **Font Packs:** Metadata, pricing, featured status
- **System Alerts:** Maintenance notices, update prompts
- **A/B Test Configs:** Experiment variations, targeting rules

### ❌ NEVER Dynamic (Hardcoded)
- **Security Keys:** API keys, secrets (use env vars, never in DB)
- **Critical Logic:** Core styling algorithm, Unicode mappings
- **Schema Definitions:** Database schema, table structures
- **Build Configs:** Webpack, Next.js, TypeScript configs
- **Third-Party SDKs:** Stripe keys, Sentry DSN (env vars only)

### ⚠️ Context-Dependent
- **Feature Default States:** Hardcode in code, but allow admin override
- **Error Fallbacks:** Hardcoded defaults if DB unreachable
- **Local Dev Configs:** Use .env.local for development

---

## 6. Implementation Checklist

### Phase 1: Foundation (Week 8)
- [ ] Create admin database schema (all tables)
- [ ] Setup Row-Level Security policies
- [ ] Create admin user seeding script
- [ ] Build basic admin authentication flow

### Phase 2: Admin UI (Week 9)
- [ ] Create admin layout with sidebar navigation
- [ ] Build dashboard with metrics
- [ ] Implement app config editor
- [ ] Add audit logging for all changes

### Phase 3: Content Management (Week 10)
- [ ] AI prompts editor with version control
- [ ] Content templates multi-language editor
- [ ] Feature flags management with rollout controls
- [ ] System notifications creator

### Phase 4: Font Pack Management (Week 11)
- [ ] Font packs metadata editor
- [ ] Community pack review queue
- [ ] Pack file upload to Supabase Storage
- [ ] Pricing and featured controls

### Phase 5: Client Integration (Week 12)
- [ ] Client-side config fetching (/api/config)
- [ ] AI prompt fetching for recommendations
- [ ] Feature flag checking utility
- [ ] Cache strategy for config (60s TTL)

---

## 7. Security Considerations

### 7.1 Admin Access Control
```typescript
// Middleware to protect admin routes
// packages/web/middleware.ts

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createMiddlewareClient({ req: request, res: response });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Store role in header for route handlers
    request.headers.set('x-admin-role', adminUser.role);
  }

  return NextResponse.next();
}
```

### 7.2 Audit Logging
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL, -- 'update', 'delete', 'create'
  resource_type TEXT, -- 'config', 'prompt', 'template', 'feature_flag'
  resource_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_admin ON admin_audit_log(admin_id, created_at DESC);
CREATE INDEX idx_audit_log_resource ON admin_audit_log(resource_type, resource_id);
```

### 7.3 Rate Limiting
- Admin endpoints: 100 requests/minute per admin
- Config fetch endpoint: 1000 requests/minute (public)
- AI prompt updates: Max 10/hour to prevent abuse

---

## 8. Monitoring & Alerts

### 8.1 Config Change Alerts
**Trigger alerts for:**
- Maintenance mode enabled
- Pricing changes (notify finance team)
- Feature flag rollbacks (potential issue)
- AI prompt failures (high error rate)

**Alert Channels:**
- Slack: #admin-changes
- Email: admin-team@vibeboard.app
- Sentry: High priority

### 8.2 Performance Monitoring
**Metrics to Track:**
- Config fetch latency (target: <50ms)
- AI prompt execution time (target: <2s)
- Admin panel load time (target: <1s)
- Cache hit rate for configs (target: >90%)

---

## 9. Example: AI Prompt Management Workflow

### Step 1: Create New Prompt
1. Admin logs into `/admin/ai-prompts`
2. Clicks "+ New Prompt"
3. Fills form:
   - **Prompt Key:** `vibe_recommendation_v2`
   - **Model:** `gpt-4o-mini`
   - **Prompt Text:** "Analyze this text for aesthetic vibes..."
   - **Variables:** `{text, available_styles}`
   - **Temperature:** 0.7
   - **Max Tokens:** 150
4. Clicks "Test Prompt" with sample data
5. Reviews output, adjusts temperature
6. Saves as **inactive** (not live yet)

### Step 2: A/B Test
1. Enable both `vibe_recommendation_v1` (50%) and `v2` (50%)
2. Monitor metrics:
   - Acceptance rate (user taps suggested style)
   - Cost per request
   - User satisfaction (implicit: session duration)
3. After 1 week, review results
4. Winner: `v2` (35% acceptance vs 28%)

### Step 3: Full Rollout
1. Set `v2` to 100% active
2. Disable `v1` (archive, don't delete for rollback)
3. Monitor for errors
4. Document in changelog

### Step 4: Cost Optimization
1. Review token usage in dashboard
2. Notice `v2` uses 20% fewer tokens
3. Estimated savings: $500/month
4. Share win with team 🎉

---

## 10. Documentation for Non-Technical Admins

### Admin Handbook Topics:
1. **How to Update App Config**
   - Step-by-step with screenshots
   - What each config controls
   - Rollback procedure

2. **Managing AI Prompts**
   - Best practices for prompt engineering
   - Testing before going live
   - Cost implications

3. **Content Templates**
   - Multi-language guidelines
   - Using template variables
   - Preview before publishing

4. **Feature Flags**
   - When to use gradual rollout
   - Monitoring after enabling
   - Emergency disable procedure

5. **Font Pack Moderation**
   - Review criteria
   - Rejecting inappropriate packs
   - Communicating with creators

---

## 11. Appendix: Migration from Hardcoded Values

### Example: Moving Prompts to Admin Panel
**Before (Hardcoded):**
```typescript
// packages/web/app/api/suggest/route.ts
const PROMPT = "Analyze the following text..."; // ❌ Hardcoded!

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: PROMPT }],
  temperature: 0.7,
});
```

**After (Admin-Managed):**
```typescript
// packages/web/app/api/suggest/route.ts
import { getPrompt } from '@/lib/admin/prompts';

const prompt = await getPrompt('vibe_recommendation_v1', {
  text: userInput,
  available_styles: styles.map(s => s.name)
});

const response = await openai.chat.completions.create({
  model: prompt.model, // ✅ From DB
  messages: [{ role: "user", content: prompt.prompt_text }],
  temperature: prompt.temperature,
  max_tokens: prompt.max_tokens,
});
```

---

**Document Version:** 1.0
**Last Updated:** November 7, 2025
**Next Review:** December 2025
