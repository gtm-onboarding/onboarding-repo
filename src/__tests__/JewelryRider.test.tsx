import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { products } from '../data/products';
import { JEWELRY_CATEGORY, JEWELRY_RIDER_MINIMUM, JEWELRY_RIDER_RATE, TAX_RATE } from '../data/pricing';
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

const jewelryProduct = products.find((product) => product.category === JEWELRY_CATEGORY)!;
const nonJewelryProduct = products.find((product) => product.category !== JEWELRY_CATEGORY)!;

function renderWithCart(ui: React.ReactElement, cartItems: CartItem[]) {
  localStorageMock.setItem('onboarding-demo-cart', JSON.stringify(cartItems));
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function expectedRider(subtotal: number) {
  return Math.max(JEWELRY_RIDER_MINIMUM, subtotal * JEWELRY_RIDER_RATE);
}

describe('jewelry coverage rider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('is not offered when the cart has no jewelry', () => {
    renderWithCart(<CartPage />, [{ product: nonJewelryProduct, quantity: 1 }]);
    expect(screen.queryByLabelText(/Add Jewelry Coverage Rider/)).not.toBeInTheDocument();
  });

  it('quotes the rider price for jewelry in the cart', () => {
    renderWithCart(<CartPage />, [{ product: jewelryProduct, quantity: 1 }]);
    const quote = expectedRider(jewelryProduct.price);
    expect(screen.getByLabelText(/Add Jewelry Coverage Rider/)).not.toBeChecked();
    expect(screen.getByText(`$${quote.toFixed(2)}`)).toBeInTheDocument();
  });

  it('adds the rider to the cart total when selected', () => {
    const quantity = 2;
    renderWithCart(<CartPage />, [{ product: jewelryProduct, quantity }]);
    const subtotal = jewelryProduct.price * quantity;
    const totalWithoutRider = subtotal + subtotal * TAX_RATE;
    expect(screen.getByText(`$${totalWithoutRider.toFixed(2)}`)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Add Jewelry Coverage Rider/));

    const total = totalWithoutRider + expectedRider(subtotal);
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument();
  });

  it('prices the rider off the jewelry subtotal only', () => {
    renderWithCart(<CartPage />, [
      { product: jewelryProduct, quantity: 1 },
      { product: nonJewelryProduct, quantity: 3 },
    ]);
    fireEvent.click(screen.getByLabelText(/Add Jewelry Coverage Rider/));
    expect(screen.getAllByText(`$${expectedRider(jewelryProduct.price).toFixed(2)}`).length).toBeGreaterThan(0);
  });

  it('carries the selected rider into checkout', () => {
    localStorageMock.setItem('onboarding-demo-jewelry-rider', 'true');
    renderWithCart(<CheckoutPage />, [{ product: jewelryProduct, quantity: 1 }]);
    const rider = expectedRider(jewelryProduct.price);
    const total = jewelryProduct.price + jewelryProduct.price * TAX_RATE + rider;
    expect(screen.getByText('Jewelry Coverage Rider')).toBeInTheDocument();
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument();
  });

  it('omits the rider from checkout when not selected', () => {
    renderWithCart(<CheckoutPage />, [{ product: jewelryProduct, quantity: 1 }]);
    expect(screen.queryByText('Jewelry Coverage Rider')).not.toBeInTheDocument();
  });
});
