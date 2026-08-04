import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const listeners = new Set<(event: MediaQueryListEvent) => void>();
let systemPrefersDark = false;

function mockMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => ({
      matches: systemPrefersDark,
      addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
      removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
    })),
  });
}

function emitSystemChange(matches: boolean) {
  systemPrefersDark = matches;
  act(() => {
    listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
  });
}

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} data-testid="probe">
      {theme}
    </button>
  );
}

function renderProbe() {
  return render(
    <ThemeProvider>
      <ThemeProbe />
    </ThemeProvider>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    listeners.clear();
    systemPrefersDark = false;
    mockMatchMedia();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it('defaults to light when nothing is stored and the system prefers light', () => {
    renderProbe();
    expect(screen.getByTestId('probe')).toHaveTextContent('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('defaults to dark when the system prefers dark', () => {
    systemPrefersDark = true;
    renderProbe();
    expect(screen.getByTestId('probe')).toHaveTextContent('dark');
  });

  it('restores a stored preference over the system preference', () => {
    systemPrefersDark = true;
    localStorage.setItem('onboarding-demo-theme', 'light');
    renderProbe();
    expect(screen.getByTestId('probe')).toHaveTextContent('light');
  });

  it('discards an invalid stored preference', () => {
    localStorage.setItem('onboarding-demo-theme', 'neon');
    renderProbe();
    expect(screen.getByTestId('probe')).toHaveTextContent('light');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('onboarding-demo-theme');
  });

  it('toggles the theme, persists it and syncs the document attribute', () => {
    renderProbe();
    act(() => {
      screen.getByTestId('probe').click();
    });
    expect(screen.getByTestId('probe')).toHaveTextContent('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('onboarding-demo-theme')).toBe('dark');
  });

  it('ignores system changes once the user has chosen a theme', () => {
    renderProbe();
    act(() => {
      screen.getByTestId('probe').click();
    });
    emitSystemChange(false);
    expect(screen.getByTestId('probe')).toHaveTextContent('dark');
  });
});
