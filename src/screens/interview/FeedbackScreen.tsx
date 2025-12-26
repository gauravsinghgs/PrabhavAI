import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {Text, Button, Card} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {Circle} from 'react-native-svg';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {InterviewStackParamList} from '@app-types/navigation';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<InterviewStackParamList, 'Feedback'>;

const colors = {
  primary: '#1a237e',
  primaryLight: '#534bae',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#388e3c',
  warning: '#ffa000',
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

// Mock feedback data
const mockFeedback = {
  overallScore: 72,
  interviewType: 'HR Interview',
  company: 'Google',
  date: 'December 24, 2024',
  duration: '18 minutes',
  questionsAnswered: 5,
  breakdown: [
    {category: 'Communication', score: 78, icon: 'message-text', color: colors.success},
    {category: 'Content', score: 68, icon: 'file-document', color: colors.warning},
    {category: 'Confidence', score: 82, icon: 'shield-check', color: colors.success},
    {category: 'Body Language', score: 55, icon: 'human', color: colors.error},
  ],
  whatWentWell: [
    'Clear and articulate speech throughout the interview',
    'Good use of specific examples from past experience',
    'Demonstrated enthusiasm for the role',
    'Structured answers using the STAR method',
  ],
  areasToImprove: [
    'Maintain more consistent eye contact with the camera',
    'Reduce filler words like "um" and "you know"',
    'Provide more quantifiable results in your examples',
    'Practice more concise responses (aim for 1-2 minutes)',
  ],
  questionFeedback: [
    {
      id: '1',
      question: 'Tell me about yourself and your background.',
      score: 75,
      duration: '2:15',
      feedback: 'Good overview of your background. You provided relevant details about your education and experience. Consider adding more about your key achievements and why you\'re excited about this role specifically.',
      suggestedAnswer: 'I\'m a software engineer with 3 years of experience specializing in React Native development. At my current role at TechCorp, I led the mobile app redesign that increased user engagement by 40%. I\'m passionate about creating intuitive user experiences, which is why I\'m excited about this opportunity at Google.',
      strengths: ['Clear structure', 'Relevant experience highlighted'],
      improvements: ['Add specific metrics', 'Connect to the role'],
    },
    {
      id: '2',
      question: 'What are your greatest strengths and weaknesses?',
      score: 68,
      duration: '1:45',
      feedback: 'You handled the strengths well with good examples. For weaknesses, try to show more self-awareness and concrete steps you\'re taking to improve.',
      suggestedAnswer: 'My greatest strength is problem-solving - I enjoy breaking down complex challenges into manageable parts. For example, I resolved a critical performance issue that reduced app load time by 60%. My weakness is sometimes being too detail-oriented, which I\'m addressing by setting time limits for tasks and focusing on MVP deliverables first.',
      strengths: ['Honest self-assessment', 'Good strength example'],
      improvements: ['More specific weakness example', 'Show growth mindset'],
    },
    {
      id: '3',
      question: 'Where do you see yourself in 5 years?',
      score: 72,
      duration: '1:30',
      feedback: 'Good ambition shown. Try to align your goals more specifically with the company\'s growth trajectory and the role you\'re applying for.',
      suggestedAnswer: 'In 5 years, I see myself as a senior engineer leading a team focused on mobile innovation. I want to mentor junior developers and contribute to products that impact millions of users. Google\'s commitment to pushing boundaries aligns perfectly with my goal to work on cutting-edge technology.',
      strengths: ['Shows ambition', 'Mentions leadership'],
      improvements: ['More company-specific alignment', 'Add intermediate milestones'],
    },
    {
      id: '4',
      question: 'Why do you want to work for our company?',
      score: 80,
      duration: '1:50',
      feedback: 'Excellent research on the company! You showed genuine interest and connected your values with the company mission effectively.',
      suggestedAnswer: 'I\'ve admired Google\'s engineering culture and commitment to solving complex problems at scale. The opportunity to work on products used by billions while being surrounded by talented engineers is incredibly motivating. Your focus on innovation and 20% time for personal projects aligns with my passion for continuous learning.',
      strengths: ['Company research evident', 'Personal values aligned'],
      improvements: ['Mention specific product interest', 'Add unique contribution'],
    },
    {
      id: '5',
      question: 'Describe a challenging situation and how you handled it.',
      score: 65,
      duration: '2:30',
      feedback: 'Good situation described. Use the STAR method more consistently - you could elaborate more on the specific actions you took and quantify the results.',
      suggestedAnswer: 'Situation: Our app faced a 40% crash rate after a major update. Task: As the lead developer, I needed to resolve this within 48 hours. Action: I set up crash analytics, identified the root cause (memory leak), and implemented a fix while coordinating with QA for rapid testing. Result: Crash rate dropped to under 1%, and we retained 95% of affected users.',
      strengths: ['Real challenge described', 'Shows problem-solving'],
      improvements: ['Clearer STAR structure', 'Quantify the impact more'],
    },
  ],
};

// Score Circle Component
interface ScoreCircleProps {
  score: number;
  size: number;
  strokeWidth: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({score, size, strokeWidth}) => {
  const animatedScore = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = score / 100;

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = animatedScore.addListener(({value}) => {
      setDisplayScore(Math.round(value));
    });

    return () => animatedScore.removeListener(listener);
  }, [score, animatedScore]);

  const getScoreColor = () => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <View style={[styles.scoreCircleContainer, {width: size, height: size}]}>
      <Svg width={size} height={size}>
        <Circle
          stroke={colors.divider}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={getScoreColor()}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress * circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.scoreCircleContent}>
        <Text style={[styles.scoreNumber, {color: getScoreColor()}]}>
          {displayScore}
        </Text>
        <Text style={styles.scoreMax}>/100</Text>
      </View>
    </View>
  );
};

