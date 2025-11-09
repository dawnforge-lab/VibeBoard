'use client';

import { useState, useEffect } from 'react';
import PackCard from '../../components/PackCard';
import { useSubscription } from '../../lib/hooks/useSubscription';

interface Pack {
  pack_id: string;
  name: string;
  description: string;
  price_usd: number;
  is_featured: boolean;
  is_free: boolean;
  thumbnail_url: string | null;
  tags: string[];
  downloads_count: number;
  isOwned?: boolean;
  isPremium?: boolean;
}

export default function PacksStorePage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<
    'all' | 'free' | 'premium' | 'owned'
  >('all');
  const [purchasingPackId, setPurchasingPackId] = useState<string | null>(null);
  const { isPro } = useSubscription();

  // Mock user ID - replace with actual auth
  const userId = 'user_123';

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/packs?userId=${userId}`);
      const data = await response.json();
      setPacks(data.packs || []);
    } catch (error) {
      console.error('Error fetching packs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (packId: string) => {
    setPurchasingPackId(packId);

    try {
      const pack = packs.find((p) => p.pack_id === packId);
      if (!pack) return;

      // If free pack, just "install" it (in real app, would download the pack JSON)
      if (pack.is_free || pack.price_usd === 0) {
        // Simulate installation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert(`${pack.name} installed successfully!`);
        await fetchPacks(); // Refresh to show as owned
        return;
      }

      // For paid packs, create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'pack',
          packId: pack.pack_id,
          userId,
          userEmail: 'user@example.com', // Replace with actual user email
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
      console.error('Error purchasing pack:', error);
      alert('Failed to start purchase. Please try again.');
    } finally {
      setPurchasingPackId(null);
    }
  };

  const filteredPacks = packs.filter((pack) => {
    switch (filterType) {
      case 'free':
        return pack.is_free || pack.price_usd === 0;
      case 'premium':
        return pack.price_usd > 0;
      case 'owned':
        return pack.isOwned;
      default:
        return true;
    }
  });

  const stats = {
    total: packs.length,
    free: packs.filter((p) => p.is_free || p.price_usd === 0).length,
    premium: packs.filter((p) => p.price_usd > 0).length,
    owned: packs.filter((p) => p.isOwned).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Font Packs Store</h1>
          <p className="text-purple-100">
            Discover and download premium font packs to level up your style game
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Packs
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.free}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Free Packs
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {stats.premium}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Premium Packs
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.owned}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Your Packs
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'free', 'premium', 'owned'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Pro Banner */}
        {!isPro && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Upgrade to Pro for Unlimited Access
                </h3>
                <p className="text-purple-100">
                  Get access to all premium packs with a Pro subscription
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Packs Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Loading packs...
            </p>
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No packs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try changing the filter or check back later for new packs
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => (
              <PackCard
                key={pack.pack_id}
                pack={pack}
                onPurchase={handlePurchase}
                isPurchasing={purchasingPackId === pack.pack_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
