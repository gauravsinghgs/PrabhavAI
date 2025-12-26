/**
 * Mock API Service for Prabhav AI
 * Simulates backend responses with realistic delays
 */

import type {User} from '@contexts/AuthContext';
import type {UserProfile, UserProgress, StreakData} from '@contexts/UserContext';
import type {
  InterviewConfig,
  InterviewQuestion,
  InterviewFeedback,
  InterviewHistoryItem,
} from '@contexts/InterviewContext';

import {
  mockUser,
  mockUserProfile,
  mockUserProgress,
  mockStreakData,
  mockInterviewHistory,
  mockModules,
  getModuleById,
  getQuestionsByType,
  generateMockFeedback,
  mockCompanies,
  type Module,
  type Lesson,
} from './mockData';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simulate network delay
 * @param min Minimum delay in ms
 * @param max Maximum delay in ms
 */
const delay = (min: number = 500, max: number = 1500): Promise<void> => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate a mock JWT token
 */
const generateMockToken = (): string => {
  const header = btoa(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const payload = btoa(
    JSON.stringify({
      sub: mockUser.id,
      iat: Date.now(),
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    }),
  );
  const signature = btoa(Math.random().toString(36).substring(2));
  return `${header}.${payload}.${signature}`;
};

/**
 * Generate a unique ID
 */
const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Safe API call wrapper with error handling
 * Wraps async operations in try-catch and returns consistent error responses
 */
async function safeApiCall<T>(
  operation: () => Promise<ApiResponse<T>>,
  errorMessage: string = 'An error occurred',
): Promise<ApiResponse<T>> {
  try {
    return await operation();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : errorMessage;
    console.error(`[API Error] ${errorMessage}:`, error);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Safe paginated API call wrapper
 */
async function safePaginatedCall<T>(
  operation: () => Promise<PaginatedResponse<T>>,
  errorMessage: string = 'An error occurred',
): Promise<PaginatedResponse<T>> {
  try {
    return await operation();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : errorMessage;
    console.error(`[API Error] ${errorMessage}:`, error);
    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        hasMore: false,
      },
    };
  }
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  /**
   * Send OTP to phone number
   * @param phone Phone number with country code
   */
  sendOTP: async (phone: string): Promise<ApiResponse<{otpSent: boolean; expiresIn: number}>> => {
    return safeApiCall(async () => {
      await delay(800, 1500);

      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{9,14}$/;
      const cleanPhone = phone.replace(/\s/g, '');

      if (!phoneRegex.test(cleanPhone)) {
        return {
          success: false,
          error: 'Invalid phone number format',
        };
      }

      console.log(`[Mock API] OTP sent to ${phone}`);

      return {
        success: true,
        data: {
          otpSent: true,
          expiresIn: 300, // 5 minutes
        },
        message: 'OTP sent successfully',
      };
    }, 'Failed to send OTP');
  },

  /**
   * Verify OTP and return auth token
   * @param phone Phone number
   * @param otp 6-digit OTP
   */
  verifyOTP: async (
    phone: string,
    otp: string,
  ): Promise<ApiResponse<{token: string; user: User; isNewUser: boolean}>> => {
    return safeApiCall(async () => {
      await delay(1000, 2000);

      // Accept any 6-digit OTP for demo
      if (!/^\d{6}$/.test(otp)) {
        return {
          success: false,
          error: 'Invalid OTP format. Please enter 6 digits.',
        };
      }

      // Simulate wrong OTP for specific code
      if (otp === '000000') {
        return {
          success: false,
          error: 'Invalid OTP. Please try again.',
        };
      }

      const token = generateMockToken();
      const isNewUser = otp.startsWith('1'); // OTPs starting with 1 are "new users"

      const user: User = {
        ...mockUser,
        phone: phone.replace(/\s/g, ''),
      };

      console.log(`[Mock API] OTP verified for ${phone}`);

      return {
        success: true,
        data: {
          token,
          user,
          isNewUser,
        },
        message: 'Phone verified successfully',
      };
    }, 'Failed to verify OTP');
  },

  /**
   * Google Sign In
   * @param googleToken Google OAuth token
   */
  googleLogin: async (
    googleToken: string,
  ): Promise<ApiResponse<{token: string; user: User; isNewUser: boolean}>> => {
    await delay(1000, 1800);

    if (!googleToken) {
      return {
        success: false,
        error: 'Invalid Google token',
      };
    }

    const token = generateMockToken();
    const user: User = {
      ...mockUser,
      email: 'rahul.sharma@gmail.com',
    };

    console.log('[Mock API] Google login successful');

    return {
      success: true,
      data: {
        token,
        user,
        isNewUser: false,
      },
      message: 'Google login successful',
    };
  },

  /**
   * Refresh auth token
   * @param currentToken Current JWT token
   */
  refreshToken: async (currentToken: string): Promise<ApiResponse<{token: string}>> => {
    await delay(300, 600);

    if (!currentToken) {
      return {
        success: false,
        error: 'Invalid token',
      };
    }

    return {
      success: true,
      data: {
        token: generateMockToken(),
      },
    };
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<null>> => {
    await delay(200, 400);

    console.log('[Mock API] User logged out');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  },
};

// ============================================================================
// USER API
// ============================================================================

export const userApi = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    await delay(500, 1000);

    return {
      success: true,
      data: {...mockUserProfile},
    };
  },

  /**
   * Update user profile
   * @param updates Partial profile updates
   */
  updateProfile: async (updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    await delay(800, 1500);

    const updatedProfile = {
      ...mockUserProfile,
      ...updates,
    };

    console.log('[Mock API] Profile updated:', updates);

    return {
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully',
    };
  },

  /**
   * Get user progress (XP, level, streak)
   */
  getProgress: async (): Promise<
    ApiResponse<{progress: UserProgress; streak: StreakData}>
  > => {
    await delay(500, 1000);

    return {
      success: true,
      data: {
        progress: {...mockUserProgress},
        streak: {...mockStreakData},
      },
    };
  },

  /**
   * Update user progress
   * @param xpToAdd XP to add
   */
  addXP: async (
    xpToAdd: number,
  ): Promise<ApiResponse<{newXP: number; leveledUp: boolean; newLevel?: number}>> => {
    await delay(300, 600);

    const newXP = mockUserProgress.xp + xpToAdd;
    const leveledUp = newXP >= 1500 && mockUserProgress.xp < 1500; // Example level up at 1500

    console.log(`[Mock API] Added ${xpToAdd} XP`);

    return {
      success: true,
      data: {
        newXP,
        leveledUp,
        newLevel: leveledUp ? 6 : undefined,
      },
    };
  },

  /**
   * Record daily activity for streak
   */
  recordActivity: async (): Promise<
    ApiResponse<{streak: StreakData; streakIncreased: boolean}>
  > => {
    await delay(300, 500);

    const today = new Date().toISOString().split('T')[0];
    const updatedStreak: StreakData = {
      ...mockStreakData,
      currentStreak: mockStreakData.currentStreak + 1,
      lastActivityDate: today,
    };

    return {
      success: true,
      data: {
        streak: updatedStreak,
        streakIncreased: true,
      },
    };
  },

  /**
   * Get available companies for interview practice
   */
  getCompanies: async (): Promise<ApiResponse<string[]>> => {
    await delay(300, 600);

    return {
      success: true,
      data: mockCompanies,
    };
  },
};

