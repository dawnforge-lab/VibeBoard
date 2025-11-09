import {
  getAllFontPacks,
  getPackAnalytics,
} from '../../../lib/admin/font-packs';
import FontPacksList from '../../../components/admin/FontPacksList';
import PackAnalyticsDashboard from '../../../components/admin/PackAnalyticsDashboard';

export default async function AdminFontPacksPage() {
  const packs = await getAllFontPacks();
  const analytics = await getPackAnalytics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Font Packs
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage font pack pricing, descriptions, and featured status
        </p>
      </div>

      <PackAnalyticsDashboard analytics={analytics} />

      <FontPacksList initialPacks={packs} />
    </div>
  );
}
