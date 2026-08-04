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

function TestComponent() {
  const { mode, theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="background">{theme.colors.background}</span>
      <button onClick={toggleTheme}>Toggle theme</button>
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
  });

  it('starts in light mode', () => {
    renderWithProvider();
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('toggles between light and dark themes', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle theme'));
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('background')).toHaveTextContent('#171614');
  });

  it('persists and restores the selected theme', () => {
    const firstRender = renderWithProvider();
    fireEvent.click(screen.getByText('Toggle theme'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('onboarding-demo-theme', 'dark');

    firstRender.unmount();
    renderWithProvider();
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });
});