// Expandable Question Card Component
interface QuestionCardProps {
  question: typeof mockFeedback.questionFeedback[0];
  index: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({question, index}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);

    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <Card style={styles.questionCard}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={styles.questionHeader}
        accessibilityRole="button"
        accessibilityLabel={`Question ${index + 1}: ${question.question}`}>
        <View style={styles.questionHeaderLeft}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>Q{index + 1}</Text>
          </View>
          <View style={styles.questionInfo}>
            <Text style={styles.questionText} numberOfLines={isExpanded ? undefined : 2}>
              {question.question}
            </Text>
            <View style={styles.questionMeta}>
              <Icon name="clock-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.questionMetaText}>{question.duration}</Text>
            </View>
          </View>
        </View>
        <View style={styles.questionHeaderRight}>
          <View
            style={[
              styles.questionScoreBadge,
              {backgroundColor: `${getScoreColor(question.score)}15`},
            ]}>
            <Text style={[styles.questionScore, {color: getScoreColor(question.score)}]}>
              {question.score}
            </Text>
          </View>
          <Animated.View style={{transform: [{rotate: rotation}]}}>
            <Icon name="chevron-down" size={24} color={colors.textSecondary} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.questionExpanded}>
          {/* Audio Playback Placeholder */}
          <TouchableOpacity
            style={styles.audioPlayer}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Play recording for question ${question.id}`}
            accessibilityHint="Plays back your recorded answer">
            <View style={styles.audioPlayButton}>
              <Icon name="play" size={20} color={colors.surface} />
            </View>
            <View
              style={styles.audioWaveform}
              accessibilityLabel={`Audio waveform, duration ${question.duration}`}>
              {Array.from({length: 20}, (_, i) => (
                <View
                  key={`waveform-bar-${i}`}
                  style={[
                    styles.audioBar,
                    {height: 8 + Math.random() * 16},
                  ]}
                />
              ))}
            </View>
            <Text style={styles.audioDuration}>{question.duration}</Text>
          </TouchableOpacity>

          {/* Feedback Text */}
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackLabel}>Feedback</Text>
            <Text style={styles.feedbackText}>{question.feedback}</Text>
          </View>

          {/* Strengths */}
          <View style={styles.strengthsSection}>
            <Text style={styles.feedbackLabel}>What went well</Text>
            {question.strengths.map((strength, i) => (
              <View key={`strength-${question.id}-${i}`} style={styles.strengthItem}>
                <Icon name="check-circle" size={16} color={colors.success} />
                <Text style={styles.strengthText}>{strength}</Text>
              </View>
            ))}
          </View>

          {/* Improvements */}
          <View style={styles.improvementsSection}>
            <Text style={styles.feedbackLabel}>To improve</Text>
            {question.improvements.map((improvement, i) => (
              <View key={`improvement-${question.id}-${i}`} style={styles.improvementItem}>
                <Icon name="arrow-up-circle" size={16} color={colors.warning} />
                <Text style={styles.improvementText}>{improvement}</Text>
              </View>
            ))}
          </View>

          {/* Suggested Answer */}
          <View style={styles.suggestedSection}>
            <View style={styles.suggestedHeader}>
              <Icon name="lightbulb-on" size={18} color={colors.secondary} />
              <Text style={styles.suggestedLabel}>Suggested Answer</Text>
            </View>
            <Text style={styles.suggestedText}>{question.suggestedAnswer}</Text>
          </View>
        </View>
      )}
    </Card>
  );
};

export const FeedbackScreen: React.FC<Props> = ({navigation}) => {
  const handlePracticeAgain = () => {
    navigation.navigate('InterviewSetup');
  };

  const handleViewAllFeedback = () => {
    // TODO: Navigate to detailed feedback view
    console.log('View all feedback');
  };

  const handleBackToDashboard = () => {
    navigation.navigate('InterviewHub');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Interview Complete!</Text>
          <Text style={styles.headerSubtitle}>
            {mockFeedback.interviewType} • {mockFeedback.company}
          </Text>
          <Text style={styles.headerMeta}>
            {mockFeedback.date} • {mockFeedback.duration}
          </Text>
        </View>

        {/* Overall Score */}
        <Card style={styles.scoreCard}>
          <Card.Content style={styles.scoreCardContent}>
            <ScoreCircle score={mockFeedback.overallScore} size={140} strokeWidth={12} />
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>Overall Score</Text>
              <Text style={styles.scoreDescription}>
                {mockFeedback.overallScore >= 80
                  ? 'Excellent performance!'
                  : mockFeedback.overallScore >= 60
                  ? 'Good job! Room for improvement.'
                  : 'Keep practicing to improve.'}
              </Text>
              <View style={styles.scoreMeta}>
                <Icon name="help-circle-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.scoreMetaText}>
                  {mockFeedback.questionsAnswered} questions answered
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Score Breakdown */}
        <Text style={styles.sectionTitle}>Score Breakdown</Text>
        <View style={styles.breakdownGrid}>
          {mockFeedback.breakdown.map((item, index) => (
            <Card key={index} style={styles.breakdownCard}>
              <Card.Content style={styles.breakdownContent}>
                <View
                  style={[
                    styles.breakdownIcon,
                    {backgroundColor: `${item.color}15`},
                  ]}>
                  <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.breakdownScore, {color: item.color}]}>
                  {item.score}
                </Text>
                <Text style={styles.breakdownCategory}>{item.category}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* What Went Well */}
        <Text style={styles.sectionTitle}>What Went Well</Text>
        <Card style={styles.feedbackCard}>
          <Card.Content>
            {mockFeedback.whatWentWell.map((item, index) => (
              <View key={index} style={styles.feedbackItem}>
                <View style={styles.feedbackIconGreen}>
                  <Icon name="check" size={14} color={colors.surface} />
                </View>
                <Text style={styles.feedbackItemText}>{item}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Areas to Improve */}
        <Text style={styles.sectionTitle}>Areas to Improve</Text>
        <Card style={styles.feedbackCard}>
          <Card.Content>
            {mockFeedback.areasToImprove.map((item, index) => (
              <View key={index} style={styles.feedbackItem}>
                <View style={styles.feedbackIconYellow}>
                  <Icon name="arrow-up" size={14} color={colors.surface} />
                </View>
                <Text style={styles.feedbackItemText}>{item}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Per-Question Feedback */}
        <Text style={styles.sectionTitle}>Question-by-Question</Text>
        {mockFeedback.questionFeedback.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handlePracticeAgain}
            style={styles.practiceButton}
            contentStyle={styles.practiceButtonContent}
            labelStyle={styles.practiceButtonLabel}
            icon={({color}) => <Icon name="refresh" size={20} color={color} />}
            accessibilityRole="button"
            accessibilityLabel="Practice Again">
            Practice Again
          </Button>

          <Button
            mode="outlined"
            onPress={handleViewAllFeedback}
            style={styles.viewAllButton}
            contentStyle={styles.viewAllButtonContent}
            labelStyle={styles.viewAllButtonLabel}
            icon={({color}) => <Icon name="file-document" size={20} color={color} />}
            accessibilityRole="button"
            accessibilityLabel="View All Feedback">
            View All Feedback
          </Button>

          <TouchableOpacity
            onPress={handleBackToDashboard}
            style={styles.dashboardLink}
            accessibilityRole="button"
            accessibilityLabel="Back to Dashboard">
            <Text style={styles.dashboardLinkText}>Back to Dashboard</Text>
          </TouchableOpacity>
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  headerMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  scoreCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  scoreCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircleContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '700',
  },
  scoreMax: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scoreInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  scoreDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scoreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  scoreMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  breakdownCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  breakdownContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  breakdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  breakdownScore: {
    fontSize: 28,
    fontWeight: '700',
  },
  breakdownCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  feedbackIconGreen: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  feedbackIconYellow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  feedbackItemText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  questionHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  questionNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.surface,
  },
  questionInfo: {
    flex: 1,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  questionMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  questionHeaderRight: {
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  questionScoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  questionScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  questionExpanded: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  audioPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: spacing.md,
    height: 32,
  },
  audioBar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
    opacity: 0.5,
  },
  audioDuration: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  feedbackSection: {
    marginBottom: spacing.md,
  },
  feedbackLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  feedbackText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  strengthsSection: {
    marginBottom: spacing.md,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  strengthText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  improvementsSection: {
    marginBottom: spacing.md,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  improvementText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  suggestedSection: {
    backgroundColor: `${colors.secondary}10`,
    borderRadius: 12,
    padding: spacing.md,
  },
  suggestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  suggestedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: spacing.sm,
  },
  suggestedText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionButtons: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  practiceButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  practiceButtonContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },
  practiceButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  viewAllButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 12,
  },
  viewAllButtonContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },
  viewAllButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  dashboardLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  dashboardLinkText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});

export default FeedbackScreen;
