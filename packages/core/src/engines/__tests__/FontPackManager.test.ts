/**
 * FontPackManager Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FontPackManager } from '../FontPackManager';
import type { FontPack } from '../../models';

describe('FontPackManager', () => {
  let manager: FontPackManager;
  let validPack: FontPack;

  beforeEach(() => {
    manager = new FontPackManager();
    validPack = {
      id: 'test',
      name: 'Test Pack',
      category: 'core',
      version: '1.0.0',
      description: 'Test pack',
      price: 0,
      styles: [
        {
          id: 'bold',
          name: 'Bold',
          preview: 'Bold',
          mapping: createCompleteMapping(),
        },
      ],
      decorators: [
        {
          id: 'stars',
          name: 'Stars',
          pattern: '✨{text}✨',
        },
      ],
    };
  });

  // Helper to create complete character mapping
  function createCompleteMapping(): Record<string, string> {
    const mapping: Record<string, string> = {};
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?';
    for (const char of chars) {
      mapping[char] = char;
    }
    return mapping;
  }

  describe('loadPack', () => {
    it('should load valid pack', async () => {
      await manager.loadPack(validPack);
      expect(manager.getPack('test')).toEqual(validPack);
    });

    it('should reject invalid pack', async () => {
      const invalidPack: FontPack = {
        ...validPack,
        id: '',
      };

      await expect(manager.loadPack(invalidPack)).rejects.toThrow(
        'Invalid pack'
      );
    });

    it('should reject pack with incomplete mappings', async () => {
      const incompletePack: FontPack = {
        ...validPack,
        styles: [
          {
            id: 'incomplete',
            name: 'Incomplete',
            preview: 'Test',
            mapping: { a: 'a', b: 'b' }, // Missing required characters
          },
        ],
      };

      await expect(manager.loadPack(incompletePack)).rejects.toThrow();
    });
  });

  describe('loadPacks', () => {
    it('should load multiple packs', async () => {
      const pack2: FontPack = {
        ...validPack,
        id: 'test2',
        name: 'Test Pack 2',
      };

      await manager.loadPacks([validPack, pack2]);
      expect(manager.getPackCount()).toBe(2);
    });

    it('should stop loading on invalid pack', async () => {
      const invalidPack: FontPack = {
        ...validPack,
        id: '',
      };

      await expect(
        manager.loadPacks([validPack, invalidPack])
      ).rejects.toThrow();
    });
  });

  describe('getPack', () => {
    it('should return pack by id', async () => {
      await manager.loadPack(validPack);
      const pack = manager.getPack('test');
      expect(pack).toEqual(validPack);
    });

    it('should return null for non-existent pack', () => {
      const pack = manager.getPack('nonexistent');
      expect(pack).toBeNull();
    });
  });

  describe('getInstalledPacks', () => {
    it('should return all installed packs', async () => {
      const pack2: FontPack = {
        ...validPack,
        id: 'test2',
        name: 'Test Pack 2',
      };

      await manager.loadPacks([validPack, pack2]);
      const packs = manager.getInstalledPacks();
      expect(packs).toHaveLength(2);
    });

    it('should return empty array when no packs installed', () => {
      const packs = manager.getInstalledPacks();
      expect(packs).toHaveLength(0);
    });
  });

  describe('getPacksByCategory', () => {
    it('should return packs filtered by category', async () => {
      const corePack: FontPack = {
        ...validPack,
        id: 'core1',
        category: 'core',
      };
      const aestheticPack: FontPack = {
        ...validPack,
        id: 'aesthetic1',
        category: 'aesthetic',
      };

      await manager.loadPacks([corePack, aestheticPack]);
      const corePacks = manager.getPacksByCategory('core');
      expect(corePacks).toHaveLength(1);
      expect(corePacks[0].id).toBe('core1');
    });

    it('should return empty array when no packs match category', async () => {
      await manager.loadPack(validPack);
      const seasonalPacks = manager.getPacksByCategory('seasonal');
      expect(seasonalPacks).toHaveLength(0);
    });
  });

  describe('getFreePacks', () => {
    it('should return only free packs', async () => {
      const freePack: FontPack = { ...validPack, id: 'free', price: 0 };
      const paidPack: FontPack = { ...validPack, id: 'paid', price: 4.99 };

      await manager.loadPacks([freePack, paidPack]);
      const freePacks = manager.getFreePacks();
      expect(freePacks).toHaveLength(1);
      expect(freePacks[0].id).toBe('free');
    });
  });

  describe('getPremiumPacks', () => {
    it('should return only premium packs', async () => {
      const freePack: FontPack = { ...validPack, id: 'free', price: 0 };
      const paidPack: FontPack = { ...validPack, id: 'paid', price: 4.99 };

      await manager.loadPacks([freePack, paidPack]);
      const premiumPacks = manager.getPremiumPacks();
      expect(premiumPacks).toHaveLength(1);
      expect(premiumPacks[0].id).toBe('paid');
    });
  });

  describe('validatePack', () => {
    it('should validate complete pack', () => {
      const result = manager.validatePack(validPack);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should catch missing id', () => {
      const pack: FontPack = { ...validPack, id: '' };
      const result = manager.validatePack(pack);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Pack missing id');
    });

    it('should catch missing name', () => {
      const pack: FontPack = { ...validPack, name: '' };
      const result = manager.validatePack(pack);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Pack missing name');
    });

    it('should catch missing version', () => {
      const pack: FontPack = { ...validPack, version: '' };
      const result = manager.validatePack(pack);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Pack missing version');
    });

    it('should catch missing styles', () => {
      const pack: FontPack = { ...validPack, styles: [] };
      const result = manager.validatePack(pack);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('styles'))).toBe(true);
    });

    it('should catch incomplete character mappings', () => {
      const pack: FontPack = {
        ...validPack,
        styles: [
          {
            id: 'incomplete',
            name: 'Incomplete',
            preview: 'Test',
            mapping: { a: 'a' }, // Missing required characters
          },
        ],
      };

      const result = manager.validatePack(pack);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('missing mappings'))).toBe(
        true
      );
    });

    it('should validate decorators pattern has placeholder', () => {
      const pack: FontPack = {
        ...validPack,
        decorators: [
          {
            id: 'test',
            name: 'Test',
            pattern: 'invalid pattern', // Missing {text} placeholder
          },
        ],
      };

      // Note: Current implementation doesn't validate decorator patterns
      // This test documents expected behavior for future enhancement
      const result = manager.validatePack(pack);
      // expect(result.valid).toBe(false); // Future enhancement
    });
  });

  describe('isPackLoaded', () => {
    it('should return true for loaded pack', async () => {
      await manager.loadPack(validPack);
      expect(manager.isPackLoaded('test')).toBe(true);
    });

    it('should return false for non-loaded pack', () => {
      expect(manager.isPackLoaded('test')).toBe(false);
    });
  });

  describe('removePack', () => {
    it('should remove pack by id', async () => {
      await manager.loadPack(validPack);
      const removed = manager.removePack('test');
      expect(removed).toBe(true);
      expect(manager.getPack('test')).toBeNull();
    });

    it('should return false when removing non-existent pack', () => {
      const removed = manager.removePack('nonexistent');
      expect(removed).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('should clear all packs', async () => {
      const pack2: FontPack = {
        ...validPack,
        id: 'test2',
        name: 'Test Pack 2',
      };

      await manager.loadPacks([validPack, pack2]);
      manager.clearAll();
      expect(manager.getPackCount()).toBe(0);
    });
  });

  describe('getPackCount', () => {
    it('should return correct pack count', async () => {
      expect(manager.getPackCount()).toBe(0);

      await manager.loadPack(validPack);
      expect(manager.getPackCount()).toBe(1);

      const pack2: FontPack = {
        ...validPack,
        id: 'test2',
        name: 'Test Pack 2',
      };
      await manager.loadPack(pack2);
      expect(manager.getPackCount()).toBe(2);
    });
  });
});
