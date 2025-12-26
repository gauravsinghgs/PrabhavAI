import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {InterviewStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<InterviewStackParamList, 'QuestionDisplay'>;

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

// Mock questions based on interview type
const mockQuestions: Record<string, string[]> = {
  hr: [
    'Tell me about yourself and your background.',
    'What are your greatest strengths and weaknesses?',
    'Where do you see yourself in 5 years?',
    'Why do you want to work for our company?',
    'Describe a challenging situation and how you handled it.',
    'What motivates you in your work?',
    'How do you handle stress and pressure?',
    'Why should we hire you?',
  ],
  technical: [
    'Explain the concept of object-oriented programming.',
    'What is the difference between stack and queue data structures?',
    'How would you optimize a slow database query?',
    'Describe RESTful API design principles.',
    'What is your approach to debugging complex issues?',
    'Explain the concept of version control and Git workflows.',
  ],
  behavioral: [
    'Tell me about a time you demonstrated leadership.',
    'Describe a situation where you had to work with a difficult team member.',
    'Give an example of when you had to meet a tight deadline.',
    'Tell me about a time you failed and what you learned from it.',
    'Describe a situation where you had to adapt to change quickly.',
  ],
};

const difficultyTimers: Record<string, number> = {
  easy: 120, // 2 minutes
  medium: 90, // 1.5 minutes
  hard: 60, // 1 minute
};

export const QuestionDisplayScreen: React.FC<Props> = ({navigation, route}) => {
  const {type, company, difficulty, totalQuestions, questionIndex} = route.params;
  const [timeRemaining, setTimeRemaining] = useState(difficultyTimers[difficulty]);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Animation values
  const questionOpacity = useRef(new Animated.Value(0)).current;
  const questionTranslateY = useRef(new Animated.Value(20)).current;
  const timerScale = useRef(new Animated.Value(1)).current;

  const questions = mockQuestions[type] || mockQuestions.hr;
  const currentQuestion = questions[questionIndex % questions.length];

  // Animate question entrance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(questionOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(questionTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [questionOpacity, questionTranslateY]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeRemaining]);

  // Pulse animation when time is low
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0) {
      Animated.sequence([
        Animated.timing(timerScale, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(timerScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [timeRemaining, timerScale]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timeRemaining <= 10) return colors.error;
    if (timeRemaining <= 30) return colors.warning;
    return colors.primary;
  };

  const handleStartRecording = useCallback(() => {
    navigation.navigate('RecordingActive', {
      type,
      company,
      difficulty,
      totalQuestions,
      questionIndex,
      question: currentQuestion,
    });
  }, [navigation, type, company, difficulty, totalQuestions, questionIndex, currentQuestion]);

  const handleSkip = useCallback(() => {
    if (questionIndex < totalQuestions - 1) {
      // Go to next question
      navigation.replace('QuestionDisplay', {
        type,
        company,
        difficulty,
        totalQuestions,
        questionIndex: questionIndex + 1,
      });
    } else {
      // Last question, go to processing
      navigation.navigate('Processing', {
        type,
        company,
        difficulty,
        totalQuestions,
      });
    }
  }, [navigation, type, company, difficulty, totalQuestions, questionIndex]);

  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressInfo}>
          <Text style={styles.questionNumber}>
            Question {questionIndex + 1} of {totalQuestions}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, {width: `${progressPercentage}%`}]}
            />
          </View>
        </View>
        <Animated.View
          style={[
            styles.timerBadge,
            {
              backgroundColor: `${getTimerColor()}15`,
              transform: [{scale: timerScale}],
            },
          ]}>
          <Icon name="clock-outline" size={18} color={getTimerColor()} />
          <Text style={[styles.timerText, {color: getTimerColor()}]}>
            {formatTime(timeRemaining)}
          </Text>
        </Animated.View>
      </View>

      {/* Question Display */}
      <View style={styles.questionContainer}>
        <Animated.View
          style={[
            styles.questionCard,
            {
              opacity: questionOpacity,
              transform: [{translateY: questionTranslateY}],
            },
          ]}>
          <View style={styles.questionIconContainer}>
            <Icon name="help-circle" size={32} color={colors.primary} />
          </View>
          <Text style={styles.questionText}>{currentQuestion}</Text>
          <View style={styles.questionMeta}>
            <Icon name="information-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.questionHint}>
              Take a moment to think before recording
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          mode="contained"
          onPress={handleStartRecording}
          style={styles.recordButton}
          contentStyle={styles.recordButtonContent}
          labelStyle={styles.recordButtonLabel}
          icon={({color}) => (
            <Icon name="microphone" size={24} color={color} />
          )}
          accessibilityRole="button"
          accessibilityLabel="Start Recording your answer">
          Start Recording
        </Button>

        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipLink}
          accessibilityRole="button"
          accessibilityLabel="Skip this question">
          <Text style={styles.skipText}>Skip Question</Text>
          <Icon name="chevron-right" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  progressInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: spacing.lg,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  questionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  bottomActions: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  recordButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
  },
  recordButtonContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },
  recordButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  skipLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  skipText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});

export default QuestionDisplayScreen;
