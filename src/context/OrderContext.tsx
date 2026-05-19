import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    subtotal: number,
    tax: number,
    total: number,
    shippingAddress: { name: string; address: string; city: string; zipCode: string },
    userEmail: string
  ) => Order;
  getOrdersByUser: (email: string) => Order[];
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

  const placeOrder = (
    items: CartItem[],
    subtotal: number,
    tax: number,
    total: number,
    shippingAddress: { name: string; address: string; city: string; zipCode: string },
    userEmail: string
  ): Order => {
    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      items: items.map((item) => ({ product: item.product, quantity: item.quantity })),
      subtotal,
      tax,
      total,
      shippingAddress,
      userEmail,
      createdAt: new Date().toISOString(),
    };
    setOrders((current) => [order, ...current]);
    return order;
  };

  const getOrdersByUser = (email: string): Order[] => {
    return orders.filter((order) => order.userEmail === email);
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrdersByUser }}>
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
