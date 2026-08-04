import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { palettes } from '../theme';
import indexHtml from '../../index.html?raw';

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

function mockPrefersDark(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

function ModeLabel() {
  const { mode } = useTheme();
  return <span data-testid="mode">{mode}</span>;
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ModeLabel />
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    mockPrefersDark(false);
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('style');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('style');
  });

  it('defaults to light mode when nothing is stored and the OS prefers light', () => {
    renderWithProvider();
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('follows the OS preference on first visit', () => {
    mockPrefersDark(true);
    renderWithProvider();
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('restores a stored preference over the OS preference', () => {
    localStorageMock.setItem('onboarding-demo-theme', 'dark');
    mockPrefersDark(false);
    renderWithProvider();
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('ignores an invalid stored value', () => {
    localStorageMock.setItem('onboarding-demo-theme', 'neon');
    renderWithProvider();
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('applies palette values as CSS variables on the document root', () => {
    renderWithProvider();
    expect(document.documentElement.style.getPropertyValue('--color-background')).toBe(
      palettes.light.background
    );
    expect(document.documentElement.style.getPropertyValue('--color-text-secondary')).toBe(
      palettes.light.textSecondary
    );
  });

  it('toggles the mode, swaps the palette and persists the choice', () => {
    renderWithProvider();
    act(() => {
      screen.getByRole('button', { name: 'Switch to dark mode' }).click();
    });

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--color-background')).toBe(
      palettes.dark.background
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith('onboarding-demo-theme', 'dark');

    act(() => {
      screen.getByRole('button', { name: 'Switch to light mode' }).click();
    });
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('onboarding-demo-theme', 'light');
  });

  it('exposes toggle state to assistive technology', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('throws when useTheme is used outside a provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ModeLabel />)).toThrow('useTheme must be used within a ThemeProvider');
    consoleError.mockRestore();
  });

  it('defines the same color keys for both palettes', () => {
    expect(Object.keys(palettes.dark).sort()).toEqual(Object.keys(palettes.light).sort());
  });

  it('keeps the pre-paint script in index.html in sync with the dark palette', () => {
    const declared = Object.fromEntries(
      [...indexHtml.matchAll(/'(--color-[a-z-]+)':\s*'([^']+)'/g)].map(([, name, value]) => [
        name,
        value,
      ])
    );
    const expected = Object.fromEntries(
      Object.entries(palettes.dark).map(([key, value]) => [
        `--color-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
        value,
      ])
    );
    expect(declared).toEqual(expected);
  });
});
