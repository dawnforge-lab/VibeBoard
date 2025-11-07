'use client';

import { useMemo, useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { StyleEngine, FontPackManager, type FontPack } from '@vibeboard/core';
import defaultPackData from '../../../data/packs/default.json';

const DEFAULT_STYLE_IDS = [
  'bold-sans',
  'bold-italic',
  'small-caps',
  'monospace',
  'double-struck',
  'fraktur',
  'script',
  'superscript',
  'circled',
  'squared',
];

export function useStyles() {
  const { inputText, currentPackId } = useAppStore();
  const [styleEngine] = useState(() => new StyleEngine());
  const [initialized, setInitialized] = useState(false);

  // Initialize engine with default pack
  useEffect(() => {
    const packManager = new FontPackManager();
    const defaultPack = defaultPackData as FontPack;
    packManager.loadPack(defaultPack).then(() => {
      styleEngine.loadPack(defaultPack);
      setInitialized(true);
    });
  }, [styleEngine]);

  // Generate styled versions
  const styledVersions = useMemo(() => {
    if (!inputText || !initialized) return [];

    try {
      return DEFAULT_STYLE_IDS.map((styleId) => {
        try {
          return styleEngine.applyStyle({
            text: inputText,
            styleId,
            packId: currentPackId,
          });
        } catch (error) {
          console.error(`Error applying style ${styleId}:`, error);
          return {
            original: inputText,
            styled: inputText,
            styleId: `${currentPackId}_${styleId}`,
            packId: currentPackId,
          };
        }
      });
    } catch (error) {
      console.error('Error generating styles:', error);
      return [];
    }
  }, [inputText, currentPackId, styleEngine, initialized]);

  return { styledVersions, initialized };
}
