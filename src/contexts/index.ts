// Auth Context
export {AuthProvider, useAuth, default as AuthContext} from './AuthContext';
export type {User, AuthState, AuthContextType} from './AuthContext';

// User Context
export {UserProvider, useUser, default as UserContext} from './UserContext';
export type {
  UserProfile,
  UserProgress,
  Achievement,
  Badge,
  StreakData,
  UserState,
  UserContextType,
} from './UserContext';

// Interview Context
export {InterviewProvider, useInterview, default as InterviewContext} from './InterviewContext';
export type {
  InterviewType,
  DifficultyLevel,
  InterviewStatus,
  InterviewQuestion,
  InterviewAnswer,
  QuestionFeedback,
  InterviewFeedback,
  InterviewConfig,
  CurrentInterview,
  InterviewHistoryItem,
  InterviewState,
  InterviewContextType,
} from './InterviewContext';
