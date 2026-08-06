import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderSearchBar(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SearchBar />
    </MemoryRouter>
  );
}

describe('SearchBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the search input', () => {
    renderSearchBar();
    expect(screen.getByLabelText('Search products')).toBeInTheDocument();
  });

  it('updates the input value when typing', () => {
    renderSearchBar();
    const input = screen.getByLabelText('Search products') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'watch' } });
    expect(input.value).toBe('watch');
  });

  it('navigates to the search results page on submit', () => {
    renderSearchBar();
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: 'smart watch' } });
    fireEvent.click(screen.getByLabelText('Search'));
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=smart%20watch');
  });

  it('trims whitespace before navigating', () => {
    renderSearchBar();
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: '  lamp  ' } });
    fireEvent.click(screen.getByLabelText('Search'));
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=lamp');
  });

  it('does not navigate when the query is empty', () => {
    renderSearchBar();
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: '   ' } });
    fireEvent.click(screen.getByLabelText('Search'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('initializes from the q query parameter', () => {
    renderSearchBar('/search?q=beanie');
    expect(screen.getByLabelText('Search products')).toHaveValue('beanie');
  });
});
