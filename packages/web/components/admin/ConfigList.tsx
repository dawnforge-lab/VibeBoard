'use client';

import { useState, useMemo } from 'react';
import { AppConfig } from '../../lib/admin/config';
import ConfigItem from './ConfigItem';

const categories = ['all', 'general', 'monetization', 'features', 'system'];

export default function ConfigList({
  initialConfigs,
}: {
  initialConfigs: AppConfig[];
}) {
  const [configs, setConfigs] = useState<AppConfig[]>(initialConfigs);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConfigs = useMemo(() => {
    return configs.filter((config) => {
      const matchesCategory =
        selectedCategory === 'all' || config.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        config.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [configs, selectedCategory, searchQuery]);

  const handleConfigUpdate = (updatedConfig: AppConfig) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === updatedConfig.id ? updatedConfig : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search configurations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedCategory === category
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Config List */}
      <div className="space-y-4">
        {filteredConfigs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No configurations found
            </p>
          </div>
        ) : (
          filteredConfigs.map((config) => (
            <ConfigItem
              key={config.id}
              config={config}
              onUpdate={handleConfigUpdate}
            />
          ))
        )}
      </div>

      {/* Config Count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredConfigs.length} of {configs.length} configurations
      </div>
    </div>
  );
}
