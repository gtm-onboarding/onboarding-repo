import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeName } from '../theme';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'onboarding-demo-theme';
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

function isThemeName(value: unknown): value is ThemeName {
  return value === 'light' || value === 'dark';
}

function darkMediaQuery(): MediaQueryList | null {
  return typeof window.matchMedia === 'function' ? window.matchMedia(DARK_MEDIA_QUERY) : null;
}

function readStoredTheme(): ThemeName | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeName(stored)) {
    return stored;
  }
  if (stored !== null) {
    localStorage.removeItem(THEME_STORAGE_KEY);
  }
  return null;
}

function resolveInitialTheme(): ThemeName {
  return readStoredTheme() ?? (darkMediaQuery()?.matches ? 'dark' : 'light');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const query = darkMediaQuery();
    if (!query) return;
    const handleChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme() === null) {
        setThemeState(event.matches ? 'dark' : 'light');
      }
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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
