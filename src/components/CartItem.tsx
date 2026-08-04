import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-borderLight)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      <img
        src={item.product.image}
        alt={item.product.name}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '10px',
        }}
      />
      <div style={{ flex: 1 }}>
        <span
          style={{
            color: 'var(--color-text)',
            fontWeight: '600',
            display: 'block',
            fontSize: '16px',
            marginBottom: '4px',
          }}
        >
          {item.product.name}
        </span>
        <span style={{ color: 'var(--color-primary)', display: 'block', fontWeight: '600', fontSize: '15px' }}>
          ${item.product.price.toFixed(2)} each
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          style={{
            backgroundColor: 'var(--color-surfaceAlt)',
            color: 'var(--color-text)',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
          }}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span
          style={{
            color: 'var(--color-text)',
            minWidth: '44px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: '600',
          }}
        >
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          style={{
            backgroundColor: 'var(--color-surfaceAlt)',
            color: 'var(--color-text)',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
          }}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div style={{ minWidth: '100px', textAlign: 'right' }}>
        <span style={{ color: 'var(--color-text)', fontWeight: '700', fontSize: '17px' }}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
      </div>
      <button
        onClick={() => removeFromCart(item.product.id)}
        style={{
          backgroundColor: 'transparent',
          color: 'var(--color-error)',
          border: '1px solid var(--color-error)',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '500',
        }}
      >
        Remove
      </button>
    </div>
  );
}
