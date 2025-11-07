'use client';

import { useAppStore } from '@/store/appStore';

interface FontPackInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stylesCount: number;
  preview: string;
}

// This would eventually come from the FontPackManager
const availablePacks: FontPackInfo[] = [
  {
    id: 'default',
    name: 'Essential Fonts',
    description: '10 versatile Unicode font styles for every occasion',
    price: 0,
    category: 'core',
    stylesCount: 10,
    preview: '𝐁𝐨𝐥𝐝 𝐒𝐚𝐧𝐬',
  },
  // Future packs will be added here
];

export default function FontPacksTab() {
  const { currentPackId, setCurrentPack } = useAppStore();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Font Packs
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore and switch between different font pack collections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePacks.map((pack) => {
          const isActive = currentPackId === pack.id;
          const isFree = pack.price === 0;

          return (
            <div
              key={pack.id}
              className={`border-2 rounded-xl p-6 transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isFree
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}
                >
                  {isFree ? 'FREE' : `$${pack.price.toFixed(2)}`}
                </span>
                {isActive && (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    ✓ Active
                  </span>
                )}
              </div>

              {/* Preview */}
              <div className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {pack.preview}
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                {pack.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {pack.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>📝 {pack.stylesCount} styles</span>
                <span>📁 {pack.category}</span>
              </div>

              {/* Action Button */}
              {isActive ? (
                <button
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 font-medium cursor-not-allowed"
                >
                  Currently Active
                </button>
              ) : isFree ? (
                <button
                  onClick={() => setCurrentPack(pack.id)}
                  className="w-full px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                >
                  Switch to This Pack
                </button>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12 text-center py-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-xl">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          More Packs Coming Soon
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          We&apos;re working on exciting new font packs including aesthetic
          styles, seasonal themes, and community creations.
        </p>
      </div>
    </div>
  );
}
