import { getAllNotifications } from '../../../lib/admin/notifications';
import NotificationsList from '../../../components/admin/NotificationsList';
import CreateNotificationForm from '../../../components/admin/CreateNotificationForm';

export default async function AdminNotificationsPage() {
  const notifications = await getAllNotifications();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          System Notifications
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create and manage in-app announcements and alerts
        </p>
      </div>

      <CreateNotificationForm />

      <NotificationsList initialNotifications={notifications} />
    </div>
  );
}
