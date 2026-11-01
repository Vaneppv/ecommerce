import { Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ProductGrid } from '../../../components/organisms/product-grid/product-grid';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/product-service';

@Component({
  selector: 'app-catalog',
  imports: [ProductGrid],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private readonly productService = inject(ProductService);
  private readonly pageSize = 20;
  private noticeTimer?: ReturnType<typeof setTimeout>;

  readonly products = signal<Product[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly hasMore = computed(() => this.products().length < this.total());

  constructor() {
    this.loadMore();
  }

  loadMore() {
    if (this.loading() || (this.total() > 0 && !this.hasMore())) return;

    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getPage(this.products().length, this.pageSize)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => {
          this.products.update((list) => [...list, ...page.products]);
          this.total.set(page.total);
        },
        error: () => this.error.set('No se pudieron cargar los productos.'),
      });
  }

  addToCart(product: Product) {
    // Provisional: se reemplazará por CartService.add(product) al construir el carrito.
    this.notice.set(`"${product.title}" agregado al carrito`);
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => this.notice.set(null), 3000);
  }
}
