import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartItem } from '../components/CartItem';
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

const testItem = { product: products[0], quantity: 2 };

function renderCartItem(item = testItem) {
  return render(
    <MemoryRouter>
      <CartProvider>
        <CartItem item={item} />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('CartItem', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders product name', () => {
    renderCartItem();
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
  });

  it('renders product price', () => {
    renderCartItem();
    expect(screen.getByText(`$${products[0].price.toFixed(2)} each`)).toBeInTheDocument();
  });

  it('renders product image', () => {
    renderCartItem();
    const img = screen.getByAltText(products[0].name);
    expect(img).toHaveAttribute('src', products[0].image);
  });

  it('renders quantity', () => {
    renderCartItem();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders subtotal', () => {
    renderCartItem();
    const subtotal = (products[0].price * 2).toFixed(2);
    expect(screen.getByText(`$${subtotal}`)).toBeInTheDocument();
  });

  it('has decrease quantity button', () => {
    renderCartItem();
    expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
  });

  it('has increase quantity button', () => {
    renderCartItem();
    expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
  });

  it('has remove button', () => {
    renderCartItem();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('calls updateQuantity on decrease click', () => {
    renderCartItem();
    fireEvent.click(screen.getByLabelText('Decrease quantity'));
  });

  it('calls updateQuantity on increase click', () => {
    renderCartItem();
    fireEvent.click(screen.getByLabelText('Increase quantity'));
  });

  it('calls removeFromCart on remove click', () => {
    renderCartItem();
    fireEvent.click(screen.getByText('Remove'));
  });
});
