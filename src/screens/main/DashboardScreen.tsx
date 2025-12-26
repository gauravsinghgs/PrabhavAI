import React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Card, ProgressBar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {Circle} from 'react-native-svg';
import type {MainTabScreenProps} from '@app-types/navigation';

type Props = MainTabScreenProps<'Home'>;

const colors = {
  primary: '#1a237e',
  primaryLight: '#534bae',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#388e3c',
  divider: '#e0e0e0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Mock data
const mockUser = {
  name: 'Rahul',
  streak: 7,
  currentXP: 1250,
  levelXP: 1500,
  level: 5,
  levelName: 'Explorer',
  weeklyGoal: 5,
  weeklyProgress: 3,
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'interview',
    title: 'HR Interview Practice',
    score: 85,
    time: '2 hours ago',
    icon: 'microphone',
  },
  {
    id: '2',
    type: 'module',
    title: 'Completed: Body Language',
    xp: 50,
    time: 'Yesterday',
    icon: 'book-check',
  },
  {
    id: '3',
    type: 'badge',
    title: 'Earned: 7-Day Streak',
    time: '2 days ago',
    icon: 'trophy',
  },
];

const quickActions = [
  {
    id: 'interview',
    title: 'Start Interview',
    icon: 'microphone',
    color: colors.primary,
    bgColor: `${colors.primary}15`,
  },
  {
    id: 'learn',
    title: 'Continue Learning',
    icon: 'book-open-variant',
    color: colors.success,
    bgColor: `${colors.success}15`,
  },
  {
    id: 'progress',
    title: 'View Progress',
    icon: 'chart-line',
    color: colors.secondary,
    bgColor: `${colors.secondary}15`,
  },
  {
    id: 'tips',
    title: 'Daily Tips',
    icon: 'lightbulb-on',
    color: colors.primaryLight,
    bgColor: `${colors.primaryLight}15`,
  },
];

// Progress Ring Component
interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  color,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        stroke={colors.divider}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <Circle
        stroke={color}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

export const DashboardScreen: React.FC<Props> = ({navigation}) => {
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'interview':
        navigation.navigate('Interview');
        break;
      case 'learn':
        navigation.navigate('Learn');
        break;
      case 'progress':
        navigation.navigate('Profile');
        break;
      case 'tips':
        // TODO: Navigate to tips screen
        console.log('Daily tips');
        break;
    }
  };

  const xpProgress = mockUser.currentXP / mockUser.levelXP;
  const weeklyProgress = mockUser.weeklyProgress / mockUser.weeklyGoal;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Greeting Header */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.userName}>Hello, {mockUser.name}! 👋</Text>
        </View>

        {/* Streak Card */}
        <Card style={styles.streakCard}>
          <Card.Content style={styles.streakContent}>
            <View style={styles.streakLeft}>
              <View style={styles.flameContainer}>
                <Icon name="fire" size={36} color={colors.secondary} />
              </View>
              <View style={styles.streakInfo}>
                <Text style={styles.streakCount}>{mockUser.streak} Day Streak</Text>
                <Text style={styles.streakSubtext}>
                  {mockUser.streak >= 7 ? "You're on fire! 🔥" : 'Keep it going!'}
                </Text>
              </View>
            </View>
            <View style={styles.xpBadge}>
              <Icon name="star" size={16} color={colors.secondary} />
              <Text style={styles.xpText}>{mockUser.currentXP} XP</Text>
            </View>
          </Card.Content>
        </Card>

        {/* XP Progress Card */}
        <Card style={styles.xpCard}>
          <Card.Content>
            <View style={styles.xpHeader}>
              <View>
                <Text style={styles.levelLabel}>
                  Level {mockUser.level} - {mockUser.levelName}
                </Text>
                <Text style={styles.xpToNext}>
                  {mockUser.levelXP - mockUser.currentXP} XP to next level
                </Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelNumber}>{mockUser.level}</Text>
              </View>
            </View>
            <ProgressBar
              progress={xpProgress}
              color={colors.primary}
              style={styles.xpProgressBar}
            />
            <View style={styles.xpLabels}>
              <Text style={styles.xpLabelText}>{mockUser.currentXP} XP</Text>
              <Text style={styles.xpLabelText}>{mockUser.levelXP} XP</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleQuickAction(action.id)}
              accessibilityRole="button"
              accessibilityLabel={action.title}>
              <View
                style={[styles.actionIcon, {backgroundColor: action.bgColor}]}>
                <Icon name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Goal */}
        <Card style={styles.weeklyCard}>
          <Card.Content style={styles.weeklyContent}>
            <View style={styles.weeklyLeft}>
              <Text style={styles.weeklyTitle}>Weekly Goal</Text>
              <Text style={styles.weeklySubtitle}>
                {mockUser.weeklyProgress} of {mockUser.weeklyGoal} days completed
              </Text>
              <View style={styles.weeklyDots}>
                {Array.from({length: mockUser.weeklyGoal}, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.weeklyDot,
                      i < mockUser.weeklyProgress && styles.weeklyDotFilled,
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.progressRingContainer}>
              <ProgressRing
                progress={weeklyProgress}
                size={70}
                strokeWidth={6}
                color={colors.success}
              />
              <View style={styles.progressRingCenter}>
                <Text style={styles.progressPercent}>
                  {Math.round(weeklyProgress * 100)}%
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card style={styles.activityCard}>
          <Card.Content style={styles.activityContent}>
            {mockRecentActivity.map((activity, index) => (
              <View key={activity.id}>
                <TouchableOpacity
                  style={styles.activityItem}
                  accessibilityRole="button"
                  accessibilityLabel={activity.title}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          activity.type === 'interview'
                            ? `${colors.primary}15`
                            : activity.type === 'badge'
                            ? `${colors.secondary}15`
                            : `${colors.success}15`,
                      },
                    ]}>
                    <Icon
                      name={activity.icon}
                      size={20}
                      color={
                        activity.type === 'interview'
                          ? colors.primary
                          : activity.type === 'badge'
                          ? colors.secondary
                          : colors.success
                      }
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  {activity.score && (
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{activity.score}</Text>
                    </View>
                  )}
                  {activity.xp && (
                    <View style={styles.xpEarned}>
                      <Text style={styles.xpEarnedText}>+{activity.xp} XP</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {index < mockRecentActivity.length - 1 && (
                  <View style={styles.activityDivider} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  greetingSection: {
    marginBottom: spacing.md,
  },
  greetingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  streakCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.secondary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakInfo: {
    marginLeft: spacing.md,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  streakSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.secondary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: spacing.xs,
  },
  xpCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  xpToNext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },
  xpProgressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.divider,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  xpLabelText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  weeklyCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  weeklyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weeklyLeft: {
    flex: 1,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  weeklySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  weeklyDots: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  weeklyDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.divider,
  },
  weeklyDotFilled: {
    backgroundColor: colors.success,
  },
  progressRingContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  activityContent: {
    paddingVertical: spacing.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
  },
  xpEarned: {
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpEarnedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  activityDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 56,
  },
});

export default DashboardScreen;
