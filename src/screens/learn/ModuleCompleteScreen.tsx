import React, {useEffect, useRef, useCallback} from 'react';
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
import type {LearnStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<LearnStackParamList, 'ModuleComplete'>;

const colors = {
  primary: '#1a237e',
  primaryLight: '#534bae',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#388e3c',
  gold: '#ffd700',
  divider: '#e0e0e0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Mock module titles
const moduleNames: Record<string, string> = {
  'tell-me-about-yourself': 'Tell Me About Yourself',
  'professional-email-writing': 'Professional Email Writing',
  'first-impressions': 'First Impressions',
  'handshake-greetings': 'Handshake & Greetings',
  'dress-code-basics': 'Dress Code Basics',
};

// Next module suggestions
const nextModuleSuggestions: Record<string, string> = {
  'tell-me-about-yourself': 'professional-email-writing',
  'professional-email-writing': 'first-impressions',
  'first-impressions': 'handshake-greetings',
  'handshake-greetings': 'dress-code-basics',
  'dress-code-basics': 'tell-me-about-yourself',
};

// Confetti particle component
interface ConfettiParticleProps {
  delay: number;
  startX: number;
  color: string;
}

const ConfettiParticle: React.FC<ConfettiParticleProps> = ({delay, startX, color}) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 400,
        duration: 2000 + Math.random() * 1000,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: (Math.random() - 0.5) * 100,
        duration: 2000 + Math.random() * 1000,
        delay,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: Math.random() * 4,
        duration: 2000 + Math.random() * 1000,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000 + Math.random() * 1000,
        delay,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
  }, [translateY, translateX, rotate, opacity, delay]);

  const spin = rotate.interpolate({
    inputRange: [0, 4],
    outputRange: ['0deg', '1440deg'],
  });

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          left: startX,
          backgroundColor: color,
          transform: [{translateY}, {translateX}, {rotate: spin}],
          opacity,
        },
      ]}
    />
  );
};

export const ModuleCompleteScreen: React.FC<Props> = ({navigation, route}) => {
  const {moduleId, xpEarned, badgeEarned} = route.params;

  // Animation values
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const xpScale = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const starRotation = useRef(new Animated.Value(0)).current;

  const moduleName = moduleNames[moduleId] || 'Module';
  const nextModuleId = nextModuleSuggestions[moduleId] || 'tell-me-about-yourself';
  const nextModuleName = moduleNames[nextModuleId] || 'Next Module';

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Celebration icon pops in
      Animated.spring(celebrationScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      // XP badge pops in
      Animated.spring(xpScale, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      // Badge pops in (if earned)
      ...(badgeEarned
        ? [
            Animated.spring(badgeScale, {
              toValue: 1,
              tension: 60,
              friction: 6,
              useNativeDriver: true,
            }),
          ]
        : []),
      // Content fades in
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous star rotation
    const rotateAnimation = Animated.loop(
      Animated.timing(starRotation, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, [celebrationScale, xpScale, badgeScale, contentOpacity, starRotation, badgeEarned]);

  const handleNextModule = useCallback(() => {
    navigation.replace('ModuleDetail', {moduleId: nextModuleId});
  }, [navigation, nextModuleId]);

  const handleBackToModules = useCallback(() => {
    navigation.navigate('ModulesList');
  }, [navigation]);

  const spin = starRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Generate confetti
  const confettiColors = [colors.primary, colors.secondary, colors.success, colors.gold, '#e91e63', '#9c27b0'];
  const confettiParticles = Array.from({length: 30}, (_, i) => ({
    id: i,
    delay: i * 50,
    startX: Math.random() * 300 + 30,
    color: confettiColors[i % confettiColors.length],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Confetti */}
      <View style={styles.confettiContainer}>
        {confettiParticles.map(particle => (
          <ConfettiParticle
            key={particle.id}
            delay={particle.delay}
            startX={particle.startX}
            color={particle.color}
          />
        ))}
      </View>

      <View style={styles.content}>
        {/* Celebration Icon */}
        <Animated.View
          style={[
            styles.celebrationContainer,
            {transform: [{scale: celebrationScale}]},
          ]}>
          <Animated.View style={{transform: [{rotate: spin}]}}>
            <View style={styles.starsContainer}>
              {[0, 1, 2, 3, 4].map(i => (
                <View
                  key={i}
                  style={[
                    styles.starWrapper,
                    {transform: [{rotate: `${i * 72}deg`}]},
                  ]}>
                  <Icon name="star" size={16} color={colors.gold} />
                </View>
              ))}
            </View>
          </Animated.View>
          <View style={styles.trophyContainer}>
            <Icon name="trophy" size={64} color={colors.gold} />
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Module Completed!</Text>
        <Text style={styles.moduleName}>{moduleName}</Text>

        {/* XP Earned */}
        <Animated.View
          style={[
            styles.xpContainer,
            {transform: [{scale: xpScale}]},
          ]}>
          <View style={styles.xpBadge}>
            <Icon name="star-four-points" size={24} color={colors.secondary} />
            <Text style={styles.xpText}>+{xpEarned} XP</Text>
          </View>
          <Text style={styles.xpLabel}>Experience Points Earned</Text>
        </Animated.View>

        {/* Badge Earned */}
        {badgeEarned && (
          <Animated.View
            style={[
              styles.badgeContainer,
              {transform: [{scale: badgeScale}]},
            ]}>
            <View style={styles.badgeCard}>
              <View style={styles.badgeIconContainer}>
                <Icon name="medal" size={32} color={colors.surface} />
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Badge Earned!</Text>
                <Text style={styles.badgeName}>{badgeEarned}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Stats Summary */}
        <Animated.View style={[styles.statsContainer, {opacity: contentOpacity}]}>
          <View style={styles.statItem}>
            <Icon name="check-circle" size={20} color={colors.success} />
            <Text style={styles.statText}>All lessons completed</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="clock-check" size={20} color={colors.primary} />
            <Text style={styles.statText}>Knowledge retained</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="trending-up" size={20} color={colors.secondary} />
            <Text style={styles.statText}>Skills improved</Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionButtons, {opacity: contentOpacity}]}>
          <Button
            mode="contained"
            onPress={handleNextModule}
            style={styles.nextButton}
            contentStyle={styles.nextButtonContent}
            labelStyle={styles.nextButtonLabel}
            icon={({color}) => (
              <Icon name="arrow-right" size={20} color={color} />
            )}
            accessibilityRole="button"
            accessibilityLabel="Next Module">
            Next Module: {nextModuleName}
          </Button>

          <TouchableOpacity
            onPress={handleBackToModules}
            style={styles.backLink}
            accessibilityRole="button"
            accessibilityLabel="Back to Modules">
            <Text style={styles.backLinkText}>Back to Modules</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    overflow: 'hidden',
  },
  confettiParticle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  celebrationContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  starsContainer: {
    position: 'absolute',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starWrapper: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  trophyContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.gold}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  moduleName: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  xpContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.secondary}15`,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 24,
    marginBottom: spacing.sm,
  },
  xpText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: spacing.sm,
  },
  xpLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  badgeContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  actionButtons: {
    width: '100%',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  nextButtonContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },
  nextButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  backLinkText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});

export default ModuleCompleteScreen;
