import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

export function OrderHistoryPage() {
  const { getOrdersByUser } = useOrders();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
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
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#9A9A9A' }}>
              Please sign in to view your order history.
            </p>
            <Link
              to="/signin?redirect=/orders"
              style={{
                color: '#E07A5F',
                fontSize: '15px',
                fontWeight: '600',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = getOrdersByUser(user.email);

  if (userOrders.length === 0) {
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
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#9A9A9A' }}>
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              to="/"
              style={{
                color: '#E07A5F',
                fontSize: '15px',
                fontWeight: '600',
              }}
            >
              Start Shopping
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
            marginBottom: '40px',
            fontSize: '36px',
            fontWeight: '600',
          }}
        >
          Order History
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {userOrders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
              }}
            >
              <div
                style={{
                  padding: '20px 28px',
                  borderBottom: '1px solid #F0EEEB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                    {order.id}
                  </span>
                  <span
                    style={{
                      color: '#9A9A9A',
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
              <div style={{ padding: '20px 28px' }}>
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 0',
                      borderBottom: '1px solid #F0EEEB',
                    }}
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      style={{
                        width: '56px',
                        height: '56px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        backgroundColor: '#F5F5F5',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          color: '#1A1A1A',
                          fontSize: '15px',
                          fontWeight: '500',
                          marginBottom: '4px',
                        }}
                      >
                        {item.productName}
                      </p>
                      <p style={{ color: '#9A9A9A', fontSize: '13px' }}>Qty: {item.quantity}</p>
                    </div>
                    <span
                      style={{
                        color: '#1A1A1A',
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={{ paddingTop: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      color: '#6B6B6B',
                      fontSize: '14px',
                    }}
                  >
                    <span>Subtotal</span>
                    <span style={{ color: '#1A1A1A' }}>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      color: '#6B6B6B',
                      fontSize: '14px',
                    }}
                  >
                    <span>Tax</span>
                    <span style={{ color: '#1A1A1A' }}>${order.tax.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#1A1A1A',
                      paddingTop: '8px',
                      borderTop: '1px solid #F0EEEB',
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: '#E07A5F', fontWeight: '700' }}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
