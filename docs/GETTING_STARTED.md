# VibeBoard — Getting Started Guide

This guide will help you set up the VibeBoard development environment on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.20.0 or higher ([Download](https://nodejs.org/))
  ```bash
  node --version  # Should be v18.20.0 or higher
  ```

- **pnpm** 8.0.0 or higher
  ```bash
  npm install -g pnpm
  pnpm --version  # Should be 8.0.0 or higher
  ```

- **Git** ([Download](https://git-scm.com/))
  ```bash
  git --version
  ```

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dawnforge-lab/VibeBoard.git
cd VibeBoard
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

This will install dependencies for all packages in the monorepo (core, web, mobile, ui).

### 3. Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# For local development, the defaults should work fine
```

**Note:** Most environment variables are optional for Phase 1 (MVP). They'll be needed in Phase 2 when we add cloud features.

## Running the Application

### Web Application (Next.js)

```bash
# Start the web development server
pnpm dev:web

# Or use turbo to run all dev servers
pnpm dev
```

The web application will be available at:
- **Local:** http://localhost:3000
- **Network:** http://[your-ip]:3000

### Build for Production

```bash
# Build all packages
pnpm build

# Build only web
pnpm build:web
```

## Development Workflow

### Project Structure

```
vibeboard/
├── packages/
│   ├── core/          # Shared business logic
│   ├── web/           # Next.js web app
│   ├── mobile/        # React Native app (Phase 2)
│   └── ui/            # Shared UI components
├── data/
│   └── packs/         # Font pack JSONs
├── scripts/           # Build & utility scripts
├── docs/              # Documentation
└── .github/           # CI/CD workflows
```

### Available Commands

```bash
# Development
pnpm dev              # Start all dev servers (web + mobile)
pnpm dev:web          # Start web only
pnpm dev:mobile       # Start mobile only (Phase 2)

# Building
pnpm build            # Build all packages
pnpm build:web        # Build web only
pnpm build:mobile     # Build mobile only

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Unit tests only
pnpm test:e2e         # E2E tests only
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report

# Linting & Formatting
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Type Checking
pnpm type-check       # Run TypeScript type checking

# Utilities
pnpm validate-packs   # Validate font pack JSONs
pnpm clean            # Clean build artifacts
```

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Code is automatically linted and formatted on commit (via Husky)
   - Type checking runs automatically

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation changes
   - `refactor:` Code refactoring
   - `test:` Test additions/changes
   - `chore:` Build/config changes

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## IDE Setup

### VS Code (Recommended)

We recommend using Visual Studio Code with the following extensions:

- **ESLint** - For linting
- **Prettier** - For code formatting
- **TypeScript Vue Plugin (Volar)** - For better TypeScript support
- **Tailwind CSS IntelliSense** - For Tailwind class suggestions
- **Error Lens** - Inline error highlighting

When you open the project in VS Code, you'll be prompted to install recommended extensions.

### VS Code Settings

The project includes workspace settings that:
- Auto-format on save
- Run ESLint on save
- Configure correct file associations

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev:web
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript definitions
pnpm type-check

# Clear Next.js cache
rm -rf packages/web/.next
pnpm dev:web
```

### Husky Hooks Not Running

```bash
# Reinstall Husky
pnpm prepare
git config core.hooksPath .husky
```

## Next Steps

- Read the [Technical Architecture](../2-TECHNICAL_ARCHITECTURE.md)
- Review the [Delivery Plan](../DELIVERY_PLAN.md)
- Check out the [Product Specification](../1-PRODUCT_SPECIFICATION.md)
- Explore the codebase starting with `packages/web/app/page.tsx`

## Getting Help

- **Documentation:** Check the `/docs` folder
- **Issues:** Report bugs on GitHub Issues
- **Questions:** Ask in GitHub Discussions

## Phase-Specific Setup

### Phase 2: Cloud & Mobile (Future)

When Phase 2 begins, you'll need to:

1. **Set up Supabase**
   - Create a Supabase project
   - Add database credentials to `.env.local`
   - Run migrations: `pnpm db:migrate`

2. **Set up Stripe**
   - Create Stripe account
   - Add API keys to `.env.local`

3. **Mobile Development**
   - Install Expo CLI: `npm install -g @expo/cli`
   - Install Expo Go app on your phone
   - Run: `pnpm dev:mobile`

## Success Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed
- [ ] Dependencies installed successfully
- [ ] `.env.local` created
- [ ] Web app runs at http://localhost:3000
- [ ] Can type text and see styled versions
- [ ] VS Code extensions installed
- [ ] Pre-commit hooks working

---

**Happy coding! 🎨**
