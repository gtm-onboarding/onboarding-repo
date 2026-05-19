import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <GoogleOAuthProvider clientId="">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>{ui}</CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

describe('Email Validation', () => {
  it('validates email format on sign up', () => {
    renderWithProviders(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'asdf' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('validates email format on sign in', () => {
    renderWithProviders(<SignInPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('displays inline error for invalid email', () => {
    renderWithProviders(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: '@test.com' } });
    fireEvent.blur(emailInput);
    const errorMsg = screen.getByText('Please enter a valid email address');
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.tagName).toBe('P');
  });

  it('disables submit button when email is invalid', () => {
    renderWithProviders(<SignInPage />);
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
