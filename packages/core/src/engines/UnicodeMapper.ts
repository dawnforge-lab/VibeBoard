/**
 * UnicodeMapper
 * Handles character-by-character Unicode transformations
 */

import { Style } from '../models';

export class UnicodeMapper {
  private mapping: Record<string, string> = {};

  /**
   * Load mapping from a style definition
   */
  loadMapping(style: Style): void {
    this.mapping = { ...style.mapping };
  }

  /**
   * Transform text using loaded mapping
   */
  transform(text: string): string {
    return text
      .split('')
      .map((char) => this.mapping[char] || char)
      .join('');
  }

  /**
   * Validate that mapping covers all required characters
   */
  validateMapping(): boolean {
    const requiredChars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?';
    const mappedChars = new Set(Object.keys(this.mapping));

    for (const char of requiredChars) {
      if (!mappedChars.has(char)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Clear current mapping
   */
  clear(): void {
    this.mapping = {};
  }
}
