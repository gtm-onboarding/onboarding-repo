import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUpPage } from '../pages/SignUpPage';
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
      }, 'Google Sign Up'),
      React.createElement('button', {
        type: 'button',
        onClick: () => {
          const payload = btoa(JSON.stringify({ name: 'NoEmail' }));
          onSuccess({ credential: `header.${payload}.sig` });
        },
      }, 'Google Sign Up Fail'),
      React.createElement('button', {
        type: 'button',
        onClick: () => onError(),
      }, 'Google Error'),
    );
  },
  GoogleOAuthProvider: (props: { children: React.ReactNode }) => React.createElement(React.Fragment, null, props.children),
}));

function renderSignUpPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <SignUpPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('SignUpPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders sign up form', () => {
    renderSignUpPage();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Join us and start shopping')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('At least 6 characters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });

  it('shows error for missing fields', () => {
    renderSignUpPage();
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('signs up successfully and navigates home', () => {
    renderSignUpPage();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows error for duplicate email', () => {
    localStorageMock.setItem('onboarding-demo-users', JSON.stringify([
      { email: 'existing@test.com', password: 'pass', name: 'Existing' },
    ]));
    renderSignUpPage();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'existing@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByText('An account with this email already exists')).toBeInTheDocument();
  });

  it('signs up with Google successfully', () => {
    renderSignUpPage();
    fireEvent.click(screen.getByText('Google Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles Google sign up failure when no email in payload', async () => {
    renderSignUpPage();
    fireEvent.click(screen.getByText('Google Sign Up Fail'));
    await waitFor(() => {
      expect(screen.getByText('Google sign-up failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles Google sign up error callback', async () => {
    renderSignUpPage();
    fireEvent.click(screen.getByText('Google Error'));
    await waitFor(() => {
      expect(screen.getByText('Google sign-up failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('has link to sign in page', () => {
    renderSignUpPage();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });
});