// ============================================================================
// INTERVIEW API
// ============================================================================

export const interviewApi = {
  /**
   * Start a new interview
   * @param config Interview configuration
   */
  startInterview: async (
    config: InterviewConfig,
  ): Promise<ApiResponse<{interviewId: string; questions: InterviewQuestion[]}>> => {
    await delay(1000, 2000);

    const interviewId = generateId('int');
    const questions = getQuestionsByType(
      config.type,
      config.totalQuestions,
      config.difficulty,
    );

    console.log(`[Mock API] Started interview ${interviewId}`);

    return {
      success: true,
      data: {
        interviewId,
        questions,
      },
    };
  },

  /**
   * Submit answer for a question
   * @param interviewId Interview ID
   * @param questionId Question ID
   * @param audioUri Audio file URI
   * @param duration Answer duration in seconds
   */
  submitAnswer: async (
    interviewId: string,
    questionId: string,
    audioUri: string,
    duration: number,
  ): Promise<ApiResponse<{submitted: boolean; transcription?: string}>> => {
    await delay(500, 1000);

    console.log(`[Mock API] Answer submitted for ${questionId}`);

    return {
      success: true,
      data: {
        submitted: true,
        transcription: 'Mock transcription of the answer...', // In production, this would be from speech-to-text
      },
    };
  },

  /**
   * Get AI feedback for completed interview
   * @param interviewId Interview ID
   * @param questions Questions that were asked
   * @param config Interview configuration
   */
  getInterviewFeedback: async (
    interviewId: string,
    questions: InterviewQuestion[],
    config: InterviewConfig,
  ): Promise<ApiResponse<InterviewFeedback>> => {
    await delay(2000, 4000); // Longer delay to simulate AI processing

    const feedback = generateMockFeedback(questions, config);

    console.log(`[Mock API] Generated feedback for ${interviewId}`);

    return {
      success: true,
      data: feedback,
    };
  },

  /**
   * Get interview history
   * @param page Page number
   * @param limit Items per page
   */
  getInterviewHistory: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<InterviewHistoryItem>> => {
    await delay(500, 1000);

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedHistory = mockInterviewHistory.slice(start, end);

    return {
      success: true,
      data: paginatedHistory,
      pagination: {
        page,
        limit,
        total: mockInterviewHistory.length,
        hasMore: end < mockInterviewHistory.length,
      },
    };
  },

  /**
   * Get specific interview details
   * @param interviewId Interview ID
   */
  getInterviewById: async (
    interviewId: string,
  ): Promise<ApiResponse<InterviewHistoryItem | null>> => {
    await delay(300, 600);

    const interview = mockInterviewHistory.find(i => i.id === interviewId);

    return {
      success: true,
      data: interview || null,
    };
  },

  /**
   * Get interview statistics
   */
  getInterviewStats: async (): Promise<
    ApiResponse<{
      total: number;
      completed: number;
      averageScore: number;
      byType: Record<string, number>;
      recentScores: number[];
    }>
  > => {
    await delay(400, 800);

    const completed = mockInterviewHistory.filter(i => i.status === 'completed');
    const avgScore =
      completed.reduce((sum, i) => sum + i.score, 0) / completed.length;

    return {
      success: true,
      data: {
        total: mockInterviewHistory.length,
        completed: completed.length,
        averageScore: Math.round(avgScore),
        byType: {
          hr: mockInterviewHistory.filter(i => i.config.type === 'hr').length,
          technical: mockInterviewHistory.filter(i => i.config.type === 'technical').length,
          behavioral: mockInterviewHistory.filter(i => i.config.type === 'behavioral').length,
        },
        recentScores: completed.slice(0, 5).map(i => i.score),
      },
    };
  },
};

