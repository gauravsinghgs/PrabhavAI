/**
 * Mock Data for Prabhav AI
 * Realistic data for investor demo
 */

import type {
  InterviewType,
  DifficultyLevel,
  InterviewQuestion,
  InterviewFeedback,
  QuestionFeedback,
  InterviewHistoryItem,
  InterviewConfig,
} from '@contexts/InterviewContext';
import type {UserProfile, UserProgress, StreakData, Achievement, Badge} from '@contexts/UserContext';
import type {User} from '@contexts/AuthContext';

// ============================================================================
// USER DATA
// ============================================================================

export const mockUser: User = {
  id: 'usr_prabhav_001',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  photo: undefined,
  isPremium: false,
  createdAt: '2024-01-15T10:30:00.000Z',
};

export const mockPremiumUser: User = {
  id: 'usr_prabhav_002',
  name: 'Priya Patel',
  email: 'priya.patel@email.com',
  phone: '+91 87654 32109',
  photo: undefined,
  isPremium: true,
  createdAt: '2024-01-01T08:00:00.000Z',
};

export const mockUserProfile: UserProfile = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  gender: 'male',
  dateOfBirth: '2001-05-15',

  // Education
  college: 'Delhi Technological University',
  branch: 'Computer Science',
  graduationYear: '2024',
  degree: 'B.Tech',

  // Career
  targetRole: 'Software Developer',
  targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Flipkart'],
  yearsOfExperience: 0,

  // Preferences
  preferredLanguage: 'en',
  interviewTypes: ['hr', 'technical', 'behavioral'],
  notificationsEnabled: true,
};

export const mockUserProgress: UserProgress = {
  xp: 1250,
  level: 5,
  levelName: 'Achiever',
  xpToNextLevel: 250,

  totalInterviews: 12,
  completedModules: 8,
  questionsAnswered: 156,
  averageScore: 72,

  achievements: [
    {
      id: 'ach_first_interview',
      name: 'First Steps',
      description: 'Complete your first mock interview',
      icon: 'microphone',
      earnedAt: '2024-01-20T14:30:00.000Z',
    },
    {
      id: 'ach_streak_7',
      name: '7-Day Streak',
      description: 'Practice for 7 consecutive days',
      icon: 'fire',
      earnedAt: '2024-02-01T09:00:00.000Z',
    },
    {
      id: 'ach_quick_learner',
      name: 'Quick Learner',
      description: 'Complete 5 modules in a week',
      icon: 'lightning-bolt',
      earnedAt: '2024-02-10T16:45:00.000Z',
    },
    {
      id: 'ach_perfect_score',
      name: 'Perfect Score',
      description: 'Score 100% on any interview',
      icon: 'star',
      earnedAt: '2024-02-15T11:20:00.000Z',
    },
  ],

  badges: [
    {
      id: 'badge_early_adopter',
      name: 'Early Adopter',
      icon: 'rocket',
      color: '#ff6f00',
      earnedAt: '2024-01-15T10:30:00.000Z',
    },
    {
      id: 'badge_communication',
      name: 'Communication Pro',
      icon: 'message-text',
      color: '#1a237e',
      earnedAt: '2024-02-05T13:15:00.000Z',
    },
  ],
};

export const mockStreakData: StreakData = {
  currentStreak: 7,
  longestStreak: 14,
  lastActivityDate: new Date().toISOString().split('T')[0],
  streakHistory: Array.from({length: 14}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      completed: i < 7 || (i >= 10 && i < 14),
    };
  }).reverse(),
};

// ============================================================================
// INTERVIEW DATA
// ============================================================================

export const mockCompanies = [
  'Google',
  'Microsoft',
  'Amazon',
  'Apple',
  'Meta',
  'Netflix',
  'Flipkart',
  'Swiggy',
  'Zomato',
  'Paytm',
  'PhonePe',
  'Razorpay',
  'CRED',
  'Zerodha',
  'Infosys',
  'TCS',
  'Wipro',
  'Accenture',
];

