import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../data/products';

interface CategoryMenuProps {
  activeCategory?: string;
}

export function CategoryMenu({ activeCategory }: CategoryMenuProps) {
  const { theme, mode } = useTheme();
  const c = theme.colors;

  const activeBg = mode === 'dark' ? '#3A2520' : '#FEF6F4';

  return (
    <nav
      style={{
        backgroundColor: c.surface,
        padding: '24px',
        borderRadius: '12px',
        boxShadow: theme.shadows.md,
        transition: 'background-color 250ms ease',
      }}
    >
      <h3
        style={{
          color: c.text,
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
                color: activeCategory === category ? c.primary : c.textSecondary,
                fontWeight: activeCategory === category ? '600' : '500',
                display: 'block',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: activeCategory === category ? activeBg : 'transparent',
                fontSize: '15px',
                borderLeft: activeCategory === category ? `3px solid ${c.primary}` : '3px solid transparent',
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
