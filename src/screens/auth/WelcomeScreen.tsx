import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const colors = {
  primary: '#1a237e',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

interface ValuePropProps {
  icon: string;
  text: string;
}

const ValueProp: React.FC<ValuePropProps> = ({icon, text}) => (
  <View style={styles.valuePropItem} accessibilityRole="text">
    <View style={styles.iconContainer}>
      <Icon name={icon} size={24} color={colors.primary} />
    </View>
    <Text style={styles.valuePropText}>{text}</Text>
  </View>
);

export const WelcomeScreen: React.FC<Props> = ({navigation}) => {
  const handleGetStarted = () => {
    navigation.navigate('PhoneInput');
  };

  const handleLogin = () => {
    // For existing users, also go to phone input for now
    navigation.navigate('PhoneInput');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Hero Illustration Placeholder */}
      <View style={styles.heroContainer}>
        <View
          style={styles.heroPlaceholder}
          accessibilityRole="image"
          accessibilityLabel="Illustration of person preparing for interview">
          <Icon name="account-tie" size={80} color={colors.primary} />
          <Icon
            name="microphone"
            size={40}
            color={colors.secondary}
            style={styles.micIcon}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Headline */}
        <Text
          variant="headlineLarge"
          style={styles.headline}
          accessibilityRole="header">
          Ace Your Next Interview
        </Text>

        {/* Value Props */}
        <View style={styles.valueProps}>
          <ValueProp icon="robot" text="AI-powered mock interviews" />
          <ValueProp icon="school" text="Learn professional etiquette" />
          <ValueProp icon="chart-line" text="Track your progress" />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleGetStarted}
            style={styles.primaryButton}
            contentStyle={styles.primaryButtonContent}
            labelStyle={styles.primaryButtonLabel}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
            accessibilityHint="Begin the onboarding process">
            Get Started
          </Button>

          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginLink}
            accessibilityRole="button"
            accessibilityLabel="I already have an account"
            accessibilityHint="Go to login screen">
            <Text style={styles.loginLinkText}>I already have an account</Text>
          </TouchableOpacity>
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
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  heroPlaceholder: {
    width: 240,
    height: 240,
    backgroundColor: colors.surface,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  micIcon: {
    position: 'absolute',
    bottom: 40,
    right: 40,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  valueProps: {
    marginBottom: spacing.xl,
  },
  valuePropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  valuePropText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textPrimary,
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: '100%',
    marginBottom: spacing.md,
  },
  primaryButtonContent: {
    height: 52,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  loginLink: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default WelcomeScreen;
