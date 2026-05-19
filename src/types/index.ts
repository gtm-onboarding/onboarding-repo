export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  email: string;
  name: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
  };
}
