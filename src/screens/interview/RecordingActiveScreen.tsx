import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {InterviewStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<InterviewStackParamList, 'RecordingActive'>;

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

const MAX_RECORDING_TIME = 180; // 3 minutes
const NUM_BARS = 40;

// Animated Waveform Bar Component
interface WaveformBarProps {
  index: number;
  isRecording: boolean;
  isPaused: boolean;
}

const WaveformBar: React.FC<WaveformBarProps> = ({index, isRecording, isPaused}) => {
  const heightAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isRecording || isPaused) {
      // Reset to idle state
      Animated.timing(heightAnim, {
        toValue: 0.15,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return undefined;
    }

    // Create random animation for each bar
    const animateBar = () => {
      const randomHeight = 0.2 + Math.random() * 0.8;
      const randomDuration = 100 + Math.random() * 200;

      Animated.sequence([
        Animated.timing(heightAnim, {
          toValue: randomHeight,
          duration: randomDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(heightAnim, {
          toValue: 0.2 + Math.random() * 0.3,
          duration: randomDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (isRecording && !isPaused) {
          animateBar();
        }
      });
    };

    // Stagger the start of each bar's animation
    const delay = setTimeout(() => {
      animateBar();
    }, index * 20);

    return () => clearTimeout(delay);
  }, [isRecording, isPaused, index, heightAnim]);

  return (
    <Animated.View
      style={[
        styles.waveformBar,
        {
          height: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
          backgroundColor: isRecording && !isPaused ? colors.error : colors.divider,
        },
      ]}
    />
  );
};

export const RecordingActiveScreen: React.FC<Props> = ({navigation, route}) => {
  const {type, company, difficulty, totalQuestions, questionIndex, question} = route.params;
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Animation values
  const recordingPulse = useRef(new Animated.Value(1)).current;
  const questionOpacity = useRef(new Animated.Value(1)).current;

  // Recording timer
  useEffect(() => {
    if (!isRecording || isPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= MAX_RECORDING_TIME) {
          setIsRecording(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, isPaused]);

  // Pulse animation for recording indicator
  useEffect(() => {
    if (isRecording && !isPaused) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(recordingPulse, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(recordingPulse, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
    return undefined;
  }, [isRecording, isPaused, recordingPulse]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    const remaining = MAX_RECORDING_TIME - recordingTime;
    if (remaining <= 30) return colors.error;
    if (remaining <= 60) return colors.warning;
    return colors.textPrimary;
  };

  const handlePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const handleStopAndSubmit = useCallback(() => {
    setIsRecording(false);

    // Check if there are more questions
    if (questionIndex < totalQuestions - 1) {
      // Navigate to next question
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

  const handleRetake = useCallback(() => {
    setRecordingTime(0);
    setIsRecording(true);
    setIsPaused(false);
  }, []);

  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;
  const timePercentage = (recordingTime / MAX_RECORDING_TIME) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with Question */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.questionNumber}>
            Question {questionIndex + 1} of {totalQuestions}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, {width: `${progressPercentage}%`}]}
            />
          </View>
        </View>
        <Animated.View style={{opacity: questionOpacity}}>
          <Text style={styles.questionText} numberOfLines={3}>
            {question}
          </Text>
        </Animated.View>
      </View>

      {/* Recording Status */}
      <View style={styles.recordingStatus}>
        <Animated.View
          style={[
            styles.recordingIndicator,
            {
              transform: [{scale: recordingPulse}],
              backgroundColor: isPaused ? colors.warning : colors.error,
            },
          ]}>
          <Icon
            name={isPaused ? 'pause' : 'record-circle'}
            size={24}
            color={colors.surface}
          />
        </Animated.View>
        <Text style={styles.recordingLabel}>
          {isPaused ? 'Paused' : 'Recording...'}
        </Text>
      </View>

      {/* Waveform Visualization */}
      <View style={styles.waveformContainer}>
        <View style={styles.waveformWrapper}>
          {Array.from({length: NUM_BARS}, (_, i) => (
            <WaveformBar
              key={i}
              index={i}
              isRecording={isRecording}
              isPaused={isPaused}
            />
          ))}
        </View>
      </View>

      {/* Timer */}
      <View style={styles.timerSection}>
        <Text style={[styles.timerText, {color: getTimeColor()}]}>
          {formatTime(recordingTime)}
        </Text>
        <Text style={styles.timerMax}>/ {formatTime(MAX_RECORDING_TIME)}</Text>
        <View style={styles.timerProgressContainer}>
          <View
            style={[
              styles.timerProgress,
              {
                width: `${Math.min(timePercentage, 100)}%`,
                backgroundColor: getTimeColor(),
              },
            ]}
          />
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.mainControls}>
          <TouchableOpacity
            onPress={handlePause}
            style={[
              styles.pauseButton,
              isPaused && styles.pauseButtonActive,
            ]}
            accessibilityRole="button"
            accessibilityLabel={isPaused ? 'Resume recording' : 'Pause recording'}>
            <Icon
              name={isPaused ? 'play' : 'pause'}
              size={32}
              color={isPaused ? colors.surface : colors.primary}
            />
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleStopAndSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            labelStyle={styles.submitButtonLabel}
            icon={({color}) => (
              <Icon name="check" size={24} color={color} />
            )}
            accessibilityRole="button"
            accessibilityLabel="Stop recording and submit answer">
            Stop & Submit
          </Button>
        </View>

        <TouchableOpacity
          onPress={handleRetake}
          style={styles.retakeLink}
          accessibilityRole="button"
          accessibilityLabel="Retake this answer">
          <Icon name="refresh" size={18} color={colors.textSecondary} />
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>
      </View>

      {/* Tips Footer */}
      <View style={styles.tipsFooter}>
        <Icon name="lightbulb-on-outline" size={16} color={colors.secondary} />
        <Text style={styles.tipText}>
          Speak naturally and take your time to articulate your thoughts
        </Text>
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
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTop: {
    marginBottom: spacing.sm,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: colors.divider,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  recordingIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  recordingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  waveformContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  waveformWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: '100%',
    gap: 3,
  },
  waveformBar: {
    width: 6,
    borderRadius: 3,
    minHeight: 8,
  },
  timerSection: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
  },
  timerMax: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  timerProgressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    borderRadius: 2,
  },
  controlsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 12,
  },
  submitButtonContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  retakeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  retakeText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  tipsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: `${colors.secondary}10`,
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
});

export default RecordingActiveScreen;
