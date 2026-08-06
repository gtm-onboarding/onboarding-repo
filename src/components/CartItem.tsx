import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';
import { JEWELRY_COVERAGE_RIDER_RATE } from '../data/products';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const merchandiseTotal = item.product.price * item.quantity;
  const coverageRiderCost = item.hasCoverageRider ? merchandiseTotal * JEWELRY_COVERAGE_RIDER_RATE : 0;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #F0EEEB',
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
            color: '#1A1A1A',
            fontWeight: '600',
            display: 'block',
            fontSize: '16px',
            marginBottom: '4px',
          }}
        >
          {item.product.name}
        </span>
        <span style={{ color: '#E07A5F', display: 'block', fontWeight: '600', fontSize: '15px' }}>
          ${item.product.price.toFixed(2)} each
        </span>
        {item.hasCoverageRider && (
          <span style={{ color: '#6B6B6B', display: 'block', fontSize: '13px', marginTop: '4px' }}>
            Includes jewelry coverage rider (+${coverageRiderCost.toFixed(2)})
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          style={{
            backgroundColor: '#F5F3F0',
            color: '#1A1A1A',
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
            color: '#1A1A1A',
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
            backgroundColor: '#F5F3F0',
            color: '#1A1A1A',
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
        <span style={{ color: '#1A1A1A', fontWeight: '700', fontSize: '17px' }}>
          ${(merchandiseTotal + coverageRiderCost).toFixed(2)}
        </span>
      </div>
      <button
        onClick={() => removeFromCart(item.product.id)}
        style={{
          backgroundColor: 'transparent',
          color: '#C44536',
          border: '1px solid #C44536',
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
