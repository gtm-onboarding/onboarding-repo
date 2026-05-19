import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HeartIcon } from '../components/icons/HeartIcon';

export function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              marginBottom: '32px',
              fontSize: '36px',
              fontWeight: '600',
            }}
          >
            My Wishlist
          </h1>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              textAlign: 'center',
              padding: '80px',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
            }}
          >
            <HeartIcon size={48} color="#E8E6E3" />
            <p style={{ fontSize: '18px', marginBottom: '24px', marginTop: '16px', color: '#9A9A9A' }}>
              Your wishlist is empty
            </p>
            <Link
              to="/"
              style={{
                color: '#E07A5F',
                fontSize: '15px',
                fontWeight: '600',
              }}
            >
              Discover Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              fontSize: '36px',
              fontWeight: '600',
            }}
          >
            My Wishlist
          </h1>
          <span style={{ color: '#6B6B6B', fontSize: '15px' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
          }}
        >
          {items.map((product, index) => (
            <div
              key={product.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px 24px',
                gap: '20px',
                borderBottom: index < items.length - 1 ? '1px solid #F0EEEB' : 'none',
              }}
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </Link>
              <div style={{ flex: 1 }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    {product.name}
                  </h3>
                </Link>
                <p style={{ color: '#9A9A9A', fontSize: '13px' }}>{product.category}</p>
              </div>
              <span style={{ color: '#E07A5F', fontWeight: '700', fontSize: '18px', minWidth: '80px', textAlign: 'right' }}>
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
                  whiteSpace: 'nowrap',
                }}
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(product.id)}
                aria-label="Remove from wishlist"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #E8E6E3',
                  borderRadius: '6px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <HeartIcon filled size={16} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '28px' }}>
          <Link
            to="/"
            style={{
              color: '#6B6B6B',
              padding: '12px 0',
              fontSize: '15px',
              fontWeight: '500',
            }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
