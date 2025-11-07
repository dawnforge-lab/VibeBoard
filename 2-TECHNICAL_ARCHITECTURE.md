# AI Text Styler — Technical Architecture & Implementation Guide

## Document Purpose
This document provides the complete technical blueprint for developing VibeBoard with AI assistance. It covers system architecture, code structure, key modules, API specifications, and step-by-step implementation guidance for AI tools (Claude, GitHub Copilot, etc.).

**Version:** 1.0  
**Target Audience:** Developers, AI assistants, technical leads

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Web (Next)  │  │ Mobile (RN)  │  │ Admin Panel  │       │
│  │  React/TS    │  │  Shared Code │  │ (Future)     │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼──────────────┐
│         │  BUSINESS LOGIC LAYER                              │
│  ┌──────▼────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Font Manager  │  │ Style Engine     │  │ Theme Engine │  │
│  │ (JSON maps)   │  │ (Unicode logic)  │  │ (CSS/dark)   │  │
│  └───────────────┘  └──────────────────┘  └──────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Analytics & Events (Local Cache → Cloud on Phase 2)     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────┬──────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────┐
│              STORAGE & PERSISTENCE LAYER                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ LocalStorage │  │ AsyncStorage │  │ IndexedDB    │        │
│  │ (Web prefs) │  │ (Mobile data)│  │ (Web cache)  │        │
│  └─────────────┘  └──────────────┘  └──────────────┘        │
└─────────┬──────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────┐
│            OPTIONAL CLOUD LAYER (Phase 2+)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Supabase / Firebase                                    │ │
│  │ - Authentication                                       │ │
│  │ - Cloud sync (favorites, purchases)                    │ │
│  │ - Analytics                                            │ │
│  │ - User profiles                                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Tech Stack

| Layer | Technology | Purpose | Notes |
|-------|-----------|---------|-------|
| **Web Frontend** | Next.js 14+ | Framework | SSR, static export, PWA |
| **Mobile Frontend** | React Native + Expo | Cross-platform | Code sharing, fast iteration |
| **UI Framework (Web)** | Tailwind CSS | Styling | Utility-first, dark mode built-in |
| **UI Framework (Mobile)** | React Native + NativeWind | Styling | Tailwind-like syntax for RN |
| **Language** | TypeScript | Type safety | Full codebase (strict mode) |
| **State Management** | Zustand | Store | Lightweight, scalable, easy for AI |
| **Storage (Web)** | localStorage + IndexedDB | Persistence | Sync with Zustand |
| **Storage (Mobile)** | AsyncStorage + SQLite (future) | Persistence | React Native standard |
| **Payments (Web)** | Stripe | Billing | Subscriptions + one-time purchases |
| **Payments (Mobile)** | RevenueCat | Billing | Unified SDK (iOS/Android) |
| **Analytics** | PostHog (self-hosted on Railway) | Tracking | Privacy-first, event-based |
| **Cloud Backend** | Supabase | Database + Auth | PostgreSQL, optional Phase 2 |
| **AI Integration** | OpenAI API (Phase 2) | Recommendations | Optional, non-blocking |

---

## 2. Monorepo Structure

