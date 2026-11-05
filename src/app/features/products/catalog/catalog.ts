import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { ProductGrid } from '../../../components/organisms/product-grid/product-grid';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/product-service';
import { CartAccessService } from '../../../core/cart-access.service';
import { CategoryFilter } from '../../../components/molecules/category-filter/category-filter';

@Component({
  selector: 'app-catalog',
  imports: [ProductGrid, CategoryFilter],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private readonly productService = inject(ProductService);
  private readonly cartAccess = inject(CartAccessService);
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly router = inject(Router);
  private readonly pageSize = 20;
  private noticeTimer?: ReturnType<typeof setTimeout>;
  private request?: Subscription;

  readonly products = signal<Product[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly hasMore = computed(() => this.products().length < this.total());

  readonly categories = signal<string[]>([]);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('todas');

  constructor() {
    this.loadCategories();

    if (this.route) {
      this.route.queryParamMap.subscribe((params) => {
        const search = params.get('q') ?? '';
        const category = params.get('category') || 'todas';

        if (
          search === this.searchTerm() &&
          category === this.selectedCategory() &&
          (this.products().length > 0 || this.loading())
        ) {
          return;
        }

        this.searchTerm.set(search);
        this.selectedCategory.set(category);
        this.resetList();
        this.loadMore();
      });
    } else {
      this.loadMore();
    }
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
    });
  }

  loadMore() {
    if (this.loading() || (this.total() > 0 && !this.hasMore())) return;

    this.loading.set(true);
    this.error.set(null);

    const skip = this.products().length;
    const category = this.selectedCategory();
    const search = this.searchTerm();

    this.request = this.productService
      .getPage(skip, this.pageSize, category, search)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => {
          this.products.update((list) => [...list, ...page.products]);
          this.total.set(page.total);
        },
        error: () => this.error.set('No se pudieron cargar los productos.'),
      });
  }

  clearSearch() {
    this.router.navigate(['/products'], {
      queryParams: { q: null },
      queryParamsHandling: 'merge',
    });
  }

  setCategory(category: string) {
    const next = category || 'todas';
    if (next === this.selectedCategory()) return;

    this.selectedCategory.set(next);
    this.resetList();
    this.loadMore();

    this.router.navigate(['/products'], {
      queryParams: { category: next },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  clearCategory() {
    this.setCategory('todas');
  }

  addToCart(product: Product) {
    if (!this.cartAccess.add(product)) return;

    this.notice.set(`"${product.title}" agregado al carrito`);
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => this.notice.set(null), 3000);
  }

  private resetList() {
    this.request?.unsubscribe();
    this.loading.set(false);
    this.products.set([]);
    this.total.set(0);
  }
}
