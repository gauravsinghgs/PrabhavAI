/**
 * Skeleton - Shimmer loading placeholders
 * For showing loading states with smooth shimmer animation
 */

import React, {useRef, useEffect} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Dimensions,
  DimensionValue,
} from 'react-native';
import {useTheme} from 'react-native-paper';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const theme = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    );
    animation.start();

    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
          overflow: 'hidden',
        },
        style,
      ]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{translateX}],
          },
        ]}
      />
    </View>
  );
};

/**
 * SkeletonCircle - Circular skeleton for avatars
 */
interface SkeletonCircleProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 48,
  style,
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
};

/**
 * SkeletonText - Text line skeleton
 */
interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
  lastLineWidth?: DimensionValue;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lineHeight = 16,
  lastLineWidth = '60%',
  spacing = 8,
  style,
}) => {
  return (
    <View style={style}>
      {Array.from({length: lines}).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height={lineHeight}
          style={{marginBottom: index < lines - 1 ? spacing : 0}}
        />
      ))}
    </View>
  );
};

/**
 * SkeletonCard - Card skeleton placeholder
 */
interface SkeletonCardProps {
  hasImage?: boolean;
  imageHeight?: number;
  style?: StyleProp<ViewStyle>;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasImage = true,
  imageHeight = 150,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: theme.colors.surface},
        style,
      ]}>
      {hasImage && (
        <Skeleton
          width="100%"
          height={imageHeight}
          borderRadius={0}
          style={styles.cardImage}
        />
      )}
      <View style={styles.cardContent}>
        <Skeleton width="70%" height={20} style={{marginBottom: 12}} />
        <SkeletonText lines={2} lineHeight={14} />
        <View style={styles.cardFooter}>
          <Skeleton width={80} height={14} />
          <Skeleton width={60} height={14} />
        </View>
      </View>
    </View>
  );
};

/**
 * SkeletonListItem - List item skeleton
 */
interface SkeletonListItemProps {
  hasAvatar?: boolean;
  hasSubtitle?: boolean;
  hasAction?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SkeletonListItem: React.FC<SkeletonListItemProps> = ({
  hasAvatar = true,
  hasSubtitle = true,
  hasAction = false,
  style,
}) => {
  return (
    <View style={[styles.listItem, style]}>
      {hasAvatar && <SkeletonCircle size={48} style={styles.avatar} />}
      <View style={styles.listContent}>
        <Skeleton width="60%" height={16} style={{marginBottom: 8}} />
        {hasSubtitle && <Skeleton width="40%" height={14} />}
      </View>
      {hasAction && (
        <Skeleton width={60} height={32} borderRadius={16} />
      )}
    </View>
  );
};

/**
 * SkeletonInterviewCard - Interview history card skeleton
 */
export const SkeletonInterviewCard: React.FC<{style?: StyleProp<ViewStyle>}> = ({
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.interviewCard,
        {backgroundColor: theme.colors.surface},
        style,
      ]}>
      <View style={styles.interviewHeader}>
        <View style={styles.interviewInfo}>
          <Skeleton width={100} height={18} style={{marginBottom: 8}} />
          <Skeleton width={150} height={14} />
        </View>
        <Skeleton width={50} height={50} borderRadius={25} />
      </View>
      <View style={styles.interviewStats}>
        <Skeleton width={80} height={14} />
        <Skeleton width={60} height={14} />
        <Skeleton width={70} height={14} />
      </View>
    </View>
  );
};

/**
 * SkeletonModuleCard - Learning module card skeleton
 */
export const SkeletonModuleCard: React.FC<{style?: StyleProp<ViewStyle>}> = ({
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.moduleCard,
        {backgroundColor: theme.colors.surface},
        style,
      ]}>
      <View style={styles.moduleHeader}>
        <SkeletonCircle size={56} />
        <View style={styles.moduleInfo}>
          <Skeleton width="80%" height={18} style={{marginBottom: 8}} />
          <Skeleton width="60%" height={14} />
        </View>
      </View>
      <Skeleton width="100%" height={8} borderRadius={4} style={{marginVertical: 16}} />
      <View style={styles.moduleMeta}>
        <Skeleton width={60} height={12} />
        <Skeleton width={80} height={12} />
      </View>
    </View>
  );
};

/**
 * SkeletonProfile - Profile section skeleton
 */
export const SkeletonProfile: React.FC<{style?: StyleProp<ViewStyle>}> = ({
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.profile, style]}>
      <SkeletonCircle size={100} style={{marginBottom: 16}} />
      <Skeleton width={150} height={24} style={{marginBottom: 8}} />
      <Skeleton width={200} height={16} style={{marginBottom: 24}} />
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Skeleton width={40} height={28} style={{marginBottom: 4}} />
          <Skeleton width={60} height={12} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={40} height={28} style={{marginBottom: 4}} />
          <Skeleton width={60} height={12} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={40} height={28} style={{marginBottom: 4}} />
          <Skeleton width={60} height={12} />
        </View>
      </View>
    </View>
  );
};

/**
 * SkeletonHomeScreen - Full home screen skeleton
 */
export const SkeletonHomeScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.homeScreen, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <View style={styles.homeHeader}>
        <View>
          <Skeleton width={120} height={14} style={{marginBottom: 8}} />
          <Skeleton width={180} height={24} />
        </View>
        <SkeletonCircle size={48} />
      </View>

      {/* Stats Card */}
      <View style={[styles.statsCard, {backgroundColor: theme.colors.primary}]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Skeleton width={50} height={32} style={{marginBottom: 4}} />
            <Skeleton width={40} height={12} />
          </View>
          <View style={styles.statItem}>
            <Skeleton width={50} height={32} style={{marginBottom: 4}} />
            <Skeleton width={40} height={12} />
          </View>
          <View style={styles.statItem}>
            <Skeleton width={50} height={32} style={{marginBottom: 4}} />
            <Skeleton width={40} height={12} />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Skeleton width={150} height={20} style={{marginVertical: 16}} />
      <View style={styles.quickActions}>
        <Skeleton width="48%" height={100} borderRadius={12} />
        <Skeleton width="48%" height={100} borderRadius={12} />
      </View>

      {/* Recent Activity */}
      <Skeleton width={150} height={20} style={{marginVertical: 16}} />
      <SkeletonInterviewCard style={{marginBottom: 12}} />
      <SkeletonInterviewCard />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '50%',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  interviewCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  interviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  interviewInfo: {
    flex: 1,
  },
  interviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  moduleCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  moduleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profile: {
    alignItems: 'center',
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  homeScreen: {
    flex: 1,
    padding: 16,
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    opacity: 0.3,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Skeleton;
