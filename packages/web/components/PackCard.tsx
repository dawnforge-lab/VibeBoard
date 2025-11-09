'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PackCardProps {
  pack: {
    pack_id: string;
    name: string;
    description: string;
    price_usd: number;
    is_featured: boolean;
    is_free: boolean;
    thumbnail_url: string | null;
    tags: string[];
    downloads_count: number;
    isOwned?: boolean;
    isPremium?: boolean;
  };
  onPurchase: (packId: string) => void;
  isPurchasing?: boolean;
}

/**
 * Pack Card Component
 * Displays a font pack with pricing and purchase/download button
 */
export default function PackCard({
  pack,
  onPurchase,
  isPurchasing = false,
}: PackCardProps) {
  const [imageError, setImageError] = useState(false);

  const handlePurchaseClick = () => {
    if (!pack.isOwned && !isPurchasing) {
      onPurchase(pack.pack_id);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl ${
        pack.is_featured
          ? 'ring-2 ring-purple-500 dark:ring-purple-400'
          : 'border border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-400 to-pink-600">
        {pack.thumbnail_url && !imageError ? (
          <Image
            src={pack.thumbnail_url}
            alt={pack.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📦
          </div>
        )}

        {/* Featured Badge */}
        {pack.is_featured && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
            ⭐ Featured
          </div>
        )}

        {/* Owned Badge */}
        {pack.isOwned && (
          <div className="absolute top-2 right-2 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
            ✓ Owned
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {pack.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {pack.description}
        </p>

        {/* Tags */}
        {pack.tags && pack.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {pack.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {pack.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{pack.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {pack.downloads_count.toLocaleString()}
          </span>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            {pack.isOwned ? (
              <button
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold cursor-default"
                disabled
              >
                Installed
              </button>
            ) : pack.is_free || pack.price_usd === 0 ? (
              <button
                onClick={handlePurchaseClick}
                disabled={isPurchasing}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? 'Installing...' : 'Free Download'}
              </button>
            ) : (
              <button
                onClick={handlePurchaseClick}
                disabled={isPurchasing}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPurchasing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Get for $${pack.price_usd.toFixed(2)}`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
