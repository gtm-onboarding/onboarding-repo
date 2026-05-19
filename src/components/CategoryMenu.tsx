import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../data/products';

interface CategoryMenuProps {
  activeCategory?: string;
}

export function CategoryMenu({ activeCategory }: CategoryMenuProps) {
  const { colors, mode } = useTheme();

  const activeBg = mode === 'dark' ? 'rgba(224, 122, 95, 0.15)' : '#FEF6F4';

  return (
    <nav
      style={{
        backgroundColor: colors.surface,
        padding: '24px',
        borderRadius: '12px',
        boxShadow: `0 4px 12px ${colors.shadow}`,
        transition: 'background-color 250ms ease',
      }}
    >
      <h3
        style={{
          color: colors.text,
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
                color: activeCategory === category ? colors.primary : colors.textSecondary,
                fontWeight: activeCategory === category ? '600' : '500',
                display: 'block',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: activeCategory === category ? activeBg : 'transparent',
                fontSize: '15px',
                borderLeft: activeCategory === category ? `3px solid ${colors.primary}` : '3px solid transparent',
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
