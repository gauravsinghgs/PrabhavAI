import React from 'react';
import {Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {MainTabParamList} from '@app-types/navigation';

import {DashboardScreen} from '@screens/main';
import {InterviewNavigator} from './InterviewNavigator';
import {LearnNavigator} from './LearnNavigator';
import {ProfileNavigator} from './ProfileNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

const colors = {
  primary: '#1a237e',
  textSecondary: '#757575',
  surface: '#ffffff',
};

export const MainTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Calculate tab bar height with safe area
  const TAB_BAR_BASE_HEIGHT = 56;
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom;
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: '#e0e0e0',
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#212121',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tab.Screen
        name="Interview"
        component={InterviewNavigator}
        options={{
          title: 'Interview',
          headerShown: false,
          tabBarLabel: 'Interview',
          tabBarIcon: ({color, size}) => (
            <Icon name="microphone" color={color} size={size} />
          ),
          tabBarAccessibilityLabel: 'Interview tab',
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnNavigator}
        options={{
          title: 'Learn',
          headerShown: false,
          tabBarLabel: 'Learn',
          tabBarIcon: ({color, size}) => (
            <Icon name="book-open-variant" color={color} size={size} />
          ),
          tabBarAccessibilityLabel: 'Learn tab',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="account" color={color} size={size} />
          ),
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
