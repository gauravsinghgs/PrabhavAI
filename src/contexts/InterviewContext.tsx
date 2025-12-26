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
const INTERVIEW_HISTORY_KEY = '@prabhav_interview_history';
const CURRENT_INTERVIEW_KEY = '@prabhav_current_interview';

// Interview type
export type InterviewType = 'hr' | 'technical' | 'behavioral';

// Difficulty level
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Interview status
export type InterviewStatus = 'setup' | 'ready' | 'in_progress' | 'processing' | 'completed' | 'cancelled';

// Question type
export interface InterviewQuestion {
  id: string;
  text: string;
  category: string;
  difficulty: DifficultyLevel;
  expectedDuration: number; // seconds
  tips?: string[];
}

// Answer type
export interface InterviewAnswer {
  questionId: string;
  audioUri?: string;
  transcription?: string;
  duration: number; // seconds
  startedAt: string;
  completedAt: string;
}

// Question feedback type
export interface QuestionFeedback {
  questionId: string;
  score: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  keywordMatches?: string[];
}

// Overall feedback type
export interface InterviewFeedback {
  overallScore: number;
  contentScore: number;
  communicationScore: number;
  confidenceScore: number;
  relevanceScore: number;
  summary: string;
  strengths: string[];
  areasToImprove: string[];
  questionFeedback: QuestionFeedback[];
  xpEarned: number;
  badgeEarned?: string;
}

// Interview configuration
export interface InterviewConfig {
  type: InterviewType;
  company: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  timePerQuestion?: number; // seconds
  focusAreas?: string[];
}

// Current interview type
export interface CurrentInterview {
  id: string;
  config: InterviewConfig;
  status: InterviewStatus;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: InterviewAnswer[];
  startedAt?: string;
  completedAt?: string;
  feedback?: InterviewFeedback;
}

// Interview history item
export interface InterviewHistoryItem {
  id: string;
  config: InterviewConfig;
  status: InterviewStatus;
  score: number;
  startedAt: string;
  completedAt: string;
  questionsAnswered: number;
  feedback?: InterviewFeedback;
}

// Interview state type
export interface InterviewState {
  isLoading: boolean;
  currentInterview: CurrentInterview | null;
  interviewHistory: InterviewHistoryItem[];
  isInterviewActive: boolean;
}

// Interview context type
export interface InterviewContextType extends InterviewState {
  // Interview lifecycle
  startInterview: (config: InterviewConfig) => Promise<CurrentInterview>;
  endInterview: (cancelled?: boolean) => Promise<void>;
  cancelInterview: () => Promise<void>;

