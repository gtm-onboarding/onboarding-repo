import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState, useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CheckoutPage } from '../pages/CheckoutPage';
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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderCheckoutPage(cartItems: Array<{ product: typeof products[0]; quantity: number }> = [], userName?: string) {
  localStorageMock.setItem('onboarding-demo-cart', JSON.stringify(cartItems));
  if (userName) {
    localStorageMock.setItem('onboarding-demo-session', JSON.stringify({ email: 'test@test.com', name: userName }));
  }
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <AuthProvider>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

function getInputByName(container: HTMLElement, name: string): HTMLInputElement {
  return container.querySelector(`input[name="${name}"]`) as HTMLInputElement;
}

function fillAndSubmitForm(container: HTMLElement) {
  fireEvent.change(getInputByName(container, 'name'), { target: { value: 'John', name: 'name' } });
  fireEvent.change(getInputByName(container, 'address'), { target: { value: '123 Main', name: 'address' } });
  fireEvent.change(getInputByName(container, 'city'), { target: { value: 'NYC', name: 'city' } });
  fireEvent.change(getInputByName(container, 'zipCode'), { target: { value: '10001', name: 'zipCode' } });
  fireEvent.change(getInputByName(container, 'cardNumber'), { target: { value: '1234', name: 'cardNumber' } });
  fireEvent.change(getInputByName(container, 'expiry'), { target: { value: '12/25', name: 'expiry' } });
  fireEvent.change(getInputByName(container, 'cvv'), { target: { value: '123', name: 'cvv' } });
  fireEvent.click(screen.getByText('Place Order'));
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('redirects to cart when cart is empty', () => {
    renderCheckoutPage([]);
    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });

  it('renders checkout form with cart items', () => {
    renderCheckoutPage([{ product: products[0], quantity: 2 }]);
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    expect(screen.getByText('Payment Information')).toBeInTheDocument();
  });

  it('renders order summary', () => {
    renderCheckoutPage([{ product: products[0], quantity: 2 }]);
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText(`${products[0].name} × 2`)).toBeInTheDocument();
  });

  it('shows subtotal and tax', () => {
    renderCheckoutPage([{ product: products[0], quantity: 1 }]);
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Tax (8%)')).toBeInTheDocument();
  });

  it('renders name input field', () => {
    const { container } = renderCheckoutPage([{ product: products[0], quantity: 1 }]);
    const nameInput = getInputByName(container, 'name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.type).toBe('text');
  });

  it('updates form fields on input', () => {
    const { container } = renderCheckoutPage([{ product: products[0], quantity: 1 }]);
    const addressInput = getInputByName(container, 'address');
    fireEvent.change(addressInput, { target: { value: '123 Main St', name: 'address' } });
    expect(addressInput.value).toBe('123 Main St');
  });

  it('shows confirmation modal on form submit', () => {
    const { container } = renderCheckoutPage([{ product: products[0], quantity: 1 }]);
    fillAndSubmitForm(container);
    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    expect(screen.getByText('Thank you for your purchase. Your order has been placed successfully.')).toBeInTheDocument();
  });

  it('clears cart and navigates home on confirmation close', () => {
    const { container } = renderCheckoutPage([{ product: products[0], quantity: 1 }]);
    fillAndSubmitForm(container);
    fireEvent.click(screen.getByText('Continue Shopping'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders multiple order items in summary', () => {
    renderCheckoutPage([
      { product: products[0], quantity: 1 },
      { product: products[1], quantity: 3 },
    ]);
    expect(screen.getByText(`${products[0].name} × 1`)).toBeInTheDocument();
    expect(screen.getByText(`${products[1].name} × 3`)).toBeInTheDocument();
  });

  it('prefills name from authenticated user', () => {
    function AuthenticatedCheckout() {
      const { isAuthenticated, signUp } = useAuth();
      const [ready, setReady] = useState(false);
      useEffect(() => {
        if (!isAuthenticated) {
          signUp('auth@test.com', 'pass', 'AuthUser');
        } else {
          setReady(true);
        }
      }, [isAuthenticated, signUp]);
      if (!ready) return null;
      return <CheckoutPage />;
    }

    localStorageMock.setItem('onboarding-demo-cart', JSON.stringify([{ product: products[0], quantity: 1 }]));
    const { container } = render(
      <MemoryRouter initialEntries={['/checkout']}>
        <AuthProvider>
          <CartProvider>
            <AuthenticatedCheckout />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    const nameInput = container.querySelector('input[name="name"]') as HTMLInputElement;
    expect(nameInput.value).toBe('AuthUser');
  });
});
