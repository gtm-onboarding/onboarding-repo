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
  hasCoverageRider?: boolean;
}

export interface User {
  email: string;
  name: string;
}