// HR Interview Questions
export const hrQuestions: InterviewQuestion[] = [
  {
    id: 'hr_q1',
    text: 'Tell me about yourself and your background.',
    category: 'Introduction',
    difficulty: 'easy',
    expectedDuration: 120,
    tips: [
      'Start with your education',
      'Mention relevant projects or internships',
      'Keep it under 2 minutes',
    ],
  },
  {
    id: 'hr_q2',
    text: 'Why do you want to work at our company?',
    category: 'Motivation',
    difficulty: 'medium',
    expectedDuration: 90,
    tips: [
      'Research the company beforehand',
      'Mention specific products or values',
      'Connect to your career goals',
    ],
  },
  {
    id: 'hr_q3',
    text: 'What are your greatest strengths and weaknesses?',
    category: 'Self-Assessment',
    difficulty: 'medium',
    expectedDuration: 120,
    tips: [
      'Be honest but strategic',
      'Give examples for strengths',
      'Show how you are working on weaknesses',
    ],
  },
  {
    id: 'hr_q4',
    text: 'Where do you see yourself in 5 years?',
    category: 'Career Goals',
    difficulty: 'easy',
    expectedDuration: 90,
    tips: [
      'Show ambition but be realistic',
      'Align with company growth',
      'Focus on skill development',
    ],
  },
  {
    id: 'hr_q5',
    text: 'Describe a challenging situation you faced and how you handled it.',
    category: 'Problem Solving',
    difficulty: 'hard',
    expectedDuration: 150,
    tips: [
      'Use the STAR method',
      'Be specific about your actions',
      'Highlight the positive outcome',
    ],
  },
  {
    id: 'hr_q6',
    text: 'How do you handle pressure and tight deadlines?',
    category: 'Work Style',
    difficulty: 'medium',
    expectedDuration: 90,
    tips: [
      'Give real examples',
      'Mention prioritization techniques',
      'Show you stay calm under pressure',
    ],
  },
  {
    id: 'hr_q7',
    text: 'Why should we hire you over other candidates?',
    category: 'Value Proposition',
    difficulty: 'hard',
    expectedDuration: 120,
    tips: [
      'Summarize your unique skills',
      'Reference specific job requirements',
      'Show enthusiasm and confidence',
    ],
  },
  {
    id: 'hr_q8',
    text: 'Do you have any questions for us?',
    category: 'Closing',
    difficulty: 'easy',
    expectedDuration: 60,
    tips: [
      'Always have 2-3 questions ready',
      'Ask about team culture or growth',
      'Avoid questions about salary initially',
    ],
  },
];

// Technical Interview Questions
export const technicalQuestions: InterviewQuestion[] = [
  {
    id: 'tech_q1',
    text: 'Explain the difference between stack and queue data structures.',
    category: 'Data Structures',
    difficulty: 'easy',
    expectedDuration: 120,
    tips: [
      'Explain LIFO vs FIFO',
      'Give real-world examples',
      'Mention time complexity',
    ],
  },
  {
    id: 'tech_q2',
    text: 'What is the time complexity of binary search and why?',
    category: 'Algorithms',
    difficulty: 'easy',
    expectedDuration: 90,
    tips: [
      'Explain O(log n)',
      'Describe the divide and conquer approach',
      'Mention prerequisites (sorted array)',
    ],
  },
  {
    id: 'tech_q3',
    text: 'Explain the concept of object-oriented programming and its four pillars.',
    category: 'OOP',
    difficulty: 'medium',
    expectedDuration: 150,
    tips: [
      'Cover encapsulation, inheritance, polymorphism, abstraction',
      'Give examples for each',
      'Mention benefits',
    ],
  },
  {
    id: 'tech_q4',
    text: 'How would you design a URL shortening service like bit.ly?',
    category: 'System Design',
    difficulty: 'hard',
    expectedDuration: 180,
    tips: [
      'Start with requirements',
      'Discuss database schema',
      'Consider scalability',
    ],
  },
  {
    id: 'tech_q5',
    text: 'What is the difference between SQL and NoSQL databases? When would you use each?',
    category: 'Databases',
    difficulty: 'medium',
    expectedDuration: 120,
    tips: [
      'Explain relational vs document-based',
      'Discuss use cases',
      'Mention examples (MySQL, MongoDB)',
    ],
  },
  {
    id: 'tech_q6',
    text: 'Explain how garbage collection works in Java or JavaScript.',
    category: 'Programming Languages',
    difficulty: 'medium',
    expectedDuration: 120,
    tips: [
      'Explain automatic memory management',
      'Mention mark and sweep',
      'Discuss memory leaks',
    ],
  },
  {
    id: 'tech_q7',
    text: 'What is REST API and what are its key principles?',
    category: 'Web Development',
    difficulty: 'easy',
    expectedDuration: 90,
    tips: [
      'Explain statelessness',
      'Cover HTTP methods',
      'Mention JSON/XML',
    ],
  },
  {
    id: 'tech_q8',
    text: 'How would you optimize a slow database query?',
    category: 'Performance',
    difficulty: 'hard',
    expectedDuration: 150,
    tips: [
      'Mention indexing',
      'Discuss query analysis',
      'Cover caching strategies',
    ],
  },
];

