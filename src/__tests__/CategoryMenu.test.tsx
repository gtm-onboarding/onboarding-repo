import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CategoryMenu } from '../components/CategoryMenu';
import { categories } from '../data/products';

function renderCategoryMenu(activeCategory?: string) {
  return render(
    <MemoryRouter>
      <CategoryMenu activeCategory={activeCategory} />
    </MemoryRouter>
  );
}

describe('CategoryMenu', () => {
  it('renders categories heading', () => {
    renderCategoryMenu();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('renders all category links', () => {
    renderCategoryMenu();
    categories.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });

  it('highlights active category with accent color', () => {
    renderCategoryMenu('Electronics');
    const activeLink = screen.getByText('Electronics');
    expect(activeLink).toHaveStyle({ color: '#E07A5F', fontWeight: '600' });
  });

  it('styles inactive categories normally', () => {
    renderCategoryMenu('Electronics');
    const inactiveLink = screen.getByText('Clothing');
    expect(inactiveLink).toHaveStyle({ color: '#6B6B6B', fontWeight: '500' });
  });

  it('renders without active category', () => {
    renderCategoryMenu();
    categories.forEach((cat) => {
      const link = screen.getByText(cat);
      expect(link).toHaveStyle({ color: '#6B6B6B' });
    });
  });
});
