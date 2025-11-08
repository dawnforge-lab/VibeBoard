'use client';

import { useState } from 'react';
import { useConfigValue } from '../lib/hooks/useAppConfig';

interface ProPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string; // Optional: specific feature user tried to access
}

export default function ProPaywallModal({
  isOpen,
  onClose,
  feature,
}: ProPaywallModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'monthly' | 'annual'>(
    'monthly'
  );

  // Get pricing from dynamic config
  const monthlyPrice = useConfigValue('pro_monthly_price_usd');
  const annualPrice = useConfigValue('pro_annual_price_usd');

  // Calculate annual savings
  const annualSavings = Math.round(
    ((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100
  );

  const handleUpgrade = async () => {
    setIsLoading(true);

    try {
      // Get user data from Supabase
      const userId = 'user_123'; // Replace with actual user ID from auth
      const userEmail = 'user@example.com'; // Replace with actual user email

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'subscription',
          tier: selectedTier === 'monthly' ? 'PRO_MONTHLY' : 'PRO_ANNUAL',
          userId,
          userEmail,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Upgrade to Pro</h2>
            <p className="text-purple-100">
              Unlock unlimited styles and premium features
            </p>
          </div>
        </div>

        {/* Feature attempted message */}
        {feature && (
          <div className="mx-6 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🔒 <strong>{feature}</strong> is a Pro feature
            </p>
          </div>
        )}

        {/* Pricing Tiers */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly */}
            <button
              onClick={() => setSelectedTier('monthly')}
              disabled={isLoading}
              className={`relative p-6 border-2 rounded-xl transition-all transform hover:scale-105 ${
                selectedTier === 'monthly'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Monthly
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${monthlyPrice}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    /month
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Cancel anytime
                </p>
              </div>
            </button>

            {/* Annual */}
            <button
              onClick={() => setSelectedTier('annual')}
              disabled={isLoading}
              className={`relative p-6 border-2 rounded-xl transition-all transform hover:scale-105 ${
                selectedTier === 'annual'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                  Save {annualSavings}%
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Annual
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${annualPrice}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    /year
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  ${(annualPrice / 12).toFixed(2)}/month billed annually
                </p>
              </div>
            </button>
          </div>

          {/* Features List */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Pro Features Include:
            </h4>
            <ul className="space-y-3">
              {[
                'Unlimited style transformations',
                '50+ saved custom styles',
                '50 AI suggestions per day',
                'Premium font pack library',
                'Ad-free experience',
                'Priority support',
                'Early access to new features',
                'Export to multiple formats',
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start text-gray-700 dark:text-gray-300"
                >
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              `Start Pro - $${selectedTier === 'monthly' ? monthlyPrice : annualPrice}${selectedTier === 'monthly' ? '/mo' : '/yr'}`
            )}
          </button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Secure payment powered by Stripe • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
