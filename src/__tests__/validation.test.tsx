import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { isValidEmail, getEmailError, getPasswordConfirmError } from '../utils/validation';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login" />,
}));

function renderSignUp() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SignUpPage />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>,
  );
}

function renderSignIn() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SignInPage />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>,
  );
}

describe('Validation Utilities', () => {
  it('rejects invalid email formats', () => {
    expect(isValidEmail('asdf')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@test.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('no spaces@test.com')).toBe(false);
  });

  it('accepts valid email formats', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@domain.co')).toBe(true);
    expect(isValidEmail('name+tag@company.org')).toBe(true);
  });

  it('returns error for invalid email', () => {
    expect(getEmailError('asdf')).toBe('Please enter a valid email address');
    expect(getEmailError('test@')).toBe('Please enter a valid email address');
  });

  it('returns null for valid or empty email', () => {
    expect(getEmailError('')).toBeNull();
    expect(getEmailError('user@example.com')).toBeNull();
  });

  it('returns error when passwords do not match', () => {
    expect(getPasswordConfirmError('password1', 'password2')).toBe('Passwords do not match');
  });

  it('returns null when passwords match', () => {
    expect(getPasswordConfirmError('password1', 'password1')).toBeNull();
  });

  it('returns null when confirm password is empty', () => {
    expect(getPasswordConfirmError('password1', '')).toBeNull();
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
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('displays inline error for invalid email', () => {
    renderSignUp();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: '@test.com' } });
    fireEvent.blur(emailInput);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please enter a valid email address');
  });

  it('clears email error when valid email is entered', () => {
    renderSignUp();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'bad' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'good@example.com' } });
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });
});

describe('Password Confirmation Validation', () => {
  it('shows error when passwords do not match on sign up', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmInput, { target: { value: 'password2' } });
    fireEvent.blur(confirmInput);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('does not show error when passwords match', () => {
    renderSignUp();
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmInput, { target: { value: 'password1' } });
    fireEvent.blur(confirmInput);

    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });
});

describe('Form Submission Validation', () => {
  it('prevents sign up submission with invalid email', () => {
    renderSignUp();
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmInput, { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('prevents sign up submission when passwords do not match', () => {
    renderSignUp();
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('prevents sign in submission with invalid email', () => {
    renderSignIn();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'notanemail' } });
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });
});
