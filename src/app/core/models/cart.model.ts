import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}
