import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import { products } from '../data/products';
import { COVERAGE_RIDER_RATE } from '../constants';

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

const ring = products.find((p) => p.id === 'jewelry-1')!;

function TestComponent() {
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, coverageTotal } = useCart();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
      <span data-testid="coverage-total">{coverageTotal.toFixed(2)}</span>
      <span data-testid="items-count">{items.length}</span>
      {items.map((item) => (
        <div key={item.product.id} data-testid={`item-${item.product.id}`}>
          <span data-testid={`qty-${item.product.id}`}>{item.quantity}</span>
          <span data-testid={`coverage-${item.product.id}`}>{item.hasCoverageRider ? 'true' : 'false'}</span>
        </div>
      ))}
      <button onClick={() => addToCart(products[0])}>Add Product 1</button>
      <button onClick={() => addToCart(products[1])}>Add Product 2</button>
      <button onClick={() => addToCart(ring, true)}>Add Ring with Coverage</button>
      <button onClick={() => removeFromCart(products[0].id)}>Remove Product 1</button>
      <button onClick={() => updateQuantity(products[0].id, 5)}>Set Qty 5</button>
      <button onClick={() => updateQuantity(products[0].id, 0)}>Set Qty 0</button>
      <button onClick={() => updateQuantity(products[0].id, 150)}>Set Qty 150</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <BrowserRouter>
      <CartProvider>
        <TestComponent />
      </CartProvider>
    </BrowserRouter>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with empty cart', () => {
    renderWithProvider();
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('adds item to cart', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('items-count').textContent).toBe('1');
  });

  it('increments quantity when adding same item', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('2');
    expect(screen.getByTestId('items-count').textContent).toBe('1');
    expect(screen.getByTestId(`qty-${products[0].id}`).textContent).toBe('2');
  });

  it('removes item from cart', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Remove Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('updates quantity', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Set Qty 5'));
    expect(screen.getByTestId(`qty-${products[0].id}`).textContent).toBe('5');
  });

  it('clamps quantity to max 99', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Set Qty 150'));
    expect(screen.getByTestId(`qty-${products[0].id}`).textContent).toBe('99');
  });

  it('removes item when quantity set to 0', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Set Qty 0'));
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('clears cart', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 2'));
    fireEvent.click(screen.getByText('Clear Cart'));
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('calculates total price correctly', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 1'));
    const expectedPrice = (products[0].price * 2).toFixed(2);
    expect(screen.getByTestId('total-price').textContent).toBe(expectedPrice);
  });

  it('persists cart to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('calculates coverage total at 2% of the ring price', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring with Coverage'));
    const expectedCoverage = (ring.price * COVERAGE_RIDER_RATE).toFixed(2);
    expect(screen.getByTestId('coverage-total').textContent).toBe(expectedCoverage);
    expect(screen.getByTestId('total-price').textContent).toBe(ring.price.toFixed(2));
  });

  it('persists coverage rider choice to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring with Coverage'));
    const stored = localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1]?.[1];
    const parsed = JSON.parse(stored as string);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].hasCoverageRider).toBe(true);
    expect(parsed[0].product.id).toBe(ring.id);
  });

  it('restores coverage rider from localStorage round-trip', () => {
    const cartItem = { product: ring, quantity: 2, hasCoverageRider: true };
    localStorageMock.setItem('onboarding-demo-cart', JSON.stringify([cartItem]));
    renderWithProvider();
    const expectedCoverage = (ring.price * 2 * COVERAGE_RIDER_RATE).toFixed(2);
    expect(screen.getByTestId('coverage-total').textContent).toBe(expectedCoverage);
    expect(screen.getByTestId(`coverage-${ring.id}`).textContent).toBe('true');
  });
});
