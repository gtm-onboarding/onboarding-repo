import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { darkTheme, lightTheme, Theme } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'onboarding-demo-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  });

  const activeTheme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    Object.entries(activeTheme.colors).forEach(([name, value]) => {
      document.documentElement.style.setProperty(`--color-${name}`, value);
    });
    Object.entries(activeTheme.shadows).forEach(([name, value]) => {
      document.documentElement.style.setProperty(`--shadow-${name}`, value);
    });
  }, [activeTheme, mode]);

  const toggleTheme = () => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
