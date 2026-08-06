import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  CartProvider,
  useCart,
  JEWELRY_COVERAGE_RATE,
} from '../context/CartContext';
import { CartPage } from '../pages/CartPage';
import { AuthProvider } from '../context/AuthContext';
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

const jewelryProduct = products.find((p) => p.category === 'Jewelry')!;
const nonJewelryProduct = products.find((p) => p.category !== 'Jewelry')!;

function ContextProbe() {
  const {
    hasJewelry,
    coverageRiderEnabled,
    setCoverageRiderEnabled,
    coverageRiderCost,
    jewelrySubtotal,
    addToCart,
  } = useCart();
  return (
    <div>
      <span data-testid="has-jewelry">{String(hasJewelry)}</span>
      <span data-testid="rider-enabled">{String(coverageRiderEnabled)}</span>
      <span data-testid="rider-cost">{coverageRiderCost.toFixed(2)}</span>
      <span data-testid="jewelry-subtotal">{jewelrySubtotal.toFixed(2)}</span>
      <button onClick={() => addToCart(jewelryProduct)}>Add Jewelry</button>
      <button onClick={() => addToCart(nonJewelryProduct)}>Add Other</button>
      <button onClick={() => setCoverageRiderEnabled(true)}>Enable Rider</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <BrowserRouter>
      <CartProvider>
        <ContextProbe />
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

describe('Jewelry coverage rider (CartContext)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('detects jewelry in the cart', () => {
    renderProbe();
    expect(screen.getByTestId('has-jewelry').textContent).toBe('false');
    fireEvent.click(screen.getByText('Add Jewelry'));
    expect(screen.getByTestId('has-jewelry').textContent).toBe('true');
    expect(screen.getByTestId('jewelry-subtotal').textContent).toBe(jewelryProduct.price.toFixed(2));
  });

  it('costs nothing until the rider is enabled', () => {
    renderProbe();
    fireEvent.click(screen.getByText('Add Jewelry'));
    expect(screen.getByTestId('rider-cost').textContent).toBe('0.00');
    fireEvent.click(screen.getByText('Enable Rider'));
    const expected = (jewelryProduct.price * JEWELRY_COVERAGE_RATE).toFixed(2);
    expect(screen.getByTestId('rider-cost').textContent).toBe(expected);
  });

  it('charges nothing when there is no jewelry, even if enabled', () => {
    renderProbe();
    fireEvent.click(screen.getByText('Add Other'));
    fireEvent.click(screen.getByText('Enable Rider'));
    expect(screen.getByTestId('rider-enabled').textContent).toBe('true');
    expect(screen.getByTestId('rider-cost').textContent).toBe('0.00');
  });

  it('persists the rider opt-in to localStorage', () => {
    renderProbe();
    fireEvent.click(screen.getByText('Enable Rider'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('onboarding-demo-coverage-rider', 'true');
  });
});

describe('Jewelry coverage rider (CartPage)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('hides the rider option when the cart has no jewelry', () => {
    renderCartPage([{ product: nonJewelryProduct, quantity: 1 }]);
    expect(screen.queryByLabelText(/Add Jewelry Coverage Rider/i)).not.toBeInTheDocument();
  });

  it('shows the rider option and adds its cost to the total when checked', () => {
    renderCartPage([{ product: jewelryProduct, quantity: 1 }]);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    const riderCost = jewelryProduct.price * JEWELRY_COVERAGE_RATE;
    expect(screen.getByText(`$${riderCost.toFixed(2)}`)).toBeInTheDocument();
  });
});
