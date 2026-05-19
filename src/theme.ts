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
  shadow: string;
  buttonBg: string;
  buttonText: string;
  inputBg: string;
  toastSuccessBg: string;
  toastErrorBg: string;
}

export const lightTheme: ThemeColors = {
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
  shadow: 'rgba(26, 26, 26, 0.06)',
  buttonBg: '#1A1A1A',
  buttonText: '#FFFFFF',
  inputBg: '#FFFFFF',
  toastSuccessBg: '#E8F5E9',
  toastErrorBg: '#FEF2F2',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#2A2A2A',
  text: '#E8E6E3',
  textSecondary: '#A0A0A0',
  textMuted: '#6B6B6B',
  primary: '#E07A5F',
  primaryHover: '#C96A52',
  success: '#66BB6A',
  error: '#EF5350',
  border: '#333333',
  borderLight: '#2A2A2A',
  shadow: 'rgba(0, 0, 0, 0.3)',
  buttonBg: '#E8E6E3',
  buttonText: '#121212',
  inputBg: '#2A2A2A',
  toastSuccessBg: '#1B3A1B',
  toastErrorBg: '#3A1B1B',
};

export const theme = {
  colors: lightTheme,
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
