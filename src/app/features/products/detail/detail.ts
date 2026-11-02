import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/product-service';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getPage(id - 1, 1)
      .subscribe({
        next: (page) => {
          if (page.products.length > 0) {
            this.product.set(page.products[0]);
          } else {
            this.error.set('Producto no encontrado');
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el producto.');
          this.loading.set(false);
        },
      });
  }
}