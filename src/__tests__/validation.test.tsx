import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { isValidEmail } from '../utils/validation';

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login" />,
}));

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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderPage(page: 'signin' | 'signup') {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {page === 'signin' ? <SignInPage /> : <SignUpPage />}
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('isValidEmail', () => {
  it.each(['', 'asdf', 'test@', '@test.com', 'a b@c.com', 'user@example.c', 'user@@example.com'])(
    'rejects %s',
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );

  it.each(['user@example.com', 'first.last+tag@sub.example.co.uk'])('accepts %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });
});

describe('SignInPage validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    localStorageMock.setItem(
      'onboarding-demo-users',
      JSON.stringify([{ email: 'user@example.com', password: 'password123', name: 'User' }]),
    );
  });

  it('shows an inline error and does not navigate for an invalid email', () => {
    renderPage('signin');
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'asdf' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates after valid credentials are submitted', () => {
    renderPage('signin');
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

describe('SignUpPage validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('shows an inline error and does not navigate for an invalid email', () => {
    renderPage('signup');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'asdf' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows an inline error when passwords do not match', () => {
    renderPage('signup');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates after valid form submission', () => {
    renderPage('signup');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
