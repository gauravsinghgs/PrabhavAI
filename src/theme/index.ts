/**
 * Theme Index
 * Central export for all theme-related constants
 */

export {colors, darkColors} from './colors';
export type {ColorKey} from './colors';

export {spacing, borderRadius, shadows, typography} from './spacing';
export type {SpacingKey, BorderRadiusKey, ShadowKey, TypographyKey} from './spacing';

// Re-export defaults
import colors from './colors';
import spacing from './spacing';

export default {
  colors,
  spacing,
};
