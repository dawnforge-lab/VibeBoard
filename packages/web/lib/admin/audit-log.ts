import { supabase } from '../supabase';

export interface AuditLogEntry {
  id: string;
  admin_id: string;
  action_type: string;
  resource_type: string;
  resource_id: string | null;
  old_value: unknown;
  new_value: unknown;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  admin_users?: {
    id: string;
  };
}

export interface AuditLogFilters {
  adminId?: string;
  actionType?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAuditLogs(
  filters?: AuditLogFilters,
  limit: number = 100,
  offset: number = 0
): Promise<AuditLogEntry[]> {
  let query = supabase
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
    .range(offset, offset + limit - 1);

  if (filters?.adminId) {
    query = query.eq('admin_id', filters.adminId);
  }

  if (filters?.actionType) {
    query = query.eq('action_type', filters.actionType);
  }

  if (filters?.resourceType) {
    query = query.eq('resource_type', filters.resourceType);
  }

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return (data || []) as AuditLogEntry[];
}

export async function getAuditLogCount(
  filters?: AuditLogFilters
): Promise<number> {
  let query = supabase
    .from('admin_audit_log')
    .select('*', { count: 'exact', head: true });

  if (filters?.adminId) {
    query = query.eq('admin_id', filters.adminId);
  }

  if (filters?.actionType) {
    query = query.eq('action_type', filters.actionType);
  }

  if (filters?.resourceType) {
    query = query.eq('resource_type', filters.resourceType);
  }

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error counting audit logs:', error);
    return 0;
  }

  return count || 0;
}

export function exportAuditLogsToCSV(logs: AuditLogEntry[]): string {
  const headers = [
    'Timestamp',
    'Admin ID',
    'Action Type',
    'Resource Type',
    'Resource ID',
    'Old Value',
    'New Value',
    'IP Address',
    'User Agent',
  ];

  const rows = logs.map((log) => [
    new Date(log.created_at).toISOString(),
    log.admin_id,
    log.action_type,
    log.resource_type,
    log.resource_id || '',
    JSON.stringify(log.old_value || {}),
    JSON.stringify(log.new_value || {}),
    log.ip_address || '',
    log.user_agent || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
