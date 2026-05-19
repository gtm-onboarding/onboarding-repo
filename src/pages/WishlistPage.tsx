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
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', paddingTop: '80px' }}>
          <HeartIcon size={48} color="#D1D1D1" />
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              marginTop: '24px',
              marginBottom: '12px',
              fontSize: '32px',
              fontWeight: '600',
            }}
          >
            Your Wishlist is Empty
          </h1>
          <p style={{ color: '#9A9A9A', marginBottom: '32px', fontSize: '16px' }}>
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link
            to="/"
            style={{
              backgroundColor: '#E07A5F',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: '600',
              fontSize: '15px',
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              fontSize: '36px',
              fontWeight: '600',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}
          >
            My Wishlist
          </h1>
          <p style={{ color: '#9A9A9A', fontSize: '15px' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
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
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => removeFromWishlist(product.id)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 1,
                  boxShadow: '0 2px 8px rgba(26, 26, 26, 0.1)',
                }}
                aria-label={`Remove ${product.name} from wishlist`}
              >
                <HeartIcon filled size={18} />
              </button>
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
          ))}
        </div>
      </div>
    </div>
  );
}
