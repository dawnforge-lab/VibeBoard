/**
 * ThemeEngine
 * Manages application theme (light/dark/system)
 */

import { Theme } from '../models';

export interface ThemeConfig {
  colors: {
    bg: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
  };
}

export class ThemeEngine {
  private currentTheme: Theme = 'system';
  private listeners: Set<(theme: Theme) => void> = new Set();

  /**
   * Detect system theme preference
   */
  detectTheme(): Theme {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark ? 'dark' : 'light';
  }

  /**
   * Get current theme (resolved)
   */
  getResolvedTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'system') {
      return this.detectTheme() === 'dark' ? 'dark' : 'light';
    }
    return this.currentTheme;
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.notifyListeners();
  }

  /**
   * Get current theme setting
   */
  getTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Get theme configuration
   */
  getThemeConfig(): ThemeConfig {
    const resolved = this.getResolvedTheme();

    if (resolved === 'dark') {
      return {
        colors: {
          bg: '#000000',
          text: '#ffffff',
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          border: '#374151',
        },
      };
    }

    return {
      colors: {
        bg: '#ffffff',
        text: '#000000',
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        border: '#e5e7eb',
      },
    };
  }

  /**
   * Subscribe to theme changes
   */
  onThemeChange(callback: (theme: Theme) => void): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      callback(this.currentTheme);
    });
  }

  /**
   * Initialize theme engine (setup system preference listener)
   */
  initialize(): void {
    if (typeof window === 'undefined') return;

    // Listen for system theme changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.currentTheme === 'system') {
          this.notifyListeners();
        }
      });
  }
}
