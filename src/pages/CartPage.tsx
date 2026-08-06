import { Link, useNavigate } from 'react-router-dom';
import { useCart, TAX_RATE, JEWELRY_COVERAGE_RIDER_RATE } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../components/CartItem';

export function CartPage() {
  const {
    items,
    totalPrice,
    clearCart,
    jewelrySubtotal,
    coverageRiderSelected,
    setCoverageRiderSelected,
    coverageRiderPrice,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tax = totalPrice * TAX_RATE;
  const total = totalPrice + tax + coverageRiderPrice;
  const coverageRiderPercent = JEWELRY_COVERAGE_RIDER_RATE * 100;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/signin?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
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
            Shopping Cart
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
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#9A9A9A' }}>Your cart is empty</p>
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
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #C44536',
              color: '#C44536',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Clear Cart
          </button>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
            marginBottom: '24px',
          }}
        >
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
        {jewelrySubtotal > 0 && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}
          >
            <input
              id="jewelry-coverage-rider"
              type="checkbox"
              checked={coverageRiderSelected}
              onChange={(e) => setCoverageRiderSelected(e.target.checked)}
              style={{ width: '18px', height: '18px', marginTop: '2px' }}
            />
            <label htmlFor="jewelry-coverage-rider" style={{ flex: 1 }}>
              <span
                style={{
                  color: '#1A1A1A',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Add Jewelry Coverage Rider
              </span>
              <span style={{ color: '#6B6B6B', fontSize: '14px', lineHeight: '1.5' }}>
                Protects your jewelry against loss, theft, and accidental damage for one year.
                {' '}
                {coverageRiderPercent}% of your jewelry subtotal (${jewelrySubtotal.toFixed(2)}).
              </span>
            </label>
            <span style={{ color: '#E07A5F', fontWeight: '600', fontSize: '15px' }}>
              ${(jewelrySubtotal * JEWELRY_COVERAGE_RIDER_RATE).toFixed(2)}
            </span>
          </div>
        )}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#6B6B6B', fontSize: '15px' }}>Subtotal</span>
            <span style={{ color: '#1A1A1A', fontSize: '15px', fontWeight: '500' }}>${totalPrice.toFixed(2)}</span>
          </div>
          {coverageRiderSelected && jewelrySubtotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#6B6B6B', fontSize: '15px' }}>
                Jewelry Coverage Rider ({coverageRiderPercent}%)
              </span>
              <span style={{ color: '#1A1A1A', fontSize: '15px', fontWeight: '500' }}>
                ${coverageRiderPrice.toFixed(2)}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#6B6B6B', fontSize: '15px' }}>Tax ({TAX_RATE * 100}%)</span>
            <span style={{ color: '#1A1A1A', fontSize: '15px', fontWeight: '500' }}>${tax.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #F0EEEB',
              paddingTop: '16px',
              marginTop: '8px',
            }}
          >
            <span style={{ color: '#1A1A1A', fontWeight: '600', fontSize: '18px' }}>Total</span>
            <span style={{ color: '#E07A5F', fontWeight: '700', fontSize: '22px' }}>${total.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
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
          <button
            onClick={handleCheckout}
            style={{
              backgroundColor: '#E07A5F',
              color: 'white',
              border: 'none',
              padding: '16px 40px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '0.3px',
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
