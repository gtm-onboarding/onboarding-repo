import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartProvider, TAX_RATE, JEWELRY_COVERAGE_RIDER_RATE } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { products } from '../data/products';
import { CartItem } from '../types';

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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const jewelryProduct = products.find((product) => product.category === 'Jewelry')!;
const nonJewelryProduct = products.find((product) => product.category !== 'Jewelry')!;

function renderPage(page: 'cart' | 'checkout', cartItems: CartItem[]) {
  localStorageMock.setItem('onboarding-demo-cart', JSON.stringify(cartItems));
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{page === 'cart' ? <CartPage /> : <CheckoutPage />}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('jewelry coverage rider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('is not offered when the cart has no jewelry', () => {
    renderPage('cart', [{ product: nonJewelryProduct, quantity: 1 }]);
    expect(screen.queryByLabelText(/Add Jewelry Coverage Rider/)).not.toBeInTheDocument();
  });

  it('is offered unchecked when the cart has jewelry', () => {
    renderPage('cart', [{ product: jewelryProduct, quantity: 1 }]);
    const checkbox = screen.getByLabelText(/Add Jewelry Coverage Rider/) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    expect(screen.queryByText(/Jewelry Coverage Rider \(2%\)/)).not.toBeInTheDocument();
  });

  it('adds the rider price to the cart total when selected', () => {
    const quantity = 2;
    renderPage('cart', [{ product: jewelryProduct, quantity }]);
    const subtotal = jewelryProduct.price * quantity;
    const riderPrice = subtotal * JEWELRY_COVERAGE_RIDER_RATE;

    fireEvent.click(screen.getByLabelText(/Add Jewelry Coverage Rider/));

    expect(screen.getByText(/Jewelry Coverage Rider \(2%\)/)).toBeInTheDocument();
    const total = subtotal + subtotal * TAX_RATE + riderPrice;
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument();
  });

  it('prices the rider off the jewelry subtotal only', () => {
    renderPage('cart', [
      { product: jewelryProduct, quantity: 1 },
      { product: nonJewelryProduct, quantity: 1 },
    ]);
    fireEvent.click(screen.getByLabelText(/Add Jewelry Coverage Rider/));

    const riderPrice = jewelryProduct.price * JEWELRY_COVERAGE_RIDER_RATE;
    expect(screen.getAllByText(`$${riderPrice.toFixed(2)}`).length).toBeGreaterThan(0);
  });

  it('carries the selection into checkout totals', () => {
    localStorageMock.setItem('onboarding-demo-coverage-rider', 'true');
    renderPage('checkout', [{ product: jewelryProduct, quantity: 1 }]);

    const riderPrice = jewelryProduct.price * JEWELRY_COVERAGE_RIDER_RATE;
    const total = jewelryProduct.price + jewelryProduct.price * TAX_RATE + riderPrice;
    expect(screen.getByText(/Jewelry Coverage Rider \(2%\)/)).toBeInTheDocument();
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument();
  });

  it('omits the rider from checkout when not selected', () => {
    renderPage('checkout', [{ product: jewelryProduct, quantity: 1 }]);
    expect(screen.queryByText(/Jewelry Coverage Rider/)).not.toBeInTheDocument();
  });
});
