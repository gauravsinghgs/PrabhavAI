/**
 * ErrorBoundary - Catches unhandled errors in React component tree
 * Prevents app crashes and shows user-friendly fallback UI
 */

import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Button, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({errorInfo});

    // Log error to reporting service (e.g., Sentry, Crashlytics)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <Surface style={styles.content} elevation={2}>
            <View style={styles.iconContainer}>
              <Icon name="alert-circle-outline" size={64} color="#F44336" />
            </View>

            <Text variant="headlineSmall" style={styles.title}>
              Something Went Wrong
            </Text>

            <Text variant="bodyMedium" style={styles.message}>
              We're sorry, but something unexpected happened. Please try again
              or restart the app if the problem persists.
            </Text>

            <Button
              mode="contained"
              onPress={this.handleRetry}
              style={styles.retryButton}
              icon="refresh"
              accessibilityLabel="Try again"
              accessibilityHint="Attempts to reload the screen">
              Try Again
            </Button>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.debugContainer}>
                <Text variant="labelSmall" style={styles.debugTitle}>
                  Debug Information (Dev Only)
                </Text>
                <Text style={styles.debugText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}
          </Surface>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * withErrorBoundary - HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode,
): React.FC<P> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithErrorBoundary: React.FC<P> = props => {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  content: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: '#212121',
  },
  message: {
    textAlign: 'center',
    color: '#757575',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 150,
  },
  debugContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    maxHeight: 200,
    width: '100%',
  },
  debugTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#E65100',
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#BF360C',
  },
});

export default ErrorBoundary;
