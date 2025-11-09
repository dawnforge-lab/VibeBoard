'use client';

import useSWR from 'swr';

// Default fallback configuration
const DEFAULT_CONFIG = {
  max_input_length: 200,
  free_styles_limit: 10,
  pro_styles_limit: 50,
  pro_monthly_price_usd: 2.99,
  pro_annual_price_usd: 24.99,
  enable_ai_suggestions: true,
  ai_suggestions_limit_free: 3,
  ai_suggestions_limit_pro: 50,
  maintenance_mode: false,
  show_ads: true,
  max_custom_styles: 5,
  enable_community_packs: true,
  enable_pack_purchases: true,
  community_pack_commission_pct: 30,
  max_pack_price_usd: 9.99,
  session_timeout_minutes: 30,
  rate_limit_requests_per_minute: 100,
} as const;

export type AppConfig = typeof DEFAULT_CONFIG;

const fetcher = async (url: string): Promise<AppConfig> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }

  const data = await response.json();
  return data as AppConfig;
};

export function useAppConfig() {
  const { data, error, isLoading, mutate } = useSWR<AppConfig>(
    '/api/config',
    fetcher,
    {
      // Revalidate every 60 seconds
      refreshInterval: 60000,
      // Keep previous data while revalidating
      keepPreviousData: true,
      // Revalidate on window focus
      revalidateOnFocus: true,
      // Don't revalidate on reconnect (60s refresh is enough)
      revalidateOnReconnect: false,
      // Fallback to default config on error
      fallbackData: DEFAULT_CONFIG,
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
      // Retry on error with exponential backoff
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      // Use SWR cache
      shouldRetryOnError: true,
      // Compare function to detect changes
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  );

  // Always return config (either fetched data, fallback, or default)
  const config = data || DEFAULT_CONFIG;

  return {
    config,
    isLoading,
    isError: !!error,
    error,
    // Force refresh config
    refresh: mutate,
    // Check if using fallback
    isFallback: !data,
  };
}

// Utility function to get a single config value with type safety
export function useConfigValue<K extends keyof AppConfig>(
  key: K
): AppConfig[K] {
  const { config } = useAppConfig();
  return config[key];
}
