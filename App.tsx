/**
 * Prabhav AI - Personality Development App
 * Built with React Native, TypeScript, React Navigation, and React Native Paper
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {RootNavigator, linking} from '@navigation/index';
import {AuthProvider, UserProvider, InterviewProvider} from '@contexts/index';
import {ErrorBoundary} from '@components/index';

// Customize theme colors for Prabhav AI
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1a237e',
    secondary: '#ff6f00',
    tertiary: '#9c27b0',
    background: '#f5f5f5',
    surface: '#ffffff',
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#534bae',
    secondary: '#ffab40',
    tertiary: '#ce93d8',
  },
};

// Adapt navigation theme to match Paper theme
const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    ...customLightTheme.colors,
  },
};

const CombinedDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...customDarkTheme.colors,
  },
};

/**
 * App Providers Component
 * Wraps all context providers in the correct order
 */
const AppProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <AuthProvider>
      <UserProvider>
        <InterviewProvider>{children}</InterviewProvider>
      </UserProvider>
    </AuthProvider>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? customDarkTheme : customLightTheme;
  const navigationTheme = isDarkMode ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <AppProviders>
            <PaperProvider theme={theme}>
              <NavigationContainer theme={navigationTheme} linking={linking}>
                <StatusBar
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                  backgroundColor={
                    isDarkMode
                      ? customDarkTheme.colors.surface
                      : customLightTheme.colors.surface
                  }
                />
                <RootNavigator />
              </NavigationContainer>
            </PaperProvider>
          </AppProviders>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default App;
