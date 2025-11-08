import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '../../../lib/supabase';
import { verifyWebhookSignature } from '../../../lib/stripe';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!STRIPE_WEBHOOK_SECRET) {
  console.warn(
    'WARNING: STRIPE_WEBHOOK_SECRET is not set. Webhook signature verification will fail.'
  );
}

/**
 * POST /api/stripe-webhook
 * Handle Stripe webhook events
 *
 * Important: This endpoint must receive the raw body for signature verification
 * Next.js API routes automatically parse the body, so we need special handling
 */
export async function POST(request: Request) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log(`Received Stripe event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout.session.completed event
 * This is triggered when a customer completes the checkout
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const type = session.metadata?.type;

  if (!userId) {
    console.error('No userId found in session metadata');
    return;
  }

  console.log(`Checkout completed for user ${userId}, type: ${type}`);

  // Handle subscription purchase
  if (session.mode === 'subscription') {
    const subscriptionId = session.subscription as string;
    const tier = session.metadata?.tier || 'PRO_MONTHLY';

    // Create purchase record
    const { error: purchaseError } = await supabase.from('purchases').insert({
      user_id: userId,
      type: 'subscription',
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: session.customer as string,
      status: 'active',
      metadata: {
        tier,
        sessionId: session.id,
      },
    });

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError);
    } else {
      console.log(`Created subscription purchase for user ${userId}`);
    }
  }

  // Handle one-time pack purchase
  if (session.mode === 'payment' && type === 'pack_purchase') {
    const packId = session.metadata?.packId;

    if (!packId) {
      console.error('No packId found in session metadata');
      return;
    }

    // Create purchase record
    const { error: purchaseError } = await supabase.from('purchases').insert({
      user_id: userId,
      type: 'pack',
      pack_id: packId,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_customer_id: session.customer as string,
      status: 'completed',
      metadata: {
        packId,
        sessionId: session.id,
      },
    });

    if (purchaseError) {
      console.error('Error creating pack purchase record:', purchaseError);
    } else {
      console.log(`Created pack purchase for user ${userId}, pack ${packId}`);

      // Increment pack downloads count
      const { error: packError } = await supabase.rpc(
        'increment_pack_downloads',
        {
          p_pack_id: packId,
        }
      );

      if (packError) {
        console.error('Error incrementing pack downloads:', packError);
      }

      // Record revenue
      const { data: pack } = await supabase
        .from('font_packs_meta')
        .select('price_usd')
        .eq('pack_id', packId)
        .single();

      if (pack) {
        await supabase.rpc('add_pack_revenue', {
          p_pack_id: packId,
          p_amount: pack.price_usd,
        });
      }
    }
  }
}

/**
 * Handle customer.subscription.created event
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  console.log(`Subscription created for user ${userId}`);
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  const status =
    subscription.status === 'active' || subscription.status === 'trialing'
      ? 'active'
      : subscription.status === 'canceled' || subscription.status === 'unpaid'
        ? 'cancelled'
        : 'active';

  // Update purchase record status
  const { error } = await supabase
    .from('purchases')
    .update({
      status,
      metadata: {
        ...subscription.metadata,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      },
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription status:', error);
  } else {
    console.log(`Updated subscription status for user ${userId}: ${status}`);
  }
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  // Mark subscription as cancelled
  const { error } = await supabase
    .from('purchases')
    .update({
      status: 'cancelled',
      metadata: {
        ...subscription.metadata,
        cancelledAt: new Date().toISOString(),
      },
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error cancelling subscription:', error);
  } else {
    console.log(`Cancelled subscription for user ${userId}`);
  }
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Payment succeeded for invoice ${invoice.id}`);
  // Additional logic for successful payments (e.g., send receipt email)
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Payment failed for invoice ${invoice.id}`);
  // Additional logic for failed payments (e.g., send dunning email)
}
