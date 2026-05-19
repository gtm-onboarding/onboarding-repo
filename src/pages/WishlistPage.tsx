import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HeartIcon } from '../components/icons/HeartIcon';

export function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (index: number) => {
    const item = items[index];
    addToCart(item);
    removeFromWishlist(item.id);
  };

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
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#9A9A9A' }}>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
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
                padding: '24px',
                borderBottom: index < items.length - 1 ? '1px solid #F0EEEB' : 'none',
                gap: '24px',
              }}
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />
              </Link>
              <div style={{ flex: 1 }}>
                <Link
                  to={`/product/${product.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <h3
                    style={{
                      color: '#1A1A1A',
                      fontSize: '17px',
                      fontWeight: '600',
                      marginBottom: '6px',
                    }}
                  >
                    {product.name}
                  </h3>
                </Link>
                <p
                  style={{
                    color: '#9A9A9A',
                    fontSize: '14px',
                    marginBottom: '4px',
                  }}
                >
                  {product.category}
                </p>
                <span
                  style={{
                    color: '#E07A5F',
                    fontWeight: '700',
                    fontSize: '18px',
                  }}
                >
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => handleMoveToCart(index)}
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <HeartIcon filled size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '28px' }}>
          <Link
            to="/"
            style={{
              color: '#6B6B6B',
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
