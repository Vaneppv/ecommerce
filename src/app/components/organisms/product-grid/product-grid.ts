import { Component, input, output } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { InfiniteScroll } from '../../../directives/infinite-scroll';
import { ProductCard } from '../../molecules/product-card/product-card';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCard, InfiniteScroll],
  styleUrl: './product-grid.css',
  templateUrl: './product-grid.html',
})
export class ProductGrid {
  products = input<Product[]>([]);
  loading = input(false);
  error = input<string | null>(null);
  hasMore = input(false);

  onLoadMore = output<void>();
  onRetry = output<void>();
  onAdd = output<Product>();
}
