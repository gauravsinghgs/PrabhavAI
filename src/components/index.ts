/**
 * Components Index
 * Central export for all reusable components
 */

// Onboarding components
export * from './onboarding';

// Animation Components
export {
  AnimatedButton,
  LoadingSpinner,
  PulsingDot,
  DotsLoader,
  SuccessCheckmark,
  ErrorCross,
  XPCounter,
  XPGain,
  LevelUpBadge,
  StreakFlame,
  StreakCalendar,
  StreakMilestone,
} from './animations';

// State Components (Empty & Error)
export {
  EmptyState,
  NoInterviewsEmpty,
  NoModulesEmpty,
  NoBadgesEmpty,
  NoResultsEmpty,
  NoNotificationsEmpty,
  OfflineEmpty,
  ErrorState,
  NetworkError,
  ServerError,
  TimeoutError,
  AuthError,
  PermissionError,
  GenericError,
  InlineError,
} from './states';

// Loading Components
export {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  SkeletonCard,
  SkeletonListItem,
  SkeletonInterviewCard,
  SkeletonModuleCard,
  SkeletonProfile,
  SkeletonHomeScreen,
  LoadingOverlay,
  ProcessingOverlay,
  ButtonLoadingState,
  PullToRefreshIndicator,
} from './loading';

// Error Boundary
export {default as ErrorBoundary, withErrorBoundary} from './ErrorBoundary';
