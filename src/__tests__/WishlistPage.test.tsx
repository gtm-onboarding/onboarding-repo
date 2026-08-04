import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WishlistPage } from '../pages/WishlistPage';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
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

function renderWishlistPage() {
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

  it('shows an empty state when nothing is saved', () => {
    renderWishlistPage();
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
    expect(screen.queryByText('Clear Wishlist')).not.toBeInTheDocument();
  });

  it('renders saved products', () => {
    localStorageMock.setItem('onboarding-demo-wishlist', JSON.stringify([products[0], products[1]]));
    renderWishlistPage();
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
    expect(screen.getByText(products[1].name)).toBeInTheDocument();
  });

  it('removes a product when its heart is clicked', () => {
    localStorageMock.setItem('onboarding-demo-wishlist', JSON.stringify([products[0]]));
    renderWishlistPage();
    fireEvent.click(screen.getByLabelText(`Remove ${products[0].name} from wishlist`));
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
  });

  it('clears the wishlist', () => {
    localStorageMock.setItem('onboarding-demo-wishlist', JSON.stringify([products[0], products[1]]));
    renderWishlistPage();
    fireEvent.click(screen.getByText('Clear Wishlist'));
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
  });
});
