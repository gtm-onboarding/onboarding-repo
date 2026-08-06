import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import { CartPage } from '../pages/CartPage';
import { AuthProvider } from '../context/AuthContext';
import { products } from '../data/products';
import { JEWELRY_RIDER_RATE, TAX_RATE, getJewelrySubtotal, getRiderPrice } from '../data/pricing';

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

const jewelryProduct = products.find((product) => product.category === 'Jewelry')!;
const electronicsProduct = products.find((product) => product.category === 'Electronics')!;

function TestComponent() {
  const { addToCart, clearCart, jewelrySubtotal, riderEligible, riderSelected, setRiderSelected, riderPrice } = useCart();
  return (
    <div>
      <span data-testid="jewelry-subtotal">{jewelrySubtotal.toFixed(2)}</span>
      <span data-testid="rider-eligible">{String(riderEligible)}</span>
      <span data-testid="rider-selected">{String(riderSelected)}</span>
      <span data-testid="rider-price">{riderPrice.toFixed(2)}</span>
      <button onClick={() => addToCart(jewelryProduct)}>Add Jewelry</button>
      <button onClick={() => addToCart(electronicsProduct)}>Add Electronics</button>
      <button onClick={() => setRiderSelected(true)}>Select Rider</button>
      <button onClick={() => setRiderSelected(false)}>Deselect Rider</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <BrowserRouter>
      <CartProvider>
        <TestComponent />
      </CartProvider>
    </BrowserRouter>
  );
}

function renderCartPage(cartItems: Array<{ product: typeof products[0]; quantity: number }>) {
  localStorageMock.setItem('onboarding-demo-cart', JSON.stringify(cartItems));
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('jewelry coverage rider pricing', () => {
  it('sums only jewelry items', () => {
    const items = [
      { product: jewelryProduct, quantity: 2 },
      { product: electronicsProduct, quantity: 1 },
    ];
    expect(getJewelrySubtotal(items)).toBeCloseTo(jewelryProduct.price * 2, 2);
  });

  it('prices the rider as a rate of the jewelry subtotal', () => {
    expect(getRiderPrice(1000)).toBeCloseTo(1000 * JEWELRY_RIDER_RATE, 2);
  });
});

describe('CartContext jewelry rider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('is not eligible without jewelry in the cart', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Electronics'));
    expect(screen.getByTestId('rider-eligible').textContent).toBe('false');
    expect(screen.getByTestId('rider-price').textContent).toBe('0.00');
  });

  it('charges the rider when selected with jewelry in the cart', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Jewelry'));
    fireEvent.click(screen.getByText('Select Rider'));
    expect(screen.getByTestId('rider-eligible').textContent).toBe('true');
    expect(screen.getByTestId('rider-price').textContent).toBe(
      (jewelryProduct.price * JEWELRY_RIDER_RATE).toFixed(2)
    );
  });

  it('charges nothing when the rider is deselected', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Jewelry'));
    fireEvent.click(screen.getByText('Select Rider'));
    fireEvent.click(screen.getByText('Deselect Rider'));
    expect(screen.getByTestId('rider-price').textContent).toBe('0.00');
  });

  it('resets the rider selection when the cart is cleared', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Add Jewelry'));
    fireEvent.click(screen.getByText('Select Rider'));
    fireEvent.click(screen.getByText('Clear Cart'));
    expect(screen.getByTestId('rider-selected').textContent).toBe('false');
    expect(screen.getByTestId('rider-price').textContent).toBe('0.00');
  });

  it('restores a persisted rider selection', () => {
    localStorageMock.setItem('onboarding-demo-rider', 'true');
    renderWithProvider();
    expect(screen.getByTestId('rider-selected').textContent).toBe('true');
  });
});

describe('CartPage jewelry rider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('hides the rider option for carts without jewelry', () => {
    renderCartPage([{ product: electronicsProduct, quantity: 1 }]);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('adds the rider and tax on it to the total when checked', () => {
    renderCartPage([{ product: jewelryProduct, quantity: 1 }]);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const riderPrice = jewelryProduct.price * JEWELRY_RIDER_RATE;
    const total = (jewelryProduct.price + riderPrice) * (1 + TAX_RATE);
    expect(screen.getByText(`$${riderPrice.toFixed(2)}`)).toBeTruthy();
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeTruthy();
  });
});
