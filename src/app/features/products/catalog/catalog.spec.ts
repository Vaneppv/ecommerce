import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/product-service';
import { Catalog } from './catalog';

const item = (id: number): Product => ({
  id,
  title: `Producto ${id}`,
  description: `Descripción del producto ${id}`,
  category: 'hogar',
  price: 10,
  rating: 4,
  thumbnail: `https://example.com/${id}.webp`,
  discountPercentage: 0,
  stock: 10,
  tags: ['hogar'],
  brand: 'Brand',
  sku: `SKU-${id}`,
  weight: 1,
  dimensions: { width: 10, height: 10, depth: 10 },
  warrantyInformation: '1 month warranty',
  shippingInformation: 'Ships in 1 month',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '30 days return policy',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2024-05-23T08:56:21.618Z',
    updatedAt: '2024-05-23T08:56:21.618Z',
    barcode: '1234567890',
    qrCode: 'qr',
  },
  images: [`https://example.com/${id}.webp`],
});

function setup(getPage: ProductService['getPage']) {
  TestBed.configureTestingModule({
    imports: [Catalog],
    providers: [{ provide: ProductService, useValue: { getPage } }],
  });
  return TestBed.createComponent(Catalog).componentInstance;
}

describe('Catalog', () => {
  it('carga la primera página al crearse', () => {
    const catalog = setup(() =>
      of({ products: [item(1), item(2)], total: 4, skip: 0, limit: 20 }),
    );
    expect(catalog.products().length).toBe(2);
    expect(catalog.hasMore()).toBe(true);
    expect(catalog.loading()).toBe(false);
  });

  it('indica que no hay más cuando se cargó todo', () => {
    const catalog = setup(() =>
      of({ products: [item(1), item(2)], total: 2, skip: 0, limit: 20 }),
    );
    expect(catalog.hasMore()).toBe(false);
  });

  it('muestra error si falla la carga', () => {
    const catalog = setup(() => throwError(() => new Error('fail')));
    expect(catalog.error()).toBeTruthy();
    expect(catalog.loading()).toBe(false);
  });

  it('muestra un aviso al agregar al carrito', () => {
    const catalog = setup(() => of({ products: [item(1)], total: 1, skip: 0, limit: 20 }));
    catalog.addToCart(item(1));
    expect(catalog.notice()).toContain('Producto 1');
  });
});
