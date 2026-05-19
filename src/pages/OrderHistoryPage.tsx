import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Order } from '../types';

function OrderCard({ order }: { order: Order }) {
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
          <p style={{ color: '#6B6B6B', fontSize: '13px', marginBottom: '4px' }}>
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
          <p style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '500' }}>{formattedDate}</p>
        </div>
        <span
          style={{
            color: '#E07A5F',
            fontWeight: '700',
            fontSize: '18px',
          }}
        >
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
              gap: '16px',
              marginBottom: '12px',
            }}
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '500' }}>
                {item.product.name}
              </p>
              <p style={{ color: '#6B6B6B', fontSize: '13px' }}>Qty: {item.quantity}</p>
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
          marginTop: '12px',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column' as const,
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
            fontSize: '16px',
            fontWeight: '600',
            paddingTop: '8px',
            borderTop: '1px solid #F0EEEB',
            marginTop: '4px',
          }}
        >
          <span style={{ color: '#1A1A1A' }}>Total</span>
          <span style={{ color: '#E07A5F' }}>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const { getOrdersByUser } = useOrders();

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

  const userOrders = getOrdersByUser(user.email);

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
              borderRadius: '16px',
              textAlign: 'center',
              padding: '80px',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
            }}
          >
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#9A9A9A' }}>
              You have no orders yet
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
        ) : (
          userOrders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
