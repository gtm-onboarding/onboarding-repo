import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const THEME_STORAGE_KEY = 'onboarding-demo-theme';

function TestComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to light theme', () => {
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('toggles between light and dark', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('sets theme explicitly', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Set Dark'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('applies data-theme attribute to the root element', () => {
    renderWithProvider();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    fireEvent.click(screen.getByText('Set Dark'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('persists theme to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
  });

  it('restores persisted theme on mount', () => {
    localStorageMock.setItem(THEME_STORAGE_KEY, 'dark');
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('ignores and clears an invalid persisted theme', () => {
    localStorageMock.setItem(THEME_STORAGE_KEY, 'not-a-theme');
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it('throws when useTheme is used outside a provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');
    consoleError.mockRestore();
  });
});
