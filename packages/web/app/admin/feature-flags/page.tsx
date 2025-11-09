import { getAllFeatureFlags } from '../../../lib/admin/feature-flags';
import FeatureFlagsList from '../../../components/admin/FeatureFlagsList';

export default async function AdminFeatureFlagsPage() {
  const flags = await getAllFeatureFlags();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Feature Flags
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage feature rollouts and toggle functionality
        </p>
      </div>

      <FeatureFlagsList initialFlags={flags} />
    </div>
  );
}
