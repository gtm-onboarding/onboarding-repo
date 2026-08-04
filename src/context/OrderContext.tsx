import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { CartItem, Order } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], subtotal: number, tax: number, total: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_STORAGE_KEY = 'onboarding-demo-orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      return [];
    } catch {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders));
  }, [allOrders]);

  const addOrder = (items: CartItem[], subtotal: number, tax: number, total: number) => {
    const order: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      userEmail: user?.email || '',
      items: items.map((item) => ({ ...item, product: { ...item.product } })),
      subtotal,
      tax,
      total,
    };
    setAllOrders((current) => [order, ...current]);
  };

  const orders = useMemo(
    () =>
      allOrders
        .filter((order) => (order.userEmail || '') === (user?.email || ''))
        .sort((first, second) => second.date.localeCompare(first.date)),
    [allOrders, user]
  );

  return <OrderContext.Provider value={{ orders, addOrder }}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
