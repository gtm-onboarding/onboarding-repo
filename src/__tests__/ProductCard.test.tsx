import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CartProvider } from '../context/CartContext';
import { RatingsProvider } from '../context/RatingsContext';
import { products } from '../data/products';

const mockAddToCart = vi.fn();
const mockRateProduct = vi.fn();
let mockRatings: Record<string, number[]> = {};

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

vi.mock('../context/RatingsContext', async () => {
  const actual = await vi.importActual('../context/RatingsContext');
  return {
    ...actual,
    useRatings: () => ({
      ratings: mockRatings,
      rateProduct: mockRateProduct,
      getAverageRating: (productId: string) => {
        const values = mockRatings[productId] ?? [];
        if (values.length === 0) return 0;
        return values.reduce((sum, value) => sum + value, 0) / values.length;
      },
      getRatingCount: (productId: string) => mockRatings[productId]?.length ?? 0,
    }),
  };
});

function renderProductCard() {
  return render(
    <BrowserRouter>
      <CartProvider>
        <RatingsProvider>
          <ProductCard product={products[0]} />
        </RatingsProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    mockRatings = {};
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

  it('links to product page', () => {
    renderProductCard();
    const links = screen.getAllByRole('link');
    const productLink = links.find((link) => link.getAttribute('href') === `/product/${products[0].id}`);
    expect(productLink).toBeInTheDocument();
  });

  it('displays the average rating and count', () => {
    mockRatings = { [products[0].id]: [5, 4, 3] };
    renderProductCard();
    expect(screen.getByText('4.0 (3)')).toBeInTheDocument();
  });

  it('shows an empty state when the product has no ratings', () => {
    renderProductCard();
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
  });
});