// Behavioral Interview Questions
export const behavioralQuestions: InterviewQuestion[] = [
  {
    id: 'beh_q1',
    text: 'Tell me about a time when you had to work with a difficult team member.',
    category: 'Teamwork',
    difficulty: 'medium',
    expectedDuration: 150,
    tips: [
      'Use STAR method',
      'Focus on resolution',
      'Show empathy and professionalism',
    ],
  },
  {
    id: 'beh_q2',
    text: 'Describe a situation where you had to learn something new quickly.',
    category: 'Adaptability',
    difficulty: 'easy',
    expectedDuration: 120,
    tips: [
      'Show initiative',
      'Mention resources used',
      'Highlight the outcome',
    ],
  },
  {
    id: 'beh_q3',
    text: 'Give an example of when you took initiative beyond your responsibilities.',
    category: 'Leadership',
    difficulty: 'medium',
    expectedDuration: 120,
    tips: [
      'Show proactivity',
      'Explain your motivation',
      'Describe the impact',
    ],
  },
  {
    id: 'beh_q4',
    text: 'Tell me about a time you failed at something. What did you learn?',
    category: 'Growth Mindset',
    difficulty: 'hard',
    expectedDuration: 150,
    tips: [
      'Be honest about the failure',
      'Focus on lessons learned',
      'Show how you improved',
    ],
  },
  {
    id: 'beh_q5',
    text: 'Describe a situation where you had to meet a very tight deadline.',
    category: 'Time Management',
    difficulty: 'medium',
    expectedDuration: 120,
    tips: [
      'Explain prioritization',
      'Mention any help you sought',
      'Highlight successful completion',
    ],
  },
  {
    id: 'beh_q6',
    text: 'Tell me about a time when you received critical feedback. How did you respond?',
    category: 'Self-Improvement',
    difficulty: 'medium',
    expectedDuration: 120,
    tips: [
      'Show openness to feedback',
      'Describe your response',
      'Explain how you improved',
    ],
  },
  {
    id: 'beh_q7',
    text: 'Give an example of when you had to persuade others to accept your idea.',
    category: 'Influence',
    difficulty: 'hard',
    expectedDuration: 150,
    tips: [
      'Explain your approach',
      'Show respect for others views',
      'Highlight the outcome',
    ],
  },
  {
    id: 'beh_q8',
    text: 'Describe a time when you had to make a decision with incomplete information.',
    category: 'Decision Making',
    difficulty: 'hard',
    expectedDuration: 150,
    tips: [
      'Explain your thought process',
      'Mention risk assessment',
      'Describe the outcome',
    ],
  },
];

// Get questions by type
export const getQuestionsByType = (
  type: InterviewType,
  count: number = 5,
  difficulty?: DifficultyLevel,
): InterviewQuestion[] => {
  let questions: InterviewQuestion[];

  switch (type) {
    case 'hr':
      questions = [...hrQuestions];
      break;
    case 'technical':
      questions = [...technicalQuestions];
      break;
    case 'behavioral':
      questions = [...behavioralQuestions];
      break;
    default:
      questions = [...hrQuestions];
  }

  // Filter by difficulty if specified
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }

  // Shuffle and return requested count
  return questions.sort(() => Math.random() - 0.5).slice(0, count);
};

