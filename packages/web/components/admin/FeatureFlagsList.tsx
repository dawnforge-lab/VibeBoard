'use client';

import { useState } from 'react';
import { FeatureFlag } from '../../lib/admin/feature-flags';
import FeatureFlagItem from './FeatureFlagItem';

export default function FeatureFlagsList({
  initialFlags,
}: {
  initialFlags: FeatureFlag[];
}) {
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlags = flags.filter(
    (flag) =>
      searchQuery === '' ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFlagUpdate = (updatedFlag: FeatureFlag) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === updatedFlag.id ? updatedFlag : f))
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search feature flags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {flags.filter((f) => f.is_enabled).length} of {flags.length} enabled
          </span>
        </div>
      </div>

      {/* Flags List */}
      <div className="space-y-4">
        {filteredFlags.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No feature flags found
            </p>
          </div>
        ) : (
          filteredFlags.map((flag) => (
            <FeatureFlagItem
              key={flag.id}
              flag={flag}
              onUpdate={handleFlagUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
