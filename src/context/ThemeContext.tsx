import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, lightTheme, darkTheme } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem('theme-mode');
  if (stored === 'light' || stored === 'dark') return stored;
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    const root = document.documentElement;
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-selection', `rgba(224, 122, 95, 0.2)`);
  }, [mode, theme]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