// Mock Interview Feedback Generator
export const generateMockFeedback = (
  questions: InterviewQuestion[],
  config: InterviewConfig,
): InterviewFeedback => {
  // Generate random scores between 60-95
  const baseScore = Math.floor(Math.random() * 20) + 70;

  const questionFeedback: QuestionFeedback[] = questions.map((q, index) => {
    const score = Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 20) - 10));

    return {
      questionId: q.id,
      score,
      strengths: getRandomStrengths(score),
      improvements: getRandomImprovements(score),
      detailedFeedback: getDetailedFeedback(q, score),
      keywordMatches: getKeywordMatches(q),
    };
  });

  const avgScore = Math.round(
    questionFeedback.reduce((sum, f) => sum + f.score, 0) / questionFeedback.length,
  );

  return {
    overallScore: avgScore,
    contentScore: Math.min(100, avgScore + Math.floor(Math.random() * 10) - 5),
    communicationScore: Math.min(100, avgScore + Math.floor(Math.random() * 10) - 5),
    confidenceScore: Math.min(100, avgScore + Math.floor(Math.random() * 15) - 7),
    relevanceScore: Math.min(100, avgScore + Math.floor(Math.random() * 10) - 5),
    summary: getOverallSummary(avgScore, config),
    strengths: getOverallStrengths(avgScore),
    areasToImprove: getOverallImprovements(avgScore),
    questionFeedback,
    xpEarned: calculateXPEarned(avgScore, config),
    badgeEarned: avgScore >= 90 ? 'high_scorer' : undefined,
  };
};

const getRandomStrengths = (score: number): string[] => {
  const allStrengths = [
    'Clear and structured response',
    'Good use of specific examples',
    'Confident delivery',
    'Appropriate pace and tone',
    'Relevant to the question',
    'Showed problem-solving skills',
    'Demonstrated technical knowledge',
    'Good communication skills',
    'Positive attitude',
    'Well-prepared answer',
  ];

  const count = score >= 80 ? 3 : score >= 70 ? 2 : 1;
  return allStrengths.sort(() => Math.random() - 0.5).slice(0, count);
};

const getRandomImprovements = (score: number): string[] => {
  const allImprovements = [
    'Could provide more specific examples',
    'Consider structuring response with STAR method',
    'Speak more slowly for clarity',
    'Add more technical depth',
    'Connect answer to company values',
    'Quantify achievements when possible',
    'Practice more concise responses',
    'Show more enthusiasm',
    'Research company more thoroughly',
    'Prepare more questions to ask',
  ];

  const count = score >= 80 ? 1 : score >= 70 ? 2 : 3;
  return allImprovements.sort(() => Math.random() - 0.5).slice(0, count);
};

const getDetailedFeedback = (question: InterviewQuestion, score: number): string => {
  if (score >= 85) {
    return `Excellent response to "${question.text.substring(0, 50)}...". Your answer was well-structured, showed deep understanding, and included relevant examples. The delivery was confident and professional.`;
  } else if (score >= 70) {
    return `Good response overall. You covered the main points effectively. To improve, consider adding more specific examples and structuring your answer using the STAR method for behavioral questions.`;
  } else {
    return `Your response addressed the question but could be improved. Focus on providing more concrete examples, being more specific about your experiences, and practicing a clearer structure.`;
  }
};

const getKeywordMatches = (question: InterviewQuestion): string[] => {
  const keywordsByCategory: Record<string, string[]> = {
    Introduction: ['experience', 'background', 'education', 'skills', 'passion'],
    Motivation: ['company', 'values', 'growth', 'opportunity', 'mission'],
    'Self-Assessment': ['strength', 'weakness', 'improvement', 'learning', 'feedback'],
    'Career Goals': ['growth', 'development', 'leadership', 'contribution', 'impact'],
    'Problem Solving': ['challenge', 'solution', 'approach', 'result', 'learning'],
    'Data Structures': ['stack', 'queue', 'array', 'linked list', 'tree'],
    Algorithms: ['complexity', 'optimization', 'efficiency', 'sorting', 'searching'],
    OOP: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'class'],
    Teamwork: ['collaboration', 'communication', 'conflict', 'resolution', 'team'],
  };

  const keywords = keywordsByCategory[question.category] || ['relevant', 'clear', 'example'];
  return keywords.slice(0, Math.floor(Math.random() * 3) + 2);
};