### 2.1 Directory Layout
```
vibeboard/
├── packages/
│   ├── core/                    # Shared business logic
│   │   ├── src/
│   │   │   ├── engines/
│   │   │   │   ├── UnicodeMapper.ts    # Character transformation
│   │   │   │   ├── StyleEngine.ts      # Apply styles to text
│   │   │   │   ├── ThemeEngine.ts      # Light/dark mode
│   │   │   │   └── FontPackManager.ts  # Load/manage packs
│   │   │   ├── models/
│   │   │   │   ├── FontPack.ts         # TypeScript interfaces
│   │   │   │   ├── Style.ts            # Style definition
│   │   │   │   ├── User.ts             # User preferences
│   │   │   │   └── Analytics.ts        # Event tracking
│   │   │   ├── storage/
│   │   │   │   ├── StorageAdapter.ts   # Abstract interface
│   │   │   │   ├── LocalStorageImpl.ts  # Web implementation
│   │   │   │   └── AsyncStorageImpl.ts  # Mobile implementation
│   │   │   ├── utils/
│   │   │   │   ├── unicodeTable.ts     # Precomputed mappings
│   │   │   │   ├── validation.ts       # Input validation
│   │   │   │   └── helpers.ts          # Utility functions
│   │   │   └── index.ts                # Public API
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                     # Next.js web app
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout
│   │   │   ├── page.tsx                 # Home page
│   │   │   └── settings/
│   │   │       └── page.tsx             # Settings page
│   │   ├── components/
│   │   │   ├── TextLab.tsx              # Main input + preview
│   │   │   ├── PreviewGrid.tsx          # Style tiles
│   │   │   ├── StyleTile.tsx            # Single style card
│   │   │   ├── FontPackGrid.tsx         # Pack selector
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Toast.tsx                # Notifications
│   │   │   └── Onboarding.tsx
│   │   ├── hooks/
│   │   │   ├── useStyles.ts             # Main styling hook
│   │   │   ├── useFavorites.ts
│   │   │   ├── useStorage.ts
│   │   │   └── useAnalytics.ts
│   │   ├── store/
│   │   │   ├── appStore.ts              # Zustand app state
│   │   │   └── analyticsStore.ts        # Event buffer
│   │   ├── styles/
│   │   │   └── globals.css              # Tailwind imports
│   │   ├── public/
│   │   │   ├── fonts/                   # Font pack JSONs
│   │   │   ├── images/
│   │   │   └── manifest.json            # PWA manifest
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   ├── mobile/                  # React Native + Expo
│   │   ├── app/
│   │   │   ├── index.tsx                # Home screen
│   │   │   ├── saved.tsx                # Saved styles tab
│   │   │   ├── packs.tsx                # Font packs tab
│   │   │   └── settings.tsx             # Settings tab
│   │   ├── components/
│   │   │   ├── TextLab.tsx
│   │   │   ├── PreviewGrid.tsx
│   │   │   ├── StyleTile.tsx
│   │   │   └── Tabs.tsx
│   │   ├── hooks/
│   │   │   ├── useStyles.ts
│   │   │   └── useNativeShare.ts        # React Native share
│   │   ├── store/
│   │   │   └── appStore.ts              # Same Zustand store
│   │   ├── app.json                     # Expo config
│   │   └── package.json
│   │
│   └── ui/                      # Reusable UI components (shared)
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Grid.tsx
│       └── package.json
│
├── data/                        # Font packs data
│   ├── packs/
│   │   ├── default.json
│   │   ├── vaporwave.json
│   │   ├── gothcore.json
│   │   ├── kawaii.json
│   │   └── minimalist.json
│   ├── decorators.json          # Emoji patterns
│   └── unicode-map.ts           # Precomputed Unicode mappings
│
├── scripts/                     # Build & setup scripts
│   ├── generate-unicode-map.ts  # Build Unicode lookup tables
│   ├── validate-packs.ts        # Lint font pack JSONs
│   └── build-all.sh             # Full build script
│
├── .github/
│   ├── workflows/
│   │   ├── test.yml             # Run tests on PR
│   │   ├── deploy-web.yml       # Deploy web to Railway
│   │   └── deploy-mobile.yml    # Build mobile binaries
│   └── CONTRIBUTING.md
│
├── docs/
│   ├── GETTING_STARTED.md       # Dev setup guide
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   └── FONT_PACK_GUIDE.md
│
├── .env.example
├── .eslintrc.json
├── tsconfig.base.json           # Root TypeScript config
├── turbo.json                   # Monorepo build orchestration
├── package.json                 # Root workspace
└── README.md

```

---

## 3. Core Modules & Interfaces

