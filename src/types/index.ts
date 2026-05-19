export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface ProductRating {
  productId: string;
  rating: number;
}

export interface RatingData {
  ratings: number[];
  average: number;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  email: string;
  name: string;
}
