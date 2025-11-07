/**
 * FontPackManager
 * Manages loading and validation of font packs
 */

import { FontPack, ValidationResult } from '../models';

export class FontPackManager {
  private packs: Map<string, FontPack> = new Map();
  private loading: boolean = false;

  /**
   * Load a single font pack
   */
  async loadPack(pack: FontPack): Promise<void> {
    const validation = this.validatePack(pack);
    if (!validation.valid) {
      throw new Error(
        `Invalid pack: ${pack.id}\n${validation.errors.join('\n')}`
      );
    }

    this.packs.set(pack.id, pack);
  }

  /**
   * Load multiple font packs
   */
  async loadPacks(packs: FontPack[]): Promise<void> {
    this.loading = true;
    try {
      for (const pack of packs) {
        await this.loadPack(pack);
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get a single pack by ID
   */
  getPack(id: string): FontPack | null {
    return this.packs.get(id) || null;
  }

  /**
   * Get all installed packs
   */
  getInstalledPacks(): FontPack[] {
    return Array.from(this.packs.values());
  }

  /**
   * Get packs by category
   */
  getPacksByCategory(category: FontPack['category']): FontPack[] {
    return Array.from(this.packs.values()).filter(
      (pack) => pack.category === category
    );
  }

  /**
   * Get free packs
   */
  getFreePacks(): FontPack[] {
    return Array.from(this.packs.values()).filter((pack) => pack.price === 0);
  }

  /**
   * Get premium packs
   */
  getPremiumPacks(): FontPack[] {
    return Array.from(this.packs.values()).filter((pack) => pack.price > 0);
  }

  /**
   * Validate pack structure
   */
  validatePack(pack: FontPack): ValidationResult {
    const errors: string[] = [];

    // Check required fields
    if (!pack.id) errors.push('Pack missing id');
    if (!pack.name) errors.push('Pack missing name');
    if (!pack.version) errors.push('Pack missing version');
    if (!Array.isArray(pack.styles)) errors.push('Pack missing styles array');

    // Validate each style
    const requiredChars = new Set(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?'.split('')
    );

    pack.styles?.forEach((style) => {
      if (!style.id) {
        errors.push(`Style missing id`);
        return;
      }

      const mappedChars = new Set(Object.keys(style.mapping || {}));
      const missing = [...requiredChars].filter(
        (char) => !mappedChars.has(char)
      );

      if (missing.length > 0) {
        errors.push(
          `Style ${style.id} missing mappings for: ${missing.join(', ')}`
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if pack is loaded
   */
  isPackLoaded(packId: string): boolean {
    return this.packs.has(packId);
  }

  /**
   * Remove a pack
   */
  removePack(packId: string): boolean {
    return this.packs.delete(packId);
  }

  /**
   * Clear all packs
   */
  clearAll(): void {
    this.packs.clear();
  }

  /**
   * Get total pack count
   */
  getPackCount(): number {
    return this.packs.size;
  }
}
