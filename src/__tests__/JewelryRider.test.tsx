import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartProvider, JEWELRY_RIDER_NAME, JEWELRY_RIDER_RATE } from '../context/CartContext';
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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const TAX_RATE = 0.08;

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

function riderCheckbox() {
  return screen.getByRole('checkbox', { name: JEWELRY_RIDER_NAME });
}

describe('Jewelry coverage rider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('offers the rider when the cart contains jewelry', () => {
    renderPage('cart', [{ product: jewelryProduct, quantity: 1 }]);
    expect(riderCheckbox()).not.toBeChecked();
  });

  it('does not offer the rider without jewelry in the cart', () => {
    renderPage('cart', [{ product: nonJewelryProduct, quantity: 1 }]);
    expect(screen.queryByRole('checkbox', { name: JEWELRY_RIDER_NAME })).not.toBeInTheDocument();
  });

  it('adds the rider price and taxes it when selected', () => {
    renderPage('cart', [{ product: jewelryProduct, quantity: 2 }]);
    const subtotal = jewelryProduct.price * 2;
    const riderPrice = subtotal * JEWELRY_RIDER_RATE;

    fireEvent.click(riderCheckbox());

    expect(riderCheckbox()).toBeChecked();
    expect(screen.getByText(`$${riderPrice.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`$${((subtotal + riderPrice) * TAX_RATE).toFixed(2)}`)).toBeInTheDocument();
    expect(
      screen.getByText(`$${(subtotal + riderPrice + (subtotal + riderPrice) * TAX_RATE).toFixed(2)}`)
    ).toBeInTheDocument();
  });

  it('prices the rider only on the jewelry portion of a mixed cart', () => {
    renderPage('cart', [
      { product: jewelryProduct, quantity: 1 },
      { product: nonJewelryProduct, quantity: 1 },
    ]);

    fireEvent.click(riderCheckbox());

    const riderPrice = jewelryProduct.price * JEWELRY_RIDER_RATE;
    expect(screen.getByText(`$${riderPrice.toFixed(2)}`)).toBeInTheDocument();
  });

  it('removes the rider charge when deselected', () => {
    renderPage('cart', [{ product: jewelryProduct, quantity: 1 }]);
    const riderPrice = jewelryProduct.price * JEWELRY_RIDER_RATE;

    fireEvent.click(riderCheckbox());
    fireEvent.click(riderCheckbox());

    expect(riderCheckbox()).not.toBeChecked();
    expect(screen.queryByText(`$${riderPrice.toFixed(2)}`)).not.toBeInTheDocument();
    expect(screen.getByText(`$${(jewelryProduct.price * TAX_RATE).toFixed(2)}`)).toBeInTheDocument();
  });

  it('persists the rider selection', () => {
    const { unmount } = renderPage('cart', [{ product: jewelryProduct, quantity: 1 }]);
    fireEvent.click(riderCheckbox());
    unmount();

    renderPage('cart', [{ product: jewelryProduct, quantity: 1 }]);
    expect(riderCheckbox()).toBeChecked();
  });

  it('shows the rider in the checkout order summary', () => {
    localStorageMock.setItem('onboarding-demo-jewelry-rider', 'true');
    renderPage('checkout', [{ product: jewelryProduct, quantity: 1 }]);

    const riderPrice = jewelryProduct.price * JEWELRY_RIDER_RATE;
    const total = jewelryProduct.price + riderPrice + (jewelryProduct.price + riderPrice) * TAX_RATE;
    expect(screen.getByText(JEWELRY_RIDER_NAME)).toBeInTheDocument();
    expect(screen.getByText(`$${riderPrice.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument();
  });
});
