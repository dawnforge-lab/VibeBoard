'use client';

import { useAppConfig } from '../lib/hooks/useAppConfig';

/**
 * ConfigTester - Component to test and display app configuration
 * Useful for debugging and verifying config updates
 */
export default function ConfigTester() {
  const { config, isLoading, isError, error, refresh, isFallback } =
    useAppConfig();

  if (isLoading) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200">
          Loading configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div
        className={`p-4 rounded-lg border ${
          isError
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : isFallback
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`font-semibold ${
                isError
                  ? 'text-red-800 dark:text-red-200'
                  : isFallback
                    ? 'text-orange-800 dark:text-orange-200'
                    : 'text-green-800 dark:text-green-200'
              }`}
            >
              {isError
                ? '⚠️ API Error - Using Fallback'
                : isFallback
                  ? '🔄 Using Cached/Fallback Config'
                  : '✅ Config Loaded Successfully'}
            </h3>
            {error && (
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Error: {error.message}
              </p>
            )}
          </div>
          <button
            onClick={() => refresh()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Config Display */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(config).map(([key, value]) => (
            <div
              key={key}
              className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg"
            >
              <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {key}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {typeof value === 'boolean' ? (
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      value
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {value ? 'true' : 'false'}
                  </span>
                ) : typeof value === 'number' ? (
                  <span className="font-mono">{value}</span>
                ) : (
                  <span>{String(value)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Usage Examples
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Max input length:{' '}
              <span className="font-mono bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">
                {config.max_input_length}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Free user style limit:{' '}
              <span className="font-mono bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">
                {config.free_styles_limit}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Pro monthly price:{' '}
              <span className="font-mono bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">
                ${config.pro_monthly_price_usd}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              AI suggestions enabled:{' '}
              <span
                className={`font-mono px-2 py-1 rounded ${
                  config.enable_ai_suggestions
                    ? 'bg-green-100 dark:bg-green-900/40'
                    : 'bg-red-100 dark:bg-red-900/40'
                }`}
              >
                {config.enable_ai_suggestions ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Cache Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Config is cached for 60 seconds and automatically refreshes in the
        background
      </div>
    </div>
  );
}
