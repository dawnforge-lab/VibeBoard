/**
 * UnicodeMapper Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UnicodeMapper } from '../UnicodeMapper';
import type { Style } from '../../models';

describe('UnicodeMapper', () => {
  let mapper: UnicodeMapper;

  beforeEach(() => {
    mapper = new UnicodeMapper();
  });

  describe('loadMapping', () => {
    it('should load mapping from style definition', () => {
      const style: Style = {
        id: 'test',
        name: 'Test Style',
        preview: 'Test',
        mapping: {
          a: '𝐚',
          b: '𝐛',
          c: '𝐜',
        },
      };

      mapper.loadMapping(style);
      expect(mapper.transform('abc')).toBe('𝐚𝐛𝐜');
    });

    it('should replace previous mapping when loading new style', () => {
      const style1: Style = {
        id: 'style1',
        name: 'Style 1',
        preview: 'Test',
        mapping: { a: 'x' },
      };

      const style2: Style = {
        id: 'style2',
        name: 'Style 2',
        preview: 'Test',
        mapping: { a: 'y' },
      };

      mapper.loadMapping(style1);
      expect(mapper.transform('a')).toBe('x');

      mapper.loadMapping(style2);
      expect(mapper.transform('a')).toBe('y');
    });
  });

  describe('transform', () => {
    beforeEach(() => {
      const style: Style = {
        id: 'bold',
        name: 'Bold',
        preview: 'Bold',
        mapping: {
          a: '𝐚',
          b: '𝐛',
          c: '𝐜',
          A: '𝐀',
          B: '𝐁',
          C: '𝐂',
          '1': '𝟏',
          ' ': ' ',
        },
      };
      mapper.loadMapping(style);
    });

    it('should transform lowercase letters', () => {
      expect(mapper.transform('abc')).toBe('𝐚𝐛𝐜');
    });

    it('should transform uppercase letters', () => {
      expect(mapper.transform('ABC')).toBe('𝐀𝐁𝐂');
    });

    it('should transform numbers', () => {
      expect(mapper.transform('1')).toBe('𝟏');
    });

    it('should preserve spaces', () => {
      expect(mapper.transform('a b c')).toBe('𝐚 𝐛 𝐜');
    });

    it('should use fallback for unmapped characters', () => {
      expect(mapper.transform('xyz')).toBe('xyz');
    });

    it('should handle mixed mapped and unmapped characters', () => {
      expect(mapper.transform('abc xyz')).toBe('𝐚𝐛𝐜 xyz');
    });

    it('should handle empty string', () => {
      expect(mapper.transform('')).toBe('');
    });

    it('should handle special characters', () => {
      expect(mapper.transform('a!b?c')).toBe('𝐚!𝐛?𝐜');
    });

    it('should handle emojis', () => {
      expect(mapper.transform('a😀b')).toBe('𝐚😀𝐛');
    });

    it('should handle long text', () => {
      const longText = 'abc'.repeat(100);
      const expected = '𝐚𝐛𝐜'.repeat(100);
      expect(mapper.transform(longText)).toBe(expected);
    });
  });

  describe('validateMapping', () => {
    it('should return true for complete mapping', () => {
      const style: Style = {
        id: 'complete',
        name: 'Complete',
        preview: 'Test',
        mapping: {
          // Lowercase
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd',
          e: 'e',
          f: 'f',
          g: 'g',
          h: 'h',
          i: 'i',
          j: 'j',
          k: 'k',
          l: 'l',
          m: 'm',
          n: 'n',
          o: 'o',
          p: 'p',
          q: 'q',
          r: 'r',
          s: 's',
          t: 't',
          u: 'u',
          v: 'v',
          w: 'w',
          x: 'x',
          y: 'y',
          z: 'z',
          // Uppercase
          A: 'A',
          B: 'B',
          C: 'C',
          D: 'D',
          E: 'E',
          F: 'F',
          G: 'G',
          H: 'H',
          I: 'I',
          J: 'J',
          K: 'K',
          L: 'L',
          M: 'M',
          N: 'N',
          O: 'O',
          P: 'P',
          Q: 'Q',
          R: 'R',
          S: 'S',
          T: 'T',
          U: 'U',
          V: 'V',
          W: 'W',
          X: 'X',
          Y: 'Y',
          Z: 'Z',
          // Numbers
          '0': '0',
          '1': '1',
          '2': '2',
          '3': '3',
          '4': '4',
          '5': '5',
          '6': '6',
          '7': '7',
          '8': '8',
          '9': '9',
          // Punctuation
          ' ': ' ',
          '.': '.',
          ',': ',',
          '!': '!',
          '?': '?',
        },
      };

      mapper.loadMapping(style);
      expect(mapper.validateMapping()).toBe(true);
    });

    it('should return false for incomplete mapping', () => {
      const style: Style = {
        id: 'incomplete',
        name: 'Incomplete',
        preview: 'Test',
        mapping: {
          a: 'a',
          b: 'b',
          // Missing other required characters
        },
      };

      mapper.loadMapping(style);
      expect(mapper.validateMapping()).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear current mapping', () => {
      const style: Style = {
        id: 'test',
        name: 'Test',
        preview: 'Test',
        mapping: { a: 'x' },
      };

      mapper.loadMapping(style);
      expect(mapper.transform('a')).toBe('x');

      mapper.clear();
      expect(mapper.transform('a')).toBe('a'); // Fallback to original
    });
  });
});
