import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Order } from '../types';

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
        marginBottom: '24px',
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
          <span style={{ color: '#1A1A1A', fontWeight: '600', fontSize: '16px' }}>
            {order.id}
          </span>
          <span style={{ color: '#9A9A9A', fontSize: '14px', marginLeft: '16px' }}>
            {formattedDate} at {formattedTime}
          </span>
        </div>
        <span style={{ color: '#E07A5F', fontWeight: '700', fontSize: '18px' }}>
          ${order.total.toFixed(2)}
        </span>
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: '#9A9A9A', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Shipped to
          </span>
          <p style={{ color: '#6B6B6B', fontSize: '14px', marginTop: '4px' }}>
            {order.shippingAddress.name} — {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
          </p>
        </div>
        <div>
          <span style={{ color: '#9A9A9A', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
            Items
          </span>
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
                  width: '56px',
                  height: '56px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '14px', display: 'block' }}>
                  {item.product.name}
                </span>
                <span style={{ color: '#9A9A9A', fontSize: '13px' }}>
                  Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                </span>
              </div>
              <span style={{ color: '#1A1A1A', fontWeight: '600', fontSize: '14px' }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px', marginTop: '16px', fontSize: '14px' }}>
          <span style={{ color: '#6B6B6B' }}>Subtotal: ${order.subtotal.toFixed(2)}</span>
          <span style={{ color: '#6B6B6B' }}>Tax: ${order.tax.toFixed(2)}</span>
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
          <p style={{ color: '#9A9A9A', fontSize: '16px', marginBottom: '24px' }}>
            Please sign in to view your order history.
          </p>
          <Link
            to="/signin?redirect=/orders"
            style={{
              backgroundColor: '#E07A5F',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '8px',
              display: 'inline-block',
              fontWeight: '600',
              fontSize: '15px',
            }}
          >
            Sign In
          </Link>
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
              You haven't placed any orders yet.
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
        {userOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
