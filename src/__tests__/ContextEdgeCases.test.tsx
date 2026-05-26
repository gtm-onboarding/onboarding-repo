import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
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

function CartConsumer() {
  const { items, toastMessage, showToast } = useCart();
  return (
    <div>
      <span data-testid="items-count">{items.length}</span>
      <span data-testid="toast">{toastMessage || 'none'}</span>
      <button onClick={() => showToast('test')}>Show Toast</button>
    </div>
  );
}

function AuthConsumer() {
  const { user, toastMessage, signInWithGoogle } = useAuth();
  return (
    <div>
      <span data-testid="user-email">{user?.email || 'none'}</span>
      <span data-testid="toast">{toastMessage || 'none'}</span>
      <button onClick={() => {
        const payload = btoa(JSON.stringify({ name: 'NoEmail' }));
        signInWithGoogle(`header.${payload}.sig`);
      }}>Google No Email</button>
    </div>
  );
}

describe('Context Edge Cases', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('CartProvider loads malformed JSON from localStorage gracefully', () => {
    localStorageMock.setItem('onboarding-demo-cart', 'not-json');
    render(
      <MemoryRouter>
        <CartProvider>
          <CartConsumer />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('CartProvider loads valid stored cart from localStorage', () => {
    const storedCart = [{ product: { id: '1', name: 'Test', price: 10, description: '', image: '', category: '' }, quantity: 3 }];
    localStorageMock.setItem('onboarding-demo-cart', JSON.stringify(storedCart));
    render(
      <MemoryRouter>
        <CartProvider>
          <CartConsumer />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('items-count').textContent).toBe('1');
  });

  it('AuthProvider loads malformed session JSON gracefully', () => {
    localStorageMock.setItem('onboarding-demo-session', 'bad-json');
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('user-email').textContent).toBe('none');
  });

  it('AuthProvider loads valid stored session', () => {
    localStorageMock.setItem('onboarding-demo-session', JSON.stringify({ email: 'stored@test.com', name: 'Stored' }));
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('user-email').textContent).toBe('stored@test.com');
  });

  it('AuthProvider getUsers handles malformed users JSON during signIn', () => {
    localStorageMock.setItem('onboarding-demo-users', 'bad-json');

    function SignInAttempt() {
      const { signIn } = useAuth();
      return <button onClick={() => signIn('a@b.com', 'pass')}>Try Sign In</button>;
    }

    render(
      <MemoryRouter>
        <AuthProvider>
          <SignInAttempt />
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Try Sign In'));
  });

  it('signInWithGoogle fails when payload has no email', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Google No Email'));
    expect(screen.getByTestId('user-email').textContent).toBe('none');
  });

  it('useCart throws when used outside CartProvider', () => {
    function BadComponent() {
      useCart();
      return null;
    }
    expect(() => render(<BadComponent />)).toThrow('useCart must be used within a CartProvider');
  });

  it('useAuth throws when used outside AuthProvider', () => {
    function BadComponent() {
      useAuth();
      return null;
    }
    expect(() => render(<BadComponent />)).toThrow('useAuth must be used within an AuthProvider');
  });

  it('Cart toast auto-clears after timeout', () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <CartProvider>
          <CartConsumer />
        </CartProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByTestId('toast').textContent).toBe('test');
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.getByTestId('toast').textContent).toBe('none');
    vi.useRealTimers();
  });

  it('Auth duplicate sign-up returns false', () => {
    localStorageMock.setItem('onboarding-demo-users', JSON.stringify([
      { email: 'dup@test.com', password: 'pass', name: 'Dup' },
    ]));

    function DupSignUp() {
      const { signUp } = useAuth();
      return (
        <button onClick={() => {
          const result = signUp('dup@test.com', 'pass', 'Dup2');
          document.title = result ? 'true' : 'false';
        }}>Try Dup</button>
      );
    }

    render(
      <MemoryRouter>
        <AuthProvider>
          <DupSignUp />
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Try Dup'));
    expect(document.title).toBe('false');
  });

  it('signInWithGoogle uses email as name when name is missing', () => {
    function GoogleNameFallback() {
      const { user, signInWithGoogle } = useAuth();
      return (
        <div>
          <span data-testid="user-name">{user?.name || 'none'}</span>
          <button onClick={() => {
            const payload = btoa(JSON.stringify({ email: 'noname@test.com' }));
            signInWithGoogle(`header.${payload}.sig`);
          }}>Google No Name</button>
        </div>
      );
    }

    render(
      <MemoryRouter>
        <AuthProvider>
          <GoogleNameFallback />
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Google No Name'));
    expect(screen.getByTestId('user-name').textContent).toBe('noname@test.com');
  });

  it('updateQuantity with multiple items only changes the matching one', () => {
    const product1 = { id: 'uq-1', name: 'UQ1', price: 10, description: '', image: '', category: '' };
    const product2 = { id: 'uq-2', name: 'UQ2', price: 20, description: '', image: '', category: '' };
    const storedCart = [
      { product: product1, quantity: 5 },
      { product: product2, quantity: 3 },
    ];
    localStorageMock.setItem('onboarding-demo-cart', JSON.stringify(storedCart));

    function UQTest() {
      const { items, updateQuantity } = useCart();
      return (
        <div>
          <span data-testid="uq-qty1">{items[0]?.quantity || 0}</span>
          <span data-testid="uq-qty2">{items[1]?.quantity || 0}</span>
          <button onClick={() => updateQuantity('uq-1', 10)}>Update1</button>
        </div>
      );
    }

    render(
      <MemoryRouter>
        <CartProvider>
          <UQTest />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('uq-qty1').textContent).toBe('5');
    expect(screen.getByTestId('uq-qty2').textContent).toBe('3');
    fireEvent.click(screen.getByText('Update1'));
    expect(screen.getByTestId('uq-qty1').textContent).toBe('10');
    expect(screen.getByTestId('uq-qty2').textContent).toBe('3');
  });

  it('CartProvider addToCart caps at 99 for existing items and leaves others unchanged', () => {
    const product1 = { id: 'cap-test-1', name: 'Cap1', price: 10, description: '', image: '', category: '' };
    const product2 = { id: 'cap-test-2', name: 'Cap2', price: 20, description: '', image: '', category: '' };
    const storedCart = [
      { product: product1, quantity: 99 },
      { product: product2, quantity: 1 },
    ];
    localStorageMock.setItem('onboarding-demo-cart', JSON.stringify(storedCart));

    function CapTest() {
      const { items, addToCart } = useCart();
      return (
        <div>
          <span data-testid="qty1">{items[0]?.quantity || 0}</span>
          <span data-testid="qty2">{items[1]?.quantity || 0}</span>
          <button onClick={() => addToCart(product1)}>Add1</button>
        </div>
      );
    }

    render(
      <MemoryRouter>
        <CartProvider>
          <CapTest />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('qty1').textContent).toBe('99');
    expect(screen.getByTestId('qty2').textContent).toBe('1');
    fireEvent.click(screen.getByText('Add1'));
    expect(screen.getByTestId('qty1').textContent).toBe('99');
    expect(screen.getByTestId('qty2').textContent).toBe('1');
  });
});
