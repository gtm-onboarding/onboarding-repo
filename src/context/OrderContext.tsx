import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order } from '../types';

interface OrderContextType {
  orders: Order[];
  placeOrder: (items: CartItem[], subtotal: number, tax: number, total: number) => Order;
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
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
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
