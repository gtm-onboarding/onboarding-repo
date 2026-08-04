import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';
import { AuthProvider } from '../context/AuthContext';
import { isValidEmail } from '../utils/validation';

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

function renderPage(page: React.ReactElement) {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <BrowserRouter>
        <AuthProvider>{page}</AuthProvider>
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
    expect(isValidEmail('asdf')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@test.com')).toBe(false);
    expect(isValidEmail('user@example.com')).toBe(true);

    renderPage(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'asdf' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('validates email format on sign in', () => {
    renderPage(<SignInPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('displays inline error for invalid email', () => {
    renderPage(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: '@test.com' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('disables submit button when email is invalid', () => {
    renderPage(<SignInPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(submitButton).not.toBeDisabled();
  });
});

describe('Password Confirmation', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('shows error when passwords do not match on sign up', () => {
    renderPage(<SignUpPage />);
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'password123' },
    });
    const confirmInput = screen.getByPlaceholderText('Confirm your password');
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('enforces minimum password length', () => {
    renderPage(<SignUpPage />);
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    fireEvent.change(passwordInput, { target: { value: 'abc' } });
    fireEvent.blur(passwordInput);
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });
});
