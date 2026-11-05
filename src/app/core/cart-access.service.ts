import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { Product } from './models/product.model';

@Injectable({ providedIn: 'root' })
export class CartAccessService {
  private readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  /**
   * Agrega un producto solo si hay una sesión activa.
   * Si no la hay, redirige al login y devuelve false.
   */
  add(product: Product, quantity = 1): boolean {
    if (!this.auth.isLoggedIn()) {
      void this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url, reason: 'cart' },
      });
      return false;
    }

    this.cart.addItem(product, quantity);
    return true;
  }
}
