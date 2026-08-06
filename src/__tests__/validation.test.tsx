import { useState } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { validateEmail } from '../utils/validation';

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

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

const INVALID_EMAILS = ['asdf', 'test@', '@test.com', 'test@example', 'a b@example.com', ''];
const VALID_EMAILS = ['user@example.com', 'first.last@sub.example.co.uk', 'user+tag@example.org'];

function AuthResultProbe() {
  const { signIn, signUp } = useAuth();
  const [result, setResult] = useState<string>('none');
  return (
    <div>
      <span data-testid="result">{result}</span>
      {INVALID_EMAILS.filter((email) => email !== '').map((email) => (
        <div key={email}>
          <button onClick={() => setResult(String(signUp(email, 'password123', 'Test User')))}>
            {`signUp ${email}`}
          </button>
          <button onClick={() => setResult(String(signIn(email, 'password123')))}>
            {`signIn ${email}`}
          </button>
        </div>
      ))}
      <button onClick={() => setResult(String(signUp('user@example.com', 'password123', 'Test User')))}>
        signUp valid
      </button>
      <button onClick={() => setResult(String(signIn('user@example.com', 'password123')))}>
        signIn valid
      </button>
    </div>
  );
}

function renderPage(page: 'signin' | 'signup') {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <BrowserRouter future={routerFuture}>
        <AuthProvider>{page === 'signin' ? <SignInPage /> : <SignUpPage />}</AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

describe('Email Validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('accepts valid emails and rejects invalid ones', () => {
    INVALID_EMAILS.forEach((email) => expect(validateEmail(email)).toBe(false));
    VALID_EMAILS.forEach((email) => expect(validateEmail(email)).toBe(true));
  });

  it('validates email format on sign up', () => {
    render(
      <BrowserRouter future={routerFuture}>
        <AuthProvider>
          <AuthResultProbe />
        </AuthProvider>
      </BrowserRouter>
    );
    INVALID_EMAILS.filter((email) => email !== '').forEach((email) => {
      fireEvent.click(screen.getByText(`signUp ${email}`));
      expect(screen.getByTestId('result').textContent).toBe('false');
    });
    fireEvent.click(screen.getByText('signUp valid'));
    expect(screen.getByTestId('result').textContent).toBe('true');
  });

  it('validates email format on sign in', () => {
    render(
      <BrowserRouter future={routerFuture}>
        <AuthProvider>
          <AuthResultProbe />
        </AuthProvider>
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('signUp valid'));
    INVALID_EMAILS.filter((email) => email !== '').forEach((email) => {
      fireEvent.click(screen.getByText(`signIn ${email}`));
      expect(screen.getByTestId('result').textContent).toBe('false');
    });
    fireEvent.click(screen.getByText('signIn valid'));
    expect(screen.getByTestId('result').textContent).toBe('true');
  });

  it('displays inline error for invalid email', () => {
    renderPage('signup');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'asdf' } });
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('disables submit button when email is invalid', () => {
    renderPage('signin');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    expect(submitButton).not.toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'test@' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(submitButton).not.toBeDisabled();
  });
});
