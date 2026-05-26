import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';

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

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => null,
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Form Validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('sign in shows error for missing fields', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <SignInPage />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('sign up shows error for missing fields', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <SignUpPage />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('sign in accepts any format (no client-side email validation)', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <SignInPage />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'asdf' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });
});
