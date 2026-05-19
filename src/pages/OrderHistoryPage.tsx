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
          <span style={{ color: '#6B6B6B', fontSize: '13px', fontWeight: '500' }}>
            Order {order.id}
          </span>
          <div style={{ color: '#1A1A1A', fontSize: '15px', fontWeight: '500', marginTop: '4px' }}>
            {formattedDate}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#E8F5E9',
            color: '#4A7C59',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          Delivered
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
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
                objectFit: 'cover',
                borderRadius: '8px',
                backgroundColor: '#F5F4F2',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '500' }}>
                {item.product.name}
              </div>
              <div style={{ color: '#6B6B6B', fontSize: '13px', marginTop: '2px' }}>
                Qty: {item.quantity}
              </div>
            </div>
            <div style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '500' }}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #F0EEEB', paddingTop: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            color: '#6B6B6B',
            fontSize: '13px',
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
            fontSize: '13px',
          }}
        >
          <span>Tax (8%)</span>
          <span style={{ color: '#1A1A1A' }}>${order.tax.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: '600',
            fontSize: '16px',
            color: '#1A1A1A',
            paddingTop: '12px',
            borderTop: '1px solid #F0EEEB',
            marginTop: '8px',
          }}
        >
          <span>Total</span>
          <span style={{ color: '#E07A5F', fontWeight: '700' }}>${order.total.toFixed(2)}</span>
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
        <div
          style={{
            maxWidth: '600px',
            margin: '80px auto',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            padding: '48px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
          }}
        >
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              marginBottom: '16px',
              fontSize: '24px',
              fontWeight: '600',
            }}
          >
            Sign in to view your orders
          </h2>
          <p style={{ color: '#6B6B6B', marginBottom: '24px', fontSize: '15px' }}>
            You need to be signed in to view your order history.
          </p>
          <Link
            to="/signin?redirect=/orders"
            style={{
              backgroundColor: '#E07A5F',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              padding: '48px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
            }}
          >
            <p
              style={{
                color: '#6B6B6B',
                fontSize: '16px',
                marginBottom: '24px',
              }}
            >
              You haven't placed any orders yet.
            </p>
            <Link
              to="/"
              style={{
                backgroundColor: '#E07A5F',
                color: 'white',
                border: 'none',
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
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
