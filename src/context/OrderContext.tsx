import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], subtotal: number, tax: number, total: number) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'onboarding-demo-orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {
        localStorage.removeItem(ORDERS_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: CartItem[], subtotal: number, tax: number, total: number): Order => {
    const order: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      items,
      subtotal,
      tax,
      total,
    };
    setOrders((current) => [order, ...current]);
    return order;
  };

  return <OrderContext.Provider value={{ orders, addOrder }}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
