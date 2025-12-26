import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ProfileBasicScreen,
  EducationScreen,
  GoalsScreen,
  LanguageScreen,
  OnboardingCompleteScreen,
} from '@screens/onboarding';
import type {OnboardingStackParamList} from '@app-types/navigation';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileBasic"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="ProfileBasic" component={ProfileBasicScreen} />
      <Stack.Screen name="Education" component={EducationScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen
        name="OnboardingComplete"
        component={OnboardingCompleteScreen}
        options={{animation: 'fade'}}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
