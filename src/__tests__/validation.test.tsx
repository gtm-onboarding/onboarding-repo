import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';
import { AuthProvider } from '../context/AuthContext';

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login" />,
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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

function renderSignUp() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <SignUpPage />
      </AuthProvider>
    </BrowserRouter>
  );
}

function renderSignIn() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <SignInPage />
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('Email Validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('validates email format on sign up', () => {
    renderSignUp();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'asdf' } });
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'test@' } });
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: '@test.com' } });
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('validates email format on sign in', () => {
    renderSignIn();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('displays inline error for invalid email', () => {
    renderSignUp();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    const errorMessage = screen.getByText('Please enter a valid email address');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.tagName.toLowerCase()).toBe('span');
  });

  it('disables submit button when email is invalid', () => {
    renderSignIn();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(submitButton).not.toBeDisabled();
  });
});

describe('Password Confirmation Validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('shows error when passwords do not match on sign up', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('clears error when passwords match', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();

    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });

  it('disables submit button when passwords do not match', () => {
    renderSignUp();
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'mismatch' } });

    expect(submitButton).toBeDisabled();

    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    expect(submitButton).not.toBeDisabled();
  });
});
