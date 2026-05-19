import { Navigate, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function OrderHistoryPage() {
  const { getOrders } = useOrders();
  const { isAuthenticated } = useAuth();
  const { activeTheme } = useTheme();
  const orders = getOrders();

  if (!isAuthenticated) {
    return <Navigate to="/signin?redirect=/orders" replace />;
  }

  return (
    <div style={{ backgroundColor: activeTheme.colors.background, minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: activeTheme.fonts.display,
            color: activeTheme.colors.text,
            marginBottom: '40px',
            fontSize: '36px',
            fontWeight: '600',
          }}
        >
          Order History
        </h1>
        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: activeTheme.colors.surface,
              padding: '48px',
              borderRadius: activeTheme.radii.lg,
              textAlign: 'center',
              boxShadow: activeTheme.shadows.md,
            }}
          >
            <p style={{ color: activeTheme.colors.textSecondary, fontSize: '18px', marginBottom: '24px' }}>
              You haven't placed any orders yet.
            </p>
            <Link
              to="/"
              style={{
                backgroundColor: activeTheme.colors.primary,
                color: 'white',
                padding: '14px 32px',
                borderRadius: activeTheme.radii.sm,
                display: 'inline-block',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: activeTheme.colors.surface,
                  padding: '28px',
                  borderRadius: activeTheme.radii.lg,
                  boxShadow: activeTheme.shadows.md,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: `1px solid ${activeTheme.colors.borderLight}`,
                  }}
                >
                  <div>
                    <p style={{ color: activeTheme.colors.textMuted, fontSize: '13px', marginBottom: '4px' }}>
                      Order ID
                    </p>
                    <p style={{ color: activeTheme.colors.text, fontSize: '14px', fontWeight: '600' }}>
                      {order.id}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: activeTheme.colors.textMuted, fontSize: '13px', marginBottom: '4px' }}>
                      Date
                    </p>
                    <p style={{ color: activeTheme.colors.text, fontSize: '14px', fontWeight: '500' }}>
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  {order.items.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        color: activeTheme.colors.textSecondary,
                        fontSize: '14px',
                      }}
                    >
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span style={{ color: activeTheme.colors.text, fontWeight: '500' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    borderTop: `1px solid ${activeTheme.colors.borderLight}`,
                    paddingTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: activeTheme.colors.textSecondary }}>
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: activeTheme.colors.textSecondary }}>
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '600', color: activeTheme.colors.text }}>
                    <span>Total</span>
                    <span style={{ color: activeTheme.colors.primary }}>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
