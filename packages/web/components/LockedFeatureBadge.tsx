'use client';

interface LockedFeatureBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

/**
 * Badge shown on locked Pro features
 */
export default function LockedFeatureBadge({
  size = 'md',
  showText = false,
  className = '',
}: LockedFeatureBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      title="Pro feature"
    >
      <svg
        className={`${sizeClasses[size]} text-yellow-500`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
      {showText && (
        <span
          className={`font-semibold text-yellow-600 dark:text-yellow-400 ${textSizeClasses[size]}`}
        >
          PRO
        </span>
      )}
    </div>
  );
}
