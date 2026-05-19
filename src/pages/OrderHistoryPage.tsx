import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

export function OrderHistoryPage() {
  const { orders } = useOrders();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/signin?redirect=/orders');
    return null;
  }

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: '#1A1A1A',
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
              backgroundColor: '#FFFFFF',
              padding: '48px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
            }}
          >
            <p style={{ color: '#6B6B6B', fontSize: '16px', marginBottom: '24px' }}>
              You haven't placed any orders yet.
            </p>
            <Link
              to="/"
              style={{
                backgroundColor: '#E07A5F',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '28px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #F0EEEB',
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: '#1A1A1A',
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      Order #{order.id.slice(-6)}
                    </span>
                    <span
                      style={{
                        color: '#6B6B6B',
                        fontSize: '14px',
                        marginLeft: '16px',
                      }}
                    >
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#E07A5F',
                      fontSize: '18px',
                      fontWeight: '700',
                    }}
                  >
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  {order.items.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: '#6B6B6B' }}>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span style={{ color: '#1A1A1A', fontWeight: '500' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: '1px solid #F0EEEB',
                    paddingTop: '12px',
                    fontSize: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                      color: '#6B6B6B',
                    }}
                  >
                    <span>Subtotal</span>
                    <span style={{ color: '#1A1A1A' }}>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#6B6B6B',
                    }}
                  >
                    <span>Tax</span>
                    <span style={{ color: '#1A1A1A' }}>${order.tax.toFixed(2)}</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #F0EEEB',
                    fontSize: '13px',
                    color: '#9A9A9A',
                  }}
                >
                  Shipped to: {order.shippingName}, {order.shippingAddress}, {order.shippingCity}{' '}
                  {order.shippingZip}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
