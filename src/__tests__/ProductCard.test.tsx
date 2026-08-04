import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { RatingsProvider } from '../context/RatingsContext';
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

const mockAddToCart = vi.fn();

vi.mock('../context/CartContext', async () => {
  const actual = await vi.importActual('../context/CartContext');
  return {
    ...actual,
    useCart: () => ({
      addToCart: mockAddToCart,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      showToast: vi.fn(),
      toastMessage: null,
    }),
  };
});

function renderProductCard() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <RatingsProvider>
            <ProductCard product={products[0]} />
          </RatingsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders product information', () => {
    renderProductCard();
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
    expect(screen.getByText(`$${products[0].price.toFixed(2)}`)).toBeInTheDocument();
  });

  it('renders product image', () => {
    renderProductCard();
    const img = screen.getByAltText(products[0].name);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', products[0].image);
  });

  it('calls addToCart when button clicked', () => {
    renderProductCard();
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockAddToCart).toHaveBeenCalledWith(products[0]);
  });

  it('renders read-only stars with no ratings yet', () => {
    renderProductCard();
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
    expect(screen.getByLabelText('Rated 0.0 out of 5')).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: /Rate \d star/ })).toHaveLength(0);
  });

  it('renders the average rating and count from stored ratings', () => {
    localStorageMock.setItem(
      'onboarding-demo-ratings',
      JSON.stringify({ [products[0].id]: { 'a@example.com': 5, 'b@example.com': 4 } })
    );
    renderProductCard();
    expect(screen.getByText('4.5 (2 ratings)')).toBeInTheDocument();
    expect(screen.getByLabelText('Rated 4.5 out of 5')).toBeInTheDocument();
  });

  it('links to product page', () => {
    renderProductCard();
    const links = screen.getAllByRole('link');
    const productLink = links.find((link) => link.getAttribute('href') === `/product/${products[0].id}`);
    expect(productLink).toBeInTheDocument();
  });
});
