import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../context/AuthContext';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';
import { isValidEmail, getEmailError, getPasswordConfirmError } from '../utils/validation';

describe('Email Validation', () => {
  it('validates email format on sign up', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@domain.co')).toBe(true);
    expect(isValidEmail('asdf')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@test.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('validates email format on sign in', () => {
    expect(getEmailError('user@example.com')).toBe('');
    expect(getEmailError('invalid')).toBe('Please enter a valid email address');
    expect(getEmailError('test@')).toBe('Please enter a valid email address');
    expect(getEmailError('@test.com')).toBe('Please enter a valid email address');
  });

  it('displays inline error for invalid email', () => {
    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="test">
          <AuthProvider>
            <SignUpPage />
          </AuthProvider>
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('disables submit button when email is invalid', () => {
    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="test">
          <AuthProvider>
            <SignInPage />
          </AuthProvider>
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    expect(submitButton).not.toBeDisabled();
  });
});

describe('Password Confirmation', () => {
  it('returns error when passwords do not match', () => {
    expect(getPasswordConfirmError('password1', 'password2')).toBe('Passwords do not match');
  });

  it('returns empty string when passwords match', () => {
    expect(getPasswordConfirmError('password', 'password')).toBe('');
  });

  it('displays inline error when passwords do not match on sign up', () => {
    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="test">
          <AuthProvider>
            <SignUpPage />
          </AuthProvider>
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
