import {LinkingOptions} from '@react-navigation/native';
import type {RootStackParamList} from '@app-types/navigation';

/**
 * Deep linking configuration for Prabhav AI
 *
 * Supported deep links:
 * - prabhav://interview - Opens interview hub
 * - prabhav://interview/setup - Opens interview setup
 * - prabhav://module/:id - Opens specific module
 * - prabhav://learn - Opens modules list
 * - prabhav://profile - Opens profile
 * - prabhav://premium - Opens premium screen
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['prabhav://', 'https://prabhavai.com', 'https://app.prabhavai.com'],

  config: {
    screens: {
      // Auth stack - only accessible when not authenticated
      Auth: {
        screens: {
          Splash: 'splash',
          Welcome: 'welcome',
          PhoneInput: 'login',
          OTPVerify: 'verify',
          GoogleAuth: 'google-auth',
        },
      },

      // Onboarding stack - only accessible when authenticated but not completed onboarding
      Onboarding: {
        screens: {
          ProfileBasic: 'onboarding/profile',
          Education: 'onboarding/education',
          Goals: 'onboarding/goals',
          Language: 'onboarding/language',
          OnboardingComplete: 'onboarding/complete',
        },
      },

      // Main tab navigator
      Main: {
        screens: {
          Home: 'home',
          Interview: {
            screens: {
              InterviewHub: 'interview',
              InterviewSetup: 'interview/setup',
              InterviewReady: 'interview/ready',
              QuestionDisplay: 'interview/question',
              RecordingActive: 'interview/recording',
              Processing: 'interview/processing',
              Feedback: 'interview/feedback/:interviewId',
            },
          },
          Learn: {
            screens: {
              ModulesList: 'learn',
              ModuleDetail: 'module/:moduleId',
              ModuleContent: 'module/:moduleId/lesson/:lessonIndex',
              ModuleQuiz: 'module/:moduleId/quiz',
              ModuleComplete: 'module/:moduleId/complete',
            },
          },
          Profile: {
            screens: {
              ProfileMain: 'profile',
              EditProfile: 'profile/edit',
              Notifications: 'profile/notifications',
              Language: 'profile/language',
              Premium: 'premium',
              HelpSupport: 'help',
              About: 'about',
            },
          },
        },
      },

      // Modal stacks
      InterviewFlow: {
        screens: {
          InterviewHub: 'interview-flow',
          InterviewSetup: 'interview-flow/setup',
          InterviewReady: 'interview-flow/ready',
          QuestionDisplay: 'interview-flow/question',
          RecordingActive: 'interview-flow/recording',
          Processing: 'interview-flow/processing',
          Feedback: 'interview-flow/feedback/:interviewId',
        },
      },

      ModuleFlow: {
        screens: {
          ModulesList: 'module-flow',
          ModuleDetail: 'module-flow/:moduleId',
          ModuleContent: 'module-flow/:moduleId/lesson/:lessonIndex',
          ModuleQuiz: 'module-flow/:moduleId/quiz',
          ModuleComplete: 'module-flow/:moduleId/complete',
        },
      },

      SettingsFlow: {
        screens: {
          ProfileMain: 'settings',
          EditProfile: 'settings/edit',
          Notifications: 'settings/notifications',
          Language: 'settings/language',
          Premium: 'settings/premium',
          HelpSupport: 'settings/help',
          About: 'settings/about',
        },
      },
    },
  },
};

export default linking;
