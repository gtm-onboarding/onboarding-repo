import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

export function OrderHistoryPage() {
  const { orders } = useOrders();

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: 'var(--color-text)',
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
              backgroundColor: 'var(--color-surface)',
              padding: '48px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
            }}
          >
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '16px' }}>
              You haven't placed any orders yet.
            </p>
            <Link
              to="/"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                display: 'inline-block',
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                padding: '28px',
                borderRadius: '16px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--color-border-light)',
                }}
              >
                <span style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: '16px' }}>
                  {formatDate(order.date)}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{order.id}</span>
              </div>
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '14px',
                  }}
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span style={{ color: 'var(--color-text)', fontWeight: '500' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  borderTop: '1px solid var(--color-border-light)',
                  marginTop: '16px',
                  paddingTop: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '14px',
                  }}
                >
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--color-text)' }}>${order.subtotal.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '14px',
                  }}
                >
                  <span>Tax</span>
                  <span style={{ color: 'var(--color-text)' }}>${order.tax.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '600',
                    fontSize: '16px',
                    color: 'var(--color-text)',
                    paddingTop: '8px',
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
