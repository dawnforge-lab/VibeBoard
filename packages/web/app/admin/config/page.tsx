import { getAllConfigs } from '../../../lib/admin/config';
import ConfigList from '../../../components/admin/ConfigList';

export default async function AdminConfigPage() {
  const configs = await getAllConfigs();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          App Configuration
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage all application settings and configurations
        </p>
      </div>

      <ConfigList initialConfigs={configs} />
    </div>
  );
}
