import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

export function OrdersPage() {
  const { orders } = useOrders();

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <p style={{ color: '#6B6B6B', fontSize: '16px', marginBottom: '24px' }}>
              You have no past orders yet.
            </p>
            <Link to="/" style={{ color: '#E07A5F', fontWeight: '600', fontSize: '15px' }}>
              Start shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={cardStyle} data-testid={`order-${order.id}`}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #F0EEEB',
                }}
              >
                <div>
                  <div style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: '600' }}>
                    Order {order.id}
                  </div>
                  <div style={{ color: '#6B6B6B', fontSize: '14px', marginTop: '4px' }}>
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ color: '#E07A5F', fontSize: '18px', fontWeight: '700' }}>
                  ${order.total.toFixed(2)}
                </div>
              </div>

              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '15px',
                    color: '#6B6B6B',
                  }}
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span style={{ color: '#1A1A1A' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #F0EEEB',
                  fontSize: '14px',
                  color: '#6B6B6B',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#1A1A1A' }}>${order.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax</span>
                  <span style={{ color: '#1A1A1A' }}>${order.tax.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