// ============================================================================
// MODULES API
// ============================================================================

export const modulesApi = {
  /**
   * Get all available modules
   */
  getModules: async (): Promise<ApiResponse<Module[]>> => {
    await delay(500, 1000);

    return {
      success: true,
      data: mockModules.map(m => ({
        ...m,
        // Don't send full lessons list in this endpoint
        lessons: [],
      })),
    };
  },

  /**
   * Get module details including lessons
   * @param moduleId Module ID
   */
  getModuleDetail: async (moduleId: string): Promise<ApiResponse<Module | null>> => {
    await delay(500, 1000);

    const module = getModuleById(moduleId);

    if (!module) {
      return {
        success: false,
        error: 'Module not found',
      };
    }

    return {
      success: true,
      data: module,
    };
  },

  /**
   * Get lesson content
   * @param moduleId Module ID
   * @param lessonId Lesson ID
   */
  getLessonContent: async (
    moduleId: string,
    lessonId: string,
  ): Promise<
    ApiResponse<{
      lesson: Lesson;
      content: {
        type: 'text' | 'video' | 'quiz' | 'exercise';
        blocks: Array<{
          type: string;
          content: string;
          imageUrl?: string;
        }>;
      };
    }>
  > => {
    await delay(600, 1200);

    const module = getModuleById(moduleId);
    if (!module) {
      return {
        success: false,
        error: 'Module not found',
      };
    }

    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      return {
        success: false,
        error: 'Lesson not found',
      };
    }

    // Generate mock content blocks
    const contentBlocks = [
      {
        type: 'heading',
        content: lesson.title,
      },
      {
        type: 'text',
        content:
          'This is an introduction to the topic. In this lesson, you will learn key concepts and practical applications that will help you in your interview preparation.',
      },
      {
        type: 'tip',
        content:
          'Pro Tip: Practice these concepts regularly to build muscle memory and confidence.',
      },
      {
        type: 'text',
        content:
          'The key to success in interviews is preparation and practice. Studies show that candidates who practice regularly score 40% higher on average.',
      },
      {
        type: 'example',
        content:
          'Example: When asked "Tell me about yourself", start with your current role, then mention 2-3 key achievements, and end with why you are excited about this opportunity.',
      },
      {
        type: 'text',
        content:
          'Remember to keep your responses concise and relevant. Interviewers appreciate candidates who can communicate clearly and efficiently.',
      },
    ];

    return {
      success: true,
      data: {
        lesson,
        content: {
          type: lesson.type,
          blocks: contentBlocks,
        },
      },
    };
  },

  /**
   * Mark lesson as complete
   * @param moduleId Module ID
   * @param lessonId Lesson ID
   */
  completeLesson: async (
    moduleId: string,
    lessonId: string,
  ): Promise<ApiResponse<{xpEarned: number; moduleCompleted: boolean; badgeEarned?: string}>> => {
    await delay(500, 1000);

    const module = getModuleById(moduleId);
    if (!module) {
      return {
        success: false,
        error: 'Module not found',
      };
    }

    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      return {
        success: false,
        error: 'Lesson not found',
      };
    }

    // Check if this was the last lesson
    const completedCount = module.lessons.filter(l => l.completed).length + 1;
    const moduleCompleted = completedCount >= module.lessonsCount;

    console.log(`[Mock API] Lesson ${lessonId} completed`);

    return {
      success: true,
      data: {
        xpEarned: lesson.xpReward,
        moduleCompleted,
        badgeEarned: moduleCompleted ? 'module_complete' : undefined,
      },
      message: 'Lesson completed successfully',
    };
  },

  /**
   * Get module progress
   * @param moduleId Module ID
   */
  getModuleProgress: async (
    moduleId: string,
  ): Promise<
    ApiResponse<{
      completedLessons: number;
      totalLessons: number;
      percentComplete: number;
      xpEarned: number;
    }>
  > => {
    await delay(300, 600);

    const module = getModuleById(moduleId);
    if (!module) {
      return {
        success: false,
        error: 'Module not found',
      };
    }

    const completedLessons = module.lessons.filter(l => l.completed).length;
    const xpEarned = module.lessons
      .filter(l => l.completed)
      .reduce((sum, l) => sum + l.xpReward, 0);

    return {
      success: true,
      data: {
        completedLessons,
        totalLessons: module.lessonsCount,
        percentComplete: Math.round((completedLessons / module.lessonsCount) * 100),
        xpEarned,
      },
    };
  },

  /**
   * Submit quiz answers
   * @param moduleId Module ID
   * @param lessonId Quiz lesson ID
   * @param answers User's answers
   */
  submitQuiz: async (
    moduleId: string,
    lessonId: string,
    answers: Record<string, string>,
  ): Promise<
    ApiResponse<{
      score: number;
      passed: boolean;
      xpEarned: number;
      correctAnswers: Record<string, string>;
    }>
  > => {
    await delay(800, 1500);

    // Mock quiz scoring - 80% correct
    const totalQuestions = Object.keys(answers).length;
    const correctCount = Math.floor(totalQuestions * 0.8);
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;

    console.log(`[Mock API] Quiz submitted - Score: ${score}%`);

    return {
      success: true,
      data: {
        score,
        passed,
        xpEarned: passed ? 30 : 10,
        correctAnswers: answers, // In production, would return actual correct answers
      },
    };
  },
};

// ============================================================================
// COMBINED API EXPORT
// ============================================================================

export const api = {
  auth: authApi,
  user: userApi,
  interview: interviewApi,
  modules: modulesApi,
};

export default api;
