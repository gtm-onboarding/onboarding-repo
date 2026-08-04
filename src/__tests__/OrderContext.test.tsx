import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { OrderProvider, useOrders } from '../context/OrderContext';
import { OrdersPage } from '../pages/OrdersPage';
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

function TestComponent() {
  const { orders, placeOrder } = useOrders();
  return (
    <div>
      <span data-testid="orders-count">{orders.length}</span>
      <span data-testid="first-total">{orders[0]?.total.toFixed(2) ?? ''}</span>
      <button onClick={() => placeOrder([{ product: products[0], quantity: 2 }], 100, 8, 108)}>
        Place Order
      </button>
    </div>
  );
}

describe('OrderContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no orders', () => {
    render(
      <AuthProvider>
        <OrderProvider>
          <TestComponent />
        </OrderProvider>
      </AuthProvider>
    );
    expect(screen.getByTestId('orders-count').textContent).toBe('0');
  });

  it('saves an order and persists it to localStorage', () => {
    render(
      <AuthProvider>
        <OrderProvider>
          <TestComponent />
        </OrderProvider>
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Place Order'));
    expect(screen.getByTestId('orders-count').textContent).toBe('1');
    expect(screen.getByTestId('first-total').textContent).toBe('108.00');

    const stored = JSON.parse(localStorage.getItem('onboarding-demo-orders:guest')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].items[0].quantity).toBe(2);
  });

  it('shows saved orders on the Order History page', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <OrderProvider>
            <TestComponent />
            <OrdersPage />
          </OrderProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('You have no past orders yet.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Place Order'));

    expect(screen.getByText(`${products[0].name} × 2`)).toBeInTheDocument();
    expect(screen.getByText('$108.00')).toBeInTheDocument();
  });
});
