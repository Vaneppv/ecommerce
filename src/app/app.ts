import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CartBadge } from './components/atoms/cart-badge/cart-badge';
import { AuthService } from './core/auth.service';
import { CartService } from './core/cart.service';

@Component({
  imports: [RouterOutlet, RouterLink, CartBadge],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly cartService = inject(CartService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/products');
  }

  // Un href="#main" normal chocaría con <base href="/"> y recargaría la ruta raíz.
  skipToContent(event: Event) {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }
}