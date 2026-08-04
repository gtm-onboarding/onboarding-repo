import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../components/CartItem';
import { theme } from '../theme';

export function CartPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tax = totalPrice * 0.08;
  const total = totalPrice + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/signin?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', padding: '40px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: theme.fonts.display,
              color: theme.colors.text,
              marginBottom: '32px',
              fontSize: '36px',
              fontWeight: '600',
            }}
          >
            Shopping Cart
          </h1>
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: '16px',
              textAlign: 'center',
              padding: '80px',
              boxShadow: theme.shadows.md,
            }}
          >
            <p style={{ fontSize: '18px', marginBottom: '24px', color: theme.colors.textMuted }}>Your cart is empty</p>
            <Link
              to="/"
              style={{
                color: theme.colors.primary,
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
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: theme.fonts.display,
              color: theme.colors.text,
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
              border: `1px solid ${theme.colors.error}`,
              color: theme.colors.error,
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
            backgroundColor: theme.colors.surface,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: theme.shadows.md,
            marginBottom: '24px',
          }}
        >
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
        <div
          style={{
            backgroundColor: theme.colors.surface,
            padding: '28px',
            borderRadius: '16px',
            boxShadow: theme.shadows.md,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: theme.colors.textSecondary, fontSize: '15px' }}>Subtotal</span>
            <span style={{ color: theme.colors.text, fontSize: '15px', fontWeight: '500' }}>${totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: theme.colors.textSecondary, fontSize: '15px' }}>Tax (8%)</span>
            <span style={{ color: theme.colors.text, fontSize: '15px', fontWeight: '500' }}>${tax.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: `1px solid ${theme.colors.borderLight}`,
              paddingTop: '16px',
              marginTop: '8px',
            }}
          >
            <span style={{ color: theme.colors.text, fontWeight: '600', fontSize: '18px' }}>Total</span>
            <span style={{ color: theme.colors.primary, fontWeight: '700', fontSize: '22px' }}>${total.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
          <Link
            to="/"
            style={{
              color: theme.colors.textSecondary,
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
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryContrast,
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