const getOverallSummary = (score: number, config: InterviewConfig): string => {
  if (score >= 85) {
    return `Outstanding performance in your ${config.type} interview for ${config.company}! You demonstrated excellent communication skills, deep knowledge, and professional confidence. You are well-prepared for real interviews.`;
  } else if (score >= 70) {
    return `Good performance in your ${config.type} interview for ${config.company}. You showed solid fundamentals with room for improvement. Focus on the suggested areas and continue practicing to boost your confidence.`;
  } else {
    return `Your ${config.type} interview practice for ${config.company} shows you understand the basics. With more practice and focus on the improvement areas, you can significantly enhance your interview performance.`;
  }
};

const getOverallStrengths = (score: number): string[] => {
  if (score >= 80) {
    return [
      'Strong communication and articulation',
      'Well-structured responses using STAR method',
      'Good technical knowledge demonstration',
      'Confident and professional demeanor',
    ];
  } else if (score >= 70) {
    return [
      'Clear understanding of questions',
      'Relevant examples provided',
      'Positive attitude throughout',
    ];
  } else {
    return [
      'Showed willingness to engage',
      'Basic understanding demonstrated',
    ];
  }
};

const getOverallImprovements = (score: number): string[] => {
  if (score >= 80) {
    return [
      'Continue practicing for consistency',
      'Add more quantifiable achievements',
    ];
  } else if (score >= 70) {
    return [
      'Practice more structured responses',
      'Prepare specific examples for common questions',
      'Work on delivery confidence',
    ];
  } else {
    return [
      'Spend more time preparing responses',
      'Practice speaking clearly and confidently',
      'Research companies thoroughly before interviews',
      'Use the STAR method for behavioral questions',
    ];
  }
};

const calculateXPEarned = (score: number, config: InterviewConfig): number => {
  let baseXP = 50;

  // Bonus for difficulty
  switch (config.difficulty) {
    case 'easy':
      baseXP += 10;
      break;
    case 'medium':
      baseXP += 25;
      break;
    case 'hard':
      baseXP += 50;
      break;
  }

  // Bonus for score
  if (score >= 90) baseXP += 50;
  else if (score >= 80) baseXP += 30;
  else if (score >= 70) baseXP += 15;

  return baseXP;
};

// Mock Interview History
export const mockInterviewHistory: InterviewHistoryItem[] = [
  {
    id: 'int_001',
    config: {
      type: 'hr',
      company: 'Google',
      difficulty: 'medium',
      totalQuestions: 5,
    },
    status: 'completed',
    score: 82,
    startedAt: '2024-02-20T10:00:00.000Z',
    completedAt: '2024-02-20T10:35:00.000Z',
    questionsAnswered: 5,
  },
  {
    id: 'int_002',
    config: {
      type: 'technical',
      company: 'Microsoft',
      difficulty: 'hard',
      totalQuestions: 5,
    },
    status: 'completed',
    score: 75,
    startedAt: '2024-02-18T14:00:00.000Z',
    completedAt: '2024-02-18T14:45:00.000Z',
    questionsAnswered: 5,
  },
  {
    id: 'int_003',
    config: {
      type: 'behavioral',
      company: 'Amazon',
      difficulty: 'medium',
      totalQuestions: 5,
    },
    status: 'completed',
    score: 88,
    startedAt: '2024-02-15T09:00:00.000Z',
    completedAt: '2024-02-15T09:40:00.000Z',
    questionsAnswered: 5,
  },
  {
    id: 'int_004',
    config: {
      type: 'hr',
      company: 'Flipkart',
      difficulty: 'easy',
      totalQuestions: 5,
    },
    status: 'completed',
    score: 91,
    startedAt: '2024-02-12T11:00:00.000Z',
    completedAt: '2024-02-12T11:30:00.000Z',
    questionsAnswered: 5,
  },
  {
    id: 'int_005',
    config: {
      type: 'technical',
      company: 'Razorpay',
      difficulty: 'medium',
      totalQuestions: 5,
    },
    status: 'completed',
    score: 78,
    startedAt: '2024-02-10T15:00:00.000Z',
    completedAt: '2024-02-10T15:50:00.000Z',
    questionsAnswered: 5,
  },
];

