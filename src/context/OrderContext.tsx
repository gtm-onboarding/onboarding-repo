import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY_PREFIX = 'onboarding-demo-orders';

function getStorageKey(email: string): string {
  return `${ORDERS_STORAGE_KEY_PREFIX}-${email}`;
}

function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(getStorageKey(user.email));
      if (stored) {
        try {
          setOrders(JSON.parse(stored));
        } catch {
          localStorage.removeItem(getStorageKey(user.email));
        }
      } else {
        setOrders([]);
      }
    } else {
      setOrders([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && orders.length > 0) {
      localStorage.setItem(getStorageKey(user.email), JSON.stringify(orders));
    }
  }, [orders, user]);

  const addOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: generateOrderId(),
      date: new Date().toISOString(),
    };
    setOrders((current) => {
      const updated = [newOrder, ...current];
      if (user) {
        localStorage.setItem(getStorageKey(user.email), JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
