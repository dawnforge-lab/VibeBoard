import { useMemo } from 'react';
import { StyleEngine, FontPackManager, type FontPack } from '@vibeboard/core';
import defaultPackData from '../../../data/packs/default.json';
import { useAppStore, type StyledResult } from '../store/appStore';

const defaultPack = defaultPackData as FontPack;

export function useStyles(): StyledResult[] {
  const inputText = useAppStore((state) => state.inputText);
  const currentPackId = useAppStore((state) => state.currentPackId);

  const styledResults = useMemo(() => {
    if (!inputText || inputText.trim() === '') {
      return [];
    }

    try {
      const packManager = new FontPackManager();
      packManager.loadPack(defaultPack);

      const pack = packManager.getPack(currentPackId);
      if (!pack) {
        return [];
      }

      const styleEngine = new StyleEngine(packManager);
      const results: StyledResult[] = [];

      for (const style of pack.styles) {
        const result = styleEngine.applyStyle({
          text: inputText,
          packId: currentPackId,
          styleId: style.id,
        });

        results.push({
          id: style.id,
          name: style.name,
          styled: result.styled,
        });
      }

      return results;
    } catch (error) {
      console.error('Error generating styles:', error);
      return [];
    }
  }, [inputText, currentPackId]);

  return styledResults;
}
