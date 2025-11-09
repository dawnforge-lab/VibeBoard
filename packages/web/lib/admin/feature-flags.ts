import { supabase } from '../supabase';
import { logAdminAction } from './auth';

export interface FeatureFlag {
  id: string;
  key: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_user_ids: string[];
  description: string | null;
  scheduled_enable_at: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export async function getAllFeatureFlags(): Promise<FeatureFlag[]> {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .order('key', { ascending: true });

  if (error) {
    console.error('Error fetching feature flags:', error);
    return [];
  }

  return data || [];
}

export async function getFeatureFlag(key: string): Promise<FeatureFlag | null> {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching feature flag ${key}:`, error);
    return null;
  }

  return data;
}

export async function updateFeatureFlag(
  key: string,
  updates: Partial<
    Pick<
      FeatureFlag,
      | 'is_enabled'
      | 'rollout_percentage'
      | 'target_user_ids'
      | 'description'
      | 'scheduled_enable_at'
    >
  >
): Promise<boolean> {
  const oldFlag = await getFeatureFlag(key);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('feature_flags')
    .update({
      ...updates,
      updated_by: user?.id,
    })
    .eq('key', key);

  if (error) {
    console.error(`Error updating feature flag ${key}:`, error);
    return false;
  }

  await logAdminAction('update', 'feature_flags', key, oldFlag, {
    ...oldFlag,
    ...updates,
  });

  return true;
}

export async function createFeatureFlag(
  key: string,
  description: string,
  isEnabled: boolean = false,
  rolloutPercentage: number = 0
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('feature_flags').insert({
    key,
    description,
    is_enabled: isEnabled,
    rollout_percentage: rolloutPercentage,
    updated_by: user?.id,
  });

  if (error) {
    console.error(`Error creating feature flag ${key}:`, error);
    return false;
  }

  await logAdminAction('create', 'feature_flags', key, null, {
    key,
    is_enabled: isEnabled,
    rollout_percentage: rolloutPercentage,
  });

  return true;
}

export async function deleteFeatureFlag(key: string): Promise<boolean> {
  const oldFlag = await getFeatureFlag(key);

  const { error } = await supabase
    .from('feature_flags')
    .delete()
    .eq('key', key);

  if (error) {
    console.error(`Error deleting feature flag ${key}:`, error);
    return false;
  }

  await logAdminAction('delete', 'feature_flags', key, oldFlag, null);

  return true;
}

// Client-side feature flag checking (public, with rollout logic)
export async function isFeatureEnabled(
  key: string,
  userId?: string
): Promise<boolean> {
  const flag = await getFeatureFlag(key);

  if (!flag) {
    return false;
  }

  // If not enabled, return false
  if (!flag.is_enabled) {
    return false;
  }

  // If user is in target list, return true
  if (userId && flag.target_user_ids.includes(userId)) {
    return true;
  }

  // Check rollout percentage
  if (flag.rollout_percentage === 100) {
    return true;
  }

  if (flag.rollout_percentage === 0) {
    return false;
  }

  // Use deterministic hash-based rollout
  if (userId) {
    const hash = simpleHash(userId + key);
    return hash % 100 < flag.rollout_percentage;
  }

  // For anonymous users, use random rollout
  return Math.random() * 100 < flag.rollout_percentage;
}

export async function getPublicFeatureFlags(): Promise<
  Record<string, boolean>
> {
  const flags = await getAllFeatureFlags();
  const result: Record<string, boolean> = {};

  for (const flag of flags) {
    result[flag.key] = flag.is_enabled && flag.rollout_percentage > 0;
  }

  return result;
}

// Simple hash function for deterministic rollout
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
