import type { Product } from './product.model';

export interface ProductPage {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
