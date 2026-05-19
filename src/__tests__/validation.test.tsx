import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../context/AuthContext';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';
import { validateEmail, validatePassword, validateConfirmPassword } from '../utils/validation';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <GoogleOAuthProvider clientId="test">
      <AuthProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AuthProvider>
    </GoogleOAuthProvider>,
  );
}

describe('Validation utilities', () => {
  it('rejects invalid email formats', () => {
    expect(validateEmail('asdf')).toBe('Please enter a valid email address');
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
    expect(validateEmail('@test.com')).toBe('Please enter a valid email address');
    expect(validateEmail('no spaces@test.com')).toBe('Please enter a valid email address');
  });

  it('accepts valid email formats', () => {
    expect(validateEmail('user@example.com')).toBeNull();
    expect(validateEmail('test.user@domain.co')).toBeNull();
    expect(validateEmail('a+b@c.org')).toBeNull();
  });

  it('returns null for empty email', () => {
    expect(validateEmail('')).toBeNull();
  });

  it('rejects passwords shorter than 6 characters', () => {
    expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
    expect(validatePassword('a')).toBe('Password must be at least 6 characters');
  });

  it('accepts passwords with 6 or more characters', () => {
    expect(validatePassword('123456')).toBeNull();
    expect(validatePassword('longpassword')).toBeNull();
  });

  it('rejects mismatched passwords', () => {
    expect(validateConfirmPassword('abc123', 'abc124')).toBe('Passwords do not match');
  });

  it('accepts matching passwords', () => {
    expect(validateConfirmPassword('abc123', 'abc123')).toBeNull();
  });
});

describe('Email Validation', () => {
  it('validates email format on sign up', () => {
    renderWithProviders(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('validates email format on sign in', () => {
    renderWithProviders(<SignInPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'bad-email' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('displays inline error for invalid email', () => {
    renderWithProviders(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'notanemail' } });
    fireEvent.blur(emailInput);

    const errorMessage = screen.getByText('Please enter a valid email address');
    expect(errorMessage).toBeTruthy();
  });

  it('clears email error when valid email is entered', () => {
    renderWithProviders(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');

    fireEvent.change(emailInput, { target: { value: 'bad' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();

    fireEvent.change(emailInput, { target: { value: 'good@example.com' } });
    fireEvent.blur(emailInput);
    expect(screen.queryByText('Please enter a valid email address')).toBeNull();
  });
});

describe('Password Validation on Sign Up', () => {
  it('shows error for short password', () => {
    renderWithProviders(<SignUpPage />);
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');

    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);

    expect(screen.getByText('Password must be at least 6 characters')).toBeTruthy();
  });

  it('shows error when passwords do not match', () => {
    renderWithProviders(<SignUpPage />);
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);

    expect(screen.getByText('Passwords do not match')).toBeTruthy();
  });

  it('shows no error when passwords match', () => {
    renderWithProviders(<SignUpPage />);
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.blur(confirmInput);

    expect(screen.queryByText('Passwords do not match')).toBeNull();
  });

  it('prevents form submission with invalid email', () => {
    renderWithProviders(<SignUpPage />);

    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'bademail' },
    });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Sign Up'));

    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });
});
