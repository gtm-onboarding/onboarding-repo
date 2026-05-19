import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SignUpPage } from '../pages/SignUpPage';
import { SignInPage } from '../pages/SignInPage';
import { AuthProvider } from '../context/AuthContext';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function renderSignUp() {
  return render(
    <GoogleOAuthProvider clientId="test">
      <BrowserRouter>
        <AuthProvider>
          <SignUpPage />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>,
  );
}

function renderSignIn() {
  return render(
    <GoogleOAuthProvider clientId="test">
      <BrowserRouter>
        <AuthProvider>
          <SignInPage />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>,
  );
}

describe('Email Validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('validates email format on sign up', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'asdf' },
    });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('validates email format on sign in', () => {
    renderSignIn();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Sign In'));
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('displays inline error for invalid email', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: '@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Sign Up'));

    const errorMessage = screen.getByText('Please enter a valid email address');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.tagName).toBe('SPAN');
  });

  it('accepts valid email and submits successfully', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });
});

describe('Password Validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('shows error when password is too short', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'abc' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'abc' },
    });
    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'different456' },
    });
    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
