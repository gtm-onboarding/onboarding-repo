import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  const { items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, totalItems } = useWishlist();
  return (
    <div>
      <span data-testid="total">{totalItems}</span>
      <span data-testid="items">{items.map((i) => i.name).join(',')}</span>
      <button onClick={() => addToWishlist(products[0])}>Add First</button>
      <button onClick={() => addToWishlist(products[1])}>Add Second</button>
      <button onClick={() => removeFromWishlist(products[0].id)}>Remove First</button>
      <button onClick={() => toggleWishlist(products[0])}>Toggle First</button>
      <span data-testid="in-wishlist">{isInWishlist(products[0].id) ? 'yes' : 'no'}</span>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <WishlistProvider>
      <TestComponent />
    </WishlistProvider>
  );
}

describe('WishlistContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with empty wishlist', () => {
    renderWithProvider();
    expect(screen.getByTestId('total').textContent).toBe('0');
    expect(screen.getByTestId('in-wishlist').textContent).toBe('no');
  });

  it('adds a product to wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add First'));
    expect(screen.getByTestId('total').textContent).toBe('1');
    expect(screen.getByTestId('in-wishlist').textContent).toBe('yes');
  });

  it('does not duplicate products', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add First'));
    fireEvent.click(screen.getByText('Add First'));
    expect(screen.getByTestId('total').textContent).toBe('1');
  });

  it('removes a product from wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add First'));
    expect(screen.getByTestId('total').textContent).toBe('1');
    fireEvent.click(screen.getByText('Remove First'));
    expect(screen.getByTestId('total').textContent).toBe('0');
    expect(screen.getByTestId('in-wishlist').textContent).toBe('no');
  });

  it('toggles a product in and out of wishlist', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle First'));
    expect(screen.getByTestId('in-wishlist').textContent).toBe('yes');
    fireEvent.click(screen.getByText('Toggle First'));
    expect(screen.getByTestId('in-wishlist').textContent).toBe('no');
  });

  it('persists items to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add First'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'onboarding-demo-wishlist',
      expect.stringContaining(products[0].id)
    );
  });

  it('loads items from localStorage on mount', () => {
    localStorageMock.setItem('onboarding-demo-wishlist', JSON.stringify([products[0]]));
    renderWithProvider();
    expect(screen.getByTestId('total').textContent).toBe('1');
    expect(screen.getByTestId('in-wishlist').textContent).toBe('yes');
  });
});
