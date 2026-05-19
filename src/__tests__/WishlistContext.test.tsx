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
  const { items, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist, totalItems } = useWishlist();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="items-count">{items.length}</span>
      <span data-testid="in-wishlist-1">{isInWishlist(products[0].id) ? 'yes' : 'no'}</span>
      {items.map((item) => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.name}
        </div>
      ))}
      <button onClick={() => addToWishlist(products[0])}>Add Product 1</button>
      <button onClick={() => addToWishlist(products[1])}>Add Product 2</button>
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

  it('starts with empty wishlist', () => {
    renderWithProvider();
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('adds item to wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('items-count').textContent).toBe('1');
  });

  it('does not duplicate items when adding same product', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('items-count').textContent).toBe('1');
  });

  it('removes item from wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Remove Product 1'));
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('checks if item is in wishlist', () => {
    renderWithProvider();
    expect(screen.getByTestId('in-wishlist-1').textContent).toBe('no');
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(screen.getByTestId('in-wishlist-1').textContent).toBe('yes');
  });

  it('clears wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    fireEvent.click(screen.getByText('Add Product 2'));
    fireEvent.click(screen.getByText('Clear Wishlist'));
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('persists wishlist to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Product 1'));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
