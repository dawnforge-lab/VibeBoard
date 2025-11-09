'use client';

import { useState } from 'react';
import {
  SystemNotification,
  deleteNotification,
  activateNotification,
  deactivateNotification,
} from '../../lib/admin/notifications';

export default function NotificationsList({
  initialNotifications,
}: {
  initialNotifications: SystemNotification[];
}) {
  const [notifications, setNotifications] =
    useState<SystemNotification[]>(initialNotifications);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    const success = await deleteNotification(id);
    if (success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } else {
      alert('Failed to delete notification');
    }
  };

  const handleToggleActive = async (notification: SystemNotification) => {
    const success = notification.is_active
      ? await deactivateNotification(notification.id)
      : await activateNotification(notification.id);

    if (success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_active: !n.is_active } : n
        )
      );
    } else {
      alert('Failed to update notification');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Notification History
      </h2>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No notifications created yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onToggleActive,
  onDelete,
}: {
  notification: SystemNotification;
  onToggleActive: (notification: SystemNotification) => void;
  onDelete: (id: string) => void;
}) {
  const typeColors = {
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    success:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  };

  const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  const isActive =
    notification.is_active &&
    new Date(notification.start_date) <= new Date() &&
    (!notification.end_date || new Date(notification.end_date) >= new Date());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{typeIcons[notification.type]}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {notification.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${typeColors[notification.type]}`}
                >
                  {notification.type}
                </span>
                {isActive && (
                  <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Active
                  </span>
                )}
                {!notification.is_active && (
                  <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
            {notification.message}
          </p>

          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Platforms: {notification.platforms.join(', ')}</span>
            <span>•</span>
            <span>
              {new Date(notification.start_date).toLocaleDateString()}
              {notification.end_date &&
                ` - ${new Date(notification.end_date).toLocaleDateString()}`}
            </span>
            {notification.action_url && (
              <>
                <span>•</span>
                <a
                  href={notification.action_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View action
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onToggleActive(notification)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              notification.is_active
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
            }`}
          >
            {notification.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => onDelete(notification.id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
