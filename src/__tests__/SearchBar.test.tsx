import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

function renderSearchBar(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SearchBar />
      <LocationDisplay />
      <Routes>
        <Route path="*" element={null} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SearchBar', () => {
  it('renders a search input', () => {
    renderSearchBar();
    expect(screen.getByLabelText('Search products')).toBeInTheDocument();
  });

  it('navigates to the search route with the encoded query on submit', () => {
    renderSearchBar();
    fireEvent.change(screen.getByLabelText('Search products'), {
      target: { value: 'wireless headphones' },
    });
    fireEvent.submit(screen.getByRole('search'));
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/search?q=wireless%20headphones'
    );
  });

  it('does not navigate when the query is empty', () => {
    renderSearchBar();
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });

  it('initializes the input from the q query parameter on the search page', () => {
    renderSearchBar('/search?q=watch');
    expect(screen.getByLabelText('Search products')).toHaveValue('watch');
  });

  it('leaves the input empty outside the search page', () => {
    renderSearchBar('/category/Electronics?q=watch');
    expect(screen.getByLabelText('Search products')).toHaveValue('');
  });
});
