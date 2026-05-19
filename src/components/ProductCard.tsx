import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useRatings } from '../context/RatingContext';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { activeTheme } = useTheme();
  const { getAverageRating, getRatingCount } = useRatings();
  const avgRating = getAverageRating(product.id);
  const ratingCount = getRatingCount(product.id);

  return (
    <div
      style={{
        backgroundColor: activeTheme.colors.surface,
        borderRadius: activeTheme.radii.md,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: activeTheme.shadows.md,
      }}
    >
      <Link to={`/product/${product.id}`} style={{ overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '220px',
            objectFit: 'cover',
            transition: `transform ${activeTheme.transitions.slow}`,
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              color: activeTheme.colors.text,
              marginBottom: '8px',
              fontSize: '17px',
              fontWeight: '600',
              letterSpacing: '-0.2px',
            }}
          >
            {product.name}
          </h3>
        </Link>
        {ratingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <StarRating rating={avgRating} size={14} />
            <span style={{ color: activeTheme.colors.textMuted, fontSize: '12px' }}>
              ({ratingCount})
            </span>
          </div>
        )}
        <p
          style={{
            color: activeTheme.colors.textMuted,
            fontSize: '14px',
            marginBottom: '16px',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.5',
          }}
        >
          {product.description}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: `1px solid ${activeTheme.colors.borderLight}`,
          }}
        >
          <span style={{ color: activeTheme.colors.primary, fontWeight: '700', fontSize: '20px' }}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            style={{
              backgroundColor: activeTheme.colors.text,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: activeTheme.radii.sm,
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.3px',
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
