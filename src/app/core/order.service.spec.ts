import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { CheckoutRequest, Order } from './models/order.model';
import { Product } from './models/product.model';
import { OrderService } from './order.service';

const product = { id: 1, title: 'Lámpara', price: 30, stock: 10 } as Product;

const request: CheckoutRequest = {
  shipping: {
    fullName: 'María Pérez',
    email: 'maria@correo.com',
    phone: '04141234567',
    address: 'Av. Principal 123',
    city: 'Caracas',
    postalCode: '1010',
  },
  payment: {
    cardName: 'MARIA PEREZ',
    cardNumber: '4111 1111 1111 1111',
    expiry: '12/30',
    cvv: '123',
  },
};

describe('OrderService', () => {
  let service: OrderService;
  let cart: CartService;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    cart = TestBed.inject(CartService);
    cart.clearCart();
    service = TestBed.inject(OrderService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('confirma el pedido, conserva solo los últimos 4 dígitos y vacía el carrito', () => {
    cart.addItem(product, 2);
    const orders: Order[] = [];

    service.place(request, 500).subscribe((order) => orders.push(order));
    expect(cart.items().length).toBe(1); // aún procesando

    vi.advanceTimersByTime(500);

    expect(orders.length).toBe(1);
    const result = orders[0];
    expect(result.id).toMatch(/^ORD-/);
    expect(result.cardLast4).toBe('1111');
    expect(JSON.stringify(result)).not.toContain('4111 1111');
    expect(JSON.stringify(result)).not.toContain('"cvv"');
    expect(result.subtotal).toBe(60);
    expect(result.total).toBe(60);
    expect(service.lastOrder()).toEqual(result);
    expect(cart.items().length).toBe(0);
  });

  it('falla si el carrito está vacío', () => {
    expect(() => service.place(request)).toThrowError(/carrito vacío/);
  });
});
