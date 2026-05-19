import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, mode } = useTheme();
  const c = theme.colors;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const tax = totalPrice * 0.08;
  const total = totalPrice + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    clearCart();
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (items.length === 0 && !showConfirmation) {
    navigate('/cart');
    return null;
  }

  const successBg = mode === 'dark' ? '#1B3A1B' : '#E8F5E9';

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${c.border}`,
    borderRadius: '8px',
    backgroundColor: c.surface,
    color: c.text,
    fontSize: '15px',
  };

  const labelStyle = {
    display: 'block',
    color: c.text,
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500' as const,
  };

  return (
    <div style={{ backgroundColor: c.background, minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: theme.fonts.display,
            color: c.text,
            marginBottom: '40px',
            fontSize: '36px',
            fontWeight: '600',
          }}
        >
          Checkout
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                backgroundColor: c.surface,
                padding: '32px',
                borderRadius: '16px',
                marginBottom: '24px',
                boxShadow: theme.shadows.md,
                transition: 'background-color 250ms ease',
              }}
            >
              <h2
                style={{
                  color: c.text,
                  marginBottom: '24px',
                  fontSize: '18px',
                  fontWeight: '600',
                  letterSpacing: '-0.2px',
                }}
              >
                Shipping Information
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: c.surface,
                padding: '32px',
                borderRadius: '16px',
                marginBottom: '24px',
                boxShadow: theme.shadows.md,
                transition: 'background-color 250ms ease',
              }}
            >
              <h2
                style={{
                  color: c.text,
                  marginBottom: '24px',
                  fontSize: '18px',
                  fontWeight: '600',
                  letterSpacing: '-0.2px',
                }}
              >
                Payment Information
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: c.primary,
                color: 'white',
                border: 'none',
                padding: '18px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                width: '100%',
                letterSpacing: '0.3px',
              }}
            >
              Place Order
            </button>
          </form>
          <div
            style={{
              backgroundColor: c.surface,
              padding: '28px',
              borderRadius: '16px',
              height: 'fit-content',
              boxShadow: theme.shadows.md,
              position: 'sticky',
              top: '120px',
              transition: 'background-color 250ms ease',
            }}
          >
            <h2
              style={{
                color: c.text,
                marginBottom: '24px',
                fontSize: '18px',
                fontWeight: '600',
                letterSpacing: '-0.2px',
              }}
            >
              Order Summary
            </h2>
            {items.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  color: c.textSecondary,
                  fontSize: '14px',
                }}
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span style={{ color: c.text, fontWeight: '500' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${c.borderLight}`, marginTop: '20px', paddingTop: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  color: c.textSecondary,
                  fontSize: '14px',
                }}
              >
                <span>Subtotal</span>
                <span style={{ color: c.text }}>${totalPrice.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  color: c.textSecondary,
                  fontSize: '14px',
                }}
              >
                <span>Tax (8%)</span>
                <span style={{ color: c.text }}>${tax.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '600',
                  fontSize: '18px',
                  color: c.text,
                  paddingTop: '12px',
                  borderTop: `1px solid ${c.borderLight}`,
                  marginTop: '12px',
                }}
              >
                <span>Total</span>
                <span style={{ color: c.primary, fontWeight: '700' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: c.surface,
              boxShadow: theme.shadows.xl,
              padding: '48px',
              borderRadius: '20px',
              textAlign: 'center',
              maxWidth: '420px',
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: successBg,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <span style={{ color: c.success, fontSize: '32px' }}>✓</span>
            </div>
            <h2
              style={{
                fontFamily: theme.fonts.display,
                color: c.text,
                marginBottom: '12px',
                fontSize: '28px',
                fontWeight: '600',
              }}
            >
              Order Confirmed!
            </h2>
            <p style={{ color: c.textSecondary, marginBottom: '32px', fontSize: '16px', lineHeight: '1.6' }}>
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <button
              onClick={handleConfirmationClose}
              style={{
                backgroundColor: c.primary,
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
