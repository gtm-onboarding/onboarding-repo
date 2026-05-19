import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useRatings } from '../context/RatingContext';
import { StarRating } from './StarRating';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { activeTheme } = useTheme();
  const { getAverageRating, getRatingCount } = useRatings();
  const avgRating = getAverageRating(product.id);
  const ratingCount = getRatingCount(product.id);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

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
      <div style={{ position: 'relative' }}>
        <Link to={`/product/${product.id}`} style={{ overflow: 'hidden', display: 'block' }}>
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
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            boxShadow: activeTheme.shadows.sm,
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wishlisted ? '#E07A5F' : 'none'}
            stroke={wishlisted ? '#E07A5F' : '#666'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
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
