import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

export function OrderHistoryPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', paddingTop: '80px' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              marginBottom: '16px',
              fontSize: '36px',
              fontWeight: '600',
            }}
          >
            Order History
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '16px', marginBottom: '32px' }}>
            You haven&apos;t placed any orders yet.
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
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Start Shopping
          </Link>
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
                    {order.id}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      style={{
                        width: '56px',
                        height: '56px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        backgroundColor: '#F5F3F0',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          color: '#1A1A1A',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        {item.productName}
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
                    <span
                      style={{
                        color: '#1A1A1A',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #F0EEEB',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '24px',
                  fontSize: '14px',
                  color: '#6B6B6B',
                }}
              >
                <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                <span>Tax: ${order.tax.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
