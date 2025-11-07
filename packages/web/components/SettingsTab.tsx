'use client';

import { useAppStore } from '@/store/appStore';
import type { Theme } from '@vibeboard/core';

export default function SettingsTab() {
  const { theme, setTheme, favorites, inputText } = useAppStore();

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your VibeBoard experience
        </p>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Appearance
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose how VibeBoard looks on your device
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {option.label}
              </div>
              {theme === option.value && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  ✓ Active
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Your Stats
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {favorites.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Favorite Styles
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {inputText.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Current Characters
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          About VibeBoard
        </h3>

        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              1.0.0
            </span>
          </div>
          <div className="flex justify-between">
            <span>Font Packs</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              1 installed
            </span>
          </div>
          <div className="flex justify-between">
            <span>Available Styles</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              10 styles
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Transform your text into aesthetic Unicode styles for social media.
            Perfect for Instagram, TikTok, Twitter, and more!
          </p>
          <div className="flex gap-4 text-sm">
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
