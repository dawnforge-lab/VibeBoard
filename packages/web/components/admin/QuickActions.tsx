'use client';

import { useState } from 'react';
import { updateConfig } from '../../lib/admin/config';

export default function QuickActions({
  maintenanceMode,
}: {
  maintenanceMode: boolean;
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleMaintenance = async () => {
    setIsToggling(true);
    try {
      const newValue = !maintenanceMode;
      await updateConfig('maintenance_mode', newValue.toString());
      window.location.reload();
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      alert('Failed to toggle maintenance mode');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => (window.location.href = '/admin/notifications')}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl">🔔</span>
          <span className="font-medium">Create Notification</span>
        </button>

        <button
          onClick={handleToggleMaintenance}
          disabled={isToggling}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            maintenanceMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
          } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-xl">{maintenanceMode ? '✓' : '⚠️'}</span>
          <span className="font-medium">
            {isToggling
              ? 'Toggling...'
              : maintenanceMode
                ? 'Disable Maintenance'
                : 'Enable Maintenance'}
          </span>
        </button>

        <button
          onClick={() => (window.location.href = '/admin/feature-flags')}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span className="text-xl">🚩</span>
          <span className="font-medium">Manage Flags</span>
        </button>
      </div>
    </div>
  );
}
