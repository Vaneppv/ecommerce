import { CartItem } from './cart.model';

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface CheckoutRequest {
  shipping: ShippingInfo;
  payment: PaymentInfo;
}

/** Pedido confirmado. Nunca incluye el número completo ni el CVV de la tarjeta. */
export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: ShippingInfo;
  cardLast4: string;
}
