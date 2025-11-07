'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import TextLab from '@/components/TextLab';
import PreviewGrid from '@/components/PreviewGrid';
import FavoritesTab from '@/components/FavoritesTab';
import FontPacksTab from '@/components/FontPacksTab';
import SettingsTab from '@/components/SettingsTab';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { theme, initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp();
    setMounted(true);
  }, [initializeApp]);

  useEffect(() => {
    // Apply theme class to html element
    if (mounted) {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System theme
        const isDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        if (isDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-xl text-gray-900 dark:text-gray-100">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                VibeBoard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Transform your text into aesthetic styles ✨
              </p>
            </div>
            <TextLab />
            <PreviewGrid />
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            <div className="mb-6">
              <TextLab />
            </div>
            <FavoritesTab />
          </div>
        )}

        {/* Font Packs Tab */}
        {activeTab === 'packs' && <FontPacksTab />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 max-w-7xl text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Made with ❤️ by VibeBoard Team • Transform text for Instagram,
            TikTok, Twitter & more
          </p>
        </div>
      </footer>
    </div>
  );
}
