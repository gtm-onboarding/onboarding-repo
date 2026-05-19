export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  primaryBg: string;
  success: string;
  successBg: string;
  error: string;
  errorBg: string;
  border: string;
  borderLight: string;
  overlay: string;
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

const shared = {
  fonts: {
    display: '"Playfair Display", Georgia, serif',
    body: '"DM Sans", -apple-system, sans-serif',
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
  colors: {
    background: '#FAF9F7',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F3F0',
    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textMuted: '#9A9A9A',
    primary: '#E07A5F',
    primaryHover: '#C96A52',
    primaryBg: '#FEF6F4',
    success: '#4A7C59',
    successBg: '#E8F5E9',
    error: '#C44536',
    errorBg: '#FEF2F2',
    border: '#E8E6E3',
    borderLight: '#F0EEEB',
    overlay: 'rgba(26, 26, 26, 0.4)',
  },
  shadows: {
    sm: '0 1px 3px rgba(26, 26, 26, 0.04)',
    md: '0 4px 12px rgba(26, 26, 26, 0.06)',
    lg: '0 8px 24px rgba(26, 26, 26, 0.08)',
    xl: '0 16px 48px rgba(26, 26, 26, 0.1)',
  },
  ...shared,
};

export const darkTheme: Theme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceAlt: '#2A2A2A',
    text: '#F0F0F0',
    textSecondary: '#A0A0A0',
    textMuted: '#707070',
    primary: '#E07A5F',
    primaryHover: '#C96A52',
    primaryBg: 'rgba(224, 122, 95, 0.15)',
    success: '#5A9C69',
    successBg: 'rgba(90, 156, 105, 0.15)',
    error: '#E05545',
    errorBg: 'rgba(224, 85, 69, 0.15)',
    border: '#333333',
    borderLight: '#2A2A2A',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.2)',
    md: '0 4px 12px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.4)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.5)',
  },
  ...shared,
};
