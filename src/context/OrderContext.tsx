import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'userEmail' | 'date'>) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'onboarding-demo-orders';

function getAllOrders(): Order[] {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  useEffect(() => {
    setAllOrders(getAllOrders());
  }, []);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders));
  }, [allOrders]);

  const orders = user
    ? allOrders.filter((order) => order.userEmail === user.email)
    : [];

  const addOrder = (orderData: Omit<Order, 'id' | 'userEmail' | 'date'>) => {
    if (!user) return;
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      userEmail: user.email,
      date: new Date().toISOString(),
    };
    setAllOrders((current) => [newOrder, ...current]);
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
