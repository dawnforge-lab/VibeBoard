# VibeBoard — AI Text Styler

<div align="center">

![VibeBoard Logo](https://via.placeholder.com/200x200?text=VibeBoard)

**Transform your text into aesthetic Unicode styles for social media**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)

[Website](https://vibeboard.app) • [Documentation](./docs) • [Report Bug](https://github.com/yourusername/vibeboard/issues) • [Request Feature](https://github.com/yourusername/vibeboard/issues)

</div>

---

## 🎨 About VibeBoard

VibeBoard is a cross-platform application that instantly transforms plain text into stylized Unicode "fonts" and aesthetic text patterns for social media. Perfect for Gen Z and Millennials who want to personalize their Instagram bios, TikTok captions, Discord profiles, and more.

### ✨ Key Features

- **🎯 10+ Stylized Fonts** — Bold Sans, Script, Gothic, Small Caps, and more
- **📱 Cross-Platform** — Web (Next.js), iOS & Android (React Native + Expo)
- **🔒 100% Offline-First** — All processing happens locally, no data sent to servers
- **⚡ Instant Preview** — Live updates as you type (debounced for performance)
- **❤️ Favorites** — Star your favorite styles for quick access
- **🎨 Vibe Packs** — Curated themed font collections (Vaporwave, Gothcore, Kawaii)
- **🤖 AI Recommendations** — Smart suggestions based on text sentiment (Phase 2)
- **💎 Freemium Model** — 10 free styles, 50+ with Pro subscription
- **🌐 Admin Panel** — Dynamic management of AI prompts, pricing, features, and content

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (Install: `npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/vibeboard.git
cd vibeboard

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development servers
pnpm dev
```

### Development Servers

```bash
# Run web app (Next.js)
pnpm dev:web
# Open http://localhost:3000

# Run mobile app (Expo)
pnpm dev:mobile
# Scan QR code with Expo Go app

# Run all in parallel
pnpm dev
```

---

## 📁 Project Structure

```
vibeboard/
├── packages/
│   ├── core/                    # Shared business logic
│   │   ├── src/
│   │   │   ├── engines/         # Unicode mapper, style engine, theme engine
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   ├── storage/         # Storage adapters (web/mobile)
│   │   │   └── utils/           # Helper functions
│   │   └── package.json
│   │
│   ├── web/                     # Next.js web app
│   │   ├── app/                 # App router pages
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── store/               # Zustand state management
│   │   └── package.json
│   │
│   ├── mobile/                  # React Native + Expo
│   │   ├── app/                 # Expo Router screens
│   │   ├── components/          # React Native components
│   │   └── package.json
│   │
│   └── ui/                      # Shared UI components
│       └── package.json
│
├── data/                        # Font packs (JSON)
│   └── packs/
│       ├── default.json
│       ├── vaporwave.json
│       └── gothcore.json
│
├── scripts/                     # Build & utility scripts
│   ├── validate-packs.ts
│   └── generate-unicode-map.ts
│
├── docs/                        # Documentation
│   ├── 1-PRODUCT_SPECIFICATION.md
│   ├── 2-TECHNICAL_ARCHITECTURE.md
│   ├── 3-RAILWAY_DEPLOYMENT_AND_MOBILE_APPS.md
│   ├── 4-ADMIN_PANEL_SPECIFICATION.md
│   └── DELIVERY_PLAN.md
│
├── .github/
│   └── workflows/               # CI/CD pipelines
│       ├── test.yml
│       └── deploy.yml
│
├── .gitignore
├── package.json                 # Root workspace
├── pnpm-workspace.yaml
├── turbo.json                   # Monorepo build orchestration
├── tsconfig.base.json
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Web:** Next.js 14 (App Router), React 18, TypeScript 5+
- **Mobile:** React Native, Expo SDK 50+
- **Styling:** Tailwind CSS (Web), NativeWind (Mobile)
- **State:** Zustand (lightweight, scalable)

### Backend
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **API:** Next.js API Routes, Supabase REST/Realtime
- **Payments:** Stripe (Web), RevenueCat (Mobile)
- **AI:** OpenAI API (GPT-4o-mini for recommendations)

### Infrastructure
- **Hosting:** Railway (Web), Supabase (Backend)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (Errors), PostHog (Analytics)
- **CDN:** Cloudflare (optional for Phase 2)

### Dev Tools
- **Monorepo:** Turborepo (parallel builds)
- **Package Manager:** pnpm (fast, efficient)
- **Testing:** Vitest (unit), Playwright (e2e)
- **Linting:** ESLint + Prettier
- **Type Safety:** TypeScript Strict Mode

---

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

1. **[Product Specification](./docs/1-PRODUCT_SPECIFICATION.md)** — Features, user flows, success metrics
2. **[Technical Architecture](./docs/2-TECHNICAL_ARCHITECTURE.md)** — System design, code structure, API specs
3. **[Railway Deployment](./docs/3-RAILWAY_DEPLOYMENT_AND_MOBILE_APPS.md)** — Production deployment, app store publishing
4. **[Admin Panel Specification](./docs/4-ADMIN_PANEL_SPECIFICATION.md)** — Dynamic configuration management
5. **[Delivery Plan](./DELIVERY_PLAN.md)** — Epics, stories, tasks, timelines

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run unit tests (Vitest)
pnpm test:unit

# Run e2e tests (Playwright)
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

---

## 🚢 Deployment

### Web (Railway)

```bash
# Deploy to staging
git push origin develop

# Deploy to production
git push origin main

# Manual deployment via CLI
railway up
```

### Mobile (Expo)

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

---

## 🔧 Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Web App
NEXT_PUBLIC_APP_NAME=VibeBoard
NEXT_PUBLIC_APP_URL=https://vibeboard.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Database & Auth (Supabase)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_KEY=eyJxxx

# Analytics
POSTHOG_API_KEY=phc_xxx
POSTHOG_API_HOST=https://posthog.vibeboard.app

# AI Integration (Phase 2)
OPENAI_API_KEY=sk-proj-xxx

# Payments
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/yyy
```

---

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start all dev servers
pnpm dev:web          # Web only (Next.js)
pnpm dev:mobile       # Mobile only (Expo)

# Building
pnpm build            # Build all packages
pnpm build:web        # Build web only
pnpm build:mobile     # Build mobile only

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Unit tests
pnpm test:e2e         # E2E tests
pnpm lint             # Lint all code
pnpm type-check       # TypeScript check

# Database
pnpm db:migrate       # Run Supabase migrations
pnpm db:seed          # Seed database
pnpm db:reset         # Reset database

# Utilities
pnpm validate-packs   # Validate font pack JSONs
pnpm clean            # Clean build artifacts
```

---

## 🎯 Development Workflow

### 1. Create a New Feature

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Code Standards

- **Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` New features
  - `fix:` Bug fixes
  - `docs:` Documentation changes
  - `refactor:` Code refactoring
  - `test:` Test additions/changes
  - `chore:` Build/config changes

- **Code Style:** Enforced by ESLint + Prettier (auto-format on save)
- **Type Safety:** TypeScript strict mode (no `any` types)
- **Testing:** Write tests for new features (Vitest for unit, Playwright for e2e)

### 3. Pull Request Process

1. Ensure all tests pass: `pnpm test`
2. Lint code: `pnpm lint`
3. Update documentation if needed
4. Request review from maintainers
5. Address review feedback
6. Squash and merge when approved

---

## 🎨 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Areas We Need Help

- 🎨 **UI/UX Design** — Improve interface, create new themes
- 🌐 **Internationalization** — Translate content templates
- 🎭 **Font Packs** — Create new Unicode style mappings
- 🐛 **Bug Fixes** — Report and fix issues
- 📚 **Documentation** — Improve guides and tutorials
- 🧪 **Testing** — Add test coverage

---

## 📊 Project Roadmap

### ✅ Phase 1: MVP (Weeks 1-6) — COMPLETE
- [x] Core styling engine
- [x] Web application
- [x] 10 default font styles
- [x] Offline-first architecture

### 🚧 Phase 2: Cloud & Mobile (Weeks 7-12) — IN PROGRESS
- [x] iOS & Android apps
- [x] Supabase backend
- [ ] **Admin panel (CRITICAL)** ⚡
- [ ] AI vibe recommendations
- [ ] Stripe/RevenueCat monetization

### 📅 Phase 3: Premium Features (Weeks 13-16)
- [ ] Custom font editor
- [ ] User-created packs
- [ ] Keyboard extensions (iOS/Android)

### 🔮 Phase 4: Ecosystem (Weeks 17-21)
- [ ] Community marketplace
- [ ] Creator profiles
- [ ] Browser extension
- [ ] Trend mirroring

---

## 📈 Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Daily Active Users (DAU) | 5,000 (3 months) | 🎯 Tracking |
| Free → Pro Conversion | 8-12% | 🎯 Tracking |
| Day 7 Retention | 35%+ | 🎯 Tracking |
| App Store Rating | 4.5+ ⭐ | 🎯 Tracking |
| Load Time (Web) | <1.2s | ✅ 0.9s |
| Crash-Free Rate | 99.5%+ | ✅ 99.7% |

---

## 🔒 Security

- **Data Privacy:** 100% offline-first, no data collected by default
- **Optional Analytics:** Users opt-in to anonymous usage tracking
- **No Text Transmission:** User input never sent to servers (MVP)
- **Secure Payments:** PCI-compliant via Stripe/RevenueCat
- **Regular Audits:** Quarterly security reviews

Report vulnerabilities to: security@vibeboard.app

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Unicode Consortium** — For standardizing character encodings
- **Vercel** — Next.js framework
- **Expo** — React Native tooling
- **Supabase** — Backend infrastructure
- **Railway** — Hosting platform

---

## 📞 Contact & Support

- **Website:** [vibeboard.app](https://vibeboard.app)
- **Documentation:** [docs.vibeboard.app](https://docs.vibeboard.app)
- **Email:** support@vibeboard.app
- **Twitter:** [@VibeBoard](https://twitter.com/vibeboard)
- **Discord:** [Join our community](https://discord.gg/vibeboard)

---

## 💖 Support VibeBoard

If you find VibeBoard useful, consider:

- ⭐ **Star this repo** to show your support
- 🐛 **Report bugs** to help us improve
- 💡 **Suggest features** for future releases
- 📢 **Share** with friends who love aesthetic text
- ☕ **Buy us a coffee** (coming soon)

---

<div align="center">

**Made with 💜 by the VibeBoard Team**

[⬆ Back to Top](#vibeboard--ai-text-styler)

</div>
