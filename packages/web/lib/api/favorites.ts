import { supabase } from '../supabase';

export interface Favorite {
  id: string;
  user_id: string;
  style_id: string;
  pack_id: string;
  created_at: string;
}

export async function getFavorites(): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data || [];
}

export async function addFavorite(
  styleId: string,
  packId: string = 'default'
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('favorites')
    .insert([{ user_id: user.id, style_id: styleId, pack_id: packId }]);

  if (error) {
    console.error('Error adding favorite:', error);
    return false;
  }

  return true;
}

export async function removeFavorite(
  styleId: string,
  packId: string = 'default'
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('style_id', styleId)
    .eq('pack_id', packId);

  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }

  return true;
}

export async function syncFavorites(
  localFavorites: string[]
): Promise<string[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return localFavorites;
  }

  // Fetch cloud favorites
  const cloudFavorites = await getFavorites();
  const cloudStyleIds = cloudFavorites.map((f) => f.style_id);

  // Merge: union of local and cloud favorites
  const merged = [...new Set([...localFavorites, ...cloudStyleIds])];

  // Sync new local favorites to cloud
  for (const styleId of localFavorites) {
    if (!cloudStyleIds.includes(styleId)) {
      await addFavorite(styleId);
    }
  }

  return merged;
}
