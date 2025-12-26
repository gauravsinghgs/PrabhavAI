import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {InterviewStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<InterviewStackParamList, 'Processing'>;

const {width} = Dimensions.get('window');

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

const PROCESSING_DURATION = 8000; // 8 seconds for demo (instead of 30)

const tips = [
  {
    icon: 'lightbulb-on',
    title: 'Did you know?',
    text: 'Using the STAR method can improve your answer structure by up to 40%.',
  },
  {
    icon: 'trending-up',
    title: 'Pro Tip',
    text: 'Maintaining eye contact shows confidence and helps build rapport with interviewers.',
  },
  {
    icon: 'clock-check',
    title: 'Timing Matters',
    text: 'The ideal answer length is 1-2 minutes for most interview questions.',
  },
  {
    icon: 'emoticon-happy',
    title: 'Stay Positive',
    text: 'Even when discussing challenges, focus on what you learned and how you grew.',
  },
  {
    icon: 'microphone',
    title: 'Voice Clarity',
    text: 'Speaking at a moderate pace helps interviewers follow your thoughts better.',
  },
];

const processingStages = [
  'Analyzing your responses...',
  'Evaluating communication skills...',
  'Assessing content quality...',
  'Measuring confidence levels...',
  'Generating personalized feedback...',
];

// AI Mascot Component with animation
const AIMascot: React.FC<{isAnimating: boolean}> = ({isAnimating}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      // Bounce animation
      const bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );

      // Pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );

      // Rotate animation for the brain icon
      const rotate = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );

      bounce.start();
      pulse.start();
      rotate.start();

      return () => {
        bounce.stop();
        pulse.stop();
        rotate.stop();
      };
    }
    return undefined;
  }, [isAnimating, bounceAnim, pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.mascotContainer,
        {
          transform: [{translateY: bounceAnim}, {scale: pulseAnim}],
        },
      ]}>
      <View style={styles.mascotOuter}>
        <View style={styles.mascotInner}>
          <Animated.View style={{transform: [{rotate: spin}]}}>
            <Icon name="brain" size={48} color={colors.primary} />
          </Animated.View>
        </View>
      </View>
      {/* Orbiting dots */}
      <View style={styles.orbitContainer}>
        {[0, 1, 2].map(i => (
          <Animated.View
            key={i}
            style={[
              styles.orbitDot,
              {
                transform: [
                  {
                    rotate: `${i * 120}deg`,
                  },
                  {translateX: 50},
                ],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

export const ProcessingScreen: React.FC<Props> = ({navigation, route}) => {
  const {type, company, difficulty, totalQuestions} = route.params;
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const tipOpacity = useRef(new Animated.Value(1)).current;

  // Progress animation
  useEffect(() => {
    const animation = Animated.timing(progressAnim, {
      toValue: 100,
      duration: PROCESSING_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    animation.start();

    // Update progress state for display
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, PROCESSING_DURATION / 100);

    return () => {
      animation.stop();
      clearInterval(progressInterval);
    };
  }, [progressAnim]);

  // Stage updates
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage(prev => (prev + 1) % processingStages.length);
    }, PROCESSING_DURATION / processingStages.length);

    return () => clearInterval(stageInterval);
  }, []);

  // Tip carousel
  useEffect(() => {
    const tipInterval = setInterval(() => {
      // Fade out
      Animated.timing(tipOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentTip(prev => (prev + 1) % tips.length);
        // Fade in
        Animated.timing(tipOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(tipInterval);
  }, [tipOpacity]);

  // Navigate to feedback when complete
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        navigation.replace('Feedback', {
          interviewId: `interview_${Date.now()}`,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [progress, navigation]);

  const currentTipData = tips[currentTip];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* AI Mascot */}
        <AIMascot isAnimating={progress < 100} />

        {/* Processing Text */}
        <View style={styles.textSection}>
          <Text style={styles.processingTitle}>
            {progress >= 100 ? 'Analysis Complete!' : processingStages[currentStage]}
          </Text>
          <Text style={styles.processingSubtitle}>
            {progress >= 100
              ? 'Preparing your feedback...'
              : `Reviewing ${totalQuestions} responses from your ${company} interview`}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        {/* Tips Carousel */}
        <Animated.View style={[styles.tipCard, {opacity: tipOpacity}]}>
          <View style={styles.tipIconContainer}>
            <Icon name={currentTipData.icon} size={24} color={colors.secondary} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>{currentTipData.title}</Text>
            <Text style={styles.tipText}>{currentTipData.text}</Text>
          </View>
        </Animated.View>

        {/* Tip indicators */}
        <View style={styles.tipIndicators}>
          {tips.map((_, index) => (
            <View
              key={index}
              style={[
                styles.tipDot,
                currentTip === index && styles.tipDotActive,
              ]}
            />
          ))}
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  mascotContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  mascotOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orbitContainer: {
    position: 'absolute',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  processingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  processingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressSection: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.secondary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tipIndicators: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  tipDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
});

export default ProcessingScreen;
