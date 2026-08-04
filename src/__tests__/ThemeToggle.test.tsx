import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

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

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders a toggle offering dark mode in light mode', () => {
    renderToggle();
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('switches label and pressed state when clicked', () => {
    renderToggle();
    fireEvent.click(screen.getByLabelText('Switch to dark mode'));
    const button = screen.getByLabelText('Switch to light mode');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('persists the selected theme', () => {
    renderToggle();
    fireEvent.click(screen.getByLabelText('Switch to dark mode'));
    expect(localStorageMock.getItem('onboarding-demo-theme')).toBe('dark');
  });

  it('starts in dark mode when dark is persisted', () => {
    localStorageMock.setItem('onboarding-demo-theme', 'dark');
    renderToggle();
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