// ============================================================================
// LEARNING MODULES DATA
// ============================================================================

export interface Lesson {
  id: string;
  title: string;
  duration: number; // minutes
  type: 'video' | 'text' | 'quiz' | 'exercise';
  completed: boolean;
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'communication' | 'technical' | 'behavioral' | 'career';
  difficulty: DifficultyLevel;
  duration: number; // total minutes
  lessonsCount: number;
  completedLessons: number;
  isLocked: boolean;
  isPremium: boolean;
  xpReward: number;
  lessons: Lesson[];
  learningOutcomes: string[];
  prerequisites?: string[];
}

export const mockModules: Module[] = [
  {
    id: 'mod_001',
    title: 'Mastering Self Introduction',
    description: 'Learn to craft a compelling introduction that makes a lasting first impression. Cover the key elements that interviewers look for.',
    icon: 'account-voice',
    color: '#1a237e',
    category: 'communication',
    difficulty: 'easy',
    duration: 45,
    lessonsCount: 6,
    completedLessons: 4,
    isLocked: false,
    isPremium: false,
    xpReward: 100,
    learningOutcomes: [
      'Structure a compelling 2-minute introduction',
      'Highlight relevant skills and experiences',
      'Create multiple versions for different contexts',
      'Deliver with confidence and clarity',
    ],
    lessons: [
      {
        id: 'mod_001_l1',
        title: 'Why First Impressions Matter',
        duration: 5,
        type: 'video',
        completed: true,
        xpReward: 10,
      },
      {
        id: 'mod_001_l2',
        title: 'The Perfect Structure',
        duration: 8,
        type: 'text',
        completed: true,
        xpReward: 15,
      },
      {
        id: 'mod_001_l3',
        title: 'Crafting Your Story',
        duration: 10,
        type: 'exercise',
        completed: true,
        xpReward: 20,
      },
      {
        id: 'mod_001_l4',
        title: 'Common Mistakes to Avoid',
        duration: 7,
        type: 'video',
        completed: true,
        xpReward: 15,
      },
      {
        id: 'mod_001_l5',
        title: 'Practice Session',
        duration: 10,
        type: 'exercise',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'mod_001_l6',
        title: 'Final Quiz',
        duration: 5,
        type: 'quiz',
        completed: false,
        xpReward: 15,
      },
    ],
  },
  {
    id: 'mod_002',
    title: 'STAR Method Mastery',
    description: 'Master the Situation-Task-Action-Result framework to structure behavioral answers that impress interviewers.',
    icon: 'star-four-points',
    color: '#ff6f00',
    category: 'behavioral',
    difficulty: 'medium',
    duration: 60,
    lessonsCount: 8,
    completedLessons: 8,
    isLocked: false,
    isPremium: false,
    xpReward: 150,
    learningOutcomes: [
      'Understand and apply the STAR framework',
      'Prepare stories for common behavioral questions',
      'Quantify your achievements effectively',
      'Adapt stories for different question types',
    ],
    lessons: [
      {
        id: 'mod_002_l1',
        title: 'Introduction to STAR',
        duration: 6,
        type: 'video',
        completed: true,
        xpReward: 10,
      },
      {
        id: 'mod_002_l2',
        title: 'Setting the Situation',
        duration: 8,
        type: 'text',
        completed: true,
        xpReward: 15,
      },
      {
        id: 'mod_002_l3',
        title: 'Defining the Task',
        duration: 7,
        type: 'text',
        completed: true,
        xpReward: 15,
      },
      {
        id: 'mod_002_l4',
        title: 'Describing Your Action',
        duration: 10,
        type: 'video',
        completed: true,
        xpReward: 20,
      },
      {
        id: 'mod_002_l5',
        title: 'Highlighting Results',
        duration: 8,
        type: 'text',
        completed: true,
        xpReward: 15,
      },
      {
        id: 'mod_002_l6',
        title: 'Real Examples Analysis',
        duration: 10,
        type: 'video',
        completed: true,
        xpReward: 20,
      },
      {
        id: 'mod_002_l7',
        title: 'Build Your Story Bank',
        duration: 8,
        type: 'exercise',
        completed: true,
        xpReward: 25,
      },
      {
        id: 'mod_002_l8',
        title: 'Mastery Quiz',
        duration: 3,
        type: 'quiz',
        completed: true,
        xpReward: 30,
      },
    ],
  },
  {
    id: 'mod_003',
    title: 'Technical Interview Basics',
    description: 'Build a strong foundation for technical interviews with problem-solving strategies and coding best practices.',
    icon: 'code-braces',
    color: '#388e3c',
    category: 'technical',
    difficulty: 'medium',
    duration: 90,
    lessonsCount: 10,
    completedLessons: 3,
    isLocked: false,
    isPremium: false,
    xpReward: 200,
    learningOutcomes: [
      'Approach technical problems systematically',
      'Communicate your thought process clearly',
      'Handle edge cases and optimize solutions',
      'Manage time effectively during coding rounds',
    ],
    lessons: [
      {
        id: 'mod_003_l1',
        title: 'Technical Interview Overview',
        duration: 8,
        type: 'video',
        completed: true,
        xpReward: 15,
      },
      {
        id: 'mod_003_l2',
        title: 'Problem-Solving Framework',
        duration: 12,
        type: 'text',
        completed: true,
        xpReward: 20,
      },
      {
        id: 'mod_003_l3',
        title: 'Thinking Aloud',
        duration: 10,
        type: 'video',
        completed: true,
        xpReward: 20,
      },
      {
        id: 'mod_003_l4',
        title: 'Data Structures Review',
        duration: 15,
        type: 'text',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'mod_003_l5',
        title: 'Algorithm Patterns',
        duration: 12,
        type: 'video',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'mod_003_l6',
        title: 'Time & Space Complexity',
        duration: 10,
        type: 'text',
        completed: false,
        xpReward: 20,
      },
      {
        id: 'mod_003_l7',
        title: 'Code Quality Matters',
        duration: 8,
        type: 'video',
        completed: false,
        xpReward: 15,
      },
      {
        id: 'mod_003_l8',
        title: 'Handling Edge Cases',
        duration: 7,
        type: 'text',
        completed: false,
        xpReward: 15,
      },
      {
        id: 'mod_003_l9',
        title: 'Mock Problem Session',
        duration: 5,
        type: 'exercise',
        completed: false,
        xpReward: 30,
      },
      {
        id: 'mod_003_l10',
        title: 'Knowledge Check',
        duration: 3,
        type: 'quiz',
        completed: false,
        xpReward: 15,
      },
    ],
  },
  {
    id: 'mod_004',
    title: 'Body Language & Confidence',
    description: 'Project confidence through non-verbal communication. Learn to make eye contact, gesture appropriately, and manage nervousness.',
    icon: 'human-greeting',
    color: '#9c27b0',
    category: 'communication',
    difficulty: 'easy',
    duration: 40,
    lessonsCount: 6,
    completedLessons: 0,
    isLocked: false,
    isPremium: false,
    xpReward: 100,
    learningOutcomes: [
      'Understand the impact of body language',
      'Project confidence even when nervous',
      'Use appropriate gestures and posture',
      'Maintain engaging eye contact',
    ],
    lessons: [
      {
        id: 'mod_004_l1',
        title: 'The Power of Non-Verbal Cues',
        duration: 7,
        type: 'video',
        completed: false,
        xpReward: 15,
      },
      {
        id: 'mod_004_l2',
        title: 'Posture & Positioning',
        duration: 8,
        type: 'text',
        completed: false,
        xpReward: 15,
      },
      {
        id: 'mod_004_l3',
        title: 'Eye Contact Techniques',
        duration: 6,
        type: 'video',
        completed: false,
        xpReward: 15,
      },
      {
        id: 'mod_004_l4',
        title: 'Managing Nervousness',
        duration: 10,
        type: 'text',
        completed: false,
        xpReward: 20,
      },
      {
        id: 'mod_004_l5',
        title: 'Video Self-Analysis',
        duration: 6,
        type: 'exercise',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'mod_004_l6',
        title: 'Quick Quiz',
        duration: 3,
        type: 'quiz',
        completed: false,
        xpReward: 10,
      },
    ],
  },
  {
    id: 'mod_005',
    title: 'Salary Negotiation',
    description: 'Learn strategies to negotiate your compensation package confidently. Understand market rates, timing, and negotiation tactics.',
    icon: 'cash-multiple',
    color: '#d32f2f',
    category: 'career',
    difficulty: 'hard',
    duration: 50,
    lessonsCount: 7,
    completedLessons: 0,
    isLocked: false,
    isPremium: true,
    xpReward: 175,
    learningOutcomes: [
      'Research and understand market compensation',
      'Time your negotiation conversation',
      'Present your case with data',
      'Handle counter-offers professionally',
    ],
    prerequisites: ['mod_001', 'mod_002'],
    lessons: [
      {
        id: 'mod_005_l1',
        title: 'Know Your Worth',
        duration: 8,
        type: 'video',
        completed: false,
        xpReward: 20,
      },
      {
        id: 'mod_005_l2',
        title: 'Researching Market Rates',
        duration: 10,
        type: 'text',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'mod_005_l3',
        title: 'Timing Your Ask',
        duration: 6,
        type: 'video',
        completed: false,
        xpReward: 20,
      },
      {
        id: 'mod_005_l4',
        title: 'The Negotiation Conversation',
        duration: 10,
        type: 'text',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'mod_005_l5',
        title: 'Handling Objections',
        duration: 8,
        type: 'video',
        completed: false,
        xpReward: 25,
      },
      {
        id: 'mod_005_l6',
        title: 'Beyond Base Salary',
        duration: 5,
        type: 'text',
        completed: false,
        xpReward: 20,
      },
      {
        id: 'mod_005_l7',
        title: 'Role-Play Exercise',
        duration: 3,
        type: 'exercise',
        completed: false,
        xpReward: 40,
      },
    ],
  },
];

