import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import { products, JEWELRY_COVERAGE_RIDER_RATE, COVERAGE_RIDER_ELIGIBLE_PRODUCT_ID } from '../data/products';

const ring = products.find((p) => p.id === COVERAGE_RIDER_ELIGIBLE_PRODUCT_ID)!;

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
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, coverageRiderTotal } =
    useCart();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
      <span data-testid="coverage-rider-total">{coverageRiderTotal.toFixed(2)}</span>
      <span data-testid="items-count">{items.length}</span>
      {items.map((item) => (
        <div key={item.product.id} data-testid={`item-${item.product.id}`}>
          <span data-testid={`qty-${item.product.id}`}>{item.quantity}</span>
          <span data-testid={`rider-${item.product.id}`}>{item.hasCoverageRider ? 'yes' : 'no'}</span>
        </div>
      ))}
      <button onClick={() => addToCart(products[0])}>Add Product 1</button>
      <button onClick={() => addToCart(products[1])}>Add Product 2</button>
      <button onClick={() => addToCart(ring)}>Add Ring</button>
      <button onClick={() => addToCart(ring, true)}>Add Ring With Rider</button>
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

  it('does not charge a coverage rider by default', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring'));
    expect(screen.getByTestId(`rider-${ring.id}`).textContent).toBe('no');
    expect(screen.getByTestId('coverage-rider-total').textContent).toBe('0.00');
  });

  it('prices the coverage rider at 2% of the item price when opted in', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring With Rider'));
    expect(screen.getByTestId(`rider-${ring.id}`).textContent).toBe('yes');
    const expectedRiderCost = (ring.price * JEWELRY_COVERAGE_RIDER_RATE).toFixed(2);
    expect(screen.getByTestId('coverage-rider-total').textContent).toBe(expectedRiderCost);
  });

  it('scales the coverage rider cost with quantity', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring With Rider'));
    fireEvent.click(screen.getByText('Add Ring With Rider'));
    expect(screen.getByTestId(`qty-${ring.id}`).textContent).toBe('2');
    const expectedRiderCost = (ring.price * 2 * JEWELRY_COVERAGE_RIDER_RATE).toFixed(2);
    expect(screen.getByTestId('coverage-rider-total').textContent).toBe(expectedRiderCost);
  });

  it('keeps the coverage rider opted in once added, even if re-added without it', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring With Rider'));
    fireEvent.click(screen.getByText('Add Ring'));
    expect(screen.getByTestId(`rider-${ring.id}`).textContent).toBe('yes');
  });

  it('round-trips the coverage rider choice through localStorage', () => {
    const { unmount } = renderWithProvider();
    fireEvent.click(screen.getByText('Add Ring With Rider'));
    const stored = JSON.parse(localStorageMock.getItem('onboarding-demo-cart') as string);
    expect(stored).toEqual([{ product: ring, quantity: 1, hasCoverageRider: true }]);
    unmount();

    renderWithProvider();
    expect(screen.getByTestId(`rider-${ring.id}`).textContent).toBe('yes');
    expect(screen.getByTestId(`qty-${ring.id}`).textContent).toBe('1');
    const expectedRiderCost = (ring.price * JEWELRY_COVERAGE_RIDER_RATE).toFixed(2);
    expect(screen.getByTestId('coverage-rider-total').textContent).toBe(expectedRiderCost);
  });
});
