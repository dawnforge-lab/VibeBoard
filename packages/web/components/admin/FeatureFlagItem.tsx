'use client';

import { useState } from 'react';
import { FeatureFlag, updateFeatureFlag } from '../../lib/admin/feature-flags';

export default function FeatureFlagItem({
  flag,
  onUpdate,
}: {
  flag: FeatureFlag;
  onUpdate: (updatedFlag: FeatureFlag) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rolloutPercentage, setRolloutPercentage] = useState(
    flag.rollout_percentage
  );
  const [targetUserIds, setTargetUserIds] = useState(
    flag.target_user_ids.join(', ')
  );

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const newEnabled = !flag.is_enabled;
      const success = await updateFeatureFlag(flag.key, {
        is_enabled: newEnabled,
      });

      if (success) {
        onUpdate({
          ...flag,
          is_enabled: newEnabled,
          updated_at: new Date().toISOString(),
        });
      } else {
        alert('Failed to update feature flag');
      }
    } catch (error) {
      console.error('Error toggling flag:', error);
      alert('Failed to update feature flag');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRolloutUpdate = async () => {
    setIsUpdating(true);
    try {
      const success = await updateFeatureFlag(flag.key, {
        rollout_percentage: rolloutPercentage,
      });

      if (success) {
        onUpdate({
          ...flag,
          rollout_percentage: rolloutPercentage,
          updated_at: new Date().toISOString(),
        });
      } else {
        alert('Failed to update rollout percentage');
      }
    } catch (error) {
      console.error('Error updating rollout:', error);
      alert('Failed to update rollout percentage');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTargetUsersUpdate = async () => {
    setIsUpdating(true);
    try {
      const userIds = targetUserIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

      const success = await updateFeatureFlag(flag.key, {
        target_user_ids: userIds,
      });

      if (success) {
        onUpdate({
          ...flag,
          target_user_ids: userIds,
          updated_at: new Date().toISOString(),
        });
      } else {
        alert('Failed to update target users');
      }
    } catch (error) {
      console.error('Error updating target users:', error);
      alert('Failed to update target users');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {flag.key}
              </h3>
              {flag.is_enabled && (
                <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Enabled
                </span>
              )}
            </div>
            {flag.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {flag.description}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Rollout: {flag.rollout_percentage}% • Last updated:{' '}
              {new Date(flag.updated_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </button>
            <button
              onClick={handleToggle}
              disabled={isUpdating}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                flag.is_enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  flag.is_enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Rollout Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rollout Percentage: {rolloutPercentage}%
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={rolloutPercentage}
                onChange={(e) => setRolloutPercentage(Number(e.target.value))}
                disabled={isUpdating}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <button
                onClick={handleRolloutUpdate}
                disabled={
                  isUpdating || rolloutPercentage === flag.rollout_percentage
                }
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Update
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {rolloutPercentage === 0
                ? 'Feature is disabled for all users'
                : rolloutPercentage === 100
                  ? 'Feature is enabled for all users'
                  : `Feature is enabled for ${rolloutPercentage}% of users`}
            </p>
          </div>

          {/* Target User IDs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target User IDs (comma-separated)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={targetUserIds}
                onChange={(e) => setTargetUserIds(e.target.value)}
                disabled={isUpdating}
                placeholder="user-id-1, user-id-2, user-id-3"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleTargetUsersUpdate}
                disabled={
                  isUpdating ||
                  targetUserIds === flag.target_user_ids.join(', ')
                }
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Update
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {flag.target_user_ids.length > 0
                ? `${flag.target_user_ids.length} user(s) targeted`
                : 'No specific users targeted'}
            </p>
          </div>

          {/* Emergency Disable */}
          {flag.is_enabled && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleToggle}
                disabled={isUpdating}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🚨 Emergency Disable
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Immediately disable this feature for all users
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
