import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../types';

interface OrderContextType {
  addOrder: (order: Order) => void;
  getOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'onboarding-demo-orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const getOrders = (): Order[] => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{ addOrder, getOrders }}>
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
