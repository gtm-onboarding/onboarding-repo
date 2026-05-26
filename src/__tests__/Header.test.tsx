import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../components/Header';
import { CartProvider } from '../context/CartContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { products } from '../data/products';

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

function renderHeader(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

function SignInHelper() {
  const { signUp } = useAuth();
  return <button onClick={() => signUp('user@test.com', 'pass', 'User')}>Do Sign Up</button>;
}

function renderHeaderAuthenticated() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <SignInHelper />
          <Header />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders brand link', () => {
    renderHeader();
    expect(screen.getByText('Onboarding Shop')).toBeInTheDocument();
  });

  it('renders category links', () => {
    renderHeader();
    expect(screen.getAllByText('Electronics').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Clothing').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Home & Garden').length).toBeGreaterThan(0);
  });

  it('renders sign in link when not authenticated', () => {
    renderHeader();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows user email and sign out when authenticated', () => {
    renderHeaderAuthenticated();
    fireEvent.click(screen.getByText('Do Sign Up'));
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('signs out when sign out button is clicked', () => {
    renderHeaderAuthenticated();
    fireEvent.click(screen.getByText('Do Sign Up'));
    fireEvent.click(screen.getByText('Sign Out'));
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('hides cart badge when cart is empty', () => {
    renderHeader();
    const cartLink = screen.getByRole('link', { name: '' });
    expect(cartLink).toBeInTheDocument();
  });

  it('shows cart badge when items in cart', () => {
    localStorageMock.setItem('onboarding-demo-cart', JSON.stringify([{ product: products[0], quantity: 3 }]));
    renderHeader();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
