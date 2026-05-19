import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../context/AuthContext';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';

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
    <GoogleOAuthProvider clientId="">
      <BrowserRouter>
        <AuthProvider>
          <SignUpPage />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

function renderSignIn() {
  return render(
    <GoogleOAuthProvider clientId="">
      <BrowserRouter>
        <AuthProvider>
          <SignInPage />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

describe('Email Validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('validates email format on sign up', () => {
    renderSignUp();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'asdf' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'test@' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: '@test.com' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.blur(emailInput);
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('validates email format on sign in', () => {
    renderSignIn();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.blur(emailInput);
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('displays inline error for invalid email', () => {
    renderSignUp();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'bad-email' } });
    fireEvent.blur(emailInput);

    const errorMsg = screen.getByText('Please enter a valid email address');
    expect(errorMsg).toBeInTheDocument();
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
    vi.clearAllMocks();
  });

  it('shows error when passwords do not match', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('clears error when passwords match', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();

    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.blur(confirmInput);
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });

  it('clears error when password field is edited to match confirm password', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'different' } });
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });

  it('disables sign up button when passwords do not match', () => {
    renderSignUp();
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });

    expect(submitButton).toBeDisabled();

    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    expect(submitButton).not.toBeDisabled();
  });
});
