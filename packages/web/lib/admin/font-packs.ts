import { supabase } from '../supabase';
import { logAdminAction } from './auth';

export type PackStatus = 'active' | 'draft' | 'pending_review' | 'rejected';

export interface FontPackMeta {
  id: string;
  pack_id: string;
  name: string;
  description: string;
  price_usd: number;
  is_featured: boolean;
  is_free: boolean;
  storage_url: string | null;
  thumbnail_url: string | null;
  tags: string[];
  status: PackStatus;
  downloads_count: number;
  revenue_total: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export async function getAllFontPacks(): Promise<FontPackMeta[]> {
  const { data, error } = await supabase
    .from('font_packs_meta')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching font packs:', error);
    return [];
  }

  return data || [];
}

export async function getFontPack(
  packId: string
): Promise<FontPackMeta | null> {
  const { data, error } = await supabase
    .from('font_packs_meta')
    .select('*')
    .eq('pack_id', packId)
    .single();

  if (error) {
    console.error(`Error fetching font pack ${packId}:`, error);
    return null;
  }

  return data;
}

export async function getFeaturedPacks(): Promise<FontPackMeta[]> {
  const { data, error } = await supabase
    .from('font_packs_meta')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching featured packs:', error);
    return [];
  }

  return data || [];
}

export async function getPacksByStatus(
  status: PackStatus
): Promise<FontPackMeta[]> {
  const { data, error } = await supabase
    .from('font_packs_meta')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching packs with status ${status}:`, error);
    return [];
  }

  return data || [];
}

export async function createFontPack(
  packId: string,
  name: string,
  description: string,
  options?: {
    priceUsd?: number;
    isFeatured?: boolean;
    isFree?: boolean;
    storageUrl?: string;
    thumbnailUrl?: string;
    tags?: string[];
    status?: PackStatus;
  }
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('font_packs_meta')
    .insert({
      pack_id: packId,
      name,
      description,
      price_usd: options?.priceUsd ?? 0,
      is_featured: options?.isFeatured ?? false,
      is_free: options?.isFree ?? true,
      storage_url: options?.storageUrl ?? null,
      thumbnail_url: options?.thumbnailUrl ?? null,
      tags: options?.tags ?? [],
      status: options?.status ?? 'active',
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`Error creating font pack ${packId}:`, error);
    return null;
  }

  await logAdminAction('create', 'font_packs_meta', packId, null, {
    pack_id: packId,
    name,
    price_usd: options?.priceUsd ?? 0,
  });

  return data.id;
}

export async function updateFontPack(
  id: string,
  updates: Partial<
    Pick<
      FontPackMeta,
      | 'name'
      | 'description'
      | 'price_usd'
      | 'is_featured'
      | 'is_free'
      | 'storage_url'
      | 'thumbnail_url'
      | 'tags'
      | 'status'
    >
  >
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldPack } = await supabase
    .from('font_packs_meta')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('font_packs_meta')
    .update({
      ...updates,
      updated_by: user?.id,
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating font pack ${id}:`, error);
    return false;
  }

  await logAdminAction('update', 'font_packs_meta', id, oldPack, {
    ...oldPack,
    ...updates,
  });

  return true;
}

export async function deleteFontPack(id: string): Promise<boolean> {
  const { data: oldPack } = await supabase
    .from('font_packs_meta')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('font_packs_meta')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting font pack ${id}:`, error);
    return false;
  }

  await logAdminAction('delete', 'font_packs_meta', id, oldPack, null);

  return true;
}

export async function toggleFeatured(
  id: string,
  featured: boolean
): Promise<boolean> {
  return updateFontPack(id, { is_featured: featured });
}

export async function approvePack(id: string): Promise<boolean> {
  return updateFontPack(id, { status: 'active' });
}

export async function rejectPack(id: string): Promise<boolean> {
  return updateFontPack(id, { status: 'rejected' });
}

export async function incrementDownloads(packId: string): Promise<boolean> {
  const { error } = await supabase.rpc('increment_pack_downloads', {
    p_pack_id: packId,
  });

  if (error) {
    console.error(`Error incrementing downloads for ${packId}:`, error);
    return false;
  }

  return true;
}

export async function recordRevenue(
  packId: string,
  amount: number
): Promise<boolean> {
  const { error } = await supabase.rpc('add_pack_revenue', {
    p_pack_id: packId,
    p_amount: amount,
  });

  if (error) {
    console.error(`Error recording revenue for ${packId}:`, error);
    return false;
  }

  return true;
}

// Upload pack JSON file to Supabase Storage
export async function uploadPackFile(
  packId: string,
  file: File
): Promise<string | null> {
  try {
    const fileName = `${packId}.json`;
    const filePath = `font-packs/${fileName}`;

    const { error } = await supabase.storage
      .from('packs')
      .upload(filePath, file, {
        upsert: true,
        contentType: 'application/json',
      });

    if (error) {
      console.error(`Error uploading pack file:`, error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('packs').getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading pack file:', error);
    return null;
  }
}

// Upload thumbnail image
export async function uploadThumbnail(
  packId: string,
  file: File
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${packId}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error } = await supabase.storage
      .from('packs')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error(`Error uploading thumbnail:`, error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('packs').getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return null;
  }
}

// Get pack analytics
export interface PackAnalytics {
  totalPacks: number;
  totalRevenue: number;
  totalDownloads: number;
  freePacks: number;
  paidPacks: number;
  featuredPacks: number;
  pendingReview: number;
}

export async function getPackAnalytics(): Promise<PackAnalytics> {
  const packs = await getAllFontPacks();

  return {
    totalPacks: packs.length,
    totalRevenue: packs.reduce((sum, pack) => sum + pack.revenue_total, 0),
    totalDownloads: packs.reduce((sum, pack) => sum + pack.downloads_count, 0),
    freePacks: packs.filter((p) => p.is_free).length,
    paidPacks: packs.filter((p) => !p.is_free).length,
    featuredPacks: packs.filter((p) => p.is_featured).length,
    pendingReview: packs.filter((p) => p.status === 'pending_review').length,
  };
}
