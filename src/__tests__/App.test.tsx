import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

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

function renderApp() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('App', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders home page', () => {
    renderApp();
    expect(screen.getByText(/Discover Your/)).toBeInTheDocument();
  });

  it('renders header with navigation', () => {
    renderApp();
    expect(screen.getByText('Onboarding Shop')).toBeInTheDocument();
    expect(screen.getAllByText('Electronics').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Clothing').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Home & Garden').length).toBeGreaterThan(0);
  });

  it('renders sign in link when not authenticated', () => {
    renderApp();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders featured products', () => {
    renderApp();
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
  });

  it('renders shop by category section', () => {
    renderApp();
    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
  });
});
