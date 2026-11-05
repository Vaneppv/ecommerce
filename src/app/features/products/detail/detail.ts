import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/product-service';
import { CartAccessService } from '../../../core/cart-access.service';
import { Button } from '../../../components/atoms/button/button';
import { Image } from '../../../components/atoms/image/image';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, Button, Image, TablerIconComponent, CurrencyPipe, TitleCasePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartAccess = inject(CartAccessService);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly quantity = signal(1);
  readonly notice = signal<string | null>(null);
  private noticeTimer?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProduct(id);
      } else {
        this.error.set('Identificador de producto inválido');
        this.loading.set(false);
      }
    });
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product.set(product);
        } else {
          this.product.set(null);
          this.error.set('Producto no encontrado');
        }
        this.loading.set(false);
      },
      error: () => {
        this.product.set(null);
        this.error.set('No se pudo cargar la información del producto.');
        this.loading.set(false);
      },
    });
  }

  incrementQuantity() {
    const stock = this.product()?.stock ?? 99;
    if (this.quantity() < stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    if (!this.cartAccess.add(p, this.quantity())) return;

    this.notice.set(`Agregaste ${this.quantity()} unidad(es) de "${p.title}" al carrito`);
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => this.notice.set(null), 3500);
  }
}
