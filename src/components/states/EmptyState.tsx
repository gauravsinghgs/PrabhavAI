/**
 * EmptyState - Reusable empty state component
 * For showing friendly messages when lists are empty
 */

import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import {useTheme, Text, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}],
        },
        style,
      ]}>
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: theme.colors.surfaceVariant},
        ]}>
        <Icon
          name={icon}
          size={48}
          color={theme.colors.onSurfaceVariant}
        />
      </View>
      <Text
        variant="titleMedium"
        style={[styles.title, {color: theme.colors.onSurface}]}>
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.description, {color: theme.colors.onSurfaceVariant}]}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.actionButton}>
          {actionLabel}
        </Button>
      )}
      {secondaryActionLabel && onSecondaryAction && (
        <Button
          mode="text"
          onPress={onSecondaryAction}
          style={styles.secondaryButton}>
          {secondaryActionLabel}
        </Button>
      )}
    </Animated.View>
  );
};

/**
 * NoInterviewsEmpty - Empty state for interview history
 */
interface NoInterviewsEmptyProps {
  onStartInterview?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const NoInterviewsEmpty: React.FC<NoInterviewsEmptyProps> = ({
  onStartInterview,
  style,
}) => {
  return (
    <EmptyState
      icon="microphone-off"
      title="No Interviews Yet"
      description="Start your first mock interview to begin improving your skills and tracking your progress."
      actionLabel="Start Practice Interview"
      onAction={onStartInterview}
      style={style}
    />
  );
};

/**
 * NoModulesEmpty - Empty state for learning modules
 */
interface NoModulesEmptyProps {
  onBrowseModules?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const NoModulesEmpty: React.FC<NoModulesEmptyProps> = ({
  onBrowseModules,
  style,
}) => {
  return (
    <EmptyState
      icon="book-open-variant"
      title="No Modules Started"
      description="Browse our learning modules to start building your interview skills with interactive lessons."
      actionLabel="Browse Modules"
      onAction={onBrowseModules}
      style={style}
    />
  );
};

/**
 * NoBadgesEmpty - Empty state for badges/achievements
 */
interface NoBadgesEmptyProps {
  onViewGoals?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const NoBadgesEmpty: React.FC<NoBadgesEmptyProps> = ({
  onViewGoals,
  style,
}) => {
  return (
    <EmptyState
      icon="medal-outline"
      title="No Badges Earned Yet"
      description="Complete interviews, finish modules, and maintain streaks to earn badges and show off your achievements."
      actionLabel="View Goals"
      onAction={onViewGoals}
      style={style}
    />
  );
};

/**
 * NoResultsEmpty - Empty state for search results
 */
interface NoResultsEmptyProps {
  searchTerm?: string;
  onClearSearch?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const NoResultsEmpty: React.FC<NoResultsEmptyProps> = ({
  searchTerm,
  onClearSearch,
  style,
}) => {
  return (
    <EmptyState
      icon="magnify-close"
      title="No Results Found"
      description={
        searchTerm
          ? `We couldn't find anything matching "${searchTerm}". Try a different search term.`
          : "We couldn't find what you're looking for."
      }
      actionLabel="Clear Search"
      onAction={onClearSearch}
      style={style}
    />
  );
};

/**
 * NoNotificationsEmpty - Empty state for notifications
 */
interface NoNotificationsEmptyProps {
  style?: StyleProp<ViewStyle>;
}

export const NoNotificationsEmpty: React.FC<NoNotificationsEmptyProps> = ({
  style,
}) => {
  return (
    <EmptyState
      icon="bell-off-outline"
      title="No Notifications"
      description="You're all caught up! We'll notify you about new achievements, reminders, and updates."
      style={style}
    />
  );
};

/**
 * OfflineEmpty - Empty state when offline
 */
interface OfflineEmptyProps {
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const OfflineEmpty: React.FC<OfflineEmptyProps> = ({
  onRetry,
  style,
}) => {
  return (
    <EmptyState
      icon="wifi-off"
      title="You're Offline"
      description="Check your internet connection and try again. Some features may be limited while offline."
      actionLabel="Try Again"
      onAction={onRetry}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButton: {
    marginTop: 8,
    minWidth: 200,
  },
  secondaryButton: {
    marginTop: 8,
  },
});

export default EmptyState;
