import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { validateEmail, validatePasswordMatch } from '../utils/validation';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';
import { AuthProvider } from '../context/AuthContext';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <GoogleOAuthProvider clientId="test">
      <MemoryRouter>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    </GoogleOAuthProvider>
  );
}

describe('Email Validation', () => {
  it('validates email format on sign up', () => {
    expect(validateEmail('asdf')).toBe('Please enter a valid email address');
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
    expect(validateEmail('@test.com')).toBe('Please enter a valid email address');
    expect(validateEmail('user@example.com')).toBeNull();
  });

  it('validates email format on sign in', () => {
    expect(validateEmail('notanemail')).toBe('Please enter a valid email address');
    expect(validateEmail('valid@domain.org')).toBeNull();
  });

  it('displays inline error for invalid email', () => {
    renderWithProviders(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'bademail' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('displays inline error for invalid email on sign in', () => {
    renderWithProviders(<SignInPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'bademail' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });
});

describe('Password Confirmation', () => {
  it('validates password match', () => {
    expect(validatePasswordMatch('abc123', 'abc123')).toBeNull();
    expect(validatePasswordMatch('abc123', 'xyz789')).toBe('Passwords do not match');
  });

  it('displays inline error when passwords do not match on sign up', () => {
    renderWithProviders(<SignUpPage />);
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmInput, { target: { value: 'password2' } });
    fireEvent.blur(confirmInput);
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
