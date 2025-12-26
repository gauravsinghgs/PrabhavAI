import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import {Text, Button, Card} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {OnboardingStackParamList} from '@app-types/navigation';
import {StepIndicator} from '@components/onboarding';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingComplete'>;

const colors = {
  primary: '#1a237e',
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

// Mock data - in real app this would come from context/state
const onboardingSummary = {
  name: 'Rahul',
  education: 'IIT Delhi - Computer Science',
  targetRoles: ['Software Engineer', 'Full Stack Developer'],
  targetCompanies: ['Google', 'Microsoft', 'Amazon'],
  language: 'Hinglish (Mixed)',
};

export const OnboardingCompleteScreen: React.FC<Props> = ({navigation}) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Success animation sequence
    Animated.sequence([
      // First: Scale up the success icon
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Then: Fade in and slide up the content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, fadeAnim, slideAnim]);

  const handleStartLearning = () => {
    // Navigate to main app
    // In real app: navigation.reset({index: 0, routes: [{name: 'Main'}]});
    console.log('Start learning - navigate to main app');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepIndicator currentStep={5} totalSteps={5} />

      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View
          style={[
            styles.successContainer,
            {transform: [{scale: scaleAnim}]},
          ]}>
          <View style={styles.successCircle}>
            <Icon name="check" size={48} color={colors.surface} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            Welcome to Prabhav AI, {onboardingSummary.name}!
          </Text>
        </Animated.View>

        {/* Summary Card */}
        <Animated.View
          style={[
            styles.summaryContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.summaryTitle}>Your Profile Summary</Text>

              <View style={styles.summaryItem}>
                <Icon
                  name="school"
                  size={20}
                  color={colors.primary}
                  style={styles.summaryIcon}
                />
                <View style={styles.summaryText}>
                  <Text style={styles.summaryLabel}>Education</Text>
                  <Text style={styles.summaryValue}>
                    {onboardingSummary.education}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Icon
                  name="target"
                  size={20}
                  color={colors.primary}
                  style={styles.summaryIcon}
                />
                <View style={styles.summaryText}>
                  <Text style={styles.summaryLabel}>Target Roles</Text>
                  <Text style={styles.summaryValue}>
                    {onboardingSummary.targetRoles.join(', ')}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Icon
                  name="office-building"
                  size={20}
                  color={colors.primary}
                  style={styles.summaryIcon}
                />
                <View style={styles.summaryText}>
                  <Text style={styles.summaryLabel}>Target Companies</Text>
                  <Text style={styles.summaryValue}>
                    {onboardingSummary.targetCompanies.join(', ')}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Icon
                  name="translate"
                  size={20}
                  color={colors.primary}
                  style={styles.summaryIcon}
                />
                <View style={styles.summaryText}>
                  <Text style={styles.summaryLabel}>Practice Language</Text>
                  <Text style={styles.summaryValue}>
                    {onboardingSummary.language}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Features Preview */}
        <Animated.View
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name="microphone" size={20} color={colors.surface} />
            </View>
            <Text style={styles.featureText}>Mock Interviews</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name="book-open-variant" size={20} color={colors.surface} />
            </View>
            <Text style={styles.featureText}>Learning Modules</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name="chart-line" size={20} color={colors.surface} />
            </View>
            <Text style={styles.featureText}>Track Progress</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handleStartLearning}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          labelStyle={styles.startButtonLabel}
          accessibilityRole="button"
          accessibilityLabel="Start learning">
          Start Learning
        </Button>
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
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  successContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  summaryContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.surface,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  summaryIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  startButtonContent: {
    height: 52,
  },
  startButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingCompleteScreen;
