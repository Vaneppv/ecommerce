import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';
import { CartBadge } from './components/atoms/cart-badge/cart-badge';
import { SearchForm } from './components/molecules/search-form/search-form';
import { AuthService } from './core/auth.service';
import { CartService } from './core/cart.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CartBadge, TablerIconComponent, SearchForm],
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

  onSearch(term: string) {
    this.router.navigate(['/products'], { queryParams: term ? { q: term } : {} });
  }
}