### 3.1 Font Pack Manager
```typescript
// packages/core/src/engines/FontPackManager.ts

export interface FontPack {
  id: string;
  name: string;
  category: 'core' | 'aesthetic' | 'seasonal' | 'community';
  version: string;
  description: string;
  price: number; // 0 = free
  styles: Style[];
  decorators: Decorator[];
  previewImage?: string;
}

export interface Style {
  id: string;
  name: string;
  preview: string;
  mapping: Record<string, string>; // 'a' → '𝐚'
}

export interface Decorator {
  id: string;
  name: string;
  pattern: string; // '{text}' placeholder
}

class FontPackManager {
  private packs: Map<string, FontPack> = new Map();
  private loading = false;

  // Load all packs (bundled at build time)
  async loadPacks(): Promise<void>
  
  // Get single pack by ID
  getPack(id: string): FontPack | null
  
  // Get all installed packs
  getInstalledPacks(): FontPack[]
  
  // Cache installed pack list to storage
  saveInstalledPacks(packIds: string[]): Promise<void>
  
  // Validate pack structure (used in build pipeline)
  validatePack(pack: FontPack): ValidationResult
}
```

### 3.2 Unicode Style Engine
```typescript
// packages/core/src/engines/StyleEngine.ts

interface ApplyStyleOptions {
  text: string;
  styleId: string;
  decoratorId?: string;
  packId?: string;
}

interface StyledResult {
  original: string;
  styled: string;
  styleId: string;
  packId: string;
}

class StyleEngine {
  private fontManager: FontPackManager;
  private unicodeMapper: UnicodeMapper;

  // Apply single style to text
  applyStyle(options: ApplyStyleOptions): StyledResult
  
  // Apply multiple styles (batch for preview)
  applyMultipleStyles(
    text: string,
    styleIds: string[],
    packId?: string
  ): StyledResult[]
  
  // Apply decorator (wraps text with emoji)
  applyDecorator(text: string, decorator: Decorator): string
  
  // Compose style + decorator
  applyStyleWithDecorator(
    text: string,
    styleId: string,
    decoratorId: string
  ): string
}
```

### 3.3 Unicode Mapper
```typescript
// packages/core/src/engines/UnicodeMapper.ts

class UnicodeMapper {
  private mapping: Record<string, string> = {};

  // Load mapping from Style definition
  loadMapping(style: Style): void
  
  // Transform character by character
  transform(text: string): string
  
  // Validate mapping completeness (all ASCII covered?)
  validateMapping(): boolean
  
  // Fallback for unmapped chars (usually identity pass-through)
  private getFallback(char: string): string
}
```

### 3.4 Theme Engine
```typescript
// packages/core/src/engines/ThemeEngine.ts

type Theme = 'light' | 'dark' | 'system';

interface ThemeConfig {
  colors: {
    bg: string;
    text: string;
    primary: string;
    secondary: string;
  };
}

class ThemeEngine {
  private currentTheme: Theme = 'system';

  // Get theme from storage or system preference
  detectTheme(): Theme
  
  // Set theme and persist
  setTheme(theme: Theme): Promise<void>
  
  // Get CSS variables for current theme
  getThemeConfig(): ThemeConfig
  
  // Subscribe to theme changes
  onThemeChange(callback: (theme: Theme) => void): () => void
}
```

### 3.5 Storage Adapter (Abstraction Layer)
```typescript
// packages/core/src/storage/StorageAdapter.ts

export interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Web implementation
export class LocalStorageAdapter implements IStorage {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }
  // ... other methods
}

// Mobile implementation
export class AsyncStorageAdapter implements IStorage {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }
  // ... other methods
}

// Factory function for DI
export function createStorageAdapter(
  platform: 'web' | 'mobile'
): IStorage {
  return platform === 'web' ? 
    new LocalStorageAdapter() :
    new AsyncStorageAdapter();
}
```

### 3.6 Analytics Store
```typescript
// packages/core/src/models/Analytics.ts

export interface AnalyticsEvent {
  event: 'style_copied' | 'style_shared' | 'style_favorited' | 'pack_switched';
  payload: {
    styleId?: string;
    packId?: string;
    textLength?: number;
    timestamp: string;
  };
}

class AnalyticsStore {
  private events: AnalyticsEvent[] = [];
  private maxSize = 100; // Events before uploading

  // Track event locally
  track(event: AnalyticsEvent): void
  
  // Get all buffered events
  getEvents(): AnalyticsEvent[]
  
  // Clear after upload
  clearEvents(): Promise<void>
  
  // Flush to cloud (Phase 2)
  async flush(): Promise<void>
}
```

