import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/product-service';
import { ProductCard } from '../../components/molecules/product-card/product-card';
import { CategoryCard } from '../../components/molecules/category-card/category-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TablerIconComponent, ProductCard, CategoryCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly productService = inject(ProductService);
  private readonly categoryTrack = viewChild<ElementRef<HTMLElement>>('categoryTrack');
  private noticeTimer?: ReturnType<typeof setTimeout>;

  readonly popular = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly loadingPopular = signal(true);
  readonly loadingCategories = signal(true);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);

  constructor() {
    this.loadPopular();
    this.loadCategories();
  }

  loadPopular() {
    this.loadingPopular.set(true);
    this.error.set(null);

    this.productService.getPopular(6).subscribe({
      next: (products) => {
        this.popular.set(products);
        this.loadingPopular.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos populares.');
        this.loadingPopular.set(false);
      },
    });
  }

  loadCategories() {
    this.loadingCategories.set(true);

    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories.slice(0, 10));
        this.loadingCategories.set(false);
      },
      error: () => this.loadingCategories.set(false),
    });
  }

  scrollCategories(direction: -1 | 1) {
    const track = this.categoryTrack()?.nativeElement;
    if (!track) return;

    const amount = Math.min(track.clientWidth * 0.8, 640);
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  addToCart(product: Product) {
    this.notice.set(`"${product.title}" agregado al carrito`);
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => this.notice.set(null), 3000);
  }

  formatCategory(category: string): string {
    return category.replace(/[-_]/g, ' ');
  }
}
