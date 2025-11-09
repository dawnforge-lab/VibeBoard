/**
 * Stripe Integration
 * Server-side Stripe SDK wrapper and utilities
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

// Initialize Stripe with API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

/**
 * Subscription tiers and pricing
 * Prices managed dynamically via admin panel, but IDs are fixed
 */
export const SUBSCRIPTION_TIERS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
    name: 'Pro Monthly',
    interval: 'month' as const,
  },
  PRO_ANNUAL: {
    priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
    name: 'Pro Annual',
    interval: 'year' as const,
  },
} as const;

/**
 * Font pack purchase products
 */
export const PACK_PRODUCTS = {
  PREMIUM_PACK: {
    priceIdPrefix: 'price_pack_', // e.g., price_pack_vaporwave
  },
} as const;

/**
 * Create a Stripe Checkout Session for Pro subscription
 */
export async function createSubscriptionCheckoutSession(
  userId: string,
  userEmail: string,
  tier: keyof typeof SUBSCRIPTION_TIERS,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const priceId = SUBSCRIPTION_TIERS[tier].priceId;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    customer_email: userEmail,
    metadata: {
      userId,
      tier,
    },
    // Allow promo codes
    allow_promotion_codes: true,
    // Collect billing address
    billing_address_collection: 'auto',
    // Subscription metadata
    subscription_data: {
      metadata: {
        userId,
        tier,
      },
    },
  });

  return session;
}

/**
 * Create a Stripe Checkout Session for one-time pack purchase
 */
export async function createPackCheckoutSession(
  userId: string,
  userEmail: string,
  packId: string,
  packName: string,
  priceUsd: number,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  // For one-time purchases, we need to create a Price first or use a pre-created one
  // In production, font pack prices should be created in Stripe dashboard
  // and stored in the database

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: packName,
            description: `VibeBoard Font Pack: ${packName}`,
            metadata: {
              packId,
              type: 'font_pack',
            },
          },
          unit_amount: Math.round(priceUsd * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    customer_email: userEmail,
    metadata: {
      userId,
      packId,
      type: 'pack_purchase',
    },
  });

  return session;
}

/**
 * Get subscription by customer ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Get customer portal session (for managing subscription)
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

/**
 * Get price details
 */
export async function getPrice(priceId: string): Promise<Stripe.Price | null> {
  try {
    const price = await stripe.prices.retrieve(priceId);
    return price;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
}
