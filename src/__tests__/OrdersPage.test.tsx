import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { OrderProvider } from '../context/OrderContext';
import { OrdersPage } from '../pages/OrdersPage';
import { products } from '../data/products';
import { Order } from '../types';

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

function renderOrders() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <OrdersPage />
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function order(userEmail: string, product = products[0]): Order {
  return {
    id: `order-${userEmail}`,
    date: '2024-01-15T12:00:00.000Z',
    userEmail,
    items: [{ product, quantity: 2 }],
    subtotal: product.price * 2,
    tax: product.price * 2 * 0.08,
    total: product.price * 2 * 1.08,
  };
}

describe('OrdersPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('displays the empty state when there are no orders', async () => {
    renderOrders();
    expect(await screen.findByText('No orders yet')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('renders order items and totals', async () => {
    localStorageMock.setItem('onboarding-demo-session', JSON.stringify({ email: 'buyer@example.com', name: 'Buyer' }));
    localStorageMock.setItem('onboarding-demo-orders', JSON.stringify([order('buyer@example.com')]));
    renderOrders();

    expect(await screen.findByRole('heading', { name: 'Order mple.com' })).toBeInTheDocument();
    expect(screen.getByText(`${products[0].name} × 2`)).toBeInTheDocument();
    expect(screen.getAllByText(`$${(products[0].price * 2).toFixed(2)}`)).toHaveLength(2);
    expect(screen.getByText(`$${(products[0].price * 2 * 1.08).toFixed(2)}`)).toBeInTheDocument();
  });

  it('scopes orders to the signed-in user', async () => {
    localStorageMock.setItem('onboarding-demo-session', JSON.stringify({ email: 'buyer@example.com', name: 'Buyer' }));
    localStorageMock.setItem(
      'onboarding-demo-orders',
      JSON.stringify([order('buyer@example.com'), order('other@example.com', products[1])])
    );
    renderOrders();

    expect(await screen.findByText(`${products[0].name} × 2`)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(products[1].name)).not.toBeInTheDocument());
  });
});
