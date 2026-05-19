export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  success: string;
  error: string;
  border: string;
  borderLight: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: {
    display: string;
    body: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

const lightColors: ThemeColors = {
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
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#2A2A2A',
  text: '#E8E6E3',
  textSecondary: '#A0A0A0',
  textMuted: '#707070',
  primary: '#E07A5F',
  primaryHover: '#C96A52',
  success: '#6BBF7B',
  error: '#E57373',
  border: '#333333',
  borderLight: '#2A2A2A',
};

const shared = {
  fonts: {
    display: '"Playfair Display", Georgia, serif',
    body: '"DM Sans", -apple-system, sans-serif',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.25)',
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

export const lightTheme: Theme = {
  colors: lightColors,
  ...shared,
};

export const darkTheme: Theme = {
  colors: darkColors,
  ...shared,
};

export const theme = lightTheme;
