export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface RatingSeed {
  total: number;
  count: number;
}

export interface ProductRating {
  average: number;
  count: number;
  userRating: number | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  email: string;
  name: string;
}
