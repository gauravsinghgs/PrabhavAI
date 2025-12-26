import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '@app-types/navigation';

import {
  ProfileScreen,
  EditProfileScreen,
  NotificationsScreen,
  PremiumScreen,
  LanguageSettingsScreen,
  HelpSupportScreen,
  AboutScreen,
} from '@screens/profile';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="Language" component={LanguageSettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
