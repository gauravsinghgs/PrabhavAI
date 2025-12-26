import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const USER_PROFILE_KEY = '@prabhav_user_profile';
const USER_PROGRESS_KEY = '@prabhav_user_progress';
const STREAK_DATA_KEY = '@prabhav_streak_data';

// Profile data type
export interface UserProfile {
  // Basic info
  name: string;
  email?: string;
  phone: string;
  photo?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  dateOfBirth?: string;

  // Education
  college?: string;
  branch?: string;
  graduationYear?: string;
  degree?: string;

  // Career
  targetRole?: string;
  targetCompanies?: string[];
  yearsOfExperience?: number;
  currentCompany?: string;
  currentRole?: string;

  // Preferences
  preferredLanguage?: string;
  interviewTypes?: ('hr' | 'technical' | 'behavioral')[];
  notificationsEnabled?: boolean;
}

// Progress data type
export interface UserProgress {
  // XP and Level
  xp: number;
  level: number;
  levelName: string;
  xpToNextLevel: number;

  // Stats
  totalInterviews: number;
  completedModules: number;
  questionsAnswered: number;
  averageScore: number;

  // Achievements
  achievements: Achievement[];
  badges: Badge[];
}

// Achievement type
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  progress?: number; // 0-100 for incomplete
}

// Badge type
export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earnedAt: string;
}

// Streak data type
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakHistory: {date: string; completed: boolean}[];
}

// Level configuration
const LEVELS = [
  {level: 1, name: 'Beginner', minXP: 0, maxXP: 100},
  {level: 2, name: 'Learner', minXP: 100, maxXP: 300},
  {level: 3, name: 'Explorer', minXP: 300, maxXP: 600},
  {level: 4, name: 'Practitioner', minXP: 600, maxXP: 1000},
  {level: 5, name: 'Achiever', minXP: 1000, maxXP: 1500},
  {level: 6, name: 'Expert', minXP: 1500, maxXP: 2200},
  {level: 7, name: 'Master', minXP: 2200, maxXP: 3000},
  {level: 8, name: 'Champion', minXP: 3000, maxXP: 4000},
  {level: 9, name: 'Legend', minXP: 4000, maxXP: 5500},
  {level: 10, name: 'Grandmaster', minXP: 5500, maxXP: Infinity},
];

// Calculate level from XP
const calculateLevel = (xp: number): {level: number; levelName: string; xpToNextLevel: number} => {
  for (const levelConfig of LEVELS) {
    if (xp < levelConfig.maxXP) {
      return {
        level: levelConfig.level,
        levelName: levelConfig.name,
        xpToNextLevel: levelConfig.maxXP - xp,
      };
    }
  }
  const maxLevel = LEVELS[LEVELS.length - 1];
  return {
    level: maxLevel.level,
    levelName: maxLevel.name,
    xpToNextLevel: 0,
  };
};

// Initial progress
const initialProgress: UserProgress = {
  xp: 0,
  level: 1,
  levelName: 'Beginner',
  xpToNextLevel: 100,
  totalInterviews: 0,
  completedModules: 0,
  questionsAnswered: 0,
  averageScore: 0,
  achievements: [],
  badges: [],
};

// Initial streak
const initialStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: '',
  streakHistory: [],
};

// User state type
export interface UserState {
  isLoading: boolean;
  profile: UserProfile | null;
  progress: UserProgress;
  streak: StreakData;
}

// User context type
export interface UserContextType extends UserState {
  // Profile functions
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  clearProfile: () => Promise<void>;

  // Progress functions
  addXP: (amount: number) => Promise<{leveledUp: boolean; newLevel?: number}>;
  incrementInterviews: () => Promise<void>;
  incrementModules: () => Promise<void>;
  updateAverageScore: (newScore: number) => Promise<void>;
  addAchievement: (achievement: Achievement) => Promise<void>;
  addBadge: (badge: Badge) => Promise<void>;

