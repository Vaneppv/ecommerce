import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from './models/cart.model';
import { Product } from './models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'ecommerce_cart';

  readonly items = signal<CartItem[]>(this.loadInitialCart());

  readonly totalCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));

  readonly subtotal = computed(
    () =>
      Math.round(
        this.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0) * 100,
      ) / 100,
  );

  readonly shipping = computed(() =>
    this.subtotal() >= 50 || this.items().length === 0 ? 0 : 5.99,
  );

  readonly total = computed(() => Math.round((this.subtotal() + this.shipping()) * 100) / 100);

  addItem(product: Product, quantity = 1): void {
    if (quantity <= 0) return;

    this.items.update((currentItems) => {
      const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = currentItems.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item,
        );
      } else {
        updated = [...currentItems, { product, quantity }];
      }

      this.saveToStorage(updated);
      return updated;
    });
  }

  removeItem(productId: number): void {
    this.items.update((currentItems) => {
      const updated = currentItems.filter((item) => item.product.id !== productId);
      this.saveToStorage(updated);
      return updated;
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.items.update((currentItems) => {
      const updated = currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
      this.saveToStorage(updated);
      return updated;
    });
  }

  clearCart(): void {
    this.items.set([]);
    this.saveToStorage([]);
  }

  private loadInitialCart(): CartItem[] {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) => item && item.product && typeof item.quantity === 'number' && item.quantity > 0,
        );
      }
      return [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // Manejo silencioso ante cuotas de almacenamiento excedidas o restricciones
    }
  }
}
