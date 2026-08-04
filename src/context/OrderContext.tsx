import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  placeOrder: (items: CartItem[], subtotal: number, tax: number, total: number) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_PREFIX = 'onboarding-demo-orders';

function storageKey(email: string | undefined) {
  return `${ORDERS_STORAGE_PREFIX}:${email ?? 'guest'}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const key = storageKey(user?.email);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (!stored) {
      setOrders([]);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setOrders(Array.isArray(parsed) ? parsed : []);
    } catch {
      localStorage.removeItem(key);
      setOrders([]);
    }
  }, [key]);

  const placeOrder = (items: CartItem[], subtotal: number, tax: number, total: number): Order => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      subtotal,
      tax,
      total,
    };
    setOrders((current) => {
      const updated = [order, ...current];
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
    return order;
  };

  return <OrderContext.Provider value={{ orders, placeOrder }}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
