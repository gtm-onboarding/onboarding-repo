import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { HeartIcon } from '../components/icons/HeartIcon';

export function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

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
            <HeartIcon size={48} />
            <p style={{ fontSize: '18px', marginTop: '16px', marginBottom: '24px', color: '#9A9A9A' }}>
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
              Continue Shopping
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
          <button
            onClick={clearWishlist}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #C44536',
              color: '#C44536',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Clear Wishlist
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {items.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => removeFromWishlist(product.id)}
                aria-label="Remove from wishlist"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10,
                  backgroundColor: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(26, 26, 26, 0.12)',
                }}
              >
                <HeartIcon filled size={18} />
              </button>
              <Link to={`/product/${product.id}`} style={{ overflow: 'hidden', display: 'block' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '220px',
                    objectFit: 'cover',
                  }}
                />
              </Link>
              <div style={{ padding: '20px' }}>
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
                <span style={{ color: '#E07A5F', fontWeight: '700', fontSize: '20px' }}>
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
