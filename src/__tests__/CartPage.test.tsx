import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartPage } from '../pages/CartPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
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

function renderCartPage(cartItems: Array<{ product: typeof products[0]; quantity: number }> = []) {
  localStorageMock.setItem('onboarding-demo-cart', JSON.stringify(cartItems));
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('displays empty cart state', () => {
    renderCartPage([]);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('displays cart items', () => {
    renderCartPage([{ product: products[0], quantity: 2 }]);
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
  });

  it('displays correct totals', () => {
    const quantity = 2;
    renderCartPage([{ product: products[0], quantity }]);
    const subtotal = products[0].price * quantity;
    const subtotalElements = screen.getAllByText(`$${subtotal.toFixed(2)}`);
    expect(subtotalElements.length).toBeGreaterThan(0);
  });

  it('redirects to signin when checkout clicked and not authenticated', () => {
    renderCartPage([{ product: products[0], quantity: 1 }]);
    fireEvent.click(screen.getByText('Proceed to Checkout'));
    expect(mockNavigate).toHaveBeenCalledWith('/signin?redirect=/checkout');
  });
});
