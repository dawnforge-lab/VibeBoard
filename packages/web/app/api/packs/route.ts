import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/packs
 * Get all font packs with metadata and pricing
 * Optionally filter by ownership status
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const filterOwned = searchParams.get('owned') === 'true';
    const filterPremium = searchParams.get('premium') === 'true';

    // Fetch all packs from database
    let query = supabase
      .from('font_packs_meta')
      .select('*')
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('name');

    // Filter by premium status if requested
    if (filterPremium) {
      query = query.gt('price_usd', 0);
    }

    const { data: packs, error } = await query;

    if (error) {
      console.error('Error fetching packs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch packs' },
        { status: 500 }
      );
    }

    // If user ID provided, fetch owned packs
    let ownedPackIds: string[] = [];
    if (userId) {
      const { data: purchases } = await supabase
        .from('purchases')
        .select('pack_id')
        .eq('user_id', userId)
        .eq('type', 'pack')
        .eq('status', 'completed');

      ownedPackIds = purchases?.map((p) => p.pack_id).filter(Boolean) || [];
    }

    // Add ownership status to packs
    const enrichedPacks = packs?.map((pack) => ({
      ...pack,
      isOwned: ownedPackIds.includes(pack.pack_id),
      isPremium: pack.price_usd > 0,
    }));

    // Filter by ownership if requested
    let filteredPacks = enrichedPacks;
    if (filterOwned && userId) {
      filteredPacks = enrichedPacks?.filter((p) => p.isOwned);
    }

    return NextResponse.json({
      packs: filteredPacks || [],
      total: filteredPacks?.length || 0,
    });
  } catch (error) {
    console.error('Error in packs API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
