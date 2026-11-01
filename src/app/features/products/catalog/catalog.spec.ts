import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/product-service';
import { Catalog } from './catalog';

const item = (id: number): Product => ({
  id,
  title: `Producto ${id}`,
  description: '',
  category: 'hogar',
  price: 10,
  rating: 4,
  thumbnail: `https://example.com/${id}.webp`,
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
