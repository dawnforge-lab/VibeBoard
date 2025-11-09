import { supabase } from '../supabase';

export type AdminRole =
  | 'super_admin'
  | 'content_admin'
  | 'support_admin'
  | 'creator_admin';

export interface AdminUser {
  id: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  is_active: boolean;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .eq('is_active', true)
    .single();

  if (error || !adminUser) {
    return null;
  }

  return adminUser as AdminUser;
}

export async function isAdmin(): Promise<boolean> {
  const adminUser = await getAdminUser();
  return adminUser !== null;
}

export async function hasAdminRole(
  requiredRole: AdminRole | AdminRole[]
): Promise<boolean> {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    return false;
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(adminUser.role);
}

export async function updateLastLogin(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', user.id);
}

export async function logAdminAction(
  actionType: string,
  resourceType: string,
  resourceId?: string,
  oldValue?: unknown,
  newValue?: unknown
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from('admin_audit_log').insert({
    admin_id: user.id,
    action_type: actionType,
    resource_type: resourceType,
    resource_id: resourceId,
    old_value: oldValue,
    new_value: newValue,
  });
}
