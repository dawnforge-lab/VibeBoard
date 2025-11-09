import ProFeatureWrapper from '../../../components/ProFeatureWrapper';
import LockedFeatureBadge from '../../../components/LockedFeatureBadge';

/**
 * Demo page showing Pro feature gates
 * This demonstrates how to use the Pro feature system
 */
export default function ProFeaturesDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Pro Features Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Examples of how Pro feature gates work in VibeBoard
        </p>

        {/* Free vs Pro Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Free Feature */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Free Feature
              </h2>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full">
                Available
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                This feature is available to all users, including free tier.
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Use Free Feature
              </button>
            </div>
          </div>

          {/* Pro Feature */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-yellow-300 dark:border-yellow-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pro Feature
              </h2>
              <LockedFeatureBadge size="md" showText />
            </div>
            <ProFeatureWrapper
              featureName="Advanced Style Editor"
              showBadge={false}
              disableInteraction={true}
            >
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400">
                  This feature requires a Pro subscription. Click to upgrade!
                </p>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Use Pro Feature
                </button>
              </div>
            </ProFeatureWrapper>
          </div>
        </div>

        {/* Style Limits Example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Style Library (10 Free / 50 Pro)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
              const isFree = num <= 10;
              return (
                <div key={num} className="relative">
                  {isFree ? (
                    <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold text-2xl hover:scale-105 transition-transform cursor-pointer">
                      {num}
                    </div>
                  ) : (
                    <ProFeatureWrapper
                      featureName={`Style Pack ${num}`}
                      badgePosition="top-right"
                      className="aspect-square"
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                        {num}
                      </div>
                    </ProFeatureWrapper>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Suggestions Example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Suggestions (3 Free / 50 Pro per day)
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              3 / 3 used today
            </div>
          </div>
          <ProFeatureWrapper
            featureName="AI Suggestions"
            showBadge={false}
            disableInteraction={true}
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Get AI-powered style suggestions for your text...
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Generate AI Suggestion
              </button>
            </div>
          </ProFeatureWrapper>
        </div>

        {/* Font Packs Example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Premium Font Packs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Pack */}
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Basic Pack
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Essential styles for everyday use
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
                Free
              </button>
            </div>

            {/* Pro Pack */}
            <ProFeatureWrapper
              featureName="Vaporwave Font Pack"
              badgePosition="top-right"
            >
              <div className="border-2 border-purple-300 dark:border-purple-600 rounded-lg p-4">
                <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg mb-3"></div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Vaporwave Pack
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Retro aesthetic styles
                </p>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">
                  $0.99
                </button>
              </div>
            </ProFeatureWrapper>

            {/* Another Pro Pack */}
            <ProFeatureWrapper
              featureName="Kawaii Font Pack"
              badgePosition="top-right"
            >
              <div className="border-2 border-pink-300 dark:border-pink-600 rounded-lg p-4">
                <div className="aspect-video bg-gradient-to-br from-pink-400 to-rose-600 rounded-lg mb-3"></div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Kawaii Pack
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Cute and adorable styles
                </p>
                <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold">
                  $0.99
                </button>
              </div>
            </ProFeatureWrapper>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 Implementation Guide
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>1. Wrap any Pro feature:</strong>{' '}
              <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                {`<ProFeatureWrapper featureName="...">`}
              </code>
            </p>
            <p>
              <strong>2. Use subscription hook:</strong>{' '}
              <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                const {`{ isPro }`} = useSubscription()
              </code>
            </p>
            <p>
              <strong>3. Check style limits:</strong>{' '}
              <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                const {`{ styleLimit, canSaveMore }`} = useStyleLimits()
              </code>
            </p>
            <p>
              <strong>4. Show lock badge:</strong>{' '}
              <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                {`<LockedFeatureBadge />`}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
