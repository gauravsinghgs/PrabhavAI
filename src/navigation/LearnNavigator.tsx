import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {LearnStackParamList} from '@app-types/navigation';

import {
  ModulesListScreen,
  ModuleDetailScreen,
  ModuleContentScreen,
  ModuleCompleteScreen,
} from '@screens/learn';

const Stack = createNativeStackNavigator<LearnStackParamList>();

export const LearnNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ModulesList"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}>
      <Stack.Screen name="ModulesList" component={ModulesListScreen} />
      <Stack.Screen
        name="ModuleDetail"
        component={ModuleDetailScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="ModuleContent"
        component={ModuleContentScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="ModuleComplete"
        component={ModuleCompleteScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default LearnNavigator;
