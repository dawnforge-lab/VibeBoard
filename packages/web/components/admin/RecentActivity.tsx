import { supabase } from '../../lib/supabase';

async function getRecentActivity() {
  try {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select(
        `
        *,
        admin_users (
          id
        )
      `
      )
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export default async function RecentActivity() {
  const activities = await getRecentActivity();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Admin Activity
      </h2>
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No recent activity
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex-shrink-0 mt-1">
                <span className="text-lg">
                  {getActionIcon(activity.action_type)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.action_type}</span>{' '}
                  <span className="text-gray-500 dark:text-gray-400">
                    {activity.resource_type}
                  </span>
                  {activity.resource_id && (
                    <span className="text-gray-700 dark:text-gray-300">
                      {' '}
                      ({activity.resource_id})
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatTimestamp(activity.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getActionIcon(actionType: string): string {
  const icons: Record<string, string> = {
    create: '➕',
    update: '✏️',
    delete: '🗑️',
    toggle: '🔄',
  };
  return icons[actionType] || '📝';
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}
