import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, palettes } from '../theme';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'onboarding-demo-theme';

function toCssVariable(key: string): string {
  return `--color-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

function readStoredMode(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function prefersDark(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

function getInitialMode(): ThemeMode {
  return readStoredMode() ?? (prefersDark() ? 'dark' : 'light');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(palettes[mode]).forEach(([key, value]) => {
      root.style.setProperty(toCssVariable(key), value);
    });
    root.setAttribute('data-theme', mode);
    root.style.colorScheme = mode;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* storage unavailable (private mode, quota) — theme still applies for this session */
    }
  }, [mode]);

  const toggleTheme = () => setMode((current) => (current === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
