'use client';

import { useState } from 'react';
import {
  AuditLogEntry,
  AuditLogFilters,
  getAuditLogs,
  exportAuditLogsToCSV,
  downloadCSV,
} from '../../lib/admin/audit-log';

export default function AuditLogList({
  initialLogs,
}: {
  initialLogs: AuditLogEntry[];
}) {
  const [logs, setLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  const actionTypes = [
    'create',
    'update',
    'delete',
    'activate',
    'deactivate',
    'toggle',
  ];
  const resourceTypes = [
    'app_config',
    'ai_prompts',
    'feature_flags',
    'system_notifications',
    'content_templates',
    'font_packs_meta',
  ];

  const handleFilterChange = async (newFilters: Partial<AuditLogFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setIsLoading(true);

    try {
      const filteredLogs = await getAuditLogs(updatedFilters, 100, 0);
      setLogs(filteredLogs);
    } catch (error) {
      console.error('Error filtering audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = exportAuditLogsToCSV(logs);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `audit-log-${timestamp}.csv`);
  };

  const handleClearFilters = () => {
    setFilters({});
    handleFilterChange({
      adminId: undefined,
      actionType: undefined,
      resourceType: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Action Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Action Type
            </label>
            <select
              value={filters.actionType || ''}
              onChange={(e) =>
                handleFilterChange({
                  actionType: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Actions</option>
              {actionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resource Type
            </label>
            <select
              value={filters.resourceType || ''}
              onChange={(e) =>
                handleFilterChange({
                  resourceType: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Resources</option>
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="datetime-local"
              value={filters.startDate || ''}
              onChange={(e) =>
                handleFilterChange({
                  startDate: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="datetime-local"
              value={filters.endDate || ''}
              onChange={(e) =>
                handleFilterChange({
                  endDate: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 mt-4">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Clear Filters
          </button>
          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            📥 Export CSV ({logs.length} entries)
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No audit log entries found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Resource ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <AuditLogRow key={log.id} log={log} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {logs.length} entries
      </div>
    </div>
  );
}

function AuditLogRow({ log }: { log: AuditLogEntry }) {
  const [showDetails, setShowDetails] = useState(false);

  const actionColors: Record<string, string> = {
    create:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    delete: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    activate:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    deactivate:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    toggle:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  };

  const actionColor =
    actionColors[log.action_type] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          {new Date(log.created_at).toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${actionColor}`}
          >
            {log.action_type}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
          {log.resource_type}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
          {log.resource_id ? (
            <span className="truncate max-w-xs inline-block">
              {log.resource_id.substring(0, 8)}...
            </span>
          ) : (
            '-'
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
          <span className="truncate max-w-xs inline-block">
            {log.admin_id.substring(0, 8)}...
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showDetails ? 'Hide' : 'Show'}
          </button>
        </td>
      </tr>
      {showDetails && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="space-y-2 text-xs">
              {log.old_value != null && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Old Value:
                  </span>
                  <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {JSON.stringify(log.old_value, null, 2)}
                  </pre>
                </div>
              )}
              {log.new_value != null && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    New Value:
                  </span>
                  <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {JSON.stringify(log.new_value, null, 2)}
                  </pre>
                </div>
              )}
              {log.ip_address && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    IP Address:
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">
                    {log.ip_address}
                  </span>
                </div>
              )}
              {log.user_agent && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    User Agent:
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">
                    {log.user_agent}
                  </span>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
