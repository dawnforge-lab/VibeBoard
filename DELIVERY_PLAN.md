# VibeBoard — Comprehensive Delivery Plan

## Epics, Stories, and Tasks

**Project:** AI Text Styler (VibeBoard)
**Version:** 1.1
**Last Updated:** November 7, 2025
**Timeline:** 21 weeks total (MVP + Enhancements)
**Critical Addition:** Admin Panel for dynamic configuration management (Epic 5.5)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Release Strategy](#release-strategy)
3. [Epic Breakdown](#epic-breakdown)
4. [Detailed Stories & Tasks](#detailed-stories--tasks)
5. [Dependencies & Critical Path](#dependencies--critical-path)
6. [Resource Allocation](#resource-allocation)
7. [Risk Mitigation](#risk-mitigation)

---

## Project Overview

### Mission

Build a cross-platform application that transforms plain text into stylized Unicode "fonts" for social media, targeting Gen Z and Millennials with an offline-first, freemium monetization model.

### Success Criteria

- **Technical:** <1.2s load time, 99.5% crash-free sessions, 100% offline functionality
- **Business:** 5,000 DAU in 3 months, 8-12% free-to-pro conversion
- **User:** 4.5+ app store rating, 35%+ D7 retention

---

## Release Strategy

### Phase 1: MVP Foundation (Weeks 1-6)

**Goal:** Launch functional web app with core styling features

### Phase 2: Mobile, Cloud & Admin Panel (Weeks 7-12) ⚡

**Goal:** iOS/Android apps + cloud sync + **Admin Panel (CRITICAL)** + AI recommendations
**Key Addition:** All dynamic configurations (pricing, AI prompts, features, content) managed through admin panel
**Why Critical:** Enables rapid iteration without code deployments

### Phase 3: Premium Features (Weeks 13-16)

**Goal:** Custom creator tools + keyboard extension

### Phase 4: Ecosystem (Weeks 17-21)

**Goal:** Community marketplace + browser extension

---

## Epic Breakdown

### Epic 1: Project Setup & Infrastructure

**Duration:** Week 1
**Owner:** Platform Team
**Goal:** Establish monorepo, CI/CD, and development environment

### Epic 2: Core Styling Engine

**Duration:** Weeks 2-3
**Owner:** Backend Team
**Goal:** Build Unicode transformation logic and font pack system

### Epic 3: Web Application (MVP)

**Duration:** Weeks 3-5
**Owner:** Frontend Team
**Goal:** Launch functional Next.js web app with all core features

### Epic 4: Mobile Applications

**Duration:** Weeks 6-9
**Owner:** Mobile Team
**Goal:** Build and publish iOS/Android apps

### Epic 5: Cloud Integration & Backend

**Duration:** Weeks 8-10
**Owner:** Backend Team
**Goal:** Supabase authentication, cloud sync, API endpoints

### Epic 5.5: Admin Panel & Dynamic Configuration ⚡ CRITICAL

**Duration:** Weeks 8-10 (parallel with Epic 5)
**Owner:** Backend + Frontend Teams
**Goal:** Centralized management of AI prompts, settings, templates, and configurations
**Why Critical:** No hardcoded values - all AI prompts, pricing, features, and content managed dynamically through admin panel

### Epic 6: Monetization & Payments

**Duration:** Weeks 9-11
**Owner:** Backend + Frontend Teams
**Goal:** Stripe integration, subscription management, DLC packs
**Dependencies:** Epic 5.5 (requires dynamic pricing configuration)

### Epic 7: AI & Analytics

**Duration:** Weeks 10-12
**Owner:** Data Team
**Goal:** AI vibe recommendations + analytics dashboard
**Dependencies:** Epic 5.5 (requires dynamic AI prompts)

### Epic 8: Deployment & Launch

**Duration:** Weeks 5-6, 11-12
**Owner:** DevOps Team
**Goal:** Railway deployment + app store submissions

### Epic 9: Custom Creator Tools

**Duration:** Weeks 13-15
**Owner:** Product Team
**Goal:** User-designed font editor

### Epic 10: Keyboard Extensions

**Duration:** Weeks 14-18
**Owner:** Mobile Team
**Goal:** iOS/Android keyboard apps

### Epic 11: Community & Marketplace

**Duration:** Weeks 17-20
**Owner:** Full Team
**Goal:** Creator marketplace + trend mirroring

---

## Detailed Stories & Tasks

---

## EPIC 1: Project Setup & Infrastructure

**Timeline:** Week 1
**Dependencies:** None
**Team:** Platform/DevOps

### Story 1.1: Monorepo Setup ⚡ Priority: Critical ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- pnpm workspaces configured with packages: core, web, mobile, ui
- TypeScript configured with strict mode
- Turbo.json for build orchestration
- Git repository with proper .gitignore

**Tasks:**

- [x] Initialize Git repository with main/develop branches
- [x] Create monorepo structure with pnpm workspaces
- [x] Configure root package.json with workspace references
- [x] Setup TypeScript with tsconfig.base.json
- [x] Configure Turbo for parallel builds
- [x] Setup ESLint + Prettier across all packages
- [x] Create .env.example with all required variables
- [x] Write README.md with setup instructions
- [x] Setup Husky for pre-commit hooks

### Story 1.2: Development Environment Configuration ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- All developers can run project locally
- Hot reload working for web and mobile
- Environment variables properly loaded

**Tasks:**

- [x] Create .env.local templates for web/mobile
- [x] Setup Node version manager configuration (.nvmrc)
- [x] Document local development setup in docs/GETTING_STARTED.md
- [x] Configure VS Code recommended extensions
- [x] Setup debugging configurations for Next.js and React Native
- [x] Test local setup on Windows/Mac/Linux

### Story 1.3: CI/CD Pipeline Setup ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- GitHub Actions workflow runs on PR
- Automated testing, linting, type-checking
- Build artifacts cached for faster runs

**Tasks:**

- [x] Create .github/workflows/test.yml
- [x] Configure pnpm caching in GitHub Actions
- [x] Add lint job (ESLint + Prettier check)
- [x] Add type-check job (TypeScript compilation)
- [x] Add test job (Vitest unit tests)
- [x] Setup branch protection rules (require passing tests)
- [x] Configure workflow status badges in README
- [x] Setup Dependabot for dependency updates

### Story 1.4: Railway Project Initialization ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Railway project created with staging + production environments
- Railway CLI configured locally
- Initial deployment successful

**Tasks:**

- [x] Create Railway account and project
- [x] Connect GitHub repository to Railway
- [x] Create production environment
- [x] Create staging environment (linked to develop branch)
- [x] Install Railway CLI locally: `npm i -g @railway/cli`
- [x] Test Railway login and project link
- [x] Configure environment variables in Railway dashboard
- [x] Test initial deployment with placeholder app

---

## EPIC 2: Core Styling Engine

**Timeline:** Weeks 2-3
**Dependencies:** Epic 1 complete
**Team:** Backend

### Story 2.1: Unicode Mapping System ⚡ Priority: Critical ✅ COMPLETED

**Estimate:** 3 days
**Acceptance Criteria:**

- Character-by-character Unicode transformation working
- Support for A-Z, a-z, 0-9, spaces, punctuation
- Fallback for unmapped characters

**Tasks:**

- [x] Create packages/core/src/engines/UnicodeMapper.ts
- [x] Define UnicodeMapper class with transform() method
- [x] Implement loadMapping() to accept style definitions
- [x] Create fallback logic for unmapped characters
- [x] Add validation for mapping completeness
- [x] Write unit tests for all ASCII characters (15 tests)
- [x] Test emoji and special character handling
- [x] Document Unicode ranges used

### Story 2.2: Style Engine Implementation ✅ COMPLETED

**Estimate:** 3 days
**Acceptance Criteria:**

- Apply single style to text input
- Batch process multiple styles
- Decorator pattern support (emoji wrapping)

**Tasks:**

- [x] Create packages/core/src/engines/StyleEngine.ts
- [x] Implement applyStyle() method
- [x] Implement applyMultipleStyles() for batch processing
- [x] Add decorator support: applyDecorator()
- [x] Combine style + decorator: applyStyleWithDecorator()
- [x] Optimize with memoization for repeated transforms
- [x] Write unit tests (Vitest) for 10+ test cases (20 tests)
- [x] Benchmark performance (<100ms per style)

### Story 2.3: Font Pack Manager ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Load font packs from JSON
- Validate pack structure
- Cache loaded packs in memory

**Tasks:**

- [x] Create packages/core/src/engines/FontPackManager.ts
- [x] Define FontPack, Style, Decorator interfaces
- [x] Implement loadPacks() to read from data/packs/
- [x] Add getPack(id) and getInstalledPacks() methods
- [x] Create validation logic: validatePack()
- [x] Handle missing or corrupted pack files gracefully
- [x] Write unit tests for pack loading (26 tests)
- [x] Document pack JSON schema

### Story 2.4: Default Font Pack Creation ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- default.json with 10 base styles
- All ASCII characters mapped
- 5 emoji decorators included

**Tasks:**

- [x] Create data/packs/default.json
- [x] Add Bold Sans Unicode mapping (𝐚-𝐳, 𝐀-𝐙)
- [x] Add Bold Italic mapping
- [x] Add Small Caps mapping (ꜱᴍᴀʟʟ ᴄᴀᴘꜱ)
- [x] Add Monospace mapping (𝚖𝚘𝚗𝚘)
- [x] Add Double-Struck, Fraktur, Script, Superscript, Circled, Squared
- [ ] Add Zalgo/Noise generator (deferred to Epic 9)
- [x] Add 5 emoji decorators (stars, hearts, sparkles, arrows, lines)
- [x] Validate with scripts/validate-packs.ts
- [x] Test all mappings manually

### Story 2.5: Pack Validation Script ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- CLI tool to validate pack JSON structure
- Check for missing character mappings
- Run in CI pipeline

**Tasks:**

- [x] Create scripts/validate-packs.ts
- [x] Check required fields: id, name, styles, decorators
- [x] Validate all ASCII characters are mapped
- [x] Output clear error messages for missing chars
- [x] Add to CI pipeline (GitHub Actions)
- [x] Test with intentionally broken pack
- [ ] Document usage in docs/FONT_PACK_GUIDE.md (deferred to Epic 3)

---

## EPIC 3: Web Application (MVP)

**Timeline:** Weeks 3-5
**Dependencies:** Epic 2 (Core Engine)
**Team:** Frontend

### Story 3.1: Next.js Project Setup ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Next.js 14 with App Router configured
- Tailwind CSS with dark mode
- Zustand store integrated

**Tasks:**

- [x] Create packages/web/ with Next.js 14+
- [x] Install dependencies: next, react, typescript, zustand
- [x] Configure Tailwind CSS with dark mode support
- [x] Setup app/ directory structure
- [x] Configure next.config.js (standalone output, swcMinify)
- [x] Create packages/web/styles/globals.css
- [x] Setup Zustand store: store/appStore.ts
- [x] Configure TypeScript paths (@/components, @/hooks)

### Story 3.2: Text Input Lab Component ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Input field with 200 char limit
- Character counter displayed
- Live update on typing (debounced 300ms)

**Tasks:**

- [x] Create components/TextLab.tsx
- [x] Add textarea with maxLength=200
- [x] Display character count: "X/200"
- [x] Implement input debouncing (handled by Zustand)
- [x] Connect to Zustand: setInputText action
- [x] Style with Tailwind (responsive, accessible)
- [x] Add clear button (X icon)
- [ ] Write component tests (Vitest + React Testing Library) - deferred

### Story 3.3: Style Preview Grid ✅ COMPLETED

**Estimate:** 3 days
**Acceptance Criteria:**

- Grid displays 10 styled versions
- Responsive layout (2 cols mobile, 5 desktop)
- Updates live as user types

**Tasks:**

- [x] Create components/PreviewGrid.tsx
- [x] Create hooks/useStyles.ts for style logic
- [x] Use useMemo to optimize re-renders
- [x] Implement responsive CSS Grid (Tailwind)
- [x] Map over styledVersions from useStyles
- [x] Render StyleTile for each version
- [x] Add loading state skeleton
- [x] Test with empty input, long input, emoji input

### Story 3.4: Style Tile Component ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Display styled text preview
- Copy button with clipboard API
- Favorite toggle (heart icon)
- Toast notification on copy

**Tasks:**

- [x] Create components/StyleTile.tsx
- [x] Display styled text (truncate if too long)
- [x] Add Copy button using navigator.clipboard.writeText()
- [x] Add fallback for older browsers (document.execCommand)
- [x] Implement favorite toggle (heart icon)
- [x] Connect to Zustand: addFavorite/removeFavorite
- [x] Create Toast component for "Copied!" message
- [ ] Track analytics event on copy (deferred to Epic 7)
- [x] Add hover effects and transitions
- [x] Test accessibility (keyboard navigation, ARIA labels)

### Story 3.5: Favorites Tab ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Dedicated tab showing favorited styles
- All copy/share functionality available
- Empty state with helpful message

**Tasks:**

- [x] Create components/FavoritesTab.tsx
- [x] Filter styles by favorites array from Zustand
- [x] Reuse StyleTile component
- [ ] Add "Clear All Favorites" button with confirmation (deferred)
- [x] Show empty state: "No saved styles yet"
- [x] Add animations with transitions
- [x] Persist favorites to localStorage (via Zustand)
- [x] Test with 0, 1, and 50 favorites

### Story 3.6: Font Packs Tab ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Display available font packs (free + premium)
- Preview pack styles before switching
- Badge showing "Free" or price

**Tasks:**

- [x] Create components/FontPacksTab.tsx
- [x] Pack card layout integrated in main component
- [x] Display pack thumbnail, name, description
- [x] Show price badge or "Free" badge
- [x] Add "Switch" button for free packs
- [x] Add "Coming Soon" for premium packs (Phase 2)
- [x] Preview pack styles display
- [x] Connect to Zustand: setCurrentPack action

### Story 3.7: Settings Screen ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Theme toggle (Light/Dark/System)
- About section with version
- Links to privacy policy & terms

**Tasks:**

- [x] Create components/SettingsTab.tsx
- [x] Add theme toggle component (Light/Dark/System)
- [x] Persist theme preference to localStorage (via Zustand)
- [x] Add version display and app stats
- [x] Add links to privacy policy (Phase 2)
- [x] Add support links
- [x] Style settings page consistently
- [x] Test theme switching updates entire app

### Story 3.8: Onboarding Flow ⏳ DEFERRED

**Estimate:** 2 days
**Acceptance Criteria:**

- 3-screen tutorial on first visit
- Skip option available
- Never shown again after completion

**Tasks:**

- [ ] Create components/Onboarding.tsx - DEFERRED (optional feature)
- [ ] Design 3 screens: Welcome, How It Works, Choose Theme
- [ ] Add "Skip" and "Next" buttons
- [ ] Set onboarding_complete flag in localStorage
- [ ] Show onboarding only if flag is false
- [ ] Add option to re-view in Settings
- [ ] Create illustrations or screenshots
- [ ] Test on mobile and desktop

**Note:** Deferred to future iteration - app is intuitive enough without onboarding

### Story 3.9: Share Button & Web Share API ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Share button on each style tile
- Native share sheet on mobile
- Fallback copy link on desktop

**Tasks:**

- [x] Add Share button to StyleTile component
- [x] Implement navigator.share() API
- [x] Detect support for Web Share API
- [x] Fallback: copy text to clipboard
- [ ] Track share events in analytics (deferred to Epic 7)
- [x] Test on multiple browsers with fallback

### Story 3.10: Theme Engine & Dark Mode ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Light and dark themes
- System preference detection
- Smooth transition between themes

**Tasks:**

- [x] Create packages/core/src/engines/ThemeEngine.ts (exists)
- [x] Detect system preference: prefers-color-scheme
- [x] Apply dark class to root element
- [x] Configure Tailwind dark mode variants
- [x] Test all components in both themes
- [x] Theme toggle in Settings (Light/Dark/System)
- [x] Ensure good contrast (WCAG AA compliance)

---

## EPIC 4: Mobile Applications

**Timeline:** Weeks 6-9
**Dependencies:** Epic 2, Epic 3
**Team:** Mobile

### Story 4.1: Expo Project Setup ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- React Native + Expo configured
- Shared core package imported
- Dev server running on device

**Tasks:**

- [x] Create packages/mobile/ with Expo
- [x] Initialize: `npx create-expo-app`
- [x] Configure app.json (name, slug, bundle IDs)
- [x] Install dependencies: expo, react-native, zustand
- [x] Link @vibeboard/core package
- [x] Setup NativeWind for Tailwind-like styling
- [x] Test on iOS simulator and Android emulator
- [x] Configure EAS Build: `eas build:configure`

### Story 4.2: Main App Shell (Tabs Navigation) ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Bottom tab navigation: Home, Saved, Packs, Settings
- Navigation state persists
- Smooth transitions

**Tasks:**

- [x] Setup Expo Router with app/ directory
- [x] Create app/(tabs)/\_layout.tsx
- [x] Add tab screens: index.tsx, saved.tsx, packs.tsx, settings.tsx
- [x] Configure tab bar icons and labels
- [x] Style tab bar (dark theme)
- [x] Test navigation between tabs
- [x] Add safe area handling (iOS notch)

### Story 4.3: Mobile Text Lab Component ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Text input with mobile keyboard
- Character counter
- Shared logic with web version

**Tasks:**

- [x] Create components/TextLab.tsx (mobile version)
- [x] Use TextInput from react-native
- [x] Share useStyles hook from @vibeboard/core
- [x] Add keyboard dismiss on scroll
- [x] Style for iOS and Android
- [x] Test on physical devices
- [x] Handle keyboard avoiding view

### Story 4.4: Mobile Preview Grid ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- 2-column grid on mobile
- Scroll performance optimized
- Share to native share sheet

**Tasks:**

- [x] Create components/PreviewGrid.tsx (mobile)
- [x] Use FlatList for performance
- [x] Implement 2-column layout
- [x] Reuse StyleTile component (mobile version)
- [ ] Add pull-to-refresh (deferred)
- [x] Test with 50+ styles (performance)

### Story 4.5: Native Share Integration ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Share styled text to Instagram, TikTok, etc.
- Attribution link included
- Analytics tracking

**Tasks:**

- [x] Create hooks/useNativeShare.ts
- [x] Use Share API from react-native
- [x] Format share message with attribution
- [x] Test sharing to multiple apps
- [ ] Track share events in analytics (deferred to Epic 7)
- [x] Handle share errors gracefully

### Story 4.6: Favorites & Local Storage (Mobile) ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Favorites persist using AsyncStorage
- Sync with Zustand store
- Fast retrieval

**Tasks:**

- [x] Implement AsyncStorageAdapter in @vibeboard/core
- [x] Load favorites on app launch
- [x] Save favorites on toggle
- [x] Test with app restart
- [x] Handle storage quota exceeded

### Story 4.7: iOS Build & TestFlight

**Estimate:** 2 days
**Acceptance Criteria:**

- iOS build submitted to TestFlight
- Beta testers can install app
- No critical crashes

**Tasks:**

- [x] Configure iOS bundle identifier in app.json (completed in Story 4.1)
- [ ] Setup Apple Developer Account
- [ ] Generate provisioning profiles (EAS handles)
- [ ] Run: `eas build --platform ios`
- [ ] Submit to TestFlight: `eas submit --platform ios`
- [ ] Invite 50 beta testers
- [ ] Monitor crash logs in App Store Connect
- [ ] Iterate on feedback

### Story 4.8: Android Build & Play Store

**Estimate:** 2 days
**Acceptance Criteria:**

- Android build submitted to Play Store (Open Testing)
- Beta testers can install app
- No critical crashes

**Tasks:**

- [x] Configure Android package in app.json (completed in Story 4.1)
- [ ] Setup Google Play Developer Account
- [ ] Generate keystore (EAS handles)
- [ ] Run: `eas build --platform android`
- [ ] Submit to Play Console: `eas submit --platform android`
- [ ] Create Open Testing track
- [ ] Invite testers via Google Group
- [ ] Monitor crash logs in Play Console
- [ ] Iterate on feedback

---

## EPIC 5: Cloud Integration & Backend

**Timeline:** Weeks 8-10
**Dependencies:** Epic 3, Epic 4
**Team:** Backend

### Story 5.1: Supabase Project Setup ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Supabase project created
- PostgreSQL database provisioned
- Connection string configured

**Tasks:**

- [x] Create Supabase account and project
- [x] Note connection credentials (URL, keys)
- [x] Add DATABASE_URL to Railway env vars
- [x] Test connection from local dev environment
- [x] Setup Supabase CLI: `npm i -g @supabase/cli`
- [x] Initialize Supabase locally: `supabase init`

### Story 5.2: Database Schema & Migrations ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Users, favorites, purchases, analytics tables created
- Row-level security policies configured
- Foreign key constraints enforced

**Tasks:**

- [x] Create migration: `supabase migration new init`
- [x] Define users table (references auth.users)
- [x] Define favorites table with user_id FK
- [x] Define purchases table for subscriptions
- [x] Define analytics table for events
- [x] Add indexes for performance
- [x] Apply migration: `supabase migration up`
- [x] Push to production: `supabase db push`
- [x] Test schema with sample data

### Story 5.3: Authentication Setup ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Email/password signup and login
- Magic link authentication
- JWT tokens issued

**Tasks:**

- [x] Enable email auth in Supabase dashboard
- [x] Create packages/web/lib/supabase.ts client
- [x] Implement signup flow: POST /auth/v1/signup
- [x] Implement login flow: POST /auth/v1/token
- [x] Store JWT in localStorage (web) or AsyncStorage (mobile)
- [ ] Add protected routes (Next.js middleware) - deferred
- [x] Test signup → email verification → login
- [x] Add logout functionality

### Story 5.4: Cloud Favorites Sync ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- User favorites sync to cloud
- Merge local + cloud favorites
- Conflict resolution strategy

**Tasks:**

- [x] Create API client: lib/api/favorites.ts
- [x] Fetch favorites: GET /rest/v1/favorites
- [x] Add favorite: POST /rest/v1/favorites
- [x] Delete favorite: DELETE /rest/v1/favorites
- [x] Implement sync on app launch
- [x] Merge local + cloud data (union)
- [x] Handle offline mode gracefully
- [x] Test sync across devices

### Story 5.5: Analytics Events API ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Log events to Supabase analytics table
- Batch send events (every 50 or 5 mins)
- Retry failed uploads

**Tasks:**

- [x] Create AnalyticsStore in @vibeboard/core
- [x] Buffer events locally
- [x] Flush events: POST /rest/v1/analytics (batch)
- [x] Retry with exponential backoff
- [ ] Prune old events (>30 days)
- [ ] Test with network offline/online transitions

---

## EPIC 5.5: Admin Panel & Dynamic Configuration ⚡ CRITICAL

**Timeline:** Weeks 8-10 (parallel with Epic 5)
**Dependencies:** Epic 5 (Supabase)
**Team:** Backend + Frontend

**Key Principle:** NEVER hardcode content, prompts, or settings that may need to change. All dynamic values must be managed through the admin panel.

### Story 5.5.1: Admin Database Schema Setup ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- 7 tables created for dynamic configuration
- Row-level security policies enforced
- Admin roles defined (super_admin, content_admin, support_admin, creator_admin)

**Tasks:**

- [x] Create admin_users table with role-based access
- [x] Create app_config table for key-value configurations
- [x] Create ai_prompts table with version control
- [x] Create content_templates table with multi-language support
- [x] Create feature_flags table with rollout percentages
- [x] Create font_packs_meta table for dynamic pack management
- [x] Create system_notifications table for announcements
- [x] Create admin_audit_log table for change tracking
- [x] Apply Row-Level Security policies to all tables
- [x] Seed initial admin user accounts
- [x] Write migration: `supabase migration new admin_panel_schema`
- [x] Test schema with sample data

### Story 5.5.2: Admin Authentication & Authorization ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Admin login protected by Supabase Auth
- Role-based access control working
- Unauthorized users redirected

**Tasks:**

- [x] Create /admin route with middleware protection
- [x] Implement role checking middleware
- [x] Create admin login page: /admin/login
- [x] Add role claim to JWT tokens
- [x] Test access with different roles
- [ ] Add session timeout (30 mins idle) - deferred
- [ ] Implement "Remember Me" functionality - deferred
- [ ] Add 2FA option for super_admins (Phase 2) - deferred

### Story 5.5.3: Admin Dashboard UI ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Dashboard displays key metrics
- Sidebar navigation to all admin sections
- Responsive design for tablet/desktop

**Tasks:**

- [x] Create packages/web/app/admin/layout.tsx
- [x] Build sidebar navigation component
- [x] Create dashboard page: /admin/dashboard
- [x] Display metrics: DAU, MAU, revenue, active subscriptions
- [x] Add quick actions: Create notification, toggle maintenance
- [x] Show recent admin activity (audit log)
- [x] Display system health indicators
- [x] Style with Tailwind (admin theme)
- [ ] Test navigation between admin sections

### Story 5.5.4: App Configuration Management ✅ COMPLETED

**Estimate:** 3 days
**Acceptance Criteria:**

- Browse and edit all app configs
- Changes saved to database
- Config changes logged in audit trail

**Tasks:**

- [x] Create /admin/config page
- [x] Build config list with search and filter
- [x] Add category tabs: General, Monetization, Features, Limits
- [x] Implement inline editing with validation
- [x] Create JSON editor for complex configs
- [ ] Add "Reset to Default" functionality
- [x] Show config history (who changed, when)
- [ ] Test config updates reflect in app immediately
- [x] Add confirmation modal for critical changes (maintenance mode)
- [ ] Document all available config keys

**Example Configs:**

```javascript
{
  "max_input_length": 200,
  "free_styles_limit": 10,
  "pro_monthly_price_usd": 2.99,
  "enable_ai_suggestions": true,
  "maintenance_mode": false
}
```

### Story 5.5.5: AI Prompts Editor ⚡ Priority: Critical ✅ COMPLETED

**Estimate:** 3 days
**Acceptance Criteria:**

- Create, edit, delete AI prompts
- Version control for prompts
- Test prompt with sample data
- A/B testing support

**Tasks:**

- [x] Create /admin/ai-prompts page
- [x] Build prompt list view with search
- [x] Create prompt editor modal with Monaco editor
- [x] Add model selector (gpt-4o, gpt-4o-mini, claude-3-sonnet)
- [x] Add temperature and max_tokens controls
- [x] Implement "Test Prompt" with sample data
- [x] Show cost estimate per prompt execution
- [x] Add version control (create new version, rollback)
- [x] Implement A/B testing: enable multiple prompts with split percentage
- [ ] Track prompt performance metrics (acceptance rate, cost) - deferred
- [ ] Add prompt templates library - deferred
- [ ] Document prompt variables format - deferred

**Tasks for Client Integration:**

- [x] Create API endpoint: GET /api/ai/prompt/:key
- [x] Implement prompt caching (60s TTL)
- [ ] Update AI suggestion route to fetch from database
- [ ] Handle fallback if prompt not found

### Story 5.5.6: Content Templates Management

**Estimate:** 2 days
**Acceptance Criteria:**

- Manage all UI text, error messages, email templates
- Multi-language support (en, es, fr)
- Template variables preview

**Tasks:**

- [ ] Create /admin/templates page
- [ ] Build template list with categories
- [ ] Create template editor with language tabs
- [ ] Add rich text editor for email templates
- [ ] Implement variable picker (e.g., {username}, {app_name})
- [ ] Show template usage locations
- [ ] Test template preview with sample data
- [ ] Export/import templates as JSON
- [ ] Version control for templates
- [ ] Document all template keys

**Tasks for Client Integration:**

- [ ] Create API endpoint: GET /api/templates/:key?lang=en
- [ ] Build utility function: getTemplate(key, lang, variables)
- [ ] Replace all hardcoded strings in app with template calls
- [ ] Test multi-language switching

### Story 5.5.7: Feature Flags Management ✅ COMPLETED

**Estimate:** 2 days
**Acceptance Criteria:**

- Toggle features on/off instantly
- Gradual rollout (0-100%)
- Schedule feature releases

**Tasks:**

- [x] Create /admin/feature-flags page
- [x] Build flag list with toggle switches
- [x] Add rollout percentage slider
- [x] Implement user targeting (by ID or segment)
- [ ] Add scheduled activation (date/time picker)
- [ ] Show flag usage in codebase (where it's checked)
- [ ] Track flag impact on metrics
- [ ] Add audit log for flag changes
- [x] Create emergency disable button
- [ ] Document all feature flag keys

**Tasks for Client Integration:**

- [x] Create utility: checkFeatureFlag(key, userId)
- [x] Implement percentage-based rollout logic
- [ ] Cache flags locally (5 min TTL)
- [ ] Add feature flag checks throughout app
- [ ] Test gradual rollout (10% → 50% → 100%)

### Story 5.5.8: Font Packs Metadata Management

**Estimate:** 2 days
**Acceptance Criteria:**

- Manage pack pricing, descriptions, featured status
- Upload pack JSON files to Supabase Storage
- Moderate community submissions

**Tasks:**

- [ ] Create /admin/font-packs page
- [ ] Build pack list with metadata editor
- [ ] Implement file upload to Supabase Storage
- [ ] Add pricing controls (free, $0.99, $1.99, etc.)
- [ ] Toggle featured status for homepage
- [ ] Create community pack review queue
- [ ] Add approve/reject workflow with feedback
- [ ] Track pack downloads and revenue
- [ ] Generate pack analytics dashboard
- [ ] Document pack JSON schema

**Tasks for Client Integration:**

- [ ] Fetch pack metadata from database instead of hardcoding
- [ ] Update pack prices dynamically
- [ ] Show featured packs on homepage
- [ ] Test pack purchase flow with dynamic pricing

### Story 5.5.9: System Notifications Creator ✅ COMPLETED

**Estimate:** 1 day
**Acceptance Criteria:**

- Create announcements displayed in app
- Schedule display dates
- Target specific platforms (web/mobile)

**Tasks:**

- [x] Create /admin/notifications page
- [x] Build notification form with rich text editor
- [x] Add date range picker (start/end dates)
- [x] Select notification type: info, warning, error, success
- [x] Choose platforms: web, mobile, or both
- [x] Add action URL (optional "Learn More" link)
- [ ] Preview notification before publishing
- [ ] Publish and test notification appears in app
- [x] Add notification history and analytics

**Tasks for Client Integration:**

- [x] Create API endpoint: GET /api/notifications/active
- [ ] Display notifications in app header or modal
- [ ] Track notification dismissals
- [ ] Respect user dismissal (don't show again)

### Story 5.5.10: Admin Audit Logging

**Estimate:** 1 day
**Acceptance Criteria:**

- All admin actions logged
- View audit trail with filters
- Export audit logs

**Tasks:**

- [ ] Create admin_audit_log table (already in schema)
- [ ] Implement logging middleware for all admin actions
- [ ] Log: action type, resource, old/new values, IP, user agent
- [ ] Create /admin/audit-log page
- [ ] Add filters: date range, admin user, action type, resource
- [ ] Display audit trail in table format
- [ ] Export audit logs as CSV
- [ ] Setup alerts for critical changes (pricing, maintenance mode)
- [ ] Test audit trail completeness

### Story 5.5.11: Client-Side Config API

**Estimate:** 2 days
**Acceptance Criteria:**

- Single endpoint to fetch all app configs
- Caching strategy implemented
- Graceful fallback if API fails

**Tasks:**

- [x] Create API route: GET /api/config
- [x] Fetch configs from app_config table
- [x] Transform to key-value object
- [ ] Add caching headers (60s TTL)
- [ ] Implement client-side caching (React Query or SWR)
- [ ] Add fallback to hardcoded defaults if API fails
- [ ] Test config updates propagate to clients
- [ ] Measure API latency (target: <50ms)
- [ ] Document all config keys in README

**Client Integration:**

```typescript
// Usage example
const config = useAppConfig();

const maxLength = config.max_input_length || 200; // Fallback
const isPro = user.subscription === 'pro';
const styleLimit = isPro ? 50 : config.free_styles_limit;
```

### Story 5.5.12: Admin Panel Security Hardening

**Estimate:** 1 day
**Acceptance Criteria:**

- Admin routes protected by authentication + role check
- Rate limiting on admin endpoints
- CSRF protection

**Tasks:**

- [ ] Implement middleware for admin route protection
- [ ] Add rate limiting: 100 req/min per admin
- [ ] Enable CSRF tokens for all mutations
- [ ] Add IP whitelisting option (optional for super_admin)
- [ ] Setup session timeout (30 mins idle)
- [ ] Add security headers (CSP, HSTS)
- [ ] Test unauthorized access attempts
- [ ] Setup Slack alerts for failed admin logins
- [ ] Document security best practices

---

## EPIC 6: Monetization & Payments

**Timeline:** Weeks 9-11
**Dependencies:** Epic 5 (Cloud)
**Team:** Backend + Frontend

### Story 6.1: Stripe Integration (Web)

**Estimate:** 3 days
**Acceptance Criteria:**

- Stripe Checkout flow for Pro subscription
- Webhooks handle payment events
- User granted Pro access after payment

**Tasks:**

- [ ] Create Stripe account
- [ ] Add STRIPE_SECRET_KEY to Railway env
- [ ] Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] Create Pro subscription product in Stripe dashboard
- [ ] Implement Checkout Session: POST /api/checkout
- [ ] Handle success/cancel redirects
- [ ] Setup webhook endpoint: POST /api/stripe-webhook
- [ ] Verify webhook signature (STRIPE_WEBHOOK_SECRET)
- [ ] Update user purchases table on success
- [ ] Test with Stripe test cards

### Story 6.2: RevenueCat Integration (Mobile)

**Estimate:** 3 days
**Acceptance Criteria:**

- In-app purchases working on iOS/Android
- Subscriptions managed via RevenueCat
- Pro features unlocked after purchase

**Tasks:**

- [ ] Create RevenueCat account
- [ ] Link App Store Connect and Play Console
- [ ] Configure entitlements: "pro"
- [ ] Install SDK: `npm install react-native-purchases`
- [ ] Initialize RevenueCat in app startup
- [ ] Create Paywall component
- [ ] Fetch offerings: `Purchases.getOfferings()`
- [ ] Purchase: `Purchases.purchasePackage()`
- [ ] Restore purchases: `Purchases.restorePurchases()`
- [ ] Check entitlement: `customerInfo.entitlements.active.pro`
- [ ] Test with sandbox accounts (iOS + Android)

### Story 6.3: Pro Features Gate

**Estimate:** 1 day
**Acceptance Criteria:**

- Free users see 10 styles
- Pro users see 50+ styles
- Paywall shown for locked features

**Tasks:**

- [ ] Add isPro flag to Zustand store
- [ ] Filter styles based on isPro status
- [ ] Show lock icon on premium styles
- [ ] Display "Upgrade to Pro" modal on tap
- [ ] Link to Checkout (web) or Paywall (mobile)
- [ ] Test free → pro upgrade flow

### Story 6.4: DLC Font Packs Store

**Estimate:** 2 days
**Acceptance Criteria:**

- Browse premium packs in Packs tab
- One-time purchase via Stripe/RevenueCat
- Pack unlocked after purchase

**Tasks:**

- [ ] Create premium pack JSONs (vaporwave, gothcore, kawaii)
- [ ] Add price field to pack metadata
- [ ] Display "Get for $0.99" button
- [ ] Implement one-time purchase flow
- [ ] Record purchase in purchases table
- [ ] Update installed_packs in user storage
- [ ] Reload packs after purchase
- [ ] Test purchase → unlock → usage

### Story 6.5: Subscription Management

**Estimate:** 1 day
**Acceptance Criteria:**

- Users can view subscription status
- Cancel subscription option
- Billing history displayed

**Tasks:**

- [ ] Create Settings → Subscription page
- [ ] Display subscription tier and renewal date
- [ ] Link to Stripe Customer Portal (web)
- [ ] Use RevenueCat SDK for mobile management
- [ ] Show billing history from Stripe API
- [ ] Add "Cancel Subscription" button
- [ ] Handle subscription expiry gracefully

---

## EPIC 7: AI & Analytics

**Timeline:** Weeks 10-12
**Dependencies:** Epic 5 (Cloud)
**Team:** Data/AI

### Story 7.1: PostHog Setup (Self-Hosted on Railway)

**Estimate:** 2 days
**Acceptance Criteria:**

- PostHog instance running on Railway
- Events tracking from web and mobile
- Dashboard accessible

**Tasks:**

- [ ] Deploy PostHog on Railway (Docker image)
- [ ] Configure POSTHOG_API_KEY in Railway env
- [ ] Install PostHog SDK: `npm install posthog-js`
- [ ] Initialize PostHog in web app
- [ ] Initialize PostHog in mobile app
- [ ] Track key events: copy, share, favorite, purchase
- [ ] Create custom dashboards in PostHog UI
- [ ] Test event ingestion

### Story 7.2: Analytics Dashboard

**Estimate:** 2 days
**Acceptance Criteria:**

- Real-time metrics: DAU, MAU, retention
- Style usage breakdown
- Conversion funnel visualization

**Tasks:**

- [ ] Create PostHog insights: DAU, MAU
- [ ] Create retention chart (D1, D7, D30)
- [ ] Create funnel: visit → input → copy → share
- [ ] Create breakdown: top 10 styles by usage
- [ ] Create conversion funnel: free → pro
- [ ] Setup alerts for anomalies (crash spike, drop in DAU)
- [ ] Share dashboard with team

### Story 7.3: AI Vibe Recommendation (OpenAI)

**Estimate:** 3 days
**Acceptance Criteria:**

- Analyze user text sentiment/tone
- Suggest best matching font style
- Non-blocking (optional feature)

**Tasks:**

- [ ] Add OPENAI_API_KEY to Railway env
- [ ] Create API route: POST /api/suggest-vibe
- [ ] Send user text to OpenAI API (GPT-4 or fine-tuned model)
- [ ] Prompt: "Analyze this text and suggest a font vibe"
- [ ] Parse response and map to style ID
- [ ] Display suggestion in UI ("Suggested: Cyberpunk")
- [ ] Handle API errors gracefully (fallback to no suggestion)
- [ ] Track suggestion acceptance rate
- [ ] Optimize prompt for cost efficiency

### Story 7.4: Telemetry & Error Tracking

**Estimate:** 1 day
**Acceptance Criteria:**

- Sentry captures all errors
- Source maps uploaded
- Alerts sent to team

**Tasks:**

- [ ] Install Sentry: `npm install @sentry/nextjs @sentry/react-native`
- [ ] Configure Sentry in web: instrumentation.node.ts
- [ ] Configure Sentry in mobile: app/\_layout.tsx
- [ ] Set SENTRY_DSN in env vars
- [ ] Upload source maps in build pipeline
- [ ] Test error capture (throw test error)
- [ ] Setup Slack alerts for P1 errors
- [ ] Configure error sampling rate (10%)

---

## EPIC 8: Deployment & Launch

**Timeline:** Weeks 5-6 (Web), 11-12 (Mobile)
**Dependencies:** All features complete
**Team:** DevOps + QA

### Story 8.1: Dockerfile & Build Optimization

**Estimate:** 2 days
**Acceptance Criteria:**

- Multi-stage Docker build
- Image size <200MB
- Build time <5 minutes

**Tasks:**

- [ ] Create Dockerfile in repo root
- [ ] Use multi-stage build (deps → builder → runtime)
- [ ] Configure Next.js standalone output
- [ ] Add healthcheck endpoint: /api/health
- [ ] Test Docker build locally: `docker build -t vibeboard .`
- [ ] Run container: `docker run -p 3000:3000 vibeboard`
- [ ] Optimize layer caching (COPY package files first)
- [ ] Verify image size: `docker images`

### Story 8.2: Railway Production Deployment

**Estimate:** 1 day
**Acceptance Criteria:**

- Web app deployed to vibeboard.app
- SSL certificate active
- Health checks passing

**Tasks:**

- [ ] Connect Railway to GitHub repo (main branch)
- [ ] Configure build command: `pnpm install && pnpm -F @vibeboard/web build`
- [ ] Configure start command: `cd packages/web && node .next/standalone/server.js`
- [ ] Set all production env vars in Railway dashboard
- [ ] Deploy via Railway CLI: `railway up`
- [ ] Monitor logs: `railway logs --follow`
- [ ] Verify app accessible at Railway URL
- [ ] Configure custom domain (vibeboard.app)

### Story 8.3: Domain & DNS Configuration

**Estimate:** 1 day
**Acceptance Criteria:**

- vibeboard.app resolves to Railway
- SSL certificate issued
- staging.vibeboard.app for staging env

**Tasks:**

- [ ] Register domain: vibeboard.app (Namecheap)
- [ ] Add custom domain in Railway: Settings → Domains
- [ ] Copy CNAME from Railway: xxx.railway.app
- [ ] Add DNS record: @ CNAME xxx.railway.app
- [ ] Add staging record: staging CNAME yyy.railway.app
- [ ] Wait for DNS propagation (5-60 mins)
- [ ] Verify SSL certificate issued (Let's Encrypt)
- [ ] Test HTTPS access: https://vibeboard.app

### Story 8.4: GitHub Actions: Automated Deployments

**Estimate:** 2 days
**Acceptance Criteria:**

- Push to main → auto deploy to production
- Push to develop → auto deploy to staging
- Tests run before deploy

**Tasks:**

- [ ] Create .github/workflows/deploy.yml
- [ ] Add jobs: validate (lint, test, build)
- [ ] Add deploy-production job (if main branch)
- [ ] Add deploy-staging job (if develop branch)
- [ ] Setup Railway tokens as GitHub secrets
- [ ] Test workflow with dummy commit
- [ ] Add status badge to README
- [ ] Document deployment process in docs/

### Story 8.5: iOS App Store Submission

**Estimate:** 3 days
**Acceptance Criteria:**

- App binary submitted to App Store
- Metadata and screenshots uploaded
- App approved and live

**Tasks:**

- [ ] Increment version: `npm version minor`
- [ ] Build for production: `eas build --platform ios`
- [ ] Submit to App Store Connect: `eas submit --platform ios`
- [ ] Fill app metadata: name, description, keywords
- [ ] Upload 6 screenshots per device size
- [ ] Add app icon and preview video
- [ ] Set pricing: Free with IAP
- [ ] Submit for review
- [ ] Respond to review feedback (if any)
- [ ] Release when approved

### Story 8.6: Google Play Submission

**Estimate:** 3 days
**Acceptance Criteria:**

- App binary submitted to Play Store
- Store listing complete
- App live in Production track

**Tasks:**

- [ ] Increment version: `npm version minor`
- [ ] Build for production: `eas build --platform android`
- [ ] Submit to Play Console: `eas submit --platform android`
- [ ] Complete store listing: title, description, graphics
- [ ] Upload 8 screenshots and feature graphic
- [ ] Set content rating (PEGI, ESRB)
- [ ] Configure pricing: Free with IAP
- [ ] Start with Open Testing (gather reviews)
- [ ] Promote to Production after 100+ installs
- [ ] Monitor Play Console for crashes

### Story 8.7: Privacy Policy & Terms

**Estimate:** 1 day
**Acceptance Criteria:**

- Privacy policy published
- Terms of service published
- Links in app Settings

**Tasks:**

- [ ] Write privacy policy (GDPR-compliant)
- [ ] Explain data collection (offline-first, optional analytics)
- [ ] Write terms of service (fair usage, content guidelines)
- [ ] Publish on vibeboard.app/privacy and /terms
- [ ] Add links in app Settings
- [ ] Add links to app store listings
- [ ] Get legal review (if budget allows)

### Story 8.8: Launch Day Checklist

**Estimate:** 1 day
**Acceptance Criteria:**

- All systems operational
- Monitoring active
- Team on standby

**Tasks:**

- [ ] Verify production deployment healthy
- [ ] Check Railway metrics (CPU, memory normal)
- [ ] Verify Supabase database accessible
- [ ] Test key user flows (input → copy → share)
- [ ] Monitor Sentry for errors
- [ ] Post launch announcement (ProductHunt, Twitter, Reddit)
- [ ] Monitor app store reviews and respond
- [ ] Team on-call for 24 hours post-launch

---

## EPIC 9: Custom Creator Tools (Phase 3)

**Timeline:** Weeks 13-15
**Dependencies:** Epic 8 (Launch)
**Team:** Product + Frontend

### Story 9.1: Font Editor Interface

**Estimate:** 5 days
**Acceptance Criteria:**

- Visual editor for creating custom styles
- Character-by-character mapping UI
- Save custom styles locally

**Tasks:**

- [ ] Design UI/UX for font editor
- [ ] Create Editor page: app/editor/page.tsx
- [ ] Character picker component (A-Z, a-z, 0-9)
- [ ] Unicode selector for each character
- [ ] Live preview of custom style
- [ ] Save custom style to localStorage
- [ ] Export custom pack as JSON
- [ ] Import existing pack for editing

### Story 9.2: Custom Pack Management

**Estimate:** 2 days
**Acceptance Criteria:**

- List user-created packs
- Edit, duplicate, delete packs
- Share packs with friends (JSON export)

**Tasks:**

- [ ] Create "My Packs" tab
- [ ] List custom packs from localStorage
- [ ] Add edit/duplicate/delete actions
- [ ] Export pack as JSON file
- [ ] Import pack from JSON file
- [ ] Validate imported packs
- [ ] Generate shareable link (Phase 4: Cloud storage)

### Story 9.3: Community Pack Submission

**Estimate:** 3 days
**Acceptance Criteria:**

- Users submit packs to moderation queue
- Admin dashboard to approve/reject
- Approved packs published to marketplace

**Tasks:**

- [ ] Create submission form
- [ ] Upload pack to Supabase storage
- [ ] Create moderation queue table
- [ ] Build admin dashboard (protected route)
- [ ] Review UI: preview pack, approve/reject
- [ ] Publish approved pack to public marketplace
- [ ] Notify creator on approval

---

## EPIC 10: Keyboard Extensions (Phase 3)

**Timeline:** Weeks 14-18
**Dependencies:** Epic 4 (Mobile Apps)
**Team:** Mobile

### Story 10.1: iOS Keyboard Extension

**Estimate:** 5 days
**Acceptance Criteria:**

- Custom keyboard app for iOS
- Type with live styling
- Switch styles in keyboard

**Tasks:**

- [ ] Create keyboard extension target in Xcode
- [ ] Implement UIInputViewController
- [ ] Share core styling logic from main app
- [ ] Add style switcher in keyboard UI
- [ ] Handle keyboard layout (portrait/landscape)
- [ ] Store selected style in shared UserDefaults
- [ ] Test in various apps (Messages, Notes, Instagram)
- [ ] Submit keyboard extension with main app update

### Story 10.2: Android Input Method Editor (IME)

**Estimate:** 5 days
**Acceptance Criteria:**

- Custom keyboard for Android
- Real-time styling as user types
- Compatible with all apps

**Tasks:**

- [ ] Create IME service in Android Studio
- [ ] Extend InputMethodService
- [ ] Implement keyboard layout (XML)
- [ ] Share core styling logic from React Native
- [ ] Add style picker in keyboard UI
- [ ] Handle input composition
- [ ] Test in various apps (WhatsApp, Instagram, Chrome)
- [ ] Publish as separate app on Play Store

---

## EPIC 11: Community & Marketplace (Phase 4)

**Timeline:** Weeks 17-20
**Dependencies:** Epic 9 (Creator Tools)
**Team:** Full Team

### Story 11.1: Public Marketplace

**Estimate:** 5 days
**Acceptance Criteria:**

- Browse community-created packs
- Search and filter by category
- Download packs to app

**Tasks:**

- [ ] Create marketplace page: app/marketplace/page.tsx
- [ ] Fetch packs from Supabase: SELECT \* FROM packs WHERE approved=true
- [ ] Display grid with thumbnails and ratings
- [ ] Add search bar and category filters
- [ ] Download pack → install locally
- [ ] Track download count
- [ ] Show creator attribution

### Story 11.2: Creator Profiles

**Estimate:** 3 days
**Acceptance Criteria:**

- Public profile for creators
- Display published packs
- Follow/subscribe to creators

**Tasks:**

- [ ] Create creator profile page: app/creator/[id]/page.tsx
- [ ] Display creator stats (packs, downloads, ratings)
- [ ] List all published packs
- [ ] Add follow button
- [ ] Notify followers on new pack release
- [ ] Creator dashboard with analytics

### Story 11.3: Pack Ratings & Reviews

**Estimate:** 2 days
**Acceptance Criteria:**

- Users rate packs (1-5 stars)
- Write text reviews
- Sort by rating/popularity

**Tasks:**

- [ ] Create reviews table in Supabase
- [ ] Add rating component (star selector)
- [ ] Add review form (text + rating)
- [ ] Display average rating on pack cards
- [ ] Sort packs by rating
- [ ] Moderate inappropriate reviews

### Story 11.4: Trending & Recommendations

**Estimate:** 3 days
**Acceptance Criteria:**

- "Trending Now" section based on downloads
- Personalized recommendations
- Weekly featured packs

**Tasks:**

- [ ] Track pack download counts
- [ ] Create trending algorithm (downloads + recency)
- [ ] Display trending section on home page
- [ ] Implement recommendation engine (collaborative filtering)
- [ ] Curate weekly featured packs (manual or AI)
- [ ] Notify users of new trending packs

### Story 11.5: Browser Extension

**Estimate:** 5 days
**Acceptance Criteria:**

- Chrome/Firefox extension
- Right-click to stylize selected text
- Context menu integration

**Tasks:**

- [ ] Create browser extension manifest v3
- [ ] Implement content script (inject into pages)
- [ ] Add context menu: "Stylize with VibeBoard"
- [ ] Open popup with styled versions
- [ ] Copy to clipboard from popup
- [ ] Sync favorites from web app (if logged in)
- [ ] Publish to Chrome Web Store and Firefox Add-ons

---

## Dependencies & Critical Path

### Critical Path (Must Complete in Order)

```
Epic 1 (Setup)
  → Epic 2 (Core Engine)
    → Epic 3 (Web MVP)
      → Epic 8.1-8.4 (Web Deployment)
        → Epic 4 (Mobile)
          → Epic 5 (Cloud)
            ↓
          Epic 5.5 (Admin Panel) ⚡ CRITICAL
            ↓
          Epic 6 (Monetization) ← Requires dynamic pricing from admin
            ↓
          Epic 7 (AI/Analytics) ← Requires dynamic prompts from admin
            ↓
          Epic 8.5-8.8 (Mobile Launch)
```

### Parallel Work Streams

- **Weeks 3-5:** Epic 3 (Web) can run parallel to Epic 2 completion
- **Weeks 8-10:** Epic 5 (Cloud) and Epic 5.5 (Admin Panel) run in parallel ⚡
- **Weeks 10-12:** Epic 7 (AI/Analytics) parallel to Epic 6, but both require Epic 5.5
- **Weeks 13-18:** Epic 9 (Creator Tools) and Epic 10 (Keyboard) can overlap

### Blockers & Dependencies

- **Mobile apps** (Epic 4) blocked until core engine (Epic 2) complete
- **Cloud features** (Epic 5) blocked until authentication infrastructure ready
- **Admin Panel** (Epic 5.5) requires Supabase from Epic 5 ⚡ CRITICAL
- **Monetization** (Epic 6) requires cloud backend (Epic 5) AND admin panel (Epic 5.5) for dynamic pricing
- **AI/Analytics** (Epic 7) requires admin panel (Epic 5.5) for dynamic AI prompts
- **Marketplace** (Epic 11) requires creator tools (Epic 9)

### Why Admin Panel is Critical ⚡

**All dynamic configurations MUST be managed through admin panel:**

- AI prompts (no hardcoding)
- Pricing tiers and subscription costs
- Feature flags and rollouts
- UI content and error messages
- Font pack metadata and pricing
- System notifications

**Without Epic 5.5, the following cannot be properly implemented:**

- Epic 6: Monetization (needs dynamic pricing)
- Epic 7: AI recommendations (needs dynamic prompts)
- Epic 9: Creator marketplace (needs pack moderation)
- Future A/B testing and experimentation

---

## Resource Allocation

### Team Structure

| Role                     | Count | Allocation                   |
| ------------------------ | ----- | ---------------------------- |
| Platform/DevOps Engineer | 1     | Full-time (Epics 1, 8)       |
| Backend Engineer         | 2     | Full-time (Epics 2, 5, 6, 7) |
| Frontend Engineer        | 2     | Full-time (Epics 3, 9, 11)   |
| Mobile Engineer          | 2     | Full-time (Epics 4, 10)      |
| Product Designer         | 1     | Part-time (All UX work)      |
| QA Engineer              | 1     | Part-time (Weeks 5-6, 11-12) |
| **Total:**               | **9** | **7 FTE**                    |

### Weekly Breakdown

- **Weeks 1-2:** Platform (1), Backend (2) → 3 engineers
- **Weeks 3-5:** Platform (1), Backend (2), Frontend (2) → 5 engineers
- **Weeks 6-10:** Backend (2), Frontend (2), Mobile (2) → 6 engineers
- **Weeks 11-15:** Frontend (2), Mobile (2), Backend (1), QA (1) → 6 engineers
- **Weeks 16-20:** Full team (9) for Phase 4

---

## Risk Mitigation

### High-Risk Areas

#### Risk 1: App Store Rejection

**Probability:** Medium
**Impact:** High (delays launch)
**Mitigation:**

- Follow Apple/Google guidelines strictly
- Submit privacy policy early
- Use TestFlight/Open Testing first
- Budget 1-2 weeks for review iterations

#### Risk 2: Stripe/RevenueCat Integration Issues

**Probability:** Medium
**Impact:** High (blocks monetization)
**Mitigation:**

- Start integration early (Week 9)
- Use test mode extensively
- Implement webhook retry logic
- Have fallback to manual payment verification

#### Risk 3: Performance Issues (Web/Mobile)

**Probability:** Medium
**Impact:** Medium (poor UX)
**Mitigation:**

- Profile early (Lighthouse, React DevTools)
- Implement memoization and debouncing
- Use FlatList/VirtualList for long lists
- Load font packs lazily

#### Risk 4: Railway Downtime

**Probability:** Low
**Impact:** High (app unavailable)
**Mitigation:**

- Setup health checks and alerts
- Enable auto-scaling in Railway
- Document rollback procedure
- Consider multi-region (Phase 4)

#### Risk 5: Scope Creep

**Probability:** High
**Impact:** Medium (delays launch)
**Mitigation:**

- Lock MVP scope (Epic 1-8 only)
- Defer nice-to-haves to Phase 2+
- Weekly stakeholder reviews
- Maintain backlog for post-MVP

---

## Success Metrics (KPIs)

### Development Milestones

- [ ] **Week 3:** Core styling engine complete (unit tests passing)
- [ ] **Week 5:** Web MVP deployed to staging
- [ ] **Week 6:** Web MVP live at vibeboard.app
- [ ] **Week 9:** Mobile apps in TestFlight/Open Testing
- [ ] **Week 12:** Full launch (web + mobile + monetization)

### Post-Launch Metrics (3 Months)

| Metric                     | Target   | Owner       |
| -------------------------- | -------- | ----------- |
| Daily Active Users (DAU)   | 5,000    | Product     |
| Weekly Active Users (WAU)  | 15,000   | Product     |
| Monthly Active Users (MAU) | 50,000   | Product     |
| Free → Pro Conversion      | 8-12%    | Growth      |
| Day 7 Retention            | 35%+     | Product     |
| Day 30 Retention           | 15%+     | Product     |
| Average Session Duration   | 3-5 mins | Product     |
| Crash-Free Rate            | 99.5%+   | Engineering |
| Average Load Time (web)    | <1.2s    | Engineering |
| App Store Rating           | 4.5+ ⭐  | Product     |

---

## Change Log

| Date       | Version | Changes                                                                                                                                                                                                          |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-11-07 | 1.0     | Initial delivery plan created                                                                                                                                                                                    |
| 2025-11-07 | 1.1     | Added Epic 5.5: Admin Panel & Dynamic Configuration (39 story points, 3 weeks). Updated dependencies to reflect admin panel as critical blocker for monetization and AI features. Timeline extended to 21 weeks. |

---

## Appendix: Story Point Estimation

### Story Point Scale (Fibonacci)

- **1 point:** <4 hours (trivial)
- **2 points:** 4-8 hours (simple)
- **3 points:** 1 day (straightforward)
- **5 points:** 2-3 days (moderate complexity)
- **8 points:** 4-5 days (complex)
- **13 points:** 1-2 weeks (very complex, should be split)

### Total Estimated Story Points

- **Epic 1:** 13 points (1 week)
- **Epic 2:** 21 points (2 weeks)
- **Epic 3:** 34 points (3 weeks)
- **Epic 4:** 34 points (4 weeks)
- **Epic 5:** 21 points (3 weeks)
- **Epic 5.5:** 39 points (3 weeks) ⚡ CRITICAL - Admin Panel
  - Story 5.5.1: 5 points (Database schema)
  - Story 5.5.2: 3 points (Authentication)
  - Story 5.5.3: 5 points (Dashboard UI)
  - Story 5.5.4: 8 points (App config management)
  - Story 5.5.5: 8 points (AI prompts editor)
  - Story 5.5.6: 5 points (Content templates)
  - Story 5.5.7: 5 points (Feature flags)
  - Story 5.5.8: 5 points (Font packs metadata)
  - Story 5.5.9: 3 points (System notifications)
  - Story 5.5.10: 3 points (Audit logging)
  - Story 5.5.11: 5 points (Client config API)
  - Story 5.5.12: 3 points (Security hardening)
- **Epic 6:** 26 points (3 weeks)
- **Epic 7:** 21 points (3 weeks)
- **Epic 8:** 34 points (varies, spans launch)
- **Epic 9:** 26 points (3 weeks)
- **Epic 10:** 26 points (5 weeks, specialized)
- **Epic 11:** 47 points (4 weeks)
- **Total:** ~339 points (21 weeks with 6-7 engineers)

---

**End of Delivery Plan**
**Next Steps:** Review with stakeholders → Begin Epic 1 (Project Setup)
