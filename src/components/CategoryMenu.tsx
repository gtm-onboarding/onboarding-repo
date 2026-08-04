import { Link } from 'react-router-dom';
import { categories } from '../data/products';
import { theme } from '../theme';

interface CategoryMenuProps {
  activeCategory?: string;
}

export function CategoryMenu({ activeCategory }: CategoryMenuProps) {
  return (
    <nav
      style={{
        backgroundColor: theme.colors.surface,
        padding: '24px',
        borderRadius: theme.radii.md,
        boxShadow: theme.shadows.md,
      }}
    >
      <h3
        style={{
          color: theme.colors.text,
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
                color: activeCategory === category ? theme.colors.primary : theme.colors.textSecondary,
                fontWeight: activeCategory === category ? '600' : '500',
                display: 'block',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: activeCategory === category ? theme.colors.primarySurface : 'transparent',
                fontSize: '15px',
                borderLeft:
                  activeCategory === category
                    ? `3px solid ${theme.colors.primary}`
                    : '3px solid transparent',
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