// Get module by ID
export const getModuleById = (id: string): Module | undefined => {
  return mockModules.find(m => m.id === id);
};

// ============================================================================
// ACHIEVEMENT DATA
// ============================================================================

export const allAchievements: Achievement[] = [
  {
    id: 'ach_first_interview',
    name: 'First Steps',
    description: 'Complete your first mock interview',
    icon: 'microphone',
  },
  {
    id: 'ach_streak_7',
    name: '7-Day Streak',
    description: 'Practice for 7 consecutive days',
    icon: 'fire',
  },
  {
    id: 'ach_streak_30',
    name: 'Monthly Dedication',
    description: 'Maintain a 30-day streak',
    icon: 'calendar-check',
  },
  {
    id: 'ach_quick_learner',
    name: 'Quick Learner',
    description: 'Complete 5 modules in a week',
    icon: 'lightning-bolt',
  },
  {
    id: 'ach_perfect_score',
    name: 'Perfect Score',
    description: 'Score 100% on any interview',
    icon: 'star',
  },
  {
    id: 'ach_10_interviews',
    name: 'Interview Veteran',
    description: 'Complete 10 mock interviews',
    icon: 'trophy',
  },
  {
    id: 'ach_all_types',
    name: 'Well-Rounded',
    description: 'Complete interviews in all categories',
    icon: 'check-circle',
  },
  {
    id: 'ach_module_master',
    name: 'Module Master',
    description: 'Complete all learning modules',
    icon: 'school',
  },
];

// ============================================================================
// NOTIFICATION DATA
// ============================================================================

export interface NotificationItem {
  id: string;
  type: 'reminder' | 'achievement' | 'tip' | 'update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_001',
    type: 'reminder',
    title: 'Daily Practice Reminder',
    message: 'Keep your 7-day streak alive! Complete a quick interview today.',
    timestamp: new Date().toISOString(),
    read: false,
    actionUrl: 'prabhav://interview',
  },
  {
    id: 'notif_002',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'Congratulations! You earned the "7-Day Streak" badge.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: false,
  },
  {
    id: 'notif_003',
    type: 'tip',
    title: 'Pro Tip',
    message: 'Use the STAR method for behavioral questions to structure your answers effectively.',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: true,
  },
  {
    id: 'notif_004',
    type: 'update',
    title: 'New Module Available',
    message: 'Check out our new module on "System Design Interviews"!',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    read: true,
    actionUrl: 'prabhav://learn',
  },
];
