/**
 * Centralized Color Palette for Prabhav AI
 * Single source of truth for all colors in the app
 */

export const colors = {
  // Primary brand colors
  primary: '#1a237e',
  primaryLight: '#534bae',
  primaryDark: '#000051',

  // Secondary/Accent colors
  secondary: '#ff6f00',
  secondaryLight: '#ffa040',
  secondaryDark: '#c43e00',

  // Tertiary/Premium colors
  tertiary: '#9c27b0',
  tertiaryLight: '#d05ce3',
  tertiaryDark: '#6a0080',

  // Success/Error/Warning
  success: '#4CAF50',
  successLight: '#81C784',
  successDark: '#388E3C',

  error: '#F44336',
  errorLight: '#E57373',
  errorDark: '#D32F2F',

  warning: '#FF9800',
  warningLight: '#FFB74D',
  warningDark: '#F57C00',

  info: '#2196F3',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',

  // Neutral/Grayscale
  white: '#FFFFFF',
  black: '#000000',

  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Surface colors
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceVariant: '#E8EAF6',

  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#9E9E9E',
  textInverse: '#FFFFFF',

  // Specific UI elements
  streak: '#FF6B35',
  xp: '#FFD700',
  premium: '#9c27b0',

  // Interview types
  hrInterview: '#1a237e',
  technicalInterview: '#388E3C',
  behavioralInterview: '#FF6F00',

  // Difficulty levels
  difficultyEasy: '#4CAF50',
  difficultyMedium: '#FF9800',
  difficultyHard: '#F44336',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

/**
 * Dark theme color overrides
 */
export const darkColors = {
  ...colors,
  primary: '#534bae',
  secondary: '#ffab40',
  tertiary: '#ce93d8',

  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2D2D2D',

  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#666666',
  textInverse: '#212121',
} as const;

export type ColorKey = keyof typeof colors;

export default colors;
