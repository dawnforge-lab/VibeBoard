'use client';

import { useState } from 'react';
import { AppConfig, updateConfig } from '../../lib/admin/config';

export default function ConfigItem({
  config,
  onUpdate,
}: {
  config: AppConfig;
  onUpdate: (updatedConfig: AppConfig) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    typeof config.value === 'string'
      ? config.value
      : JSON.stringify(config.value, null, 2)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isCritical = config.key === 'maintenance_mode';

  const handleSave = async () => {
    if (isCritical && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsSaving(true);
    try {
      // Parse value if it looks like JSON
      let parsedValue: unknown = editValue;
      if (editValue.startsWith('{') || editValue.startsWith('[')) {
        try {
          parsedValue = JSON.parse(editValue);
        } catch {
          // If parsing fails, treat as string
          parsedValue = editValue;
        }
      }

      const success = await updateConfig(config.key, parsedValue);

      if (success) {
        onUpdate({
          ...config,
          value: parsedValue,
          updated_at: new Date().toISOString(),
        });
        setIsEditing(false);
        setShowConfirmation(false);
      } else {
        alert('Failed to update configuration');
      }
    } catch (error) {
      console.error('Error updating config:', error);
      alert('Failed to update configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(
      typeof config.value === 'string'
        ? config.value
        : JSON.stringify(config.value, null, 2)
    );
    setIsEditing(false);
    setShowConfirmation(false);
  };

  const displayValue =
    typeof config.value === 'object'
      ? JSON.stringify(config.value)
      : String(config.value);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {config.key}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                config.category === 'monetization'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : config.category === 'features'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : config.category === 'system'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {config.category}
            </span>
          </div>
          {config.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {config.description}
            </p>
          )}

          {isEditing ? (
            <div className="mt-4 space-y-3">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={editValue.includes('\n') ? 6 : 2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {showConfirmation && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Warning: This is a critical configuration. Are you sure
                    you want to change it?
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving
                    ? 'Saving...'
                    : showConfirmation
                      ? 'Confirm'
                      : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-mono bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded text-gray-900 dark:text-white">
                  {displayValue}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Last updated: {new Date(config.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
