import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import {
  createSubscriptionCheckoutSession,
  createPackCheckoutSession,
  SUBSCRIPTION_TIERS,
} from '../../../lib/stripe';

export const dynamic = 'force-dynamic';

/**
 * POST /api/checkout
 * Create a Stripe Checkout Session for subscription or pack purchase
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, tier, packId, userId, userEmail } = body;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, userEmail' },
        { status: 400 }
      );
    }

    // Get the origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout/cancel`;

    // Handle subscription checkout
    if (type === 'subscription') {
      if (!tier || !(tier in SUBSCRIPTION_TIERS)) {
        return NextResponse.json(
          { error: 'Invalid subscription tier' },
          { status: 400 }
        );
      }

      const session = await createSubscriptionCheckoutSession(
        userId,
        userEmail,
        tier as keyof typeof SUBSCRIPTION_TIERS,
        successUrl,
        cancelUrl
      );

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    // Handle pack purchase checkout
    if (type === 'pack') {
      if (!packId) {
        return NextResponse.json(
          { error: 'Missing packId for pack purchase' },
          { status: 400 }
        );
      }

      // Fetch pack details from database
      const { data: pack, error } = await supabase
        .from('font_packs_meta')
        .select('pack_id, name, price_usd')
        .eq('pack_id', packId)
        .single();

      if (error || !pack) {
        return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
      }

      if (pack.price_usd === 0) {
        return NextResponse.json(
          { error: 'Cannot checkout free pack' },
          { status: 400 }
        );
      }

      const session = await createPackCheckoutSession(
        userId,
        userEmail,
        pack.pack_id,
        pack.name,
        pack.price_usd,
        successUrl,
        cancelUrl
      );

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    return NextResponse.json(
      { error: 'Invalid checkout type. Must be "subscription" or "pack"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
