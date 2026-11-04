import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CartBadge } from './components/atoms/cart-badge/cart-badge';
import { Alert } from './components/atoms/alert/alert';
import { ConfirmDialog } from './components/molecules/confirm-dialog/confirm-dialog';
import { AuthService } from './core/auth.service';
import { CartService } from './core/cart.service';

@Component({
  imports: [RouterOutlet, RouterLink, CartBadge, Alert, ConfirmDialog],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly cartService = inject(CartService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLogoutModalOpen = signal(false);
  protected readonly logoutAlert = signal<string | null>(null);

  openLogoutModal() {
    this.isLogoutModalOpen.set(true);
  }

  cancelLogout() {
    this.isLogoutModalOpen.set(false);
  }

  confirmLogout() {
    this.isLogoutModalOpen.set(false);
    this.auth.logout();
    this.logoutAlert.set('Has cerrado sesión correctamente. Te has salido de tu cuenta.');
    this.router.navigateByUrl('/products');
  }

  clearLogoutAlert() {
    this.logoutAlert.set(null);
  }

  // Un href="#main" normal chocaría con <base href="/"> y recargaría la ruta raíz.
  skipToContent(event: Event) {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }
}
