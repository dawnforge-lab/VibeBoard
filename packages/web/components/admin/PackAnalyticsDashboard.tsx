import { PackAnalytics } from '../../lib/admin/font-packs';

export default function PackAnalyticsDashboard({
  analytics,
}: {
  analytics: PackAnalytics;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Packs"
        value={analytics.totalPacks}
        icon="📦"
        subtitle={`${analytics.freePacks} free, ${analytics.paidPacks} paid`}
      />
      <MetricCard
        title="Total Revenue"
        value={`$${analytics.totalRevenue.toFixed(2)}`}
        icon="💰"
      />
      <MetricCard
        title="Total Downloads"
        value={analytics.totalDownloads.toLocaleString()}
        icon="⬇️"
      />
      <MetricCard
        title="Pending Review"
        value={analytics.pendingReview}
        icon="⏳"
        highlight={analytics.pendingReview > 0}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  subtitle,
  highlight,
}: {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
        highlight ? 'ring-2 ring-yellow-500' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
