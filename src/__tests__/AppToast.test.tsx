import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { CartProvider } from '../context/CartContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

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

function CartToastTrigger() {
  const { showToast } = useCart();
  return <button onClick={() => showToast('Cart toast')}>Trigger Cart Toast</button>;
}

function AuthToastTrigger() {
  const { showToast } = useAuth();
  return <button onClick={() => showToast('Auth toast')}>Trigger Auth Toast</button>;
}

describe('App Toast Integration', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows and clears cart toast', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <CartToastTrigger />
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Trigger Cart Toast'));
    expect(screen.getByText('Cart toast')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close notification'));
    expect(screen.queryByText('Cart toast')).not.toBeInTheDocument();
  });

  it('shows and clears auth toast', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <AuthToastTrigger />
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Trigger Auth Toast'));
    expect(screen.getByText('Auth toast')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close notification'));
    expect(screen.queryByText('Auth toast')).not.toBeInTheDocument();
  });

  it('auto-dismisses toast after timeout', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <CartToastTrigger />
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Trigger Cart Toast'));
    expect(screen.getByText('Cart toast')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.queryByText('Cart toast')).not.toBeInTheDocument();
  });
});
