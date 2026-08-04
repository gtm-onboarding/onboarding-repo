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

const WISHLIST_STORAGE_KEY = 'onboarding-demo-wishlist';

function TestComponent() {
  const { items, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist, totalItems } =
    useWishlist();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="in-wishlist-1">{String(isInWishlist(products[0].id))}</span>
      {items.map((product) => (
        <div key={product.id} data-testid={`item-${product.id}`}>
          {product.name}
        </div>
      ))}
      <button onClick={() => addToWishlist(products[0])}>Add Product 1</button>
      <button onClick={() => addToWishlist(products[1])}>Add Product 2</button>
      <button onClick={() => removeFromWishlist(products[0].id)}>Remove Product 1</button>
      <button onClick={() => toggleWishlist(products[0])}>Toggle Product 1</button>
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

  it('starts with an empty wishlist', () => {
    renderWithProvider();
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('in-wishlist-1').textContent).toBe('false');
  });

  it('adds a product to the wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('in-wishlist-1').textContent).toBe('true');
  });

  it('does not add the same product twice', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('1');
  });

  it('removes a product from the wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 2'));
    fireEvent.click(screen.getByText('Remove Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('in-wishlist-1').textContent).toBe('false');
    expect(screen.getByTestId(`item-${products[1].id}`)).toBeInTheDocument();
  });

  it('toggles a product on and off', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle Product 1'));
    expect(screen.getByTestId('in-wishlist-1').textContent).toBe('true');
    fireEvent.click(screen.getByText('Toggle Product 1'));
    expect(screen.getByTestId('in-wishlist-1').textContent).toBe('false');
  });

  it('clears the wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 2'));
    fireEvent.click(screen.getByText('Clear Wishlist'));
    expect(screen.getByTestId('total-items').textContent).toBe('0');
  });

  it('persists the wishlist to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    const stored = JSON.parse(localStorageMock.getItem(WISHLIST_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(products[0].id);
  });

  it('loads the wishlist from localStorage', () => {
    localStorageMock.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([products[1]]));
    renderWithProvider();
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId(`item-${products[1].id}`)).toBeInTheDocument();
  });

  it('recovers from corrupted localStorage data', () => {
    localStorageMock.setItem(WISHLIST_STORAGE_KEY, 'not-json');
    renderWithProvider();
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(WISHLIST_STORAGE_KEY);
  });
});
