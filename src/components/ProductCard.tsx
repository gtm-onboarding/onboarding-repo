import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
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
            transition: 'transform 400ms ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              color: 'var(--color-text)',
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
            color: 'var(--color-textMuted)',
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
            borderTop: '1px solid var(--color-borderLight)',
          }}
        >
          <span style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '20px' }}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            style={{
              backgroundColor: 'var(--color-text)',
              color: 'var(--color-textInverse)',
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