---

## 4. Web Frontend (Next.js) Implementation

### 4.1 Main Page Structure
```typescript
// packages/web/app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import TextLab from '@/components/TextLab';
import PreviewGrid from '@/components/PreviewGrid';
import Header from '@/components/Header';
import { useAppStore } from '@/store/appStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp(); // Load packs, preferences, etc.
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>; // Hydration safety

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TextLab />
        <PreviewGrid />
      </main>
    </div>
  );
}
```

### 4.2 Zustand Store
```typescript
// packages/web/store/appStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  inputText: string;
  favorites: string[];
  currentPackId: string;
  onboarding_complete: boolean;

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setInputText: (text: string) => void;
  addFavorite: (styleId: string) => void;
  removeFavorite: (styleId: string) => void;
  setCurrentPack: (packId: string) => void;
  initializeApp: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      inputText: '',
      favorites: [],
      currentPackId: 'default',
      onboarding_complete: false,

      setTheme: (theme) => set({ theme }),
      setInputText: (text) => set({ inputText: text.slice(0, 200) }),
      addFavorite: (styleId) => {
        const current = get().favorites;
        set({ favorites: [...new Set([...current, styleId])] });
      },
      // ... other actions

      initializeApp: async () => {
        // Load font packs, restore preferences
        const stored = localStorage.getItem('vibeboard_state');
        if (stored) {
          const state = JSON.parse(stored);
          set(state);
        }
      },
    }),
    {
      name: 'vibeboard_state',
      skipHydration: true, // Prevent Next.js hydration mismatch
    }
  )
);
```

### 4.3 Hook for Styling
```typescript
// packages/web/hooks/useStyles.ts

import { useAppStore } from '@/store/appStore';
import { useEffect, useMemo } from 'react';

const DEFAULT_STYLE_IDS = [
  'default_bold-sans',
  'default_bold-italic',
  'default_small-caps',
  'default_monospace',
  'default_double-struck',
  'default_fraktur',
  'default_script',
  'default_superscript',
  'default_zalgo',
  'default_emoji-stars',
];

export function useStyles() {
  const { inputText, currentPackId } = useAppStore();
  
  // Memoized styled versions
  const styledVersions = useMemo(() => {
    if (!inputText) return [];
    
    return DEFAULT_STYLE_IDS.map((styleId) => {
      const [packId, styleKey] = styleId.split('_');
      return styleEngine.applyStyle({
        text: inputText,
        styleId: styleKey,
        packId: packId || currentPackId,
      });
    });
  }, [inputText, currentPackId]);

  return { styledVersions };
}
```

### 4.4 Preview Grid Component
```typescript
// packages/web/components/PreviewGrid.tsx

'use client';

import { useStyles } from '@/hooks/useStyles';
import StyleTile from './StyleTile';

export default function PreviewGrid() {
  const { styledVersions } = useStyles();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
      {styledVersions.map((styled) => (
        <StyleTile key={styled.styleId} styled={styled} />
      ))}
    </div>
  );
}
```

### 4.5 Style Tile Component
```typescript
// packages/web/components/StyleTile.tsx

'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import Toast from './Toast';

interface Props {
  styled: StyledResult;
}

export default function StyleTile({ styled }: Props) {
  const [copied, setCopied] = useState(false);
  const { addFavorite, removeFavorite, favorites } = useAppStore();
  
  const isFavorited = favorites.includes(styled.styleId);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(styled.styled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Track analytics
    analyticsStore.track({
      event: 'style_copied',
      payload: { styleId: styled.styleId, timestamp: new Date().toISOString() },
    });
  };

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFavorite(styled.styleId);
    } else {
      addFavorite(styled.styleId);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition">
      <div className="text-center text-lg font-bold mb-3 truncate">
        {styled.styled}
      </div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={handleCopy}
          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <button
          onClick={handleToggleFavorite}
          className={`px-3 py-2 rounded text-sm ${
            isFavorited ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>
      {copied && <Toast message="Copied!" />}
    </div>
  );
}
```

---

## 5. Mobile Frontend (React Native) Implementation

### 5.1 Expo Configuration
```json
// packages/mobile/app.json

