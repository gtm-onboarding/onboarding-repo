import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import { products } from '../data/products';
import {
  JEWELRY_RIDER_PRODUCT_ID,
  JEWELRY_RIDER_RATE,
  getRiderEligibleSubtotal,
  getRiderPrice,
} from '../data/pricing';

const CART_STORAGE_KEY = 'onboarding-demo-cart';

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

const ring = products.find((product) => product.id === JEWELRY_RIDER_PRODUCT_ID)!;
const otherProduct = products.find((product) => product.category !== 'Jewelry')!;

function TestComponent() {
  const { addToCart, clearCart, riderSelected, setRiderSelected, riderEligible, riderPrice } = useCart();
  return (
    <div>
      <span data-testid="rider-eligible">{String(riderEligible)}</span>
      <span data-testid="rider-selected">{String(riderSelected)}</span>
      <span data-testid="rider-price">{riderPrice.toFixed(2)}</span>
      <button onClick={() => addToCart(ring)}>Add Ring</button>
      <button onClick={() => addToCart(otherProduct)}>Add Other</button>
      <button onClick={() => setRiderSelected(true)}>Select Rider</button>
      <button onClick={() => setRiderSelected(false)}>Unselect Rider</button>
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

describe('jewelry rider pricing', () => {
  it('prices the rider at 2% of the ring price', () => {
    expect(JEWELRY_RIDER_RATE).toBe(0.02);
    const items = [{ product: ring, quantity: 1 }];
    expect(getRiderEligibleSubtotal(items)).toBe(ring.price);
    expect(getRiderPrice(items, true)).toBeCloseTo(ring.price * 0.02, 10);
  });

  it('scales with quantity and ignores non-rider products', () => {
    const items = [
      { product: ring, quantity: 3 },
      { product: otherProduct, quantity: 2 },
    ];
    expect(getRiderPrice(items, true)).toBeCloseTo(ring.price * 3 * 0.02, 10);
  });

  it('charges nothing when the rider is not selected', () => {
    expect(getRiderPrice([{ product: ring, quantity: 1 }], false)).toBe(0);
  });
});

describe('jewelry rider in CartContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('is only eligible when the ring is in the cart', () => {
    renderWithProvider();
    expect(screen.getByTestId('rider-eligible').textContent).toBe('false');
    fireEvent.click(screen.getByText('Add Other'));
    expect(screen.getByTestId('rider-eligible').textContent).toBe('false');
    fireEvent.click(screen.getByText('Add Ring'));
    expect(screen.getByTestId('rider-eligible').textContent).toBe('true');
  });

  it('adds the rider charge when opted in', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring'));
    expect(screen.getByTestId('rider-price').textContent).toBe('0.00');
    fireEvent.click(screen.getByText('Select Rider'));
    expect(screen.getByTestId('rider-price').textContent).toBe((ring.price * JEWELRY_RIDER_RATE).toFixed(2));
    fireEvent.click(screen.getByText('Unselect Rider'));
    expect(screen.getByTestId('rider-price').textContent).toBe('0.00');
  });

  it('resets the rider when the cart is cleared', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring'));
    fireEvent.click(screen.getByText('Select Rider'));
    fireEvent.click(screen.getByText('Clear Cart'));
    expect(screen.getByTestId('rider-selected').textContent).toBe('false');
    expect(screen.getByTestId('rider-price').textContent).toBe('0.00');
  });

  it('round-trips the rider choice through localStorage', () => {
    const first = renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring'));
    fireEvent.click(screen.getByText('Select Rider'));
    const stored = JSON.parse(localStorageMock.getItem(CART_STORAGE_KEY)!);
    expect(stored.riderSelected).toBe(true);
    expect(stored.items).toHaveLength(1);
    first.unmount();

    renderWithProvider();
    expect(screen.getByTestId('rider-selected').textContent).toBe('true');
    expect(screen.getByTestId('rider-price').textContent).toBe((ring.price * JEWELRY_RIDER_RATE).toFixed(2));
  });

  it('reads legacy array-shaped carts without a rider', () => {
    localStorageMock.setItem(CART_STORAGE_KEY, JSON.stringify([{ product: ring, quantity: 1 }]));
    renderWithProvider();
    expect(screen.getByTestId('rider-eligible').textContent).toBe('true');
    expect(screen.getByTestId('rider-selected').textContent).toBe('false');
  });
});
