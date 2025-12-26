import React, {useEffect} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const colors = {
  primary: '#1a237e',
  surface: '#ffffff',
};

export const SplashScreen: React.FC<Props> = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Logo Container */}
      <View
        style={styles.logoContainer}
        accessibilityRole="image"
        accessibilityLabel="Prabhav AI Logo">
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>P</Text>
        </View>
      </View>

      {/* App Name */}
      <Text
        variant="headlineLarge"
        style={styles.appName}
        accessibilityRole="header">
        Prabhav AI
      </Text>

      {/* Tagline */}
      <Text
        variant="bodyLarge"
        style={styles.tagline}
        accessibilityLabel="Your AI Interview Coach">
        Your AI Interview Coach
      </Text>

      {/* Loading Indicator */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          animating={true}
          color={colors.surface}
          size="large"
          accessibilityLabel="Loading application"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  appName: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 32,
    marginBottom: 8,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 18,
    marginBottom: 48,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
  },
});

export default SplashScreen;
