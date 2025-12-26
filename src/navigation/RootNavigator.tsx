import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '@contexts/AuthContext';

import {AuthNavigator} from './AuthNavigator';
import {OnboardingNavigator} from './OnboardingNavigator';
import {MainTabNavigator} from './MainTabNavigator';
import {InterviewNavigator} from './InterviewNavigator';
import {LearnNavigator} from './LearnNavigator';
import {ProfileNavigator} from './ProfileNavigator';
import type {RootStackParamList} from '@app-types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const colors = {
  primary: '#1a237e',
  background: '#f5f5f5',
};

// Loading screen while checking auth state
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

export const RootNavigator: React.FC = () => {
  const {isLoading, isAuthenticated, hasCompletedOnboarding} = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Determine initial route based on auth state
  const getInitialRoute = (): keyof RootStackParamList => {
    if (!isAuthenticated) {
      return 'Auth';
    }
    if (!hasCompletedOnboarding) {
      return 'Onboarding';
    }
    return 'Main';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      {/* Conditional rendering based on auth state */}
      {!isAuthenticated ? (
        // Not authenticated - show auth screens
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
      ) : !hasCompletedOnboarding ? (
        // Authenticated but not completed onboarding
        <Stack.Screen
          name="Onboarding"
          component={OnboardingNavigator}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
      ) : (
        // Fully authenticated - show main app
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Interview Flow - Modal presentation */}
          <Stack.Screen
            name="InterviewFlow"
            component={InterviewNavigator}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              gestureEnabled: true,
              gestureDirection: 'vertical',
            }}
          />

          {/* Module Flow - Full screen modal */}
          <Stack.Screen
            name="ModuleFlow"
            component={LearnNavigator}
            options={{
              presentation: 'fullScreenModal',
              animation: 'slide_from_right',
            }}
          />

          {/* Settings Flow - Modal presentation */}
          <Stack.Screen
            name="SettingsFlow"
            component={ProfileNavigator}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;
