import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { theme } from '../theme';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radii.md,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadows.md,
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
            transition: `transform ${theme.transitions.slow}`,
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>
      <div style={{ padding: theme.spacing.lg, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              color: theme.colors.text,
              marginBottom: theme.spacing.sm,
              fontSize: theme.fontSizes.md,
              fontWeight: theme.fontWeights.semibold,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            {product.name}
          </h3>
        </Link>
        <p
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.fontSizes.base,
            marginBottom: theme.spacing.md,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: theme.lineHeights.normal,
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
            paddingTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          <span style={{ 
            color: theme.colors.primary, 
            fontWeight: theme.fontWeights.bold, 
            fontSize: theme.fontSizes.lg 
          }}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            style={{
              backgroundColor: theme.colors.text,
              color: 'white',
              border: 'none',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.radii.sm,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontWeights.semibold,
              letterSpacing: theme.letterSpacing.wide,
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
