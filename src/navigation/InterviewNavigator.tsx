import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {InterviewStackParamList} from '@app-types/navigation';

import {
  InterviewHubScreen,
  InterviewSetupScreen,
  InterviewReadyScreen,
  QuestionDisplayScreen,
  RecordingActiveScreen,
  ProcessingScreen,
  FeedbackScreen,
} from '@screens/interview';

const Stack = createNativeStackNavigator<InterviewStackParamList>();

export const InterviewNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="InterviewHub"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}>
      <Stack.Screen name="InterviewHub" component={InterviewHubScreen} />
      <Stack.Screen
        name="InterviewSetup"
        component={InterviewSetupScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="InterviewReady"
        component={InterviewReadyScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="QuestionDisplay"
        component={QuestionDisplayScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="RecordingActive"
        component={RecordingActiveScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Processing"
        component={ProcessingScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default InterviewNavigator;
