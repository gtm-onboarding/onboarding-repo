export const lightTheme = {
  colors: {
    background: '#FAF9F7',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F3F0',
    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textMuted: '#9A9A9A',
    primary: '#E07A5F',
    primaryHover: '#C96A52',
    success: '#4A7C59',
    error: '#C44536',
    border: '#E8E6E3',
    borderLight: '#F0EEEB',
    accentSurface: '#FEF6F4',
    errorSurface: '#FEF2F2',
    successSurface: '#E8F5E9',
    textInverse: '#FFFFFF',
  },
  fonts: {
    display: '"Playfair Display", Georgia, serif',
    body: '"DM Sans", -apple-system, sans-serif',
  },
  shadows: {
    sm: '0 1px 3px rgba(26, 26, 26, 0.04)',
    md: '0 4px 12px rgba(26, 26, 26, 0.06)',
    lg: '0 8px 24px rgba(26, 26, 26, 0.08)',
    xl: '0 16px 48px rgba(26, 26, 26, 0.1)',
  },
  radii: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#171614',
    surface: '#242220',
    surfaceAlt: '#302D29',
    text: '#F5F3F0',
    textSecondary: '#C5C0B9',
    textMuted: '#938D85',
    primary: '#F09A7D',
    primaryHover: '#F5B098',
    success: '#7FB08D',
    error: '#E08A7D',
    border: '#49443E',
    borderLight: '#3B3732',
    accentSurface: '#432C25',
    errorSurface: '#422422',
    successSurface: '#253A2A',
    textInverse: '#171614',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.2)',
    md: '0 4px 12px rgba(0, 0, 0, 0.25)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.3)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.35)',
  },
};

export const theme = lightTheme;

export type Theme = typeof lightTheme;
