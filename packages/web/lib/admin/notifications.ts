import { supabase } from '../supabase';
import { logAdminAction } from './auth';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';
export type Platform = 'web' | 'mobile';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  platforms: Platform[];
  action_url: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export async function getAllNotifications(): Promise<SystemNotification[]> {
  const { data, error } = await supabase
    .from('system_notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
}

export async function getNotification(
  id: string
): Promise<SystemNotification | null> {
  const { data, error } = await supabase
    .from('system_notifications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching notification ${id}:`, error);
    return null;
  }

  return data;
}

export async function createNotification(
  notification: Pick<
    SystemNotification,
    'title' | 'message' | 'type' | 'platforms'
  > & {
    action_url?: string;
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
  }
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('system_notifications')
    .insert({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      platforms: notification.platforms,
      action_url: notification.action_url || null,
      start_date: notification.start_date || new Date().toISOString(),
      end_date: notification.end_date || null,
      is_active: notification.is_active ?? true,
      created_by: user?.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }

  await logAdminAction('create', 'system_notifications', data.id, null, {
    title: notification.title,
    type: notification.type,
  });

  return data.id;
}

export async function updateNotification(
  id: string,
  updates: Partial<
    Pick<
      SystemNotification,
      | 'title'
      | 'message'
      | 'type'
      | 'platforms'
      | 'action_url'
      | 'start_date'
      | 'end_date'
      | 'is_active'
    >
  >
): Promise<boolean> {
  const oldNotification = await getNotification(id);

  const { error } = await supabase
    .from('system_notifications')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error(`Error updating notification ${id}:`, error);
    return false;
  }

  await logAdminAction('update', 'system_notifications', id, oldNotification, {
    ...oldNotification,
    ...updates,
  });

  return true;
}

export async function deleteNotification(id: string): Promise<boolean> {
  const oldNotification = await getNotification(id);

  const { error } = await supabase
    .from('system_notifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting notification ${id}:`, error);
    return false;
  }

  await logAdminAction(
    'delete',
    'system_notifications',
    id,
    oldNotification,
    null
  );

  return true;
}

export async function activateNotification(id: string): Promise<boolean> {
  return updateNotification(id, { is_active: true });
}

export async function deactivateNotification(id: string): Promise<boolean> {
  return updateNotification(id, { is_active: false });
}

// Client-side notification fetching (public, filtered by active status and dates)
export async function getActiveNotifications(
  platform: Platform = 'web'
): Promise<SystemNotification[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('system_notifications')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', now)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .contains('platforms', [platform])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active notifications:', error);
    return [];
  }

  return data || [];
}

export async function scheduleNotification(
  notification: Pick<
    SystemNotification,
    'title' | 'message' | 'type' | 'platforms'
  > & {
    action_url?: string;
    start_date: string;
    end_date?: string;
  }
): Promise<string | null> {
  return createNotification({
    ...notification,
    is_active: true,
  });
}
