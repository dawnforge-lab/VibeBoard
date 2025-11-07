/**
 * StyleEngine Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StyleEngine } from '../StyleEngine';
import type { FontPack } from '../../models';

describe('StyleEngine', () => {
  let engine: StyleEngine;
  let testPack: FontPack;

  beforeEach(() => {
    engine = new StyleEngine();
    testPack = {
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
          preview: '𝐁𝐨𝐥𝐝',
          mapping: {
            a: '𝐚',
            b: '𝐛',
            c: '𝐜',
            H: '𝐇',
            e: '𝐞',
            l: '𝐥',
            o: '𝐨',
            ' ': ' ',
            '!': '!',
          },
        },
        {
          id: 'italic',
          name: 'Italic',
          preview: '𝘐𝘵𝘢𝘭𝘪𝘤',
          mapping: {
            a: '𝘢',
            b: '𝘣',
            c: '𝘤',
            H: '𝘏',
            e: '𝘦',
            l: '𝘭',
            o: '𝘰',
            ' ': ' ',
            '!': '!',
          },
        },
      ],
      decorators: [
        {
          id: 'stars',
          name: 'Stars',
          pattern: '✨{text}✨',
        },
        {
          id: 'hearts',
          name: 'Hearts',
          pattern: '💖{text}💖',
        },
      ],
    };

    engine.loadPack(testPack);
  });

  describe('loadPack', () => {
    it('should load a font pack', () => {
      const newEngine = new StyleEngine();
      newEngine.loadPack(testPack);
      expect(newEngine.getPack('test')).toEqual(testPack);
    });

    it('should allow loading multiple packs', () => {
      const pack2: FontPack = {
        ...testPack,
        id: 'test2',
        name: 'Test Pack 2',
      };

      engine.loadPack(pack2);
      expect(engine.getLoadedPacks()).toHaveLength(2);
    });
  });

  describe('applyStyle', () => {
    it('should apply style to text', () => {
      const result = engine.applyStyle({
        text: 'Hello',
        styleId: 'bold',
        packId: 'test',
      });

      expect(result.styled).toBe('𝐇𝐞𝐥𝐥𝐨');
      expect(result.original).toBe('Hello');
      expect(result.styleId).toBe('test_bold');
      expect(result.packId).toBe('test');
    });

    it('should throw error for non-existent pack', () => {
      expect(() => {
        engine.applyStyle({
          text: 'Hello',
          styleId: 'bold',
          packId: 'nonexistent',
        });
      }).toThrow('Pack not found: nonexistent');
    });

    it('should throw error for non-existent style', () => {
      expect(() => {
        engine.applyStyle({
          text: 'Hello',
          styleId: 'nonexistent',
          packId: 'test',
        });
      }).toThrow('Style not found: nonexistent in pack test');
    });

    it('should use default pack when packId not specified', () => {
      const defaultPack: FontPack = {
        ...testPack,
        id: 'default',
      };

      engine.loadPack(defaultPack);

      const result = engine.applyStyle({
        text: 'Hello',
        styleId: 'bold',
      });

      expect(result.packId).toBe('default');
    });

    it('should apply decorator when specified', () => {
      const result = engine.applyStyle({
        text: 'Hello',
        styleId: 'bold',
        packId: 'test',
        decoratorId: 'stars',
      });

      expect(result.styled).toBe('✨𝐇𝐞𝐥𝐥𝐨✨');
    });

    it('should handle empty text', () => {
      const result = engine.applyStyle({
        text: '',
        styleId: 'bold',
        packId: 'test',
      });

      expect(result.styled).toBe('');
    });

    it('should handle text with unmapped characters', () => {
      const result = engine.applyStyle({
        text: 'Hello xyz',
        styleId: 'bold',
        packId: 'test',
      });

      expect(result.styled).toBe('𝐇𝐞𝐥𝐥𝐨 xyz');
    });
  });

  describe('applyMultipleStyles', () => {
    it('should apply multiple styles to text', () => {
      const results = engine.applyMultipleStyles(
        'Hello',
        ['bold', 'italic'],
        'test'
      );

      expect(results).toHaveLength(2);
      expect(results[0].styled).toBe('𝐇𝐞𝐥𝐥𝐨');
      expect(results[1].styled).toBe('𝘏𝘦𝘭𝘭𝘰');
    });

    it('should handle empty styles array', () => {
      const results = engine.applyMultipleStyles('Hello', [], 'test');
      expect(results).toHaveLength(0);
    });

    it('should use default pack when not specified', () => {
      const defaultPack: FontPack = {
        ...testPack,
        id: 'default',
      };

      engine.loadPack(defaultPack);

      const results = engine.applyMultipleStyles('Hello', ['bold']);
      expect(results[0].packId).toBe('default');
    });
  });

  describe('applyDecorator', () => {
    it('should apply decorator pattern', () => {
      const decorator = {
        id: 'test-decorator',
        name: 'Test',
        pattern: '→ {text} ←',
      };

      const result = engine.applyDecorator('Hello', decorator);
      expect(result).toBe('→ Hello ←');
    });

    it('should handle multiple placeholders', () => {
      const decorator = {
        id: 'test-decorator',
        name: 'Test',
        pattern: '{text} and {text}',
      };

      const result = engine.applyDecorator('Hello', decorator);
      // Note: replace only replaces first occurrence
      expect(result).toBe('Hello and {text}');
    });
  });

  describe('applyStyleWithDecorator', () => {
    it('should apply both style and decorator', () => {
      const result = engine.applyStyleWithDecorator(
        'Hello',
        'bold',
        'stars',
        'test'
      );

      expect(result).toBe('✨𝐇𝐞𝐥𝐥𝐨✨');
    });

    it('should use default pack when not specified', () => {
      const defaultPack: FontPack = {
        ...testPack,
        id: 'default',
      };

      engine.loadPack(defaultPack);

      const result = engine.applyStyleWithDecorator('Hello', 'bold', 'stars');
      expect(result).toContain('✨');
    });
  });

  describe('getLoadedPacks', () => {
    it('should return all loaded packs', () => {
      const packs = engine.getLoadedPacks();
      expect(packs).toHaveLength(1);
      expect(packs[0]).toEqual(testPack);
    });

    it('should return empty array when no packs loaded', () => {
      const newEngine = new StyleEngine();
      expect(newEngine.getLoadedPacks()).toHaveLength(0);
    });
  });

  describe('getPack', () => {
    it('should return specific pack by id', () => {
      const pack = engine.getPack('test');
      expect(pack).toEqual(testPack);
    });

    it('should return undefined for non-existent pack', () => {
      const pack = engine.getPack('nonexistent');
      expect(pack).toBeUndefined();
    });
  });
});
