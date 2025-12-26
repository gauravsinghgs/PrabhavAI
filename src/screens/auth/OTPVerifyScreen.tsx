import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Text, Button, HelperText} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '@app-types/navigation';
import {useAuth} from '@contexts/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerify'>;

const colors = {
  primary: '#1a237e',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  error: '#d32f2f',
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

const OTP_LENGTH = 6;
const RESEND_TIMER = 30;

const maskPhoneNumber = (phone: string): string => {
  // +91 98765 43210 -> +91 98****3210
  if (phone.length < 10) return phone;
  const cleaned = phone.replace(/\D/g, '');
  const last4 = cleaned.slice(-4);
  const first2 = cleaned.slice(-10, -8);
  return `+91 ${first2}****${last4}`;
};

export const OTPVerifyScreen: React.FC<Props> = ({navigation, route}) => {
  const {phoneNumber} = route.params;
  const maskedPhone = maskPhoneNumber(phoneNumber);
  const {signIn, completeOnboarding} = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
    return undefined;
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleOtpChange = useCallback(
    (text: string, index: number) => {
      // Clear error when user types
      if (error) {
        setError(null);
      }

      // Only allow digits
      const digit = text.replace(/\D/g, '').slice(-1);

      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      // Auto-focus next input
      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, error],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      // Handle backspace - move to previous input
      if (key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    },
    [otp],
  );

  const handleVerify = useCallback(async () => {
    const otpString = otp.join('');

    if (otpString.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation - accept any 6-digit OTP except "000000"
      if (otpString !== '000000') {
        // Create demo user
        const demoUser = {
          id: 'usr_demo_001',
          name: 'Rahul Sharma',
          phone: phoneNumber,
          isPremium: false,
        };

        // Sign in the user
        await signIn('demo_token_' + Date.now(), demoUser);

        // Mark onboarding as complete (skip onboarding for demo)
        await completeOnboarding();

        console.log('OTP Verified Successfully! User signed in.');
        // Navigation will happen automatically via AuthContext state change
      } else {
        setError('Invalid OTP. Please try again.');
        // Clear OTP fields
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [otp, phoneNumber, signIn, completeOnboarding]);

  const handleResendOTP = useCallback(async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(RESEND_TIMER);
    setError(null);
    setOtp(Array(OTP_LENGTH).fill(''));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      setCanResend(true);
    }
  }, [canResend]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Return to phone input screen">
            <Icon name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            variant="headlineMedium"
            style={styles.title}
            accessibilityRole="header">
            Verify your number
          </Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.phoneText}>{maskedPhone}</Text>
          </Text>

          {/* OTP Input Boxes */}
          <View
            style={styles.otpContainer}
            accessibilityLabel="OTP input"
            accessibilityHint="Enter the 6-digit verification code">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  error ? styles.otpInputError : null,
                ]}
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={({nativeEvent}) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                accessibilityLabel={`OTP digit ${index + 1}`}
              />
            ))}
          </View>

          {/* Error Message */}
          {error && (
            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          )}

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendOTP}
                style={styles.resendButton}
                accessibilityRole="button"
                accessibilityLabel="Resend OTP"
                accessibilityHint="Send a new verification code">
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend code in{' '}
                <Text style={styles.timerCount}>{resendTimer}s</Text>
              </Text>
            )}
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <Button
            mode="contained"
            onPress={handleVerify}
            disabled={!isOtpComplete || isLoading}
            loading={isLoading}
            style={[
              styles.verifyButton,
              (!isOtpComplete || isLoading) && styles.verifyButtonDisabled,
            ]}
            contentStyle={styles.verifyButtonContent}
            labelStyle={styles.verifyButtonLabel}
            accessibilityRole="button"
            accessibilityLabel="Verify OTP"
            accessibilityHint="Verify the entered code"
            accessibilityState={{disabled: !isOtpComplete || isLoading}}>
            Verify
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  phoneText: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  otpInputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  resendButton: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  timerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timerCount: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.divider,
  },
  verifyButtonContent: {
    height: 52,
  },
  verifyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OTPVerifyScreen;