  // Question management
  setQuestions: (questions: InterviewQuestion[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;

  // Answer management
  submitAnswer: (answer: Omit<InterviewAnswer, 'questionId'>) => void;
  updateAnswer: (questionId: string, updates: Partial<InterviewAnswer>) => void;

  // Status management
  setStatus: (status: InterviewStatus) => void;
  setFeedback: (feedback: InterviewFeedback) => Promise<void>;

  // History management
  getInterviewById: (id: string) => InterviewHistoryItem | undefined;
  clearHistory: () => Promise<void>;
  getRecentInterviews: (limit?: number) => InterviewHistoryItem[];
  getInterviewStats: () => {
    total: number;
    completed: number;
    averageScore: number;
    byType: Record<InterviewType, number>;
  };
}

// Generate unique ID
const generateId = (): string => {
  return `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Initial state
const initialState: InterviewState = {
  isLoading: true,
  currentInterview: null,
  interviewHistory: [],
  isInterviewActive: false,
};

// Create context
const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

// Provider props
interface InterviewProviderProps {
  children: React.ReactNode;
}

// Interview provider component
export const InterviewProvider: React.FC<InterviewProviderProps> = ({children}) => {
  const [state, setState] = useState<InterviewState>(initialState);

  // Load interview data from storage on mount
  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        const [historyData, currentData] = await Promise.all([
          AsyncStorage.getItem(INTERVIEW_HISTORY_KEY),
          AsyncStorage.getItem(CURRENT_INTERVIEW_KEY),
        ]);

        let history: InterviewHistoryItem[] = [];
        let current: CurrentInterview | null = null;

        if (historyData) {
          history = JSON.parse(historyData);
        }

        if (currentData) {
          current = JSON.parse(currentData);
          // If there's a current interview that's not completed, check if it should be cancelled
          if (current && current.status !== 'completed' && current.status !== 'cancelled') {
            const startTime = new Date(current.startedAt || '').getTime();
            const now = Date.now();
            const hoursSinceStart = (now - startTime) / (1000 * 60 * 60);

            // Cancel interviews older than 2 hours
            if (hoursSinceStart > 2) {
              current.status = 'cancelled';
              await AsyncStorage.removeItem(CURRENT_INTERVIEW_KEY);
              current = null;
            }
          }
        }

        setState({
          isLoading: false,
          currentInterview: current,
          interviewHistory: history,
          isInterviewActive: current?.status === 'in_progress',
        });
      } catch (error) {
        console.error('Failed to load interview data:', error);
        setState(prev => ({...prev, isLoading: false}));
      }
    };

    loadInterviewData();
  }, []);

  // Start interview
  const startInterview = useCallback(async (config: InterviewConfig): Promise<CurrentInterview> => {
    const interview: CurrentInterview = {
      id: generateId(),
      config,
      status: 'setup',
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      startedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(interview));
    setState(prev => ({
      ...prev,
      currentInterview: interview,
      isInterviewActive: true,
    }));

    return interview;
  }, []);

  // End interview
  const endInterview = useCallback(async (cancelled = false) => {
    if (!state.currentInterview) return;

    const completedInterview = {
      ...state.currentInterview,
      status: cancelled ? 'cancelled' as InterviewStatus : 'completed' as InterviewStatus,
      completedAt: new Date().toISOString(),
    };

    // Add to history
    const historyItem: InterviewHistoryItem = {
      id: completedInterview.id,
      config: completedInterview.config,
      status: completedInterview.status,
      score: completedInterview.feedback?.overallScore || 0,
      startedAt: completedInterview.startedAt || new Date().toISOString(),
      completedAt: completedInterview.completedAt,
      questionsAnswered: completedInterview.answers.length,
      feedback: completedInterview.feedback,
    };

    const updatedHistory = [historyItem, ...state.interviewHistory].slice(0, 50); // Keep last 50

    await Promise.all([
      AsyncStorage.setItem(INTERVIEW_HISTORY_KEY, JSON.stringify(updatedHistory)),
      AsyncStorage.removeItem(CURRENT_INTERVIEW_KEY),
    ]);

    setState(prev => ({
      ...prev,
      currentInterview: null,
      interviewHistory: updatedHistory,
      isInterviewActive: false,
    }));
  }, [state.currentInterview, state.interviewHistory]);

  // Cancel interview
  const cancelInterview = useCallback(async () => {
    await endInterview(true);
  }, [endInterview]);

  // Set questions
  const setQuestions = useCallback((questions: InterviewQuestion[]) => {
    if (!state.currentInterview) return;

    const updatedInterview = {
      ...state.currentInterview,
      questions,
      status: 'ready' as InterviewStatus,
    };

    AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(updatedInterview));
    setState(prev => ({...prev, currentInterview: updatedInterview}));
  }, [state.currentInterview]);

  // Next question
  const nextQuestion = useCallback(() => {
    if (!state.currentInterview) return;

    const nextIndex = Math.min(
      state.currentInterview.currentQuestionIndex + 1,
      state.currentInterview.questions.length - 1,
    );

    const updatedInterview = {
      ...state.currentInterview,
      currentQuestionIndex: nextIndex,
    };

    AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(updatedInterview));
    setState(prev => ({...prev, currentInterview: updatedInterview}));
  }, [state.currentInterview]);

  // Previous question
  const previousQuestion = useCallback(() => {
    if (!state.currentInterview) return;

    const prevIndex = Math.max(state.currentInterview.currentQuestionIndex - 1, 0);

    const updatedInterview = {
      ...state.currentInterview,
      currentQuestionIndex: prevIndex,
    };

    AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(updatedInterview));
    setState(prev => ({...prev, currentInterview: updatedInterview}));
  }, [state.currentInterview]);

  // Go to specific question
  const goToQuestion = useCallback((index: number) => {
    if (!state.currentInterview) return;

    const validIndex = Math.max(0, Math.min(index, state.currentInterview.questions.length - 1));

    const updatedInterview = {
      ...state.currentInterview,
      currentQuestionIndex: validIndex,
    };

    AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(updatedInterview));
    setState(prev => ({...prev, currentInterview: updatedInterview}));
  }, [state.currentInterview]);

  // Submit answer
  const submitAnswer = useCallback((answer: Omit<InterviewAnswer, 'questionId'>) => {
    if (!state.currentInterview) return;

    const currentQuestion = state.currentInterview.questions[state.currentInterview.currentQuestionIndex];
    if (!currentQuestion) return;

    const fullAnswer: InterviewAnswer = {
      ...answer,
      questionId: currentQuestion.id,
    };

    const existingIndex = state.currentInterview.answers.findIndex(
      a => a.questionId === currentQuestion.id,
    );

    let answers: InterviewAnswer[];
    if (existingIndex >= 0) {
      answers = [...state.currentInterview.answers];
      answers[existingIndex] = fullAnswer;
    } else {
      answers = [...state.currentInterview.answers, fullAnswer];
    }

    const updatedInterview = {
      ...state.currentInterview,
      answers,
    };

    AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(updatedInterview));
    setState(prev => ({...prev, currentInterview: updatedInterview}));
  }, [state.currentInterview]);

  // Update answer
  const updateAnswer = useCallback((questionId: string, updates: Partial<InterviewAnswer>) => {
    if (!state.currentInterview) return;

    const answers = state.currentInterview.answers.map(a =>
      a.questionId === questionId ? {...a, ...updates} : a,
    );

    const updatedInterview = {
      ...state.currentInterview,
      answers,
    };

    AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(updatedInterview));
    setState(prev => ({...prev, currentInterview: updatedInterview}));
  }, [state.currentInterview]);

  // Set status
  const setStatus = useCallback((status: InterviewStatus) => {
    if (!state.currentInterview) return;

    const updatedInterview = {
      ...state.currentInterview,
      status,
    };

    AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(updatedInterview));
    setState(prev => ({
      ...prev,
      currentInterview: updatedInterview,
      isInterviewActive: status === 'in_progress',
    }));
  }, [state.currentInterview]);

  // Set feedback
  const setFeedback = useCallback(async (feedback: InterviewFeedback) => {
    if (!state.currentInterview) return;

    const updatedInterview = {
      ...state.currentInterview,
      feedback,
      status: 'completed' as InterviewStatus,
      completedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(CURRENT_INTERVIEW_KEY, JSON.stringify(updatedInterview));
    setState(prev => ({...prev, currentInterview: updatedInterview}));
  }, [state.currentInterview]);

  // Get interview by ID
  const getInterviewById = useCallback((id: string): InterviewHistoryItem | undefined => {
    return state.interviewHistory.find(item => item.id === id);
  }, [state.interviewHistory]);

  // Clear history
  const clearHistory = useCallback(async () => {
    await AsyncStorage.removeItem(INTERVIEW_HISTORY_KEY);
    setState(prev => ({...prev, interviewHistory: []}));
  }, []);

  // Get recent interviews
  const getRecentInterviews = useCallback((limit = 10): InterviewHistoryItem[] => {
    return state.interviewHistory.slice(0, limit);
  }, [state.interviewHistory]);

  // Get interview stats
  const getInterviewStats = useCallback(() => {
    const completed = state.interviewHistory.filter(i => i.status === 'completed');
    const total = state.interviewHistory.length;

    const averageScore = completed.length > 0
      ? completed.reduce((sum, i) => sum + i.score, 0) / completed.length
      : 0;

    const byType: Record<InterviewType, number> = {
      hr: 0,
      technical: 0,
      behavioral: 0,
    };

    state.interviewHistory.forEach(i => {
      byType[i.config.type]++;
    });

    return {
      total,
      completed: completed.length,
      averageScore: Math.round(averageScore * 10) / 10,
      byType,
    };
  }, [state.interviewHistory]);

  // Memoize context value
  const contextValue = useMemo<InterviewContextType>(
    () => ({
      ...state,
      startInterview,
      endInterview,
      cancelInterview,
      setQuestions,
      nextQuestion,
      previousQuestion,
      goToQuestion,
      submitAnswer,
      updateAnswer,
      setStatus,
      setFeedback,
      getInterviewById,
      clearHistory,
      getRecentInterviews,
      getInterviewStats,
    }),
    [
      state,
      startInterview,
      endInterview,
      cancelInterview,
      setQuestions,
      nextQuestion,
      previousQuestion,
      goToQuestion,
      submitAnswer,
      updateAnswer,
      setStatus,
      setFeedback,
      getInterviewById,
      clearHistory,
      getRecentInterviews,
      getInterviewStats,
    ],
  );

  return (
    <InterviewContext.Provider value={contextValue}>
      {children}
    </InterviewContext.Provider>
  );
};

// Custom hook to use interview context
export const useInterview = (): InterviewContextType => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

export default InterviewContext;
