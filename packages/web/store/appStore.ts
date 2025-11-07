'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Theme } from '@vibeboard/core';

interface AppState {
  // Theme
  theme: Theme;

  // Input
  inputText: string;

  // Favorites
  favorites: string[];

  // Pack management
  currentPackId: string;
  installedPacks: string[];

  // Onboarding
  onboardingComplete: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setInputText: (text: string) => void;
  addFavorite: (styleId: string) => void;
  removeFavorite: (styleId: string) => void;
  toggleFavorite: (styleId: string) => void;
  setCurrentPack: (packId: string) => void;
  completeOnboarding: () => void;
  initializeApp: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'dark',
      inputText: '',
      favorites: [],
      currentPackId: 'default',
      installedPacks: ['default'],
      onboardingComplete: false,

      // Actions
      setTheme: (theme) => set({ theme }),

      setInputText: (text) => {
        // Limit to 200 characters
        const trimmedText = text.slice(0, 200);
        set({ inputText: trimmedText });
      },

      addFavorite: (styleId) => {
        const current = get().favorites;
        if (!current.includes(styleId)) {
          set({ favorites: [...current, styleId] });
        }
      },

      removeFavorite: (styleId) => {
        const current = get().favorites;
        set({ favorites: current.filter((id) => id !== styleId) });
      },

      toggleFavorite: (styleId) => {
        const current = get().favorites;
        if (current.includes(styleId)) {
          set({ favorites: current.filter((id) => id !== styleId) });
        } else {
          set({ favorites: [...current, styleId] });
        }
      },

      setCurrentPack: (packId) => set({ currentPackId: packId }),

      completeOnboarding: () => set({ onboardingComplete: true }),

      initializeApp: async () => {
        // This runs on app initialization
        // Can be extended to load packs from server in Phase 2
        console.log('App initialized');
      },
    }),
    {
      name: 'vibeboard-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        currentPackId: state.currentPackId,
        installedPacks: state.installedPacks,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
