import { supabase } from '../supabase';
import { logAdminAction } from './auth';

export interface AppConfig {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export async function getAllConfigs(): Promise<AppConfig[]> {
  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .order('category', { ascending: true })
    .order('key', { ascending: true });

  if (error) {
    console.error('Error fetching configs:', error);
    return [];
  }

  return data || [];
}

export async function getConfig(key: string): Promise<AppConfig | null> {
  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching config ${key}:`, error);
    return null;
  }

  return data;
}

export async function updateConfig(
  key: string,
  value: unknown,
  description?: string
): Promise<boolean> {
  const oldConfig = await getConfig(key);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('app_config')
    .update({
      value,
      description: description || oldConfig?.description,
      updated_by: user?.id,
    })
    .eq('key', key);

  if (error) {
    console.error(`Error updating config ${key}:`, error);
    return false;
  }

  await logAdminAction('update', 'app_config', key, oldConfig?.value, value);

  return true;
}

export async function createConfig(
  key: string,
  value: unknown,
  description: string,
  category: string = 'general'
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('app_config').insert({
    key,
    value,
    description,
    category,
    updated_by: user?.id,
  });

  if (error) {
    console.error(`Error creating config ${key}:`, error);
    return false;
  }

  await logAdminAction('create', 'app_config', key, null, value);

  return true;
}

export async function deleteConfig(key: string): Promise<boolean> {
  const oldConfig = await getConfig(key);

  const { error } = await supabase.from('app_config').delete().eq('key', key);

  if (error) {
    console.error(`Error deleting config ${key}:`, error);
    return false;
  }

  await logAdminAction('delete', 'app_config', key, oldConfig?.value, null);

  return true;
}

// Client-side config fetching (public, no auth required)
export async function getPublicConfig(key: string): Promise<unknown> {
  const config = await getConfig(key);
  return config?.value;
}

export async function getPublicConfigs(): Promise<Record<string, unknown>> {
  const configs = await getAllConfigs();
  return configs.reduce(
    (acc, config) => {
      acc[config.key] = config.value;
      return acc;
    },
    {} as Record<string, unknown>
  );
}
