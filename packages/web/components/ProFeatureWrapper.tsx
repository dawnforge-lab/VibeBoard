'use client';

import { ReactNode, useState } from 'react';
import { useSubscription } from '../lib/hooks/useSubscription';
import LockedFeatureBadge from './LockedFeatureBadge';
import ProPaywallModal from './ProPaywallModal';

interface ProFeatureWrapperProps {
  children: ReactNode;
  featureName: string;
  showBadge?: boolean;
  badgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  disableInteraction?: boolean;
  className?: string;
}

/**
 * Wrapper component for Pro features
 * Shows lock badge and opens paywall when clicked if user is not Pro
 */
export default function ProFeatureWrapper({
  children,
  featureName,
  showBadge = true,
  badgePosition = 'top-right',
  disableInteraction = true,
  className = '',
}: ProFeatureWrapperProps) {
  const { isPro } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  // If user is Pro, just render children normally
  if (isPro) {
    return <>{children}</>;
  }

  const badgePositionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disableInteraction) {
      e.preventDefault();
      e.stopPropagation();
      setShowPaywall(true);
    }
  };

  return (
    <>
      <div
        className={`relative ${className} ${disableInteraction ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
        role={disableInteraction ? 'button' : undefined}
        tabIndex={disableInteraction ? 0 : undefined}
        onKeyDown={(e) => {
          if (disableInteraction && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setShowPaywall(true);
          }
        }}
      >
        {/* Locked overlay */}
        {disableInteraction && (
          <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
              <LockedFeatureBadge size="lg" showText />
            </div>
          </div>
        )}

        {/* Lock badge */}
        {showBadge && (
          <div
            className={`absolute ${badgePositionClasses[badgePosition]} z-20`}
          >
            <LockedFeatureBadge size="md" showText />
          </div>
        )}

        {/* Content */}
        <div className={disableInteraction ? 'pointer-events-none' : ''}>
          {children}
        </div>
      </div>

      {/* Paywall Modal */}
      <ProPaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={featureName}
      />
    </>
  );
}
