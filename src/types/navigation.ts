import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
  LinkingOptions,
} from '@react-navigation/native';

// Auth Stack Navigator
export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  PhoneInput: undefined;
  OTPVerify: {phoneNumber: string};
  GoogleAuth: undefined;
};

// Onboarding Stack Navigator
export type OnboardingStackParamList = {
  ProfileBasic: undefined;
  Education: undefined;
  Goals: undefined;
  Language: undefined;
  OnboardingComplete: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Interview: undefined;
  Learn: undefined;
  Profile: undefined;
};

// Interview context passed between screens
export type InterviewContext = {
  type: 'hr' | 'technical' | 'behavioral';
  company: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number;
};

// Interview Stack Navigator
export type InterviewStackParamList = {
  InterviewHub: undefined;
  InterviewSetup: undefined;
  InterviewReady: InterviewContext;
  QuestionDisplay: InterviewContext & {questionIndex: number};
  RecordingActive: InterviewContext & {questionIndex: number; question: string};
  Processing: InterviewContext;
  Feedback: {interviewId: string};
};

// Learn Stack Navigator
export type LearnStackParamList = {
  ModulesList: undefined;
  ModuleDetail: {moduleId: string};
  ModuleContent: {moduleId: string; lessonIndex: number};
  ModuleQuiz: {moduleId: string};
  ModuleComplete: {moduleId: string; xpEarned: number; badgeEarned?: string};
};

// Alias for backward compatibility
export type ModuleStackParamList = LearnStackParamList;

// Profile Stack Navigator
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  Language: undefined;
  Premium: undefined;
  HelpSupport: undefined;
  About: undefined;
};

// Alias for backward compatibility
export type SettingsStackParamList = ProfileStackParamList;

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  InterviewFlow: NavigatorScreenParams<InterviewStackParamList>;
  ModuleFlow: NavigatorScreenParams<ModuleStackParamList>;
  SettingsFlow: NavigatorScreenParams<SettingsStackParamList>;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type InterviewStackScreenProps<T extends keyof InterviewStackParamList> =
  NativeStackScreenProps<InterviewStackParamList, T>;

export type LearnStackScreenProps<T extends keyof LearnStackParamList> =
  NativeStackScreenProps<LearnStackParamList, T>;

// Alias for backward compatibility
export type ModuleStackScreenProps<T extends keyof ModuleStackParamList> =
  NativeStackScreenProps<ModuleStackParamList, T>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>;

// Alias for backward compatibility
export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> =
  NativeStackScreenProps<SettingsStackParamList, T>;

// Declaration for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
