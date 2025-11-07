'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { StyledResult } from '@vibeboard/core';

interface Props {
  styled: StyledResult;
}

export default function StyleTile({ styled }: Props) {
  const [copied, setCopied] = useState(false);
  const { favorites, toggleFavorite } = useAppStore();

  const isFavorited = favorites.includes(styled.styleId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(styled.styled);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = styled.styled;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(styled.styleId);
  };

  // Extract style name from styleId (e.g., "default_bold-sans" -> "bold-sans")
  const styleName = styled.styleId.split('_')[1] || styled.styleId;
  const displayName = styleName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all bg-white dark:bg-gray-900">
      {/* Style Name */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
        {displayName}
      </div>

      {/* Styled Text Preview */}
      <div className="text-lg font-bold mb-4 truncate text-gray-900 dark:text-gray-100 min-h-[28px]">
        {styled.styled || <span className="text-gray-400">Empty text</span>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {copied ? (
            <span className="flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </span>
          ) : (
            'Copy'
          )}
        </button>

        <button
          onClick={handleToggleFavorite}
          className={`px-3 py-2 rounded-lg text-sm transition-all ${
            isFavorited
              ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Toast Notification */}
      {copied && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium pointer-events-none">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
