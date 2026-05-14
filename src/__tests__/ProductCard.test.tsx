import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CartProvider } from '../context/CartContext';
import { products } from '../data/products';

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
      <CartProvider>
        <ProductCard product={products[0]} />
      </CartProvider>
    </BrowserRouter>
  );
}

describe('ProductCard', () => {
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
});
