import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

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

function TestComponent() {
  const { user, isAuthenticated, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  return (
    <div>
      <span data-testid="is-authenticated">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="user-email">{user?.email || 'none'}</span>
      <span data-testid="user-name">{user?.name || 'none'}</span>
      <button onClick={() => signUp('test@example.com', 'password123', 'Test User')}>Sign Up Valid</button>
      <button onClick={() => signUp('asdf', 'password123', 'Invalid User')}>Sign Up Invalid Email</button>
      <button onClick={() => signIn('test@example.com', 'password123')}>Sign In Valid</button>
      <button onClick={() => signIn('wrong@example.com', 'wrongpass')}>Sign In Invalid</button>
      <button onClick={() => {
        const payload = btoa(JSON.stringify({ email: 'google@example.com', name: 'Google User' }));
        signInWithGoogle(`header.${payload}.signature`);
      }}>Sign In Google</button>
      <button onClick={() => {
        signInWithGoogle('invalid-token');
      }}>Sign In Google Invalid</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with no user', () => {
    renderWithProvider();
    expect(screen.getByTestId('is-authenticated').textContent).toBe('no');
    expect(screen.getByTestId('user-email').textContent).toBe('none');
  });

  it('signs up new user', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Sign Up Valid'));
    expect(screen.getByTestId('is-authenticated').textContent).toBe('yes');
    expect(screen.getByTestId('user-email').textContent).toBe('test@example.com');
    expect(screen.getByTestId('user-name').textContent).toBe('Test User');
  });

  it('signs in with valid credentials', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Sign Up Valid'));
    fireEvent.click(screen.getByText('Sign Out'));
    fireEvent.click(screen.getByText('Sign In Valid'));
    expect(screen.getByTestId('is-authenticated').textContent).toBe('yes');
    expect(screen.getByTestId('user-email').textContent).toBe('test@example.com');
  });

  it('fails to sign in with invalid credentials', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Sign Up Valid'));
    fireEvent.click(screen.getByText('Sign Out'));
    fireEvent.click(screen.getByText('Sign In Invalid'));
    expect(screen.getByTestId('is-authenticated').textContent).toBe('no');
  });

  it('signs out user', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Sign Up Valid'));
    fireEvent.click(screen.getByText('Sign Out'));
    expect(screen.getByTestId('is-authenticated').textContent).toBe('no');
    expect(screen.getByTestId('user-email').textContent).toBe('none');
  });

  it('accepts any email format (no validation)', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Sign Up Invalid Email'));
    expect(screen.getByTestId('is-authenticated').textContent).toBe('yes');
    expect(screen.getByTestId('user-email').textContent).toBe('asdf');
  });

  it('persists session to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Sign Up Valid'));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('signs in with Google credential', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Sign In Google'));
    expect(screen.getByTestId('is-authenticated').textContent).toBe('yes');
    expect(screen.getByTestId('user-email').textContent).toBe('google@example.com');
    expect(screen.getByTestId('user-name').textContent).toBe('Google User');
  });

  it('fails gracefully with invalid Google credential', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Sign In Google Invalid'));
    expect(screen.getByTestId('is-authenticated').textContent).toBe('no');
  });
});
