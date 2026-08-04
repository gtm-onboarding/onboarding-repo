import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useRatings } from '../context/RatingsContext';
import { StarRating } from '../components/StarRating';

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart, showToast } = useCart();
  const { rateProduct, getAverageRating, getRatingCount, getUserRating } = useRatings();
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
      <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
            <div style={{ backgroundColor: '#F5F3F0', height: '500px', borderRadius: '16px' }} />
            <div>
              <div style={{ backgroundColor: '#F5F3F0', height: '48px', borderRadius: '8px', marginBottom: '20px', width: '70%' }} />
              <div style={{ backgroundColor: '#F5F3F0', height: '32px', borderRadius: '8px', marginBottom: '32px', width: '30%' }} />
              <div style={{ backgroundColor: '#F5F3F0', height: '120px', borderRadius: '8px', marginBottom: '32px' }} />
              <div style={{ backgroundColor: '#F5F3F0', height: '56px', borderRadius: '8px', width: '50%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              marginBottom: '16px',
              fontSize: '32px',
            }}
          >
            Product Not Found
          </h1>
          <p style={{ color: '#9A9A9A', marginBottom: '32px', fontSize: '16px' }}>
            The product you're looking for doesn't exist.
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
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = getAverageRating(product.id);
  const ratingCount = getRatingCount(product.id);
  const userRating = getUserRating(product.id);

  const handleRate = (stars: number) => {
    rateProduct(product.id, stars);
    showToast(`You rated ${product.name} ${stars} star${stars === 1 ? '' : 's'}`);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Link
          to={`/category/${encodeURIComponent(product.category)}`}
          style={{
            color: '#6B6B6B',
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
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
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
                color: '#E07A5F',
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
                fontFamily: '"Playfair Display", Georgia, serif',
                color: '#1A1A1A',
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
                color: '#E07A5F',
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
                color: '#6B6B6B',
                lineHeight: '1.8',
                marginBottom: '40px',
                fontSize: '16px',
              }}
            >
              {product.description}
            </p>
            <div
              style={{
                marginBottom: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #F0EEEB',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <StarRating value={userRating ?? averageRating} onRate={handleRate} size={24} />
                <span style={{ color: '#6B6B6B', fontSize: '14px' }}>
                  {ratingCount > 0
                    ? `${averageRating.toFixed(1)} out of 5 (${ratingCount} rating${ratingCount === 1 ? '' : 's'})`
                    : 'No ratings yet'}
                </span>
              </div>
              <p style={{ color: '#9A9A9A', fontSize: '13px' }}>
                {userRating ? `You rated this ${userRating} out of 5` : 'Tap a star to rate this product'}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '32px',
              }}
            >
              <label style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '15px' }}>Quantity:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    backgroundColor: '#F5F3F0',
                    color: '#1A1A1A',
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
                    color: '#1A1A1A',
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
                    backgroundColor: '#F5F3F0',
                    color: '#1A1A1A',
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
                backgroundColor: '#E07A5F',
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
