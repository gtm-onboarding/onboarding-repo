import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const c = theme.colors;
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    setIsLoading(true);
    setQuantity(1);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [productId]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: c.background, minHeight: '100vh', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
            <div style={{ backgroundColor: c.surfaceAlt, height: '500px', borderRadius: '16px' }} />
            <div>
              <div style={{ backgroundColor: c.surfaceAlt, height: '48px', borderRadius: '8px', marginBottom: '20px', width: '70%' }} />
              <div style={{ backgroundColor: c.surfaceAlt, height: '32px', borderRadius: '8px', marginBottom: '32px', width: '30%' }} />
              <div style={{ backgroundColor: c.surfaceAlt, height: '120px', borderRadius: '8px', marginBottom: '32px' }} />
              <div style={{ backgroundColor: c.surfaceAlt, height: '56px', borderRadius: '8px', width: '50%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: c.background, minHeight: '100vh', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
          <h1
            style={{
              fontFamily: theme.fonts.display,
              color: c.text,
              marginBottom: '16px',
              fontSize: '32px',
            }}
          >
            Product Not Found
          </h1>
          <p style={{ color: c.textMuted, marginBottom: '32px', fontSize: '16px' }}>
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            style={{
              backgroundColor: c.primary,
              color: 'white',
              padding: '14px 32px',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: '600',
              fontSize: '15px',
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div style={{ backgroundColor: c.background, minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Link
          to={`/category/${encodeURIComponent(product.category)}`}
          style={{
            color: c.textSecondary,
            marginBottom: '32px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <span style={{ fontSize: '18px' }}>←</span> Back to {product.category}
        </Link>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            marginTop: '24px',
            backgroundColor: c.surface,
            borderRadius: '16px',
            padding: '40px',
            boxShadow: theme.shadows.md,
            transition: 'background-color 250ms ease',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '500px',
              objectFit: 'cover',
              borderRadius: '12px',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p
              style={{
                color: c.primary,
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              {product.category}
            </p>
            <h1
              style={{
                fontFamily: theme.fonts.display,
                color: c.text,
                marginBottom: '20px',
                fontSize: '36px',
                fontWeight: '600',
                letterSpacing: '-0.5px',
              }}
            >
              {product.name}
            </h1>
            <span
              style={{
                color: c.primary,
                fontSize: '32px',
                fontWeight: '700',
                display: 'block',
                marginBottom: '32px',
              }}
            >
              ${product.price.toFixed(2)}
            </span>
            <p
              style={{
                color: c.textSecondary,
                lineHeight: '1.8',
                marginBottom: '40px',
                fontSize: '16px',
              }}
            >
              {product.description}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '32px',
                paddingTop: '24px',
                borderTop: `1px solid ${c.borderLight}`,
              }}
            >
              <label style={{ color: c.text, fontWeight: '500', fontSize: '15px' }}>Quantity:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    backgroundColor: c.surfaceAlt,
                    color: c.text,
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: '500',
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    color: c.text,
                    minWidth: '48px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  style={{
                    backgroundColor: c.surfaceAlt,
                    color: c.text,
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: '500',
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: c.primary,
                color: '#fff',
                border: 'none',
                padding: '18px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                width: '100%',
                letterSpacing: '0.5px',
                marginTop: 'auto',
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
