import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { AuthService } from './auth.service';
import { CartItem } from './models/cart.model';
import { Product } from './models/product.model';

type CartMap = Record<string, CartItem[]>;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly auth = inject(AuthService);
  private readonly storageKey = 'ecommerce_carts';
  private readonly legacyStorageKey = 'ecommerce_cart';

  private readonly carts = signal<CartMap>(this.loadInitialCarts());

  readonly owner = computed<string | null>(() => {
    const email = this.auth.user()?.email;
    return email ? email.trim().toLowerCase() : null;
  });

  readonly items = computed<CartItem[]>(() => {
    const owner = this.owner();
    return owner ? (this.carts()[owner] ?? []) : [];
  });

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

  constructor() {
    const initialOwner = this.owner();
    if (initialOwner) {
      this.consumeLegacyCart(initialOwner);
    }

    // Si la sesión se inicia después de crear el servicio, migramos el carrito
    // antiguo al primer usuario autenticado.
    effect(() => {
      const owner = this.owner();
      if (!owner) return;
      untracked(() => this.consumeLegacyCart(owner));
    });
  }

  addItem(product: Product, quantity = 1): void {
    if (quantity <= 0) return;

    this.updateActiveCart((currentItems) => {
      const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        return currentItems.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [...currentItems, { product, quantity }];
    });
  }

  removeItem(productId: number): void {
    this.updateActiveCart((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.updateActiveCart((currentItems) =>
      currentItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  }

  clearCart(): void {
    this.updateActiveCart(() => []);
  }

  private updateActiveCart(updater: (items: CartItem[]) => CartItem[]): void {
    const owner = this.owner();
    if (!owner) return;

    this.carts.update((carts) => {
      const updated = updater(carts[owner] ?? []);
      const next = { ...carts, [owner]: updated };
      this.saveToStorage(next);
      return next;
    });
  }

  private loadInitialCarts(): CartMap {
    const carts = this.readCarts();

    const owner = this.currentOwner();
    if (!owner) return carts;

    const legacy = this.readLegacyCart();
    if (legacy.length === 0) return carts;

    carts[owner] = this.mergeItems(carts[owner] ?? [], legacy);
    this.saveToStorage(carts);
    this.removeLegacyCart();
    return carts;
  }

  private consumeLegacyCart(owner: string): void {
    const legacy = this.readLegacyCart();
    if (legacy.length === 0) {
      this.removeLegacyCart();
      return;
    }

    this.carts.update((carts) => {
      const next = { ...carts, [owner]: this.mergeItems(carts[owner] ?? [], legacy) };
      this.saveToStorage(next);
      return next;
    });
    this.removeLegacyCart();
  }

  private mergeItems(current: CartItem[], incoming: CartItem[]): CartItem[] {
    const merged = current.map((item) => ({ ...item }));
    for (const item of incoming) {
      const existing = merged.find((candidate) => candidate.product.id === item.product.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        merged.push({ ...item });
      }
    }
    return merged;
  }

  private currentOwner(): string | null {
    const email = this.auth.user()?.email;
    return email ? email.trim().toLowerCase() : null;
  }

  private readCarts(): CartMap {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return {};
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return {};

      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

      const carts: CartMap = {};
      for (const [owner, items] of Object.entries(parsed)) {
        carts[owner] = this.sanitizeItems(items);
      }
      return carts;
    } catch {
      return {};
    }
  }

  private readLegacyCart(): CartItem[] {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(this.legacyStorageKey);
      if (!stored) return [];
      return this.sanitizeItems(JSON.parse(stored));
    } catch {
      return [];
    }
  }

  private sanitizeItems(value: unknown): CartItem[] {
    if (!Array.isArray(value)) return [];

    return value.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        Boolean(item.product) &&
        typeof item.quantity === 'number' &&
        item.quantity > 0,
    );
  }

  private removeLegacyCart(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(this.legacyStorageKey);
    } catch {
      // Sin acción: el almacenamiento puede estar restringido.
    }
  }

  private saveToStorage(carts: CartMap): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(carts));
    } catch {
      // Manejo silencioso ante cuotas de almacenamiento excedidas o restricciones
    }
  }
}