  // Streak functions
  recordActivity: () => Promise<{streakIncreased: boolean; newStreak: number}>;
  getStreakStatus: () => {isActive: boolean; hoursUntilExpiry: number};
}

// Initial state
const initialState: UserState = {
  isLoading: true,
  profile: null,
  progress: initialProgress,
  streak: initialStreak,
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider props
interface UserProviderProps {
  children: React.ReactNode;
}

// Check if date is today
const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

// Check if date was yesterday
const isYesterday = (dateString: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
};

// User provider component
export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
  const [state, setState] = useState<UserState>(initialState);

  // Load user data from storage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [profileData, progressData, streakData] = await Promise.all([
          AsyncStorage.getItem(USER_PROFILE_KEY),
          AsyncStorage.getItem(USER_PROGRESS_KEY),
          AsyncStorage.getItem(STREAK_DATA_KEY),
        ]);

        let profile: UserProfile | null = null;
        let progress = initialProgress;
        let streak = initialStreak;

        if (profileData) {
          profile = JSON.parse(profileData);
        }

        if (progressData) {
          progress = JSON.parse(progressData);
        }

        if (streakData) {
          streak = JSON.parse(streakData);
          // Check if streak is still valid
          if (streak.lastActivityDate && !isToday(streak.lastActivityDate) && !isYesterday(streak.lastActivityDate)) {
            // Streak broken
            streak = {
              ...streak,
              currentStreak: 0,
            };
            await AsyncStorage.setItem(STREAK_DATA_KEY, JSON.stringify(streak));
          }
        }

        setState({
          isLoading: false,
          profile,
          progress,
          streak,
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
        setState(prev => ({...prev, isLoading: false}));
      }
    };

    loadUserData();
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = {...state.profile, ...updates} as UserProfile;
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      setState(prev => ({...prev, profile: updatedProfile}));
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, [state.profile]);

  // Set entire profile
  const setProfile = useCallback(async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      setState(prev => ({...prev, profile}));
    } catch (error) {
      console.error('Failed to set profile:', error);
      throw error;
    }
  }, []);

  // Clear profile
  const clearProfile = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([USER_PROFILE_KEY, USER_PROGRESS_KEY, STREAK_DATA_KEY]);
      setState({
        isLoading: false,
        profile: null,
        progress: initialProgress,
        streak: initialStreak,
      });
    } catch (error) {
      console.error('Failed to clear profile:', error);
      throw error;
    }
  }, []);

  // Add XP
  const addXP = useCallback(async (amount: number): Promise<{leveledUp: boolean; newLevel?: number}> => {
    try {
      const newXP = state.progress.xp + amount;
      const oldLevel = state.progress.level;
      const {level, levelName, xpToNextLevel} = calculateLevel(newXP);

      const updatedProgress = {
        ...state.progress,
        xp: newXP,
        level,
        levelName,
        xpToNextLevel,
      };

      await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(updatedProgress));
      setState(prev => ({...prev, progress: updatedProgress}));

      const leveledUp = level > oldLevel;
      return {leveledUp, newLevel: leveledUp ? level : undefined};
    } catch (error) {
      console.error('Failed to add XP:', error);
      throw error;
    }
  }, [state.progress]);

  // Increment interviews
  const incrementInterviews = useCallback(async () => {
    try {
      const updatedProgress = {
        ...state.progress,
        totalInterviews: state.progress.totalInterviews + 1,
      };
      await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(updatedProgress));
      setState(prev => ({...prev, progress: updatedProgress}));
    } catch (error) {
      console.error('Failed to increment interviews:', error);
      throw error;
    }
  }, [state.progress]);

  // Increment completed modules
  const incrementModules = useCallback(async () => {
    try {
      const updatedProgress = {
        ...state.progress,
        completedModules: state.progress.completedModules + 1,
      };
      await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(updatedProgress));
      setState(prev => ({...prev, progress: updatedProgress}));
    } catch (error) {
      console.error('Failed to increment modules:', error);
      throw error;
    }
  }, [state.progress]);

  // Update average score
  const updateAverageScore = useCallback(async (newScore: number) => {
    try {
      const totalScores = state.progress.averageScore * state.progress.totalInterviews;
      const newAverage = state.progress.totalInterviews > 0
        ? (totalScores + newScore) / (state.progress.totalInterviews + 1)
        : newScore;

      const updatedProgress = {
        ...state.progress,
        averageScore: Math.round(newAverage * 10) / 10,
      };
      await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(updatedProgress));
      setState(prev => ({...prev, progress: updatedProgress}));
    } catch (error) {
      console.error('Failed to update average score:', error);
      throw error;
    }
  }, [state.progress]);

  // Add achievement
  const addAchievement = useCallback(async (achievement: Achievement) => {
    try {
      const existingIndex = state.progress.achievements.findIndex(a => a.id === achievement.id);
      let achievements: Achievement[];

      if (existingIndex >= 0) {
        achievements = [...state.progress.achievements];
        achievements[existingIndex] = achievement;
      } else {
        achievements = [...state.progress.achievements, achievement];
      }

      const updatedProgress = {...state.progress, achievements};
      await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(updatedProgress));
      setState(prev => ({...prev, progress: updatedProgress}));
    } catch (error) {
      console.error('Failed to add achievement:', error);
      throw error;
    }
  }, [state.progress]);

  // Add badge
  const addBadge = useCallback(async (badge: Badge) => {
    try {
      const exists = state.progress.badges.some(b => b.id === badge.id);
      if (exists) return;

      const badges = [...state.progress.badges, badge];
      const updatedProgress = {...state.progress, badges};
      await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(updatedProgress));
      setState(prev => ({...prev, progress: updatedProgress}));
    } catch (error) {
      console.error('Failed to add badge:', error);
      throw error;
    }
  }, [state.progress]);

  // Record activity (for streak)
  const recordActivity = useCallback(async (): Promise<{streakIncreased: boolean; newStreak: number}> => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Already recorded today
      if (state.streak.lastActivityDate === today) {
        return {streakIncreased: false, newStreak: state.streak.currentStreak};
      }

      let newStreak = 1;
      const wasYesterday = isYesterday(state.streak.lastActivityDate);

      if (wasYesterday) {
        newStreak = state.streak.currentStreak + 1;
      }

      const updatedStreak: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(state.streak.longestStreak, newStreak),
        lastActivityDate: today,
        streakHistory: [
          ...state.streak.streakHistory.slice(-29), // Keep last 30 days
          {date: today, completed: true},
        ],
      };

      await AsyncStorage.setItem(STREAK_DATA_KEY, JSON.stringify(updatedStreak));
      setState(prev => ({...prev, streak: updatedStreak}));

      return {streakIncreased: newStreak > state.streak.currentStreak, newStreak};
    } catch (error) {
      console.error('Failed to record activity:', error);
      throw error;
    }
  }, [state.streak]);

  // Get streak status
  const getStreakStatus = useCallback((): {isActive: boolean; hoursUntilExpiry: number} => {
    const today = new Date().toISOString().split('T')[0];
    const isActive = state.streak.lastActivityDate === today || isYesterday(state.streak.lastActivityDate);

    if (!isActive || !state.streak.lastActivityDate) {
      return {isActive: false, hoursUntilExpiry: 0};
    }

    // Calculate hours until midnight tomorrow
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const hoursUntilExpiry = Math.ceil((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));

    return {isActive: true, hoursUntilExpiry};
  }, [state.streak]);

  // Memoize context value
  const contextValue = useMemo<UserContextType>(
    () => ({
      ...state,
      updateProfile,
      setProfile,
      clearProfile,
      addXP,
      incrementInterviews,
      incrementModules,
      updateAverageScore,
      addAchievement,
      addBadge,
      recordActivity,
      getStreakStatus,
    }),
    [
      state,
      updateProfile,
      setProfile,
      clearProfile,
      addXP,
      incrementInterviews,
      incrementModules,
      updateAverageScore,
      addAchievement,
      addBadge,
      recordActivity,
      getStreakStatus,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
