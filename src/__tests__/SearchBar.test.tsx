import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { products } from '../data/products';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderSearchBar() {
  return render(
    <BrowserRouter>
      <SearchBar />
    </BrowserRouter>
  );
}

function typeQuery(value: string) {
  const input = screen.getByRole('searchbox');
  fireEvent.change(input, { target: { value } });
  return input;
}

describe('SearchBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('shows matching products in a dropdown', () => {
    renderSearchBar();
    typeQuery('watch');
    expect(screen.getByText('Smart Watch')).toBeInTheDocument();
  });

  it('matches case-insensitively', () => {
    renderSearchBar();
    typeQuery('HEADPHONES');
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('shows no dropdown for an empty query', () => {
    renderSearchBar();
    typeQuery('   ');
    expect(screen.queryByText('No products found')).not.toBeInTheDocument();
    expect(screen.queryByText(products[0].name)).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', () => {
    renderSearchBar();
    typeQuery('zzzzz');
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('navigates to the product page and clears the input on select', () => {
    renderSearchBar();
    const input = typeQuery('watch');
    fireEvent.click(screen.getByText('Smart Watch'));
    expect(mockNavigate).toHaveBeenCalledWith('/product/elec-2');
    expect(input).toHaveValue('');
    expect(screen.queryByText('Smart Watch')).not.toBeInTheDocument();
  });

  it('selects the highlighted result with the keyboard', () => {
    renderSearchBar();
    const input = typeQuery('s');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    const matches = products.filter((product) => product.name.toLowerCase().includes('s'));
    expect(mockNavigate).toHaveBeenCalledWith(`/product/${matches[1].id}`);
  });

  it('closes the dropdown on Escape', () => {
    renderSearchBar();
    const input = typeQuery('watch');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByText('Smart Watch')).not.toBeInTheDocument();
  });
});
