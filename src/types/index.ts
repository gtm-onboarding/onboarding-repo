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

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  userEmail: string;
}

export interface User {
  email: string;
  name: string;
}
