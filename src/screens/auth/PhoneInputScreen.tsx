import React, {useState, useCallback} from 'react';
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
import {authApi} from '@services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneInput'>;

const colors = {
  primary: '#1a237e',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
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

export const PhoneInputScreen: React.FC<Props> = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidPhone = phoneNumber.length === 10 && /^\d{10}$/.test(phoneNumber);

  const handlePhoneChange = useCallback((text: string) => {
    // Only allow digits
    const cleaned = text.replace(/\D/g, '');
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);
    setPhoneNumber(limited);

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }, [error]);

  const handleSendOTP = useCallback(async () => {
    if (!isValidPhone) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    const fullPhoneNumber = `+91${phoneNumber}`;

    try {
      // Use the API service
      const response = await authApi.sendOTP(fullPhoneNumber);

      if (!response.success) {
        // API returned an error - display it to user
        setError(response.error || 'Failed to send OTP. Please try again.');
        return;
      }

      // Success - navigate to OTP screen
      navigation.navigate('OTPVerify', {phoneNumber: fullPhoneNumber});
    } catch (err) {
      // Network or unexpected error
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isValidPhone, phoneNumber, navigation]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
            accessibilityHint="Return to previous screen">
            <Icon name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            variant="headlineMedium"
            style={styles.title}
            accessibilityRole="header">
            Enter your phone number
          </Text>
          <Text style={styles.subtitle}>
            We'll send you a verification code
          </Text>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                error ? styles.inputError : null,
              ]}>
              {/* Country Code */}
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>

              {/* Divider */}
              <View style={styles.inputDivider} />

              {/* Phone Input */}
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholder="98765 43210"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
                accessibilityLabel="Phone number input"
                accessibilityHint="Enter your 10-digit phone number"
              />
            </View>

            {/* Error Message */}
            {error && (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            )}
          </View>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Icon
              name="information-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.infoText}>
              Standard SMS charges may apply
            </Text>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <Button
            mode="contained"
            onPress={handleSendOTP}
            disabled={!isValidPhone || isLoading}
            loading={isLoading}
            style={[
              styles.sendButton,
              (!isValidPhone || isLoading) && styles.sendButtonDisabled,
            ]}
            contentStyle={styles.sendButtonContent}
            labelStyle={styles.sendButtonLabel}
            accessibilityRole="button"
            accessibilityLabel="Send OTP"
            accessibilityHint="Send verification code to your phone"
            accessibilityState={{disabled: !isValidPhone || isLoading}}>
            Send OTP
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
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    height: 56,
    overflow: 'hidden',
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  countryCode: {
    paddingHorizontal: spacing.md,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.divider,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  errorText: {
    marginTop: spacing.xs,
    marginLeft: 0,
    paddingLeft: 0,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.divider,
  },
  sendButtonContent: {
    height: 52,
  },
  sendButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PhoneInputScreen;
