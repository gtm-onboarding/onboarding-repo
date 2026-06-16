import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { OrderProvider, useOrders } from '../context/OrderContext';
import { Order } from '../types';
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

function createTestOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'test-order-1',
    items: [{ product: products[0], quantity: 2 }],
    subtotal: products[0].price * 2,
    tax: products[0].price * 2 * 0.08,
    total: products[0].price * 2 * 1.08,
    date: '2026-01-15T12:00:00.000Z',
    shippingInfo: {
      name: 'Test User',
      address: '123 Test St',
      city: 'Testville',
      zipCode: '12345',
    },
    ...overrides,
  };
}

function TestComponent() {
  const { orders, addOrder } = useOrders();
  return (
    <div>
      <span data-testid="order-count">{orders.length}</span>
      {orders.map((order) => (
        <div key={order.id} data-testid={`order-${order.id}`}>
          <span data-testid={`order-total-${order.id}`}>{order.total.toFixed(2)}</span>
          <span data-testid={`order-items-${order.id}`}>{order.items.length}</span>
        </div>
      ))}
      <button onClick={() => addOrder(createTestOrder())}>Add Order 1</button>
      <button onClick={() => addOrder(createTestOrder({ id: 'test-order-2' }))}>Add Order 2</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <BrowserRouter>
      <OrderProvider>
        <TestComponent />
      </OrderProvider>
    </BrowserRouter>
  );
}

describe('OrderContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with no orders', () => {
    renderWithProvider();
    expect(screen.getByTestId('order-count').textContent).toBe('0');
  });

  it('adds an order', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Order 1'));
    expect(screen.getByTestId('order-count').textContent).toBe('1');
    expect(screen.getByTestId('order-total-test-order-1')).toBeTruthy();
  });

  it('adds multiple orders with newest first', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Order 1'));
    fireEvent.click(screen.getByText('Add Order 2'));
    expect(screen.getByTestId('order-count').textContent).toBe('2');
    const orderElements = screen.getAllByTestId(/^order-test-order/);
    expect(orderElements[0].getAttribute('data-testid')).toBe('order-test-order-2');
    expect(orderElements[1].getAttribute('data-testid')).toBe('order-test-order-1');
  });

  it('persists orders to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Order 1'));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('stores correct order data', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Order 1'));
    const expectedTotal = (products[0].price * 2 * 1.08).toFixed(2);
    expect(screen.getByTestId('order-total-test-order-1').textContent).toBe(expectedTotal);
    expect(screen.getByTestId('order-items-test-order-1').textContent).toBe('1');
  });
});
