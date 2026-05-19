import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { validateEmail, validatePasswordMatch } from '../utils/validation';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';
import { AuthProvider } from '../context/AuthContext';

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login" />,
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function renderSignUp() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <SignUpPage />
      </AuthProvider>
    </BrowserRouter>,
  );
}

function renderSignIn() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <SignInPage />
      </AuthProvider>
    </BrowserRouter>,
  );
}

describe('validateEmail', () => {
  it('returns null for valid emails', () => {
    expect(validateEmail('user@example.com')).toBeNull();
    expect(validateEmail('test.name@domain.co')).toBeNull();
  });

  it('returns error for invalid emails', () => {
    expect(validateEmail('asdf')).toBe('Please enter a valid email address');
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
    expect(validateEmail('@test.com')).toBe('Please enter a valid email address');
  });

  it('returns null for empty string', () => {
    expect(validateEmail('')).toBeNull();
  });
});

describe('validatePasswordMatch', () => {
  it('returns null when passwords match', () => {
    expect(validatePasswordMatch('password123', 'password123')).toBeNull();
  });

  it('returns error when passwords do not match', () => {
    expect(validatePasswordMatch('password123', 'different')).toBe('Passwords do not match');
  });

  it('returns null when confirm password is empty', () => {
    expect(validatePasswordMatch('password123', '')).toBeNull();
  });
});

describe('Email Validation', () => {
  it('validates email format on sign up', () => {
    renderSignUp();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'asdf' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('validates email format on sign in', () => {
    renderSignIn();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'test@' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('displays inline error for invalid email', () => {
    renderSignIn();
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: '@test.com' } });
    fireEvent.blur(emailInput);

    const errorMessage = screen.getByText('Please enter a valid email address');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.tagName).toBe('P');
  });

  it('disables submit button when email is invalid', () => {
    renderSignIn();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    expect(submitButton).not.toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);

    expect(submitButton).toBeDisabled();
  });
});

describe('Password Confirmation Validation', () => {
  it('shows error when passwords do not match on sign up', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('clears error when passwords match on sign up', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();

    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });
});
