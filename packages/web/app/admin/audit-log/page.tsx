import { getAuditLogs } from '../../../lib/admin/audit-log';
import AuditLogList from '../../../components/admin/AuditLogList';

export default async function AdminAuditLogPage() {
  const logs = await getAuditLogs({}, 100, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Audit Log
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track all admin actions and changes
        </p>
      </div>

      <AuditLogList initialLogs={logs} />
    </div>
  );
}
