import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
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
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
      <span data-testid="items-count">{items.length}</span>
      {items.map((item) => (
        <div key={item.product.id} data-testid={`item-${item.product.id}`}>
          <span data-testid={`qty-${item.product.id}`}>{item.quantity}</span>
        </div>
      ))}
      <button onClick={() => addToCart(products[0])}>Add Product 1</button>
      <button onClick={() => addToCart(products[1])}>Add Product 2</button>
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
});
