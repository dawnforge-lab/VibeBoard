import { supabase } from '../../../lib/supabase';
import { getAllConfigs } from '../../../lib/admin/config';
import MetricCard from '../../../components/admin/MetricCard';
import QuickActions from '../../../components/admin/QuickActions';
import RecentActivity from '../../../components/admin/RecentActivity';

async function getDashboardMetrics() {
  try {
    // Fetch DAU (Daily Active Users) - users who had events today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: dauCount } = await supabase
      .from('analytics')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Fetch MAU (Monthly Active Users) - users who had events in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: mauCount } = await supabase
      .from('analytics')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Fetch active subscriptions count
    const { count: subscriptionsCount } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Fetch total favorites count
    const { count: favoritesCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true });

    return {
      dau: dauCount || 0,
      mau: mauCount || 0,
      activeSubscriptions: subscriptionsCount || 0,
      totalFavorites: favoritesCount || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      dau: 0,
      mau: 0,
      activeSubscriptions: 0,
      totalFavorites: 0,
    };
  }
}

async function getSystemHealth() {
  try {
    const configs = await getAllConfigs();
    const maintenanceMode = configs.find((c) => c.key === 'maintenance_mode');

    return {
      maintenanceMode: maintenanceMode?.value === 'true' || false,
      databaseStatus: 'healthy',
      apiStatus: 'healthy',
    };
  } catch (error) {
    return {
      maintenanceMode: false,
      databaseStatus: 'error',
      apiStatus: 'error',
    };
  }
}

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();
  const health = await getSystemHealth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview of VibeBoard metrics and system health
        </p>
      </div>

      {/* System Health Alert */}
      {health.maintenanceMode && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Maintenance Mode is currently enabled
            </span>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Daily Active Users"
          value={metrics.dau}
          icon="👥"
          trend={null}
        />
        <MetricCard
          title="Monthly Active Users"
          value={metrics.mau}
          icon="📈"
          trend={null}
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics.activeSubscriptions}
          icon="💳"
          trend={null}
        />
        <MetricCard
          title="Total Favorites"
          value={metrics.totalFavorites}
          icon="❤️"
          trend={null}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions maintenanceMode={health.maintenanceMode} />

      {/* Recent Activity */}
      <RecentActivity />

      {/* System Health */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Health
        </h2>
        <div className="space-y-3">
          <HealthIndicator label="Database" status={health.databaseStatus} />
          <HealthIndicator label="API" status={health.apiStatus} />
          <HealthIndicator
            label="Maintenance Mode"
            status={health.maintenanceMode ? 'warning' : 'healthy'}
          />
        </div>
      </div>
    </div>
  );
}

function HealthIndicator({ label, status }: { label: string; status: string }) {
  const statusConfig = {
    healthy: { color: 'text-green-600', bg: 'bg-green-100', icon: '✓' },
    warning: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⚠' },
    error: { color: 'text-red-600', bg: 'bg-red-100', icon: '✕' },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.error;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center space-x-2">
        <span
          className={`${config.bg} ${config.color} px-2 py-1 rounded text-xs font-medium`}
        >
          {config.icon} {status}
        </span>
      </div>
    </div>
  );
}
