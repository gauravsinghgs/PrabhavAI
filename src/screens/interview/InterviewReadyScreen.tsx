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

type Props = NativeStackScreenProps<InterviewStackParamList, 'InterviewReady'>;

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

const tips = [
  {icon: 'microphone', text: 'Speak clearly and at a moderate pace'},
  {icon: 'star-four-points', text: 'Use the STAR method for behavioral questions'},
  {icon: 'clock-outline', text: 'Take your time to think before answering'},
  {icon: 'eye', text: 'Maintain eye contact with the camera'},
  {icon: 'emoticon-happy-outline', text: 'Stay calm and confident'},
];

export const InterviewReadyScreen: React.FC<Props> = ({navigation, route}) => {
  const {type, company, difficulty, totalQuestions} = route.params;
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Animation values
  const countdownScale = useRef(new Animated.Value(1)).current;
  const countdownOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const animateCountdown = useCallback(() => {
    // Reset values
    countdownScale.setValue(0.5);
    countdownOpacity.setValue(0);

    // Animate in and pulse
    Animated.parallel([
      Animated.timing(countdownScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(countdownOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [countdownScale, countdownOpacity]);

  useEffect(() => {
    if (isCountingDown) {
      animateCountdown();

      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Navigate to first question
        setTimeout(() => {
          navigation.replace('QuestionDisplay', {
            type,
            company,
            difficulty,
            totalQuestions,
            questionIndex: 0,
          });
        }, 500);
      }
    }
    return undefined;
  }, [isCountingDown, countdown, navigation, type, company, difficulty, totalQuestions, animateCountdown]);

  const handleReady = useCallback(() => {
    // Fade out content
    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsCountingDown(true);
    });
  }, [contentOpacity]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getInterviewTypeLabel = () => {
    switch (type) {
      case 'hr':
        return 'HR Interview';
      case 'technical':
        return 'Technical Interview';
      case 'behavioral':
        return 'Behavioral Interview';
      default:
        return 'Interview';
    }
  };

  if (isCountingDown) {
    return (
      <SafeAreaView style={styles.countdownContainer}>
        <Animated.View
          style={[
            styles.countdownContent,
            {
              transform: [{scale: countdownScale}],
              opacity: countdownOpacity,
            },
          ]}>
          {countdown > 0 ? (
            <>
              <Text style={styles.countdownNumber}>{countdown}</Text>
              <Text style={styles.countdownLabel}>Get Ready...</Text>
            </>
          ) : (
            <>
              <Icon name="microphone" size={80} color={colors.success} />
              <Text style={styles.goText}>GO!</Text>
            </>
          )}
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.content, {opacity: contentOpacity}]}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <View style={styles.iconContainer}>
            <Icon name="microphone-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Ready to Begin?</Text>
          <Text style={styles.subtitle}>
            {getInterviewTypeLabel()} • {company}
          </Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Icon name="help-circle-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{totalQuestions} Questions</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Icon name="speedometer" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <View style={styles.tipsList}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipIconContainer}>
                  <Icon name={tip.icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Button
            mode="contained"
            onPress={handleReady}
            style={styles.readyButton}
            contentStyle={styles.readyButtonContent}
            labelStyle={styles.readyButtonLabel}
            icon={({color}) => (
              <Icon name="play" size={24} color={color} />
            )}
            accessibilityRole="button"
            accessibilityLabel="I'm Ready to start the interview">
            I'm Ready
          </Button>

          <TouchableOpacity
            onPress={handleCancel}
            style={styles.cancelLink}
            accessibilityRole="button"
            accessibilityLabel="Cancel and go back">
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  countdownContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContent: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: '700',
    color: colors.surface,
  },
  countdownLabel: {
    fontSize: 24,
    color: colors.surface,
    opacity: 0.8,
    marginTop: spacing.md,
  },
  goText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.success,
    marginTop: spacing.md,
  },
  headerInfo: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  tipsSection: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bottomActions: {
    paddingVertical: spacing.lg,
  },
  readyButton: {
    backgroundColor: colors.success,
    borderRadius: 12,
  },
  readyButtonContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },
  readyButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  cancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default InterviewReadyScreen;
