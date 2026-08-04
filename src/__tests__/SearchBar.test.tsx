import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderSearchBar() {
  return render(
    <BrowserRouter>
      <SearchBar />
    </BrowserRouter>
  );
}

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    renderSearchBar();
    expect(screen.getByLabelText('Search products')).toBeInTheDocument();
  });

  it('does not show dropdown when query is empty', () => {
    renderSearchBar();
    fireEvent.focus(screen.getByLabelText('Search products'));
    expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
  });

  it('shows matching products in dropdown', () => {
    renderSearchBar();
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: 'watch' } });
    expect(screen.getByText('Smart Watch')).toBeInTheDocument();
    expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
  });

  it('matches case-insensitively', () => {
    renderSearchBar();
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: 'WIRELESS' } });
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('shows empty state when nothing matches', () => {
    renderSearchBar();
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: 'zzzz' } });
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('navigates to product page when a result is selected', () => {
    renderSearchBar();
    const input = screen.getByLabelText('Search products');
    fireEvent.change(input, { target: { value: 'watch' } });
    fireEvent.click(screen.getByText('Smart Watch'));
    expect(mockNavigate).toHaveBeenCalledWith('/product/elec-2');
    expect(input).toHaveValue('');
  });

  it('navigates to the first result on Enter', () => {
    renderSearchBar();
    const input = screen.getByLabelText('Search products');
    fireEvent.change(input, { target: { value: 'watch' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/product/elec-2');
  });

  it('closes dropdown on Escape', () => {
    renderSearchBar();
    const input = screen.getByLabelText('Search products');
    fireEvent.change(input, { target: { value: 'watch' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByText('Smart Watch')).not.toBeInTheDocument();
  });

  it('reopens dropdown when clicking the input after Escape', () => {
    renderSearchBar();
    const input = screen.getByLabelText('Search products');
    fireEvent.change(input, { target: { value: 'watch' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.mouseDown(input);
    expect(screen.getByText('Smart Watch')).toBeInTheDocument();
  });
});
