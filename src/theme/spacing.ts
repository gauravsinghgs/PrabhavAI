/**
 * Centralized Spacing System for Prabhav AI
 * Consistent spacing throughout the app
 */

export const spacing = {
  /** 4px - Extra small spacing */
  xs: 4,
  /** 8px - Small spacing */
  sm: 8,
  /** 12px - Medium-small spacing */
  ms: 12,
  /** 16px - Medium spacing */
  md: 16,
  /** 20px - Medium-large spacing */
  ml: 20,
  /** 24px - Large spacing */
  lg: 24,
  /** 32px - Extra large spacing */
  xl: 32,
  /** 40px - 2X Extra large spacing */
  xxl: 40,
  /** 48px - 3X Extra large spacing */
  xxxl: 48,
} as const;

/**
 * Border radius values
 */
export const borderRadius = {
  /** 4px - Small radius */
  sm: 4,
  /** 8px - Medium radius */
  md: 8,
  /** 12px - Large radius */
  lg: 12,
  /** 16px - Extra large radius */
  xl: 16,
  /** 24px - 2X Extra large radius */
  xxl: 24,
  /** Fully rounded */
  full: 9999,
} as const;

/**
 * Common shadow styles
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

/**
 * Typography sizes
 */
export const typography = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  h3: 24,
  h2: 28,
  h1: 32,
  display: 40,
} as const;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;
export type TypographyKey = keyof typeof typography;

export default spacing;
