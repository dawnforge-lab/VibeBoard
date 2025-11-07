'use client';

import { useStyles } from '@/hooks/useStyles';
import StyleTile from './StyleTile';

export default function PreviewGrid() {
  const { styledVersions, initialized } = useStyles();

  if (!initialized) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading styles...</p>
      </div>
    );
  }

  if (styledVersions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✨</div>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Type something above to see styled versions
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Styled Versions ({styledVersions.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {styledVersions.map((styled, index) => (
          <StyleTile key={`${styled.styleId}-${index}`} styled={styled} />
        ))}
      </div>
    </div>
  );
}
