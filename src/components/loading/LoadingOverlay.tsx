/**
 * LoadingOverlay - Full screen loading overlays
 * For blocking operations with status messages
 */

import React, {useRef, useEffect} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Modal,
} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import {LoadingSpinner, DotsLoader} from '../animations/LoadingSpinner';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  subMessage?: string;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
  subMessage,
  transparent = false,
  style,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={[
          styles.container,
          {
            backgroundColor: transparent
              ? 'rgba(0, 0, 0, 0.5)'
              : theme.colors.background,
          },
          style,
        ]}>
        <View
          style={[
            styles.content,
            {backgroundColor: theme.colors.surface},
          ]}>
          <LoadingSpinner size="large" />
          <Text
            variant="titleMedium"
            style={[styles.message, {color: theme.colors.onSurface}]}>
            {message}
          </Text>
          {subMessage && (
            <Text
              variant="bodySmall"
              style={[styles.subMessage, {color: theme.colors.onSurfaceVariant}]}>
              {subMessage}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

/**
 * ProcessingOverlay - For AI processing states
 */
interface ProcessingOverlayProps {
  visible: boolean;
  title?: string;
  steps?: Array<{label: string; completed: boolean}>;
  currentStep?: number;
  style?: StyleProp<ViewStyle>;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  visible,
  title = 'Processing...',
  steps = [],
  currentStep = 0,
  style,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={[styles.container, {backgroundColor: 'rgba(0, 0, 0, 0.7)'}]}>
        <View
          style={[
            styles.processingContent,
            {backgroundColor: theme.colors.surface},
            style,
          ]}>
          <LoadingSpinner size="large" color={theme.colors.primary} />
          <Text
            variant="titleLarge"
            style={[styles.processingTitle, {color: theme.colors.onSurface}]}>
            {title}
          </Text>

          {steps.length > 0 && (
            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <ProcessingStep
                  key={index}
                  label={step.label}
                  status={
                    index < currentStep
                      ? 'completed'
                      : index === currentStep
                      ? 'active'
                      : 'pending'
                  }
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

/**
 * ProcessingStep - Individual step in processing
 */
interface ProcessingStepProps {
  label: string;
  status: 'pending' | 'active' | 'completed';
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({label, status}) => {
  const theme = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'active') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }
    return undefined;
  }, [status, pulseAnim]);

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'active':
        return theme.colors.primary;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'active':
        return '●';
      default:
        return '○';
    }
  };

  return (
    <Animated.View
      style={[
        styles.step,
        {opacity: status === 'pending' ? 0.5 : pulseAnim},
      ]}>
      <Text style={[styles.stepIcon, {color: getStatusColor()}]}>
        {getStatusIcon()}
      </Text>
      <Text
        style={[
          styles.stepLabel,
          {
            color: getStatusColor(),
            fontWeight: status === 'active' ? '600' : '400',
          },
        ]}>
        {label}
      </Text>
    </Animated.View>
  );
};

/**
 * ButtonLoadingState - Inline loading for buttons
 */
interface ButtonLoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export const ButtonLoadingState: React.FC<ButtonLoadingStateProps> = ({
  loading,
  children,
  loadingText = 'Please wait',
}) => {
  if (loading) {
    return (
      <View style={styles.buttonLoading}>
        <DotsLoader size={8} color="#ffffff" />
        <Text style={styles.buttonLoadingText}>{loadingText}</Text>
      </View>
    );
  }

  return <>{children}</>;
};

/**
 * PullToRefreshIndicator - Custom pull to refresh loading
 */
interface PullToRefreshIndicatorProps {
  refreshing: boolean;
  progress?: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  refreshing,
  progress = 0,
}) => {
  const theme = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (refreshing) {
      const animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      animation.start();
      return () => animation.stop();
    }
    return undefined;
  }, [refreshing, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.refreshContainer}>
      <Animated.View
        style={{
          transform: refreshing ? [{rotate: rotation}] : [{rotate: `${progress * 360}deg`}],
        }}>
        <LoadingSpinner size="small" color={theme.colors.primary} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  message: {
    marginTop: 16,
    fontWeight: '500',
  },
  subMessage: {
    marginTop: 8,
    textAlign: 'center',
  },
  processingContent: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  processingTitle: {
    marginTop: 20,
    marginBottom: 24,
    fontWeight: '600',
  },
  stepsContainer: {
    width: '100%',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stepIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  stepLabel: {
    fontSize: 14,
  },
  buttonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoadingText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
  },
  refreshContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});

export default LoadingOverlay;
