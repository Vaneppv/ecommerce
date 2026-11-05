import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap, timer } from 'rxjs';
import { CartService } from './cart.service';
import { CheckoutRequest, Order } from './models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly cart = inject(CartService);

  /** Último pedido confirmado en esta sesión (solo en memoria). */
  readonly lastOrder = signal<Order | null>(null);

  /**
   * Simula el procesamiento del pago. No hay backend: espera un momento, arma el
   * pedido a partir del carrito, lo vacía y emite el pedido confirmado.
   */
  place(request: CheckoutRequest, delayMs = 1200): Observable<Order> {
    const items = this.cart.items();
    if (items.length === 0) {
      throw new Error('No se puede crear un pedido con el carrito vacío.');
    }

    const snapshot = {
      items,
      subtotal: this.cart.subtotal(),
      shipping: this.cart.shipping(),
      total: this.cart.total(),
    };

    return timer(delayMs).pipe(
      map(
        (): Order => ({
          id: this.generateId(),
          createdAt: new Date().toISOString(),
          ...snapshot,
          shippingInfo: request.shipping,
          cardLast4: request.payment.cardNumber.replace(/\D/g, '').slice(-4),
        }),
      ),
      tap((order) => {
        this.lastOrder.set(order);
        this.cart.clearCart();
      }),
    );
  }

  private generateId(): string {
    return `ORD-${Date.now().toString(36).toUpperCase()}`;
  }
}
