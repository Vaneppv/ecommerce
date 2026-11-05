import { Component, computed, input, output } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { InfiniteScroll } from '../../../directives/infinite-scroll';
import { ProductCard } from '../../molecules/product-card/product-card';
import { ProductCardSkeleton } from '../../molecules/product-card-skeleton/product-card-skeleton';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCard, ProductCardSkeleton, InfiniteScroll],
  styleUrl: './product-grid.css',
  templateUrl: './product-grid.html',
})
export class ProductGrid {
  products = input<Product[]>([]);
  loading = input(false);
  error = input<string | null>(null);
  hasMore = input(false);

  readonly skeletonCount = computed(() => (this.products().length === 0 ? 8 : 4));
  readonly skeletons = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, index) => index),
  );

  onLoadMore = output<void>();
  onRetry = output<void>();
  onAdd = output<Product>();
}
