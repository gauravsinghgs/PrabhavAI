/**
 * ErrorState - Reusable error state components
 * For showing user-friendly error messages with retry options
 */

import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import {useTheme, Text, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ErrorStateProps {
  icon?: string;
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon = 'alert-circle-outline',
  title,
  description,
  retryLabel = 'Try Again',
  onRetry,
  secondaryLabel,
  onSecondaryAction,
  style,
}) => {
  const theme = useTheme();
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, {toValue: 10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 0, duration: 50, useNativeDriver: true}),
    ]).start();
  }, [shakeAnim, fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{translateX: shakeAnim}],
        },
        style,
      ]}>
      <View style={[styles.iconContainer, {backgroundColor: '#FFEBEE'}]}>
        <Icon name={icon} size={48} color="#F44336" />
      </View>
      <Text
        variant="titleMedium"
        style={[styles.title, {color: theme.colors.onSurface}]}>
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.description, {color: theme.colors.onSurfaceVariant}]}>
        {description}
      </Text>
      {onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          style={styles.retryButton}
          buttonColor={theme.colors.primary}>
          {retryLabel}
        </Button>
      )}
      {secondaryLabel && onSecondaryAction && (
        <Button mode="text" onPress={onSecondaryAction} style={styles.secondaryButton}>
          {secondaryLabel}
        </Button>
      )}
    </Animated.View>
  );
};

/**
 * NetworkError - Error state for network failures
 */
interface NetworkErrorProps {
  onRetry?: () => void;
  onGoOffline?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  onGoOffline,
  style,
}) => {
  return (
    <ErrorState
      icon="wifi-off"
      title="Connection Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      retryLabel="Retry"
      onRetry={onRetry}
      secondaryLabel="Continue Offline"
      onSecondaryAction={onGoOffline}
      style={style}
    />
  );
};

/**
 * ServerError - Error state for server failures
 */
interface ServerErrorProps {
  onRetry?: () => void;
  onContactSupport?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ServerError: React.FC<ServerErrorProps> = ({
  onRetry,
  onContactSupport,
  style,
}) => {
  return (
    <ErrorState
      icon="server-off"
      title="Server Error"
      description="Something went wrong on our end. Our team has been notified and is working to fix it."
      retryLabel="Try Again"
      onRetry={onRetry}
      secondaryLabel="Contact Support"
      onSecondaryAction={onContactSupport}
      style={style}
    />
  );
};

/**
 * TimeoutError - Error state for request timeouts
 */
interface TimeoutErrorProps {
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const TimeoutError: React.FC<TimeoutErrorProps> = ({
  onRetry,
  style,
}) => {
  return (
    <ErrorState
      icon="clock-alert-outline"
      title="Request Timed Out"
      description="The request took too long to complete. This might be due to a slow connection."
      retryLabel="Retry"
      onRetry={onRetry}
      style={style}
    />
  );
};

/**
 * AuthError - Error state for authentication failures
 */
interface AuthErrorProps {
  onLogin?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const AuthError: React.FC<AuthErrorProps> = ({onLogin, style}) => {
  return (
    <ErrorState
      icon="account-alert-outline"
      title="Session Expired"
      description="Your session has expired. Please log in again to continue."
      retryLabel="Log In"
      onRetry={onLogin}
      style={style}
    />
  );
};

/**
 * PermissionError - Error state for permission issues
 */
interface PermissionErrorProps {
  permission: string;
  onOpenSettings?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const PermissionError: React.FC<PermissionErrorProps> = ({
  permission,
  onOpenSettings,
  style,
}) => {
  return (
    <ErrorState
      icon="shield-alert-outline"
      title={`${permission} Access Required`}
      description={`This feature requires ${permission.toLowerCase()} access to work properly. Please grant permission in your device settings.`}
      retryLabel="Open Settings"
      onRetry={onOpenSettings}
      style={style}
    />
  );
};

/**
 * GenericError - Generic error state for unknown errors
 */
interface GenericErrorProps {
  errorCode?: string;
  onRetry?: () => void;
  onReportIssue?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const GenericError: React.FC<GenericErrorProps> = ({
  errorCode,
  onRetry,
  onReportIssue,
  style,
}) => {
  return (
    <ErrorState
      icon="alert-octagon-outline"
      title="Something Went Wrong"
      description={
        errorCode
          ? `An unexpected error occurred. Error code: ${errorCode}`
          : 'An unexpected error occurred. Please try again.'
      }
      retryLabel="Try Again"
      onRetry={onRetry}
      secondaryLabel="Report Issue"
      onSecondaryAction={onReportIssue}
      style={style}
    />
  );
};

/**
 * InlineError - Compact inline error message
 */
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  onRetry,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.inlineContainer, style]}>
      <Icon name="alert-circle" size={20} color="#F44336" />
      <Text style={[styles.inlineMessage, {color: '#F44336'}]}>
        {message}
      </Text>
      {onRetry && (
        <Button
          mode="text"
          compact
          onPress={onRetry}
          labelStyle={styles.inlineRetry}>
          Retry
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    marginTop: 8,
    minWidth: 150,
  },
  secondaryButton: {
    marginTop: 8,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inlineMessage: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  inlineRetry: {
    fontSize: 14,
  },
});

export default ErrorState;
