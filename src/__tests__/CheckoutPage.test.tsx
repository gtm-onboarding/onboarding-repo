import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';
import { CheckoutPage } from '../pages/CheckoutPage';
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
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('CheckoutPage order persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('persists an order when checkout completes', async () => {
    const item = { product: products[0], quantity: 2 };
    localStorageMock.setItem('onboarding-demo-session', JSON.stringify({ email: 'buyer@example.com', name: 'Buyer' }));
    localStorageMock.setItem('onboarding-demo-cart', JSON.stringify([item]));

    render(
      <BrowserRouter>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <CheckoutPage />
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(await screen.findByText('Place Order')).toBeInTheDocument();
    for (const [name, value] of Object.entries({
      name: 'Buyer',
      address: '123 Main Street',
      city: 'Austin',
      zipCode: '78701',
      cardNumber: '4111111111111111',
      expiry: '12/30',
      cvv: '123',
    })) {
      const input = document.querySelector(`input[name="${name}"]`);
      if (!input) throw new Error(`Missing input: ${name}`);
      fireEvent.change(input, {
        target: { value },
      });
    }
    fireEvent.click(screen.getByText('Place Order'));

    expect(await screen.findByText('Order Confirmed!')).toBeInTheDocument();
    await waitFor(() => {
      const orders = JSON.parse(localStorageMock.getItem('onboarding-demo-orders') || '[]');
      expect(orders).toHaveLength(1);
      expect(orders[0].userEmail).toBe('buyer@example.com');
      expect(orders[0].items[0].quantity).toBe(2);
    });
  });
});
