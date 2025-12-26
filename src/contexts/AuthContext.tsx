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
const AUTH_TOKEN_KEY = '@prabhav_auth_token';
const USER_DATA_KEY = '@prabhav_user_data';
const ONBOARDING_COMPLETE_KEY = '@prabhav_onboarding_complete';

// User type
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  photo?: string;
  isPremium: boolean;
  createdAt?: string;
}

// Auth state type
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean; // Alias for hasCompletedOnboarding
  hasCompletedOnboarding: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}

// Auth context type
export interface AuthContextType extends AuthState {
  // Core functions
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  clearError: () => void;
  retryLoad: () => Promise<void>;
  // Aliases for convenience
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  isOnboarded: false,
  hasCompletedOnboarding: false,
  user: null,
  token: null,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Load auth state from storage
  const loadAuthState = useCallback(async () => {
    setState(prev => ({...prev, isLoading: true, error: null}));
    try {
      const [token, userData, onboardingComplete] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
        AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData) as User;
        const isOnboarded = onboardingComplete === 'true';
        setState({
          isLoading: false,
          isAuthenticated: true,
          isOnboarded,
          hasCompletedOnboarding: isOnboarded,
          user,
          token,
          error: null,
        });
      } else {
        setState(prev => ({...prev, isLoading: false, error: null}));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load auth state';
      console.error('Failed to load auth state:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({...prev, error: null}));
  }, []);

  // Sign in / Login
  const signIn = useCallback(async (token: string, user: User) => {
    try {
      const userWithTimestamp = {
        ...user,
        createdAt: user.createdAt || new Date().toISOString(),
      };

      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithTimestamp)),
      ]);

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: userWithTimestamp,
        token,
      }));
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
  }, []);

  // Sign out / Logout
  const signOut = useCallback(async () => {
    try {
      // Clear all auth-related storage
      await AsyncStorage.multiRemove([
        AUTH_TOKEN_KEY,
        USER_DATA_KEY,
        ONBOARDING_COMPLETE_KEY,
      ]);

      setState({
        isLoading: false,
        isAuthenticated: false,
        isOnboarded: false,
        hasCompletedOnboarding: false,
        user: null,
        token: null,
        error: null,
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      setState(prev => ({
        ...prev,
        isOnboarded: true,
        hasCompletedOnboarding: true,
      }));
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      throw error;
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (updates: Partial<User>) => {
    try {
      const updatedUser = {...state.user, ...updates} as User;
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      setState(prev => ({...prev, user: updatedUser}));
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }, [state.user]);

  // Memoize context value
  const contextValue = useMemo<AuthContextType>(
    () => ({
      ...state,
      signIn,
      signOut,
      completeOnboarding,
      updateUser,
      clearError,
      retryLoad: loadAuthState,
      // Aliases
      login: signIn,
      logout: signOut,
    }),
    [state, signIn, signOut, completeOnboarding, updateUser, clearError, loadAuthState],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
