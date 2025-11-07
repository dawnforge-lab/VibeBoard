import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StyledResult {
  id: string;
  name: string;
  styled: string;
}

interface AppState {
  inputText: string;
  favorites: string[];
  currentPackId: string;
  theme: 'light' | 'dark' | 'system';
  isHydrated: boolean;

  // Actions
  setInputText: (text: string) => void;
  addFavorite: (styleId: string) => void;
  removeFavorite: (styleId: string) => void;
  setCurrentPack: (packId: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEYS = {
  FAVORITES: '@vibeboard/favorites',
  THEME: '@vibeboard/theme',
  CURRENT_PACK: '@vibeboard/currentPack',
};

export const useAppStore = create<AppState>((set, get) => ({
  inputText: '',
  favorites: [],
  currentPackId: 'default',
  theme: 'dark',
  isHydrated: false,

  setInputText: (text) => set({ inputText: text.slice(0, 200) }),

  addFavorite: (styleId) => {
    set((state) => {
      const newFavorites = [...new Set([...state.favorites, styleId])];
      AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(newFavorites)
      );
      return { favorites: newFavorites };
    });
  },

  removeFavorite: (styleId) => {
    set((state) => {
      const newFavorites = state.favorites.filter((id) => id !== styleId);
      AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(newFavorites)
      );
      return { favorites: newFavorites };
    });
  },

  setCurrentPack: (packId) => {
    set({ currentPackId: packId });
    AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PACK, packId);
  },

  setTheme: (theme) => {
    set({ theme });
    AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  hydrate: async () => {
    try {
      const [favorites, theme, currentPack] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PACK),
      ]);

      set({
        favorites: favorites ? JSON.parse(favorites) : [],
        theme: (theme as 'light' | 'dark' | 'system') || 'dark',
        currentPackId: currentPack || 'default',
        isHydrated: true,
      });
    } catch (error) {
      console.error('Failed to hydrate store:', error);
      set({ isHydrated: true });
    }
  },
}));
