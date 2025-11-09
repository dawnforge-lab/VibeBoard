import { supabase } from '../supabase';

/**
 * Check if user has an active Pro subscription
 */
export async function checkProStatus(userId: string): Promise<boolean> {
  try {
    // Check for active subscription in purchases table
    const { data: subscriptions, error } = await supabase
      .from('purchases')
      .select('status, type, metadata')
      .eq('user_id', userId)
      .eq('type', 'subscription')
      .eq('status', 'active')
      .limit(1);

    if (error) {
      console.error('Error checking Pro status:', error);
      return false;
    }

    return subscriptions && subscriptions.length > 0;
  } catch (error) {
    console.error('Error checking Pro status:', error);
    return false;
  }
}

/**
 * Check if user owns a specific font pack
 */
export async function checkPackOwnership(
  userId: string,
  packId: string
): Promise<boolean> {
  try {
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('pack_id')
      .eq('user_id', userId)
      .eq('type', 'pack')
      .eq('pack_id', packId)
      .eq('status', 'completed')
      .limit(1);

    if (error) {
      console.error('Error checking pack ownership:', error);
      return false;
    }

    return purchases && purchases.length > 0;
  } catch (error) {
    console.error('Error checking pack ownership:', error);
    return false;
  }
}

/**
 * Get all packs owned by user
 */
export async function getUserOwnedPacks(userId: string): Promise<string[]> {
  try {
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('pack_id')
      .eq('user_id', userId)
      .eq('type', 'pack')
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching owned packs:', error);
      return [];
    }

    return purchases?.map((p) => p.pack_id).filter(Boolean) || [];
  } catch (error) {
    console.error('Error fetching owned packs:', error);
    return [];
  }
}

/**
 * Get user's subscription details
 */
export async function getUserSubscription(userId: string): Promise<{
  isPro: boolean;
  tier?: string;
  renewalDate?: string;
  status?: string;
} | null> {
  try {
    const { data: subscription, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'subscription')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !subscription) {
      return { isPro: false };
    }

    const isPro = subscription.status === 'active';
    const tier = subscription.metadata?.tier;
    const renewalDate = subscription.metadata?.currentPeriodEnd;

    return {
      isPro,
      tier,
      renewalDate,
      status: subscription.status,
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { isPro: false };
  }
}
