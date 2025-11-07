/**
 * Font Pack Models
 * Defines the structure for font packs, styles, and decorators
 */

export interface Style {
  id: string;
  name: string;
  preview: string;
  mapping: Record<string, string>; // Character mapping: 'a' → '𝐚'
}

export interface Decorator {
  id: string;
  name: string;
  pattern: string; // Template with {text} placeholder
  color?: string;
}

export type FontPackCategory = 'core' | 'aesthetic' | 'seasonal' | 'community';

export interface FontPack {
  id: string;
  name: string;
  category: FontPackCategory;
  version: string;
  description: string;
  price: number; // 0 = free
  styles: Style[];
  decorators: Decorator[];
  previewImage?: string;
}

export interface StyledResult {
  original: string;
  styled: string;
  styleId: string;
  packId: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
