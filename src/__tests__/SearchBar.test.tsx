import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderSearchBar() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SearchBar />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>,
  );
}

describe('SearchBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the search input', () => {
    renderSearchBar();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('displays matching products when typing a query', () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'wireless' } });
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('shows "No results found" for non-matching queries', () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('navigates to product page when clicking a result', () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'wireless' } });
    fireEvent.mouseDown(screen.getByText('Wireless Headphones'));
    expect(mockNavigate).toHaveBeenCalledWith('/product/elec-1');
  });

  it('navigates to the first result on Enter', () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'smart' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/product/elec-2');
  });

  it('closes dropdown on Escape', () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'desk' } });
    expect(screen.getByText('LED Desk Lamp')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByText('LED Desk Lamp')).not.toBeInTheDocument();
  });

  it('clears query after selecting a result', () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText('Search products...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'bluetooth' } });
    fireEvent.mouseDown(screen.getByText('Bluetooth Speaker'));
    expect(input.value).toBe('');
  });

  it('filters results case-insensitively', () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'DENIM' } });
    expect(screen.getByText('Denim Jacket')).toBeInTheDocument();
  });

  it('supports arrow key navigation', () => {
    renderSearchBar();
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'e' } });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalled();
  });
});
