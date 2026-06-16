import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

export function OrderHistoryPage() {
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
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#9A9A9A' }}>
              No orders yet
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
            marginBottom: '32px',
            fontSize: '36px',
            fontWeight: '600',
          }}
        >
          Order History
        </h1>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
              marginBottom: '24px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
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
                    fontWeight: '600',
                    fontSize: '16px',
                    marginRight: '16px',
                  }}
                >
                  Order #{order.id.slice(-8)}
                </span>
                <span style={{ color: '#6B6B6B', fontSize: '14px' }}>
                  {new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <span style={{ color: '#E07A5F', fontWeight: '700', fontSize: '18px' }}>
                ${order.total.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #F0EEEB',
              }}
            >
              <p style={{ color: '#6B6B6B', fontSize: '13px', marginBottom: '4px' }}>
                Shipped to: {order.shippingInfo.name}
              </p>
              <p style={{ color: '#9A9A9A', fontSize: '13px' }}>
                {order.shippingInfo.address}, {order.shippingInfo.city}{' '}
                {order.shippingInfo.zipCode}
              </p>
            </div>
            <div style={{ padding: '16px 24px' }}>
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 0',
                    borderBottom: '1px solid #F0EEEB',
                  }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        color: '#1A1A1A',
                        fontWeight: '500',
                        fontSize: '14px',
                        display: 'block',
                      }}
                    >
                      {item.product.name}
                    </span>
                    <span style={{ color: '#6B6B6B', fontSize: '13px' }}>
                      Qty: {item.quantity} @ ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                  <span style={{ color: '#1A1A1A', fontWeight: '600', fontSize: '14px' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '24px',
                  paddingTop: '16px',
                  fontSize: '14px',
                }}
              >
                <span style={{ color: '#6B6B6B' }}>
                  Subtotal: ${order.subtotal.toFixed(2)}
                </span>
                <span style={{ color: '#6B6B6B' }}>
                  Tax: ${order.tax.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
