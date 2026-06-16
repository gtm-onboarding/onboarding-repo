import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WishlistPage } from '../pages/WishlistPage';
import { WishlistProvider } from '../context/WishlistContext';
import { CartProvider } from '../context/CartContext';
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

function renderWishlistPage(wishlistItems: typeof products = []) {
  localStorageMock.setItem('onboarding-demo-wishlist', JSON.stringify(wishlistItems));
  return render(
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <WishlistPage />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

describe('WishlistPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('displays empty wishlist state', () => {
    renderWishlistPage([]);
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('displays wishlist items', () => {
    renderWishlistPage([products[0]]);
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
    expect(screen.getByText(`$${products[0].price.toFixed(2)}`)).toBeInTheDocument();
  });

  it('removes item when Remove button is clicked', () => {
    renderWishlistPage([products[0], products[1]]);
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
    expect(screen.getByText(products[1].name)).toBeInTheDocument();

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText(products[0].name)).not.toBeInTheDocument();
    expect(screen.getByText(products[1].name)).toBeInTheDocument();
  });

  it('shows Add to Cart button for each item', () => {
    renderWishlistPage([products[0], products[1]]);
    const addToCartButtons = screen.getAllByText('Add to Cart');
    expect(addToCartButtons).toHaveLength(2);
  });
});
