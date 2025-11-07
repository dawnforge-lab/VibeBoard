'use client';

import { useAppStore } from '@/store/appStore';
import { useStyles } from '@/hooks/useStyles';
import StyleTile from './StyleTile';

export default function FavoritesTab() {
  const { favorites, inputText } = useAppStore();
  const { styledVersions, initialized } = useStyles();

  if (!initialized) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // Filter styled versions to only show favorites
  const favoriteStyles = styledVersions.filter((styled) =>
    favorites.includes(styled.styleId)
  );

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-6">❤️</div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          No favorites yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Tap the heart icon on any style to save it to your favorites.
          You&apos;ll be able to quickly access them here.
        </p>
      </div>
    );
  }

  if (!inputText) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-6">💬</div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          Type something to see your favorites
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          You have {favorites.length} favorite{' '}
          {favorites.length === 1 ? 'style' : 'styles'}. Enter text above to see
          them styled!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Your Favorites ({favoriteStyles.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favoriteStyles.map((styled, index) => (
          <StyleTile key={`${styled.styleId}-${index}`} styled={styled} />
        ))}
      </div>
    </div>
  );
}
