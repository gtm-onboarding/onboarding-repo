import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../context/AuthContext';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';

function renderSignUp() {
  return render(
    <BrowserRouter>
      <GoogleOAuthProvider clientId="test">
        <AuthProvider>
          <SignUpPage />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

function renderSignIn() {
  return render(
    <BrowserRouter>
      <GoogleOAuthProvider clientId="test">
        <AuthProvider>
          <SignInPage />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

describe('Email Validation', () => {
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
    expect(errorMessage.tagName).toBe('P');
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
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    expect(submitButton).not.toBeDisabled();
  });
});