{
  "expo": {
    "name": "VibeBoard",
    "slug": "vibeboard",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.vibeboard.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.vibeboard.app"
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ]
  }
}
```

### 5.2 Main App Shell
```typescript
// packages/mobile/app/index.tsx

import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { useAppStore } from '@vibeboard/core';
import TextLab from '../components/TextLab';
import PreviewGrid from '../components/PreviewGrid';
import Tabs from '../components/Tabs';

export default function HomeScreen() {
  const [mounted, setMounted] = useState(false);
  const { initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1">
        <TextLab />
        <PreviewGrid />
      </ScrollView>
      <Tabs />
    </SafeAreaView>
  );
}
```

### 5.3 Native Share Hook
```typescript
// packages/mobile/hooks/useNativeShare.ts

import { Share } from 'react-native';

export function useNativeShare() {
  const handleShare = async (styledText: string) => {
    try {
      await Share.share({
        message: `${styledText}\n\nStyled with VibeBoard - Your aesthetic text lab 🎨`,
        url: 'https://vibeboard.app', // iOS supports URL too
        title: 'Check out my styled text!',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return { handleShare };
}
```

---

## 6. Font Pack Data Structure & Validation

### 6.1 Font Pack JSON Format
```json
{
  "id": "default",
  "name": "Essential Fonts",
  "category": "core",
  "version": "1.0.0",
  "description": "10 versatile Unicode font styles",
  "price": 0,
  "styles": [
    {
      "id": "bold-sans",
      "name": "Bold Sans",
      "preview": "𝐁𝐨𝐥𝐝",
      "mapping": {
        "a": "𝐚", "b": "𝐛", "c": "𝐜", "d": "𝐝",
        "e": "𝐞", "f": "𝐟", "g": "𝐠", "h": "𝐡",
        "i": "𝐢", "j": "𝐣", "k": "𝐤", "l": "𝐥",
        "m": "𝐦", "n": "𝐧", "o": "𝐨", "p": "𝐩",
        "q": "𝐪", "r": "𝐫", "s": "𝐬", "t": "𝐭",
        "u": "𝐮", "v": "𝐯", "w": "𝐰", "x": "𝐱",
        "y": "𝐲", "z": "𝐳",
        "A": "𝐀", "B": "𝐁", "C": "𝐂", ...
        "0": "𝟎", "1": "𝟏", ...
        " ": " ", ".": ".", ",": ","
      }
    }
  ],
  "decorators": [
    {
      "id": "stars",
      "name": "Stars",
      "pattern": "✨{text}✨"
    }
  ]
}
```

### 6.2 Pack Validation Script
```typescript
// scripts/validate-packs.ts

import fs from 'fs';
import path from 'path';
import { FontPack } from '../packages/core/src/models/FontPack';

const REQUIRED_CHARS = new Set(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?'.split('')
);

function validatePack(pack: FontPack): string[] {
  const errors: string[] = [];

  if (!pack.id || !pack.name) {
    errors.push('Pack missing id or name');
  }

  pack.styles.forEach((style) => {
    const mappedChars = new Set(Object.keys(style.mapping));
    const missing = [...REQUIRED_CHARS].filter(char => !mappedChars.has(char));
    
    if (missing.length > 0) {
      errors.push(
        `Style ${style.id} missing mappings for: ${missing.join(', ')}`
      );
    }
  });

  return errors;
}

function main() {
  const packsDir = path.join(__dirname, '../data/packs');
  const files = fs.readdirSync(packsDir).filter(f => f.endsWith('.json'));

  let totalErrors = 0;
  files.forEach(file => {
    const filePath = path.join(packsDir, file);
    const pack = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as FontPack;
    const errors = validatePack(pack);
    
    if (errors.length > 0) {
      console.error(`\n❌ ${file}:`);
      errors.forEach(e => console.error(`  - ${e}`));
      totalErrors += errors.length;
    } else {
      console.log(`✅ ${file}`);
    }
  });

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main();
```

---

## 7. Build Pipeline & Deployment Artifacts

### 7.1 Turbo Configuration (Monorepo Build Orchestration)
```json
{
  "turbo": {
    "globalDependencies": ["**/.env.local"],
    "pipeline": {
      "build": {
        "outputs": ["dist/**", "build/**", ".next/**"],
        "cache": false
      },
      "dev": {
        "cache": false
      },
      "type-check": {
        "outputs": [],
        "cache": false
      },
      "lint": {
        "outputs": [],
        "cache": false
      },
      "test": {
        "outputs": ["coverage/**"],
        "cache": false
      }
    }
  }
}
```

### 7.2 GitHub Actions: Deploy Web to Railway
```yaml
# .github/workflows/deploy-web.yml

name: Deploy Web to Railway

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
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

      - name: Run lint
        run: pnpm run lint

      - name: Run tests
        run: pnpm run test

      - name: Build web
        run: pnpm run -F @vibeboard/web build

      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
          RAILWAY_PROJECT_ID: ${{ secrets.RAILWAY_PROJECT_ID }}
          RAILWAY_SERVICE_ID: ${{ secrets.RAILWAY_SERVICE_ID }}
```

### 7.3 Build Script for All Packages
```bash
#!/bin/bash
# scripts/build-all.sh

set -e

echo "🔨 Building monorepo..."

echo "📦 Building core package..."
pnpm run -F @vibeboard/core build

echo "🌐 Building web..."
pnpm run -F @vibeboard/web build

echo "📱 Building mobile..."
pnpm run -F @vibeboard/mobile build

echo "✅ All builds complete!"
```

---

## 8. API Endpoints & Cloud Integration (Phase 2)

### 8.1 Supabase Schema
```sql
-- Auth: Supabase handles via auth.users

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE,
  username TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Favorites (cloud sync)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  style_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, style_id)
);

-- Purchases (subscription tracking)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pack_id TEXT NOT NULL,
  amount_cents INTEGER,
  currency TEXT,
  status TEXT ('pending' | 'completed' | 'failed'),
  stripe_tx_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_user_event ON analytics(user_id, event);
```

### 8.2 REST API Endpoints (Supabase Auto-Generated)
- POST `/auth/v1/signup` — Register
- POST `/auth/v1/token?grant_type=password` — Login
- GET `/rest/v1/favorites?user_id=eq.{id}` — Fetch user favorites
- POST `/rest/v1/favorites` — Add favorite
- DELETE `/rest/v1/favorites?style_id=eq.{id}` — Remove favorite
- GET `/rest/v1/purchases?user_id=eq.{id}` — Fetch user purchases
- POST `/rest/v1/purchases` — Create purchase
- POST `/rest/v1/analytics` — Log event

---

## 9. Testing Strategy

### 9.1 Unit Tests (Vitest)
```typescript
// packages/core/__tests__/StyleEngine.test.ts

import { describe, it, expect } from 'vitest';
import { StyleEngine } from '../src/engines/StyleEngine';

describe('StyleEngine', () => {
  const engine = new StyleEngine();

  it('should apply bold sans style', () => {
    const result = engine.applyStyle({
      text: 'hello',
      styleId: 'bold-sans',
      packId: 'default',
    });

    expect(result.styled).toBe('𝐡𝐞𝐥𝐥𝐨');
  });

  it('should handle emoji decorators', () => {
    const result = engine.applyStyleWithDecorator(
      'hello',
      'bold-sans',
      'stars'
    );

    expect(result).toBe('✨𝐡𝐞𝐥𝐥𝐨✨');
  });
});
```

### 9.2 Component Tests (Vitest + JSDOM)
```typescript
// packages/web/__tests__/StyleTile.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StyleTile from '../components/StyleTile';

describe('StyleTile', () => {
  it('should copy text on button click', async () => {
    const styled = { styleId: 'test', styled: '𝐭𝐞𝐬𝐭' };
    render(<StyleTile styled={styled} />);

    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    expect(screen.getByText('✓ Copied')).toBeInTheDocument();
  });
});
```

### 9.3 E2E Tests (Playwright)
```typescript
// e2e/main-flow.spec.ts

import { test, expect } from '@playwright/test';

test('main user flow: input → preview → copy', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Type text
  await page.fill('[data-testid="text-input"]', 'hello');

  // Check preview grid
  const tiles = await page.locator('[data-testid="style-tile"]').count();
  expect(tiles).toBeGreaterThan(0);

  // Copy first style
  await page.click('[data-testid="copy-button"]:first-child');

  // Check toast appears
  await expect(page.locator('[data-testid="toast"]')).toBeVisible();
});
```

---

## 10. Environment Variables

### 10.1 .env.example
```bash
# Web
NEXT_PUBLIC_APP_NAME=VibeBoard
NEXT_PUBLIC_APP_URL=https://vibeboard.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Mobile
EXPO_PUBLIC_APP_NAME=VibeBoard

# Supabase (Phase 2)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx

# Analytics
POSTHOG_API_KEY=xxx
POSTHOG_API_HOST=https://posthog.vibeboard.app

# AI Integration (Phase 2)
OPENAI_API_KEY=sk-xxx

# Build & CI
NODE_ENV=production
```

---

## 11. Performance Optimization Checklist

- [ ] Lazy load font packs (only load when switched)
- [ ] Memoize styled results (avoid unnecessary recalculations)
- [ ] Debounce text input (300ms)
- [ ] Code-split routes (Next.js dynamic imports)
- [ ] Service Worker for PWA caching (web)
- [ ] Image optimization (Responsive images, WebP)
- [ ] Tree-shake unused styles in production
- [ ] Minify and compress JSON font packs
- [ ] Use IndexedDB for large cache (web)

---

## 12. Deployment Checklist (for Railway)

- [ ] All tests passing
- [ ] Environment variables set in Railway dashboard
- [ ] Build command: `pnpm install && pnpm run build`
- [ ] Start command: `cd packages/web && pnpm start`
- [ ] Health check endpoint: GET `/api/health`
- [ ] Sentry integration for error tracking
- [ ] Postmortem for P1 issues
- [ ] Staging environment for QA before production

---

## 13. AI Coding Assistants: Prompt Templates

### 13.1 For Creating New Features
```
You are a TypeScript/React expert assisting with VibeBoard development.

Context:
- Project structure: monorepo with @vibeboard/core, @vibeboard/web, @vibeboard/mobile
- Core logic in packages/core/src
- Uses Zustand for state management
- Tailwind CSS for styling

Task: [Describe feature]

Requirements:
- Follow existing TypeScript interfaces
- Use hooks from @vibeboard/core
- Add proper error handling
- Include JSDoc comments
- Ensure offline-first approach

Please generate the implementation.
```

### 13.2 For Bug Fixes
```
Issue: [Describe bug]

Expected behavior: [What should happen]
Actual behavior: [What is happening]

Context:
- Component/Module involved: [File path]
- Environment: [Web/Mobile/Both]
- Steps to reproduce: [List]

Please provide:
1. Root cause analysis
2. Proposed fix with code
3. Test case to verify
```

---

## 14. Local Development Setup

### 14.1 Install & Run
```bash
# Clone repo
git clone https://github.com/yourusername/vibeboard.git
cd vibeboard

# Install dependencies (pnpm recommended)
pnpm install

# Setup environment
cp .env.example .env.local

# Run web dev server
pnpm run -F @vibeboard/web dev
# Runs on http://localhost:3000

# Run mobile dev server
pnpm run -F @vibeboard/mobile start
# Use Expo Go app to scan QR code

# Run tests
pnpm test

# Lint code
pnpm lint
```

---

**Document Version:** 1.0  
**Last Updated:** November 7, 2025  
**Reviewed By:** AI-Assisted Development Team
