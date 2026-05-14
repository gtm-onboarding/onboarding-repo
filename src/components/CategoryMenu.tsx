import { Link } from 'react-router-dom';
import { categories } from '../data/products';

interface CategoryMenuProps {
  activeCategory?: string;
}

export function CategoryMenu({ activeCategory }: CategoryMenuProps) {
  return (
    <nav
      style={{
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
      }}
    >
      <h3
        style={{
          color: '#1A1A1A',
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
                color: activeCategory === category ? '#E07A5F' : '#6B6B6B',
                fontWeight: activeCategory === category ? '600' : '500',
                display: 'block',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: activeCategory === category ? '#FEF6F4' : 'transparent',
                fontSize: '15px',
                borderLeft: activeCategory === category ? '3px solid #E07A5F' : '3px solid transparent',
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
