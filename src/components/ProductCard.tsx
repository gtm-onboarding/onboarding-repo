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
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
      }}
    >
      <Link to={`/product/${product.id}`} style={{ overflow: 'hidden', position: 'relative', display: 'block' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '220px',
            objectFit: 'cover',
            transition: 'transform 400ms ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {product.price < 50 && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.surface,
              fontSize: '12px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: theme.radii.sm,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}
          >
            Sale
          </span>
        )}
      </Link>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              color: '#1A1A1A',
              marginBottom: '8px',
              fontSize: '17px',
              fontWeight: '600',
              letterSpacing: '-0.2px',
            }}
          >
            {product.name}
          </h3>
        </Link>
        <p
          style={{
            color: '#9A9A9A',
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
            borderTop: '1px solid #F0EEEB',
          }}
        >
          <span style={{ color: '#E07A5F', fontWeight: '700', fontSize: '20px' }}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            style={{
              backgroundColor: '#1A1A1A',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
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
