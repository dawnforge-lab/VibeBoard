'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'App Config', href: '/admin/config', icon: '⚙️' },
  { label: 'Feature Flags', href: '/admin/feature-flags', icon: '🚩' },
  { label: 'AI Prompts', href: '/admin/ai-prompts', icon: '🤖' },
  { label: 'Templates', href: '/admin/templates', icon: '📝' },
  { label: 'Font Packs', href: '/admin/font-packs', icon: '📦' },
  { label: 'Notifications', href: '/admin/notifications', icon: '🔔' },
  { label: 'Audit Log', href: '/admin/audit-log', icon: '📋' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          VibeBoard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={() => {
            // TODO: Implement sign out
            window.location.href = '/';
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
