import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignInPage } from '../pages/SignInPage';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import React from 'react';

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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: (props: Record<string, unknown>) => {
    const onSuccess = props.onSuccess as (resp: { credential?: string }) => void;
    const onError = props.onError as () => void;
    return React.createElement('div', null,
      React.createElement('button', {
        type: 'button',
        onClick: () => {
          const payload = btoa(JSON.stringify({ email: 'google@test.com', name: 'Google User' }));
          onSuccess({ credential: `header.${payload}.sig` });
        },
      }, 'Google Sign In'),
      React.createElement('button', {
        type: 'button',
        onClick: () => onSuccess({}),
      }, 'Google No Credential'),
      React.createElement('button', {
        type: 'button',
        onClick: () => {
          const payload = btoa(JSON.stringify({ name: 'NoEmail' }));
          onSuccess({ credential: `header.${payload}.sig` });
        },
      }, 'Google Bad Payload'),
      React.createElement('button', {
        type: 'button',
        onClick: () => onError(),
      }, 'Google Error'),
    );
  },
  GoogleOAuthProvider: (props: { children: React.ReactNode }) => React.createElement(React.Fragment, null, props.children),
}));

function renderSignInPage(initialEntries: string[] = ['/signin']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <CartProvider>
          <SignInPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

function signUpUser() {
  localStorageMock.setItem('onboarding-demo-users', JSON.stringify([
    { email: 'user@test.com', password: 'password123', name: 'Test User' },
  ]));
}

describe('SignInPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders sign in form', () => {
    renderSignInPage();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue shopping')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('shows error for missing fields', () => {
    renderSignInPage();
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('shows error for invalid credentials', () => {
    renderSignInPage();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });

  it('signs in successfully and redirects to home', () => {
    signUpUser();
    renderSignInPage();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('redirects to specified path after sign in', () => {
    signUpUser();
    renderSignInPage(['/signin?redirect=/checkout']);
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('signs in with Google successfully', () => {
    renderSignInPage();
    fireEvent.click(screen.getByText('Google Sign In'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles Google sign in with no credential', () => {
    renderSignInPage();
    fireEvent.click(screen.getByText('Google No Credential'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles Google sign in error', async () => {
    renderSignInPage();
    fireEvent.click(screen.getByText('Google Error'));
    await waitFor(() => {
      expect(screen.getByText('Google sign-in failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles Google sign in with credential but signInWithGoogle returns false', async () => {
    renderSignInPage();
    fireEvent.click(screen.getByText('Google Bad Payload'));
    await waitFor(() => {
      expect(screen.getByText('Google sign-in failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('has link to sign up page', () => {
    renderSignInPage();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('clears error on new submit attempt', () => {
    renderSignInPage();
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.queryByText('Please fill in all fields')).not.toBeInTheDocument();
  });
});
