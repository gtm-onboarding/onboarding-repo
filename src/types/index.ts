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

export interface StoredRating {
  ratings: number[];
  userRating: number | null;
}

export interface ProductRating {
  average: number;
  count: number;
  userRating: number | null;
}

export interface User {
  email: string;
  name: string;
}
