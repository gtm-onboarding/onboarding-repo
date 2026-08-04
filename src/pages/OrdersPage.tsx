import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

export function OrdersPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
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
            Order History
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
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#9A9A9A' }}>No orders yet</p>
            <Link style={{ color: '#E07A5F', fontSize: '15px', fontWeight: '600' }} to="/">
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
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: '#1A1A1A',
            marginBottom: '32px',
            fontSize: '36px',
            fontWeight: '600',
          }}
        >
          Order History
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderBottom: '1px solid #F0EEEB',
                  paddingBottom: '16px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <h2 style={{ color: '#1A1A1A', fontSize: '18px', margin: '0 0 6px', fontWeight: '600' }}>
                    Order {order.id.slice(-8)}
                  </h2>
                  <p style={{ color: '#9A9A9A', fontSize: '13px', margin: 0 }}>
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    color: '#6B6B6B',
                    fontSize: '14px',
                  }}
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span style={{ color: '#1A1A1A', fontWeight: '500' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #F0EEEB', marginTop: '20px', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#6B6B6B', fontSize: '14px' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#1A1A1A' }}>${order.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#6B6B6B', fontSize: '14px' }}>
                  <span>Tax (8%)</span>
                  <span style={{ color: '#1A1A1A' }}>${order.tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '18px', color: '#1A1A1A', paddingTop: '12px', borderTop: '1px solid #F0EEEB', marginTop: '12px' }}>
                  <span>Total</span>
                  <span style={{ color: '#E07A5F', fontWeight: '700' }}>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
