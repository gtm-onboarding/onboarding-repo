import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';

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

describe('SearchBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the search input', () => {
    renderSearchBar();
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toBeInTheDocument();
  });

  it('shows no dropdown until a query is typed', () => {
    renderSearchBar();
    fireEvent.focus(screen.getByRole('searchbox'));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('filters products by name case-insensitively', () => {
    renderSearchBar();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'wireless' } });
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.queryByText('Smart Watch')).not.toBeInTheDocument();
  });

  it('ignores whitespace-only queries', () => {
    renderSearchBar();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '   ' } });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', () => {
    renderSearchBar();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzzz' } });
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('navigates to the product page when a result is clicked', () => {
    renderSearchBar();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'smart watch' } });
    fireEvent.click(screen.getByText('Smart Watch'));
    expect(mockNavigate).toHaveBeenCalledWith('/product/elec-2');
  });

  it('clears the query after selecting a result', () => {
    renderSearchBar();
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'smart watch' } });
    fireEvent.click(screen.getByText('Smart Watch'));
    expect(input).toHaveValue('');
  });

  it('selects the highlighted result with arrow keys and Enter', () => {
    renderSearchBar();
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'e' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate.mock.calls[0][0]).toMatch(/^\/product\//);
  });

  it('closes the dropdown on Escape', () => {
    renderSearchBar();
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'wireless' } });
    expect(screen.getByRole('list')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', () => {
    renderSearchBar();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'wireless' } });
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('caps the number of results shown', () => {
    renderSearchBar();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'e' } });
    expect(screen.getAllByRole('listitem').length).toBeLessThanOrEqual(6);
  });
});
