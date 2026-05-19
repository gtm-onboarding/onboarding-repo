import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => null,
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

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
  it('validates email format on sign up', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'asdf' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('validates email format on sign in', () => {
    renderSignIn();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'asdf' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('displays inline error for invalid email', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    const errorElement = screen.getByText('Please enter a valid email address');
    expect(errorElement).toBeVisible();
  });

  it('validates password confirmation on sign up', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'abc123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'xyz789' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
