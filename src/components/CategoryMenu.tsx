import { Link } from 'react-router-dom';
import { categories } from '../data/products';

interface CategoryMenuProps {
  activeCategory?: string;
}

export function CategoryMenu({ activeCategory }: CategoryMenuProps) {
  return (
    <nav
      style={{
        backgroundColor: 'var(--color-surface)',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
      }}
    >
      <h3
        style={{
          color: 'var(--color-text)',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        Categories
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {categories.map((category) => (
          <li key={category} style={{ marginBottom: '4px' }}>
            <Link
              to={`/category/${encodeURIComponent(category)}`}
              style={{
                color: activeCategory === category ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: activeCategory === category ? '600' : '500',
                display: 'block',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: activeCategory === category ? 'var(--color-primary-soft)' : 'transparent',
                fontSize: '15px',
                borderLeft: activeCategory === category ? '3px solid var(--color-primary)' : '3px solid transparent',
              }}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
