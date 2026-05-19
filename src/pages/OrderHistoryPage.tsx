import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

export function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const userOrders = orders.filter((order) => order.userEmail === user?.email);

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

        {userOrders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '60px 32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
            }}
          >
            <p style={{ color: '#6B6B6B', fontSize: '16px', marginBottom: '24px' }}>
              You haven&apos;t placed any orders yet.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#E07A5F',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {userOrders.map((order) => (
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
                        alignItems: 'center',
                        padding: '8px 0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                        <div>
                          <span
                            style={{
                              color: '#1A1A1A',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                          >
                            {item.product.name}
                          </span>
                          <span
                            style={{
                              color: '#6B6B6B',
                              fontSize: '13px',
                              marginLeft: '8px',
                            }}
                          >
                            × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          color: '#1A1A1A',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: '1px solid #F0EEEB',
                    paddingTop: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ color: '#6B6B6B', fontSize: '13px' }}>
                    <div>
                      Ship to: {order.shippingInfo.name}, {order.shippingInfo.address},{' '}
                      {order.shippingInfo.city} {order.shippingInfo.zipCode}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px' }}>
                    <div style={{ color: '#6B6B6B' }}>
                      Subtotal: ${order.subtotal.toFixed(2)}
                    </div>
                    <div style={{ color: '#6B6B6B' }}>
                      Tax: ${order.tax.toFixed(2)}
                    </div>
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
