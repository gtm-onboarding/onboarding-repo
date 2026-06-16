import { theme } from '../theme';

/**
 * Theme utility functions for common style patterns
 */

/**
 * Create a CSS style object for borders
 */
export const border = (
  width: string = '1px',
  color: string = theme.colors.border,
  style: string = 'solid'
) => ({
  borderWidth: width,
  borderColor: color,
  borderStyle: style,
});

/**
 * Create a CSS style object for flexbox centering
 */
export const flexCenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * Create a CSS style object for flexbox with space between
 */
export const flexSpaceBetween = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

/**
 * Create a CSS style object for flex column
 */
export const flexColumn = {
  display: 'flex',
  flexDirection: 'column' as const,
};

/**
 * Create spacing style object
 */
export const spacing = (property: 'padding' | 'margin', value: keyof typeof theme.spacing) => ({
  [property]: theme.spacing[value],
});

/**
 * Create responsive font size style
 */
export const fontSize = (size: keyof typeof theme.fontSizes) => ({
  fontSize: theme.fontSizes[size],
});

/**
 * Create font weight style
 */
export const fontWeight = (weight: keyof typeof theme.fontWeights) => ({
  fontWeight: theme.fontWeights[weight],
});

/**
 * Create text color style
 */
export const textColor = (color: keyof typeof theme.colors) => ({
  color: theme.colors[color],
});

/**
 * Create background color style
 */
export const backgroundColor = (color: keyof typeof theme.colors) => ({
  backgroundColor: theme.colors[color],
});

/**
 * Create border radius style
 */
export const borderRadius = (radius: keyof typeof theme.radii) => ({
  borderRadius: theme.radii[radius],
});

/**
 * Create shadow style
 */
export const shadow = (size: keyof typeof theme.shadows) => ({
  boxShadow: theme.shadows[size],
});

/**
 * Create z-index style
 */
export const zIndex = (index: keyof typeof theme.zIndex) => ({
  zIndex: theme.zIndex[index],
});

/**
 * Create transition style
 */
export const transition = (duration: keyof typeof theme.transitions, property: string = 'all') => ({
  transition: `${property} ${theme.transitions[duration]}`,
});

/**
 * Create typography style combining font family, size, weight, and color
 */
export const typography = (
  fontFamily: keyof typeof theme.fonts = 'body',
  fontSize: keyof typeof theme.fontSizes = 'base',
  fontWeight: keyof typeof theme.fontWeights = 'normal',
  color: keyof typeof theme.colors = 'text'
) => ({
  fontFamily: theme.fonts[fontFamily],
  fontSize: theme.fontSizes[fontSize],
  fontWeight: theme.fontWeights[fontWeight],
  color: theme.colors[color],
});

/**
 * Create responsive breakpoint helper (for future use with media queries)
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

/**
 * Media query helper for responsive styles
 */
export const mediaQuery = (breakpoint: keyof typeof breakpoints) => 
  `@media (min-width: ${breakpoints[breakpoint]})`;