/**
 * StyleEngine
 * Applies styles and decorators to text
 */

import { FontPack, Style, Decorator, StyledResult } from '../models';
import { UnicodeMapper } from './UnicodeMapper';

export interface ApplyStyleOptions {
  text: string;
  styleId: string;
  packId?: string;
  decoratorId?: string;
}

export class StyleEngine {
  private mapper: UnicodeMapper;
  private loadedPacks: Map<string, FontPack> = new Map();

  constructor() {
    this.mapper = new UnicodeMapper();
  }

  /**
   * Load a font pack into the engine
   */
  loadPack(pack: FontPack): void {
    this.loadedPacks.set(pack.id, pack);
  }

  /**
   * Apply a single style to text
   */
  applyStyle(options: ApplyStyleOptions): StyledResult {
    const { text, styleId, packId = 'default', decoratorId } = options;

    const pack = this.loadedPacks.get(packId);
    if (!pack) {
      throw new Error(`Pack not found: ${packId}`);
    }

    const style = pack.styles.find((s) => s.id === styleId);
    if (!style) {
      throw new Error(`Style not found: ${styleId} in pack ${packId}`);
    }

    // Load mapping and transform text
    this.mapper.loadMapping(style);
    let styledText = this.mapper.transform(text);

    // Apply decorator if specified
    if (decoratorId) {
      const decorator = pack.decorators.find((d) => d.id === decoratorId);
      if (decorator) {
        styledText = this.applyDecorator(styledText, decorator);
      }
    }

    return {
      original: text,
      styled: styledText,
      styleId: `${packId}_${styleId}`,
      packId,
    };
  }

  /**
   * Apply multiple styles to text (batch processing)
   */
  applyMultipleStyles(
    text: string,
    styleIds: string[],
    packId: string = 'default'
  ): StyledResult[] {
    return styleIds.map((styleId) =>
      this.applyStyle({ text, styleId, packId })
    );
  }

  /**
   * Apply decorator to text
   */
  applyDecorator(text: string, decorator: Decorator): string {
    return decorator.pattern.replace('{text}', text);
  }

  /**
   * Apply style with decorator combined
   */
  applyStyleWithDecorator(
    text: string,
    styleId: string,
    decoratorId: string,
    packId: string = 'default'
  ): string {
    const result = this.applyStyle({ text, styleId, packId, decoratorId });
    return result.styled;
  }

  /**
   * Get all loaded packs
   */
  getLoadedPacks(): FontPack[] {
    return Array.from(this.loadedPacks.values());
  }

  /**
   * Get a specific pack
   */
  getPack(packId: string): FontPack | undefined {
    return this.loadedPacks.get(packId);
  }
}
