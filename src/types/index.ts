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

export interface Order {
  id: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  date: string;
}
