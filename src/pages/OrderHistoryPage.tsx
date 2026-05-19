import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

function OrderCard({ order }: { order: Order }) {
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '20px',
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
          <span style={{ color: '#1A1A1A', fontWeight: '600', fontSize: '16px' }}>
            {order.id}
          </span>
          <span style={{ color: '#6B6B6B', fontSize: '14px', marginLeft: '16px' }}>
            {formattedDate}
          </span>
        </div>
        <span style={{ color: '#E07A5F', fontWeight: '700', fontSize: '18px' }}>
          ${order.total.toFixed(2)}
        </span>
      </div>
      <div>
        {order.items.map((item) => (
          <div
            key={item.product.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              gap: '16px',
            }}
          >
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
            <div style={{ flex: 1 }}>
              <Link
                to={`/product/${item.product.id}`}
                style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '500' }}
              >
                {item.product.name}
              </Link>
              <div style={{ color: '#6B6B6B', fontSize: '13px', marginTop: '2px' }}>
                Qty: {item.quantity}
              </div>
            </div>
            <span style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '500' }}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: '1px solid #F0EEEB',
          marginTop: '8px',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B6B6B' }}>Subtotal</span>
          <span style={{ color: '#1A1A1A' }}>${order.subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B6B6B' }}>Tax</span>
          <span style={{ color: '#1A1A1A' }}>${order.tax.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#6B6B6B',
          }}
        >
          <span>Ship to</span>
          <span style={{ color: '#1A1A1A' }}>
            {order.shippingAddress.city}, {order.shippingAddress.zipCode}
          </span>
        </div>
      </div>
    </div>
  );
}

export function OrderHistoryPage() {
  const { orders } = useOrders();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
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
              Please sign in to view your order history
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
              You haven't placed any orders yet
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
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
