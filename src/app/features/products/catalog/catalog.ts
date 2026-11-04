import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductGrid } from '../../../components/organisms/product-grid/product-grid';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/product-service';
import { CategoryFilter } from '../../../components/molecules/category-filter/category-filter';
import { SearchForm } from '../../../components/molecules/search-form/search-form';

@Component({
  selector: 'app-catalog',
  imports: [ProductGrid, CategoryFilter, SearchForm],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly pageSize = 20;
  private noticeTimer?: ReturnType<typeof setTimeout>;

  readonly products = signal<Product[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly hasMore = computed(() => this.products().length < this.total());

  readonly categories = signal<string[]>([]);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');

  constructor() {
    this.loadCategories();

    if (this.route) {
      this.route.queryParamMap.subscribe((params) => {
        const search = params.get('q') ?? '';
        const category = params.get('category') ?? '';

        if (
          search === this.searchTerm() &&
          category === this.selectedCategory() &&
          this.products().length > 0
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

    this.productService
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

  setSearch(term: string) {
    this.searchTerm.set(term);
    this.resetList();
    this.loadMore();
  }

  setCategory(category: string) {
    this.selectedCategory.set(category);
    this.resetList();
    this.loadMore();
  }

  clearCategory() {
    this.setCategory('');
  }

  addToCart(product: Product) {
    // Provisional: se reemplazará por CartService.add(product) al construir el carrito.
    this.notice.set(`"${product.title}" agregado al carrito`);
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => this.notice.set(null), 3000);
  }

  private resetList() {
    this.products.set([]);
    this.total.set(0);
  }
}
