import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WishlistProvider, useWishlist } from '../context/WishlistContext';
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
  const { items, totalItems, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
    useWishlist();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="has-product-1">{String(isInWishlist(products[0].id))}</span>
      {items.map((product) => (
        <span key={product.id} data-testid={`item-${product.id}`}>
          {product.name}
        </span>
      ))}
      <button onClick={() => addToWishlist(products[0])}>Add Product 1</button>
      <button onClick={() => toggleWishlist(products[0])}>Toggle Product 1</button>
      <button onClick={() => removeFromWishlist(products[0].id)}>Remove Product 1</button>
      <button onClick={clearWishlist}>Clear Wishlist</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <BrowserRouter>
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    </BrowserRouter>
  );
}

describe('WishlistContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts empty', () => {
    renderWithProvider();
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('has-product-1').textContent).toBe('false');
  });

  it('adds a product without duplicating it', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('has-product-1').textContent).toBe('true');
  });

  it('toggles a product on and off', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    fireEvent.click(screen.getByText('Toggle Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('0');
  });

  it('removes and clears products', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Remove Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Clear Wishlist'));
    expect(screen.getByTestId('total-items').textContent).toBe('0');
  });

  it('persists to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    const stored = JSON.parse(localStorageMock.getItem('onboarding-demo-wishlist') as string);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(products[0].id);
  });

  it('loads persisted items', () => {
    localStorageMock.setItem('onboarding-demo-wishlist', JSON.stringify([products[1]]));
    renderWithProvider();
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId(`item-${products[1].id}`)).toBeInTheDocument();
  });

  it('recovers from corrupt persisted data', () => {
    localStorageMock.setItem('onboarding-demo-wishlist', 'not-json');
    renderWithProvider();
    expect(screen.getByTestId('total-items').textContent).toBe('0');
  });
});
