export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  thumbnail: string;
}

export interface ProductPage {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
