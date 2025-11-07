'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import Header from '@/components/Header';
import TextLab from '@/components/TextLab';
import PreviewGrid from '@/components/PreviewGrid';

export default function Home() {
  const [mounted, setMounted] = useState(false);
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
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            VibeBoard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Transform your text into aesthetic styles
          </p>
        </div>
        <TextLab />
        <PreviewGrid />
      </main>
    </div>
  );
}
