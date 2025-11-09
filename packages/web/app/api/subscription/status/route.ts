import { NextResponse } from 'next/server';
import {
  getUserSubscription,
  getUserOwnedPacks,
} from '../../../../lib/subscription';

export const dynamic = 'force-dynamic';

/**
 * GET /api/subscription/status
 * Get user's subscription status and owned packs
 */
export async function GET(request: Request) {
  try {
    // Get user ID from auth
    // TODO: Replace with actual Supabase auth session
    const userId = request.headers.get('x-user-id') || 'user_123';

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get subscription details
    const subscription = await getUserSubscription(userId);
    const ownedPacks = await getUserOwnedPacks(userId);

    return NextResponse.json({
      isPro: subscription?.isPro || false,
      tier: subscription?.tier,
      renewalDate: subscription?.renewalDate,
      status: subscription?.status,
      ownedPacks,
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch subscription status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
