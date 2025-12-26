import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Text, Card, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {InterviewStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<InterviewStackParamList, 'InterviewHub'>;

// Re-export for backward compatibility
export type InterviewHubScreenProps = Props;

const colors = {
  primary: '#1a237e',
  primaryLight: '#534bae',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#388e3c',
  error: '#d32f2f',
  divider: '#e0e0e0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Mock interview stats
const mockStats = {
  totalInterviews: 12,
  averageScore: 78,
  thisWeek: 3,
  improvement: '+5%',
};

// Mock interview history
const mockInterviewHistory = [
  {
    id: '1',
    company: 'Google',
    companyIcon: 'google',
    type: 'Technical',
    date: 'Today, 2:30 PM',
    score: 85,
    duration: '25 min',
    status: 'completed',
  },
  {
    id: '2',
    company: 'TCS',
    companyIcon: 'office-building',
    type: 'HR Interview',
    date: 'Yesterday',
    score: 72,
    duration: '18 min',
    status: 'completed',
  },
  {
    id: '3',
    company: 'Microsoft',
    companyIcon: 'microsoft',
    type: 'Behavioral',
    date: '2 days ago',
    score: 88,
    duration: '30 min',
    status: 'completed',
  },
  {
    id: '4',
    company: 'Infosys',
    companyIcon: 'office-building',
    type: 'HR Interview',
    date: '3 days ago',
    score: 65,
    duration: '22 min',
    status: 'completed',
  },
  {
    id: '5',
    company: 'Amazon',
    companyIcon: 'amazon',
    type: 'Technical',
    date: 'Last week',
    score: 79,
    duration: '28 min',
    status: 'completed',
  },
];

const getScoreColor = (score: number): string => {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.secondary;
  return colors.error;
};

interface InterviewItemProps {
  interview: (typeof mockInterviewHistory)[0];
  onViewDetails: () => void;
}

const InterviewItem: React.FC<InterviewItemProps> = ({
  interview,
  onViewDetails,
}) => (
  <Card style={styles.interviewCard}>
    <Card.Content style={styles.interviewContent}>
      <View style={styles.interviewLeft}>
        <View style={styles.companyIcon}>
          <Icon name={interview.companyIcon} size={24} color={colors.primary} />
        </View>
        <View style={styles.interviewInfo}>
          <Text style={styles.companyName}>{interview.company}</Text>
          <Text style={styles.interviewType}>{interview.type}</Text>
          <View style={styles.interviewMeta}>
            <Icon
              name="calendar"
              size={12}
              color={colors.textSecondary}
              style={styles.metaIcon}
            />
            <Text style={styles.interviewDate}>{interview.date}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Icon
              name="clock-outline"
              size={12}
              color={colors.textSecondary}
              style={styles.metaIcon}
            />
            <Text style={styles.interviewDate}>{interview.duration}</Text>
          </View>
        </View>
      </View>
      <View style={styles.interviewRight}>
        <View
          style={[
            styles.scoreBadge,
            {backgroundColor: `${getScoreColor(interview.score)}15`},
          ]}>
          <Text
            style={[styles.scoreText, {color: getScoreColor(interview.score)}]}>
            {interview.score}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onViewDetails}
          style={styles.viewDetailsLink}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${interview.company} interview`}
          accessibilityHint="Opens the detailed feedback for this interview">
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </Card.Content>
  </Card>
);

export const InterviewHubScreen: React.FC<Props> = ({navigation}) => {
  const handleStartInterview = () => {
    navigation.navigate('InterviewSetup');
  };

  const handleViewDetails = (interviewId: string) => {
    navigation.navigate('Feedback', {interviewId});
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mock Interviews</Text>
          <Text style={styles.headerSubtitle}>
            Practice makes perfect. Start your next interview.
          </Text>
        </View>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockStats.totalInterviews}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockStats.averageScore}%</Text>
                <Text style={styles.statLabel}>Avg Score</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockStats.thisWeek}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, {color: colors.success}]}>
                  {mockStats.improvement}
                </Text>
                <Text style={styles.statLabel}>Improvement</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Start Interview Button */}
        <Button
          mode="contained"
          onPress={handleStartInterview}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          labelStyle={styles.startButtonLabel}
          icon={({color}) => (
            <Icon name="microphone" size={24} color={color} />
          )}
          accessibilityRole="button"
          accessibilityLabel="Start New Interview">
          Start New Interview
        </Button>

        {/* Quick Practice Section */}
        <View style={styles.quickPracticeSection}>
          <Text style={styles.sectionTitle}>Quick Practice</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPracticeScroll}>
            <TouchableOpacity
              style={styles.quickPracticeCard}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="5 minute warm-up"
              accessibilityHint="Start a quick 3-question practice session">
              <Icon name="lightning-bolt" size={24} color={colors.secondary} />
              <Text style={styles.quickPracticeTitle}>5 Min Warm-up</Text>
              <Text style={styles.quickPracticeDesc}>3 quick questions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickPracticeCard}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Introduction Practice"
              accessibilityHint="Practice your self-introduction response">
              <Icon name="account-voice" size={24} color={colors.primary} />
              <Text style={styles.quickPracticeTitle}>Intro Practice</Text>
              <Text style={styles.quickPracticeDesc}>Tell me about yourself</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickPracticeCard}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Weakness Question Practice"
              accessibilityHint="Learn to handle tricky weakness questions">
              <Icon name="shield-alert" size={24} color={colors.primaryLight} />
              <Text style={styles.quickPracticeTitle}>Weakness Q</Text>
              <Text style={styles.quickPracticeDesc}>Handle tricky questions</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Interview History */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interview History</Text>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="See all interviews"
              accessibilityHint="View your complete interview history">
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockInterviewHistory}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <InterviewItem
                interview={item}
                onViewDetails={() => handleViewDetails(item.id)}
              />
            )}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
  header: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  startButtonContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },
  startButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  quickPracticeSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickPracticeScroll: {
    gap: spacing.sm,
  },
  quickPracticeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    width: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickPracticeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  quickPracticeDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  interviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  interviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  interviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interviewInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  interviewType: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  interviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  metaIcon: {
    marginRight: 2,
  },
  interviewDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  metaDot: {
    fontSize: 11,
    color: colors.textSecondary,
    marginHorizontal: spacing.xs,
  },
  interviewRight: {
    alignItems: 'flex-end',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: spacing.xs,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default InterviewHubScreen;
