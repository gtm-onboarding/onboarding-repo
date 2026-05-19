import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { HeartIcon } from './icons/HeartIcon';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

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
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Link to={`/product/${product.id}`} style={{ overflow: 'hidden', display: 'block' }}>
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
        <button
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
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
            boxShadow: '0 2px 8px rgba(26, 26, 26, 0.1)',
          }}
        >
          <HeartIcon filled={wishlisted} size={18} />
        </button>
      </div>
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
