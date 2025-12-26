import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  SplashScreen,
  WelcomeScreen,
  PhoneInputScreen,
  OTPVerifyScreen,
} from '@screens/auth';
import type {AuthStackParamList} from '@app-types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
      <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
      {/* Future screens */}
      {/* <Stack.Screen name="GoogleAuth" component={GoogleAuthScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
