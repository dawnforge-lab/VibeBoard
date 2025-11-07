/**
 * User Models
 * Defines user preferences and state
 */

export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: Theme;
  defaultPackId: string;
  notificationsEnabled: boolean;
  analyticsEnabled: boolean;
}

export interface User {
  id: string;
  theme: Theme;
  onboardingComplete: boolean;
  favorites: string[]; // Array of style IDs
  installedPacks: string[]; // Array of pack IDs
  purchases: string[]; // Array of purchased pack IDs
  preferences: UserPreferences;
}
