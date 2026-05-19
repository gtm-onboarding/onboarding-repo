import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../components/CartItem';
import { useTheme } from '../context/ThemeContext';

export function CartPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const c = theme.colors;

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
      <div style={{ backgroundColor: c.background, minHeight: '100vh', padding: '40px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: theme.fonts.display,
              color: c.text,
              marginBottom: '32px',
              fontSize: '36px',
              fontWeight: '600',
            }}
          >
            Shopping Cart
          </h1>
          <div
            style={{
              backgroundColor: c.surface,
              borderRadius: '16px',
              textAlign: 'center',
              padding: '80px',
              boxShadow: theme.shadows.md,
            }}
          >
            <p style={{ fontSize: '18px', marginBottom: '24px', color: c.textMuted }}>Your cart is empty</p>
            <Link
              to="/"
              style={{
                color: c.primary,
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
    <div style={{ backgroundColor: c.background, minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: theme.fonts.display,
              color: c.text,
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
              border: `1px solid ${c.error}`,
              color: c.error,
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
            backgroundColor: c.surface,
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
            backgroundColor: c.surface,
            padding: '28px',
            borderRadius: '16px',
            boxShadow: theme.shadows.md,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: c.textSecondary, fontSize: '15px' }}>Subtotal</span>
            <span style={{ color: c.text, fontSize: '15px', fontWeight: '500' }}>${totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: c.textSecondary, fontSize: '15px' }}>Tax (8%)</span>
            <span style={{ color: c.text, fontSize: '15px', fontWeight: '500' }}>${tax.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: `1px solid ${c.borderLight}`,
              paddingTop: '16px',
              marginTop: '8px',
            }}
          >
            <span style={{ color: c.text, fontWeight: '600', fontSize: '18px' }}>Total</span>
            <span style={{ color: c.primary, fontWeight: '700', fontSize: '22px' }}>${total.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
          <Link
            to="/"
            style={{
              color: c.textSecondary,
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
              backgroundColor: c.primary,
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
