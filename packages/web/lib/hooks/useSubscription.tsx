'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useConfigValue } from './useAppConfig';

interface SubscriptionContextType {
  isPro: boolean;
  isLoading: boolean;
  ownedPacks: string[];
  checkPackOwnership: (packId: string) => boolean;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  isLoading: true,
  ownedPacks: [],
  checkPackOwnership: () => false,
  refresh: async () => {},
});

/**
 * Subscription Provider
 * Manages user Pro status and pack ownership
 */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ownedPacks, setOwnedPacks] = useState<string[]>([]);

  // Get user ID from auth (placeholder - replace with actual auth)
  const userId = 'user_123'; // TODO: Replace with actual user ID from Supabase auth

  const refresh = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch subscription status
      const subResponse = await fetch('/api/subscription/status');
      if (subResponse.ok) {
        const data = await subResponse.json();
        setIsPro(data.isPro || false);
        setOwnedPacks(data.ownedPacks || []);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [userId]);

  const checkPackOwnership = (packId: string): boolean => {
    return ownedPacks.includes(packId);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        isLoading,
        ownedPacks,
        checkPackOwnership,
        refresh,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

/**
 * Hook to access subscription context
 */
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}

/**
 * Hook to check if feature requires Pro
 */
export function useProFeature(_featureName?: string): {
  isPro: boolean;
  isLocked: boolean;
} {
  const { isPro } = useSubscription();

  return {
    isPro,
    isLocked: !isPro,
  };
}

/**
 * Hook to get style limits based on subscription
 */
export function useStyleLimits() {
  const { isPro } = useSubscription();
  const freeLimit = useConfigValue('free_styles_limit');
  const proLimit = useConfigValue('pro_styles_limit');

  return {
    styleLimit: isPro ? proLimit : freeLimit,
    isPro,
    canSaveMore: (currentCount: number) => {
      const limit = isPro ? proLimit : freeLimit;
      return currentCount < limit;
    },
  };
}
